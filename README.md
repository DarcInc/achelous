achelous
========

Generating a proper RESTful response, following hypermedia principles, can be a little tedious.  Standards exist for
HTML (HTML) and XML (AtomPub), which provide fairly complete hypermedia response.  What is missing is equivalent
guidance for JSON responses.

This API is a server-side API to make it easy to generate JSON based hypermedia responses that can be consumed by
clients.  The hypermedia specification I'm using is called Siren, so this API helps you generate Siren compatible
JSON to return to clients.

Why Hypermedia?  Hypermedia is the part of REST that allows the application state to be encapsulated in the server
response.  This is not the same thing as being a 'stateful' server.  Rather, the client that requests a resource
and from the server is returned a hypermedia response that encapsulates the state that maps to that request.
State is really a client construct. It's up to the client to make appropriate state transitions based on the contents
of the hypermedia response.

Take a web page as an example, if you navigate to a web page you are presented links, forms, and inline data that
represents the current state.  All the information you need to move to a next state (by following a link, for
exmple), is provided in the HTML response.  This is not what happens for many APIs (which often use JSON).  It is up
to the client to calculate the state transition based on some standard around URL formats.

For a more in depth description of HATEOAS (Hypermedia as the engine of application state), here are some useful
resources:


There are two approaches to designing a hypermedia format.  One is to use existing hypermedia definitions.  For
example, servers on the web use HTML as their preferred hypermedia format (text/html).  Many sites use AtomPub as an
alternative hypermedia format for server or clients that request data through an API (application/vnd.atom+xml).
Another
option is to define your own hypermedia format for a given format or client.  Rather than coming up with DarcInc's
format for JSON APIs, I chose the Siren format (application/vnd.siren+json).

About the name
--------------

Achelous is the father of sirens.  In this sense it makes siren compliant JSON responses.  This being an early version,
the API is still in flux, but the goals are to provide easy, logical, and simplified generation of a siren compatible
response instead of a blob of JSON.

For more information on Siren, here's the [basic spec](https://github.com/kevinswiber/siren).

Overview
--------

To begin a response:

```javascript
var Achelous = require('achelous');

function getCustomer(req, res) {
    var result = new Achelous("customer", { firstName: "Joe", lastName: "Customer" });
    result.addEntity({ class: ["order" "collection"], rel: "http://foo.bar.com/orders",
        href: "http://myserver.com/api/orders");
    result.addLink("self", "http://myserver.com/api/customers/1234");
    result.addLink("account", "http://myserver.com/lookup/account.json?customer=1234");
    result.addLink("lastOrder", "http://myserver.com/api/customers/1234/orders?filter=last",
    res.set('Content-Type', 'application/vnd.siren+json');
    res.send(200, result);
}
```

The client receives:

```json
{
   "class": ["customer"],
   "properties": {
       "firstName": "Joe",
       "lastName": "Customer"
   }
   "entities": [
       {
          "class": ["order", "collection"],
          "rel": "http://foo.bar.com/orders",
          "href": "http://myserver.com/api/orders"
       }
   ]
   "links": [
       { "rel": ["self"], "href": "http://myserver.com/api/customers/1234" },
       { "rel": ["account"], "href": "http://myserver.com/lookup/account.json&customer=1234" }
       { "rel": ["lastOrder"], "href": "http://myserver.com/api/customers/1234/orders?filter=last" }
   ]
}
```

Constructor
-----------

```javascript
new Achelous(className);
new Achelous(className, properties);
```

The className is required and can be either a string, such as "customer" or an array of strings, such as
["customer", "commercial"].  The properties is a has of property values.

addEntity
---------

The addEntity function adds information about entities tha are related to the entity in the response.
For example, a URL returning customer information might have related 'order' entities.  The addEntity
function returns a reference to the main response, so that addEntity calls may be chained.


```javascript
var achelous = new Achelous("customer");
achelous.addEntity(rel, href);
achelous.addEntity(entityObject);
```

The addEntity function takes either a string for the rel and href (both required) or an object with the entity
attributes:

Attribute      |    Required?    |    Description
---------------|-----------------|-------------------------
rel            | Yes             | How the entity is related to the response object.
href           | Yes             | The url of the related entity.
class          | No              | The class of the related entity.

It's possible to return a completed entity as a complete entity object.

Attribute      | Required?       | Description
---------------|-----------------|--------------------------
rel            | Yes             | How the entity is related to the response object.
class          | No              | The class of the related entity (array)
properties     | No              | The properties of the related entity (hash)
entities       | No              | Entities related to this related entity
links          | No              | Any links applicable to this related entity
actions        | No              | Actions appropriate to this related entity
title          | No              | Descriptive title

makeEntity
----------

While addEntity returns the root response object so that methods can be chained, makeEntity returns a
reference to the newly created entity.  It is inserted in the response object and allows you to

```javascript
var response = new Achelous('foo', {bar: 'baz'});

var subEntity = response.makeEntity('qux', 'http://myserver.com/qux?id=1');
subEntity.addLink(...)
...

```

addAction
---------

The addAction function adds a new action to the response entity.  The action describes a templated link that
could be invoked.  It should carry enough information to allow the API client to deduce the parameters and
operations.  The addAction method returns a reference to the parent object so that methods can be chained.

```javascript
var response = new Achelous('foo', {bar: 'baz'});
response.addAction(name, href);
response.addAction(actionObject);
```

Attribute | Required? | Description
----------|-----------|-----------------
name      | Yes       | The name of the action
href      | Yes       | The url for the action
title     | No        | A useful and friendly title
method    | No        | The HTTP method (defaults to 'GET')
type      | No        | The request type (defaults to 'application/x-www-form-urlencoded')
fields    | No        | The collection of fields

If provided, each field can contain the following attributes

Attribute | Required? | Description
----------|-----------|---------------------
name      | Yes       | The name of the field
type      | No        | Any of the HTML5 input types such as 'text' or 'number' (defaults to text)
value     | No        | A fixed value appropriate to the type
title     | No        | A friendly and useful human name for the field.

makeAction
----------

This method is the same as addAction, except that instead of returning a reference to the containing object,
it returns a reference to the new action.

action.addField
---------------

Adds a new field to an action.  Fields describe to the client the expected parameters.

```javascript
var response = new Achelous('foo', {bar: 'baz'});
var newAction = response.makeAction(name, href);
newAction.addField(name);
newAction.addField(name, type, value, title);
```

Parameter | Required? | Description
----------|-----------|---------------
name      | Yes       | The name of the field.
type      | No        | The HTML5 input type of the field (defaults to "text")
value     | No        | A fixed value
title     | No        | A helpful and friendly title

addLink
-------

The add link function adds a new link to the response or entity.  It returns a reference to the parent object to
allow method chaining.

```javascript
var response = new Achelous('foo', {bar: 'baz'});
response.addLink(rel, href);
response.addLink(rel, href, title);
response.addLink(linkObject);
```

The parameters/attriburtes are:

Attribute | Required? | Description
----------|-----------|----------------------
rel       | Yes       | The relationship to the current resonse or entity
href      | Yes       | The URL of the related link
title     | No        | A useful title for the link

Revsion History
---------------

Version | Description
--------|------------------
0.0.0   | Initial delivery - first draft of the API.




