/**
 * Created by phoehne on 3/28/14.
 */

var _ = require('lodash');


module.exports = function(p1, properties) {
  var Entity = function() {
    if (arguments.length === 2 && _.isString(arguments[0]) && _.isString(arguments[1])) {
      this.rel = arguments[0];
      this.href = arguments[1];
    } else if(arguments.length === 1 && _.isObject(arguments[0])) {
      if (arguments[0].class) { this.class = arguments[0].class; }
      if (arguments[0].rel) { this.rel = arguments[0].rel; }
      if (arguments[0].properties) { this.properties = arguments[0].properties; }
      if (arguments[0].href) { this.href = arguments[0].href; }
      if (arguments[0].links)  { this.links = arguments[0].links; }
    }
    var self = this;

    this.addLink = function(rel, href) {
      if (!self.links) {
        self.links = [];
      }
      self.links.push({rel: rel, href: href});
      return self;
    }
    return self;
  };

  var Action = function() {
    if (arguments.length === 2 && _.isString(arguments[0]) && _.isString(arguments[1])) {
      this.name = arguments[0];
      this.href = arguments[1];
    }
  }

  if (_.isString(p1)) {
    this.class = [p1];
  } else if(_.isArray(p1)) {
    this.class = p1;
  }

  if(properties && _.isObject(properties)) {
    this.properties = properties;
  }

  this.addEntity = function() {
    if(!this.entities) { this.entities = []; }
    if (arguments.length === 2 && _.isString(arguments[0]) &&_.isString(arguments[1])) {
      this.entities.push(new Entity(arguments[0], arguments[1]));
    } else if(arguments.length === 1 && _.isObject(arguments[0])) {
      this.entities.push(new Entity(arguments[0]));
    }
    return this;
  }

  this.addAction = function() {
    if (!this.actions) { this.actions = []; }
    if (arguments.length === 2 && _.isString(arguments[0]) && _.isString(arguments[1])) {
      this.actions.push(new Action(arguments[0], arguments[1]));
    }
  }
}