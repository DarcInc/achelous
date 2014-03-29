/**
 * Created by phoehne on 3/27/14.
 */

var Achelous = require('../achelous');
var should = require('should');


describe("achelous", function() {
  describe("Basic response", function() {
    it("should create a basic entity with classes", function() {
      var ach = new Achelous("Foo");
      ach.class.length.should.equal(1);
      ach.class[0].should.equal("Foo");
    });

    it("should take an array of class names", function() {
      var ach = new Achelous(["foo", "bar"]);
      ach.class.length.should.equal(2);
      ach.class[0].should.equal("foo");
      ach.class[1].should.equal("bar");
    });
  });

  describe("Properties", function() {
    it("should take a property object as the second parameter", function() {
      var ach = new Achelous("foo", {bar: "baz"});
      ach.class.length.should.equal(1);
      ach.class[0].should.equal("foo");
      ach.properties.bar.should.equal("baz");
    })
  });

  describe("Entities", function() {
    var ach;

    beforeEach(function() {
      ach = new Achelous("foo", {bar: "baz"});
    });

    it("should allow adding entities with required fields", function() {
      ach.addEntity("http://mydomain.com/relationship", "http://mydomain.com/foo/1234");
      ach.entities[0].rel.should.equal("http://mydomain.com/relationship");
      ach.entities[0].href.should.equal("http://mydomain.com/foo/1234");
    });

    it("should allow adding entities with a map of fields", function() {
      ach.addEntity({
        class: ['foo', 'bar'],
        rel: ["http://foo.bar.com/myrelation"],
        properties: {
          propOne: "boo"
        },
        links: [
          { rel: ["self"], href: "http//foo.bar.com/foo/1234" }
        ]
      });
      ach.entities[0].class[0].should.equal('foo');
      ach.entities[0].class[1].should.equal('bar');
      ach.entities[0].rel[0].should.equal("http://foo.bar.com/myrelation");
      ach.entities[0].properties.propOne.should.equal("boo")
      ach.entities[0].links[0].rel[0].should.equal("self");
      ach.entities[0].links[0].href.should.equal("http//foo.bar.com/foo/1234");
    });

    it("should allow you to add links to a an entity", function() {
      ach.addEntity({
        class: ['foo', 'bar'],
        rel: ["http://foo.bar.com/myrelation"],
        properties: {
          propOne: "boo"
        },
        links: [
          { rel: ["self"], href: "http//foo.bar.com/foo/1234" }
        ]
      });
      ach.entities[0].addLink(["other", "foo"], "http://foo.bar.com/bar/1235");

      ach.entities[0].links[1].rel[0].should.equal("other");
      ach.entities[0].links[1].rel[1].should.equal("foo");
      ach.entities[0].links[1].href.should.equal("http://foo.bar.com/bar/1235");
    })
  });

  describe("Actions", function() {
    var ach;

    beforeEach(function() {
      ach = new Achelous("foo", {bar: "baz"});
    });

    it("should allow us to add an action", function() {
      ach.addAction("foo", "http://foo.bar.com/action/1");

      ach.actions.length.should.equal(1);
      ach.actions[0].name.should.equal("foo");
      ach.actions[0].href.should.equal("http://foo.bar.com/action/1")
    });

    it("should allow us to add an action object", function() {
      ach.addAction({
        name: "foobar",
        title: "This is a title",
        method: "POST",
        href: "http://foo.bar.com/bar/1",
        type: "application/x-www-form-urlencoded",
        fields: [
          { name: "age", type: "number", value: 5 }
        ]
      });

      ach.actions[0].name.should.equal("foobar");
      ach.actions[0].title.should.equal("This is a title");
      ach.actions[0].method.should.equal("POST")
      ach.actions[0].fields[0].name.should.equal("age");
      ach.actions[0].fields[0].type.should.equal("number");
      ach.actions[0].fields[0].value.should.equal(5);
    });
  });

  describe("Links", function() {
    var ach;

    beforeEach(function() {
      ach = new Achelous("foo", {bar: "baz"});
    });

    it("should allow you to add a link", function() {
      ach.addLink("self", "http://foo.bar.com/bar/1");

      ach.links[0].rel[0].should.equal("self");
      ach.links[0].href.should.equal("http://foo.bar.com/bar/1");
    });

    it("should take an array as the first argument", function() {
      ach.addLink(["foo", "bar"], "http://foo.bar.com/bar/1");

      ach.links[0].rel[0].should.equal("foo");
      ach.links[0].rel[1].should.equal("bar");
      ach.links[0].href.should.equal("http://foo.bar.com/bar/1");
    });

    it("should take an object", function() {
      ach.addLink({ rel: ["foo"], href: 'http://foo.bar.com/bar/1', name: "bar" });
      ach.links[0].rel[0].should.equal("foo");
      ach.links[0].href.should.equal("http://foo.bar.com/bar/1");
      ach.links[0].name.should.equal("bar");

      console.log(ach);
    })
  });
});