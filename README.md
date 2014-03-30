achelous
========

Achelous is the father of sirens.  In this sense it makes siren compliant JSON responses.  This being an early version,
the API is still in flux, but the goals are to provide easy, logical, and simplified generation of a siren compatible
response instead of a blob of JSON.

For more information on Siren, here's the [basic spec](https://github.com/kevinswiber/siren).

Overview
--------

To begin a response:

    var Achelous = require('achelous');

    function getCustomer(req, res) {
        var result = new Achelous("customer", { firstName: "Joe", lastName: "Customer" });
        result.addEntities({ class: [order collection], rel: "http://foo.bar.com/orders",
            href: "http://myserver.com/api/orders");
        result.addLink("self", "http://myserver.com/api/customers/1234");
        result.addLink("account", "http://myserver.com/lookup/account.json&customer=1234");
        res.send(200, result);
    }

The client receives:

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
       ]
    }
