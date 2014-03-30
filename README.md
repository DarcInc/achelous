achelous
========

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
operations.

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
type      | No        | Any of the HTML5 input types such as 'text' or 'number'
value     | No        | A fixed value appropriate to the type
title     | No        | A friendly and useful human name for the field.






