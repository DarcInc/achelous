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
    it("should allow adding entities with required fields", function() {
      var ach = new Achelous("foo", {bar: "baz"});
      ach.addEntity("http://mydomain.com/relationship", "http://mydomain.com/foo/1234");
      ach.entities[0].rel.should.equal("http://mydomain.com/relationship");
      ach.entities[0].href.should.equal("http://mydomain.com/foo/1234");
    });
  });
});