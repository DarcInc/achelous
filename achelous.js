/**
 * Created by phoehne on 3/28/14.
 */

var _ = require('lodash');


module.exports = function(p1, properties) {
  if (_.isString(p1)) {
    this.class = [p1];
  } else if(_.isArray(p1)) {
    this.class = p1;
  }

  if(properties && _.isObject(properties)) {
    this.properties = properties;
  }

  this.addEntity = function(rel, href) {
    if(!this.entities) { this.entities = []; }
    this.entities.push({rel: rel, href: href});
    return this;
  }
}