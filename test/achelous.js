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
      ach.entities[0].rel[0].should.equal("http://mydomain.com/relationship");
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
      ach.entities[0].addLink("bar", "http://foo.bar.com/bar/1235", "title");

      ach.entities[0].links[1].rel[0].should.equal("other");
      ach.entities[0].links[1].rel[1].should.equal("foo");
      ach.entities[0].links[1].href.should.equal("http://foo.bar.com/bar/1235");

      ach.entities[0].links[2].rel[0].should.equal("bar");
      ach.entities[0].links[2].href.should.equal("http://foo.bar.com/bar/1235");
      ach.entities[0].links[2].title.should.equal("title");
    });

    it("should return the root object for message chaining", function() {
      var result = ach.addEntity("http://mydomain.com/relationship", "http://mydomain.com/foo/1234");
      result.should.equal(ach);
    });

    it("should allow you to add entities to an entity", function() {
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
      ach.entities[0].addEntity("able", "http://foo.bar.com/able/baker");
      ach.entities[0].entities[0].rel[0].should.equal("able");
      ach.entities[0].entities[0].href.should.equal("http://foo.bar.com/able/baker");
    });

    it("should allow you add an action to an entity", function() {
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

      ach.entities[0].addAction({
        name: "foobar",
        title: "This is a title",
        method: "POST",
        href: "http://foo.bar.com/bar/1",
        type: "application/x-www-form-urlencoded",
        fields: [
          { name: "age", type: "number", value: 5 }
        ]
      });
      ach.entities[0].actions[0].name.should.equal("foobar");
      ach.entities[0].actions[0].method.should.equal("POST");
    });

    it("should have a make function that returns the new entity", function() {
      var newEntity = ach.makeEntity({
        class: ['foo', 'bar'],
        rel: ["http://foo.bar.com/myrelation"],
        properties: {
          propOne: "boo"
        },
        links: [
          { rel: ["self"], href: "http//foo.bar.com/foo/1234" }
        ]
      });
      newEntity.should.equal(ach.entities[0]);
      newEntity.class[0].should.equal("foo");
      newEntity.rel[0].should.equal("http://foo.bar.com/myrelation")
    });

    it("should have a function that creates a minimal entity", function() {
      var newEntity = ach.makeEntity("foo", "http://foo.bar.com/foo/1234");
      newEntity.should.equal(ach.entities[0]);
      newEntity.rel[0].should.equal("foo");
      newEntity.href.should.equal("http://foo.bar.com/foo/1234")
    });
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

    it("should return the root object for method chaining", function() {
      var result = ach.addAction("foo", "http://foo.bar.com/action/1");
      result.should.equal(ach);
    });

    it("should have a makeAction funciton that returns the action", function() {
      var newAction = ach.makeAction("foo", "http://foo.bar.com/action/1");
      newAction.should.equal(ach.actions[0]);

      ach.actions[0].name.should.equal('foo');
    });

    describe("Action Methods", function() {
      var newAction;

      beforeEach(function() {
        newAction = ach.makeAction("foo", "http://foo.bar.com/action/1");
      })

      it("should have a method to add fields", function() {
        newAction.addField("fullField", "email", "bar", "This is the foo");
        newAction.addField("partialField");
        newAction.addField("partial2", "number");
        newAction.addField("partial3", "tel", "7035551212");

        newAction.fields.length.should.equal(4);
        newAction.fields[0].name.should.equal("fullField");
        newAction.fields[0].type.should.equal("email");
        newAction.fields[0].value.should.equal("bar");
        newAction.fields[0].title.should.equal("This is the foo");
        newAction.fields[1].name.should.equal("partialField");
        newAction.fields[1].type.should.equal("text");
        newAction.fields[2].name.should.equal("partial2");
        newAction.fields[2].type.should.equal("number");
        newAction.fields[3].name.should.equal("partial3");
        newAction.fields[3].type.should.equal("tel");

      });
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

      ach.addLink("self", "http://foo.bar.com/bar/1", "Some link");
      ach.links[1].title.should.equal("Some link");
    });

    it("should take an array as the first argument", function() {
      ach.addLink(["foo", "bar"], "http://foo.bar.com/bar/1");

      ach.links[0].rel[0].should.equal("foo");
      ach.links[0].rel[1].should.equal("bar");
      ach.links[0].href.should.equal("http://foo.bar.com/bar/1");
    });

    it("should take an object", function() {
      ach.addLink({ rel: ["foo"], href: 'http://foo.bar.com/bar/1', title: "bar" });
      ach.links[0].rel[0].should.equal("foo");
      ach.links[0].href.should.equal("http://foo.bar.com/bar/1");
      ach.links[0].title.should.equal("bar");
    });

    it("should return itself for method chaining", function() {
      var result = ach.addLink({ rel: ["foo"], href: 'http://foo.bar.com/bar/1', name: "bar" });
      result.should.equal(ach);
    });
  });
});