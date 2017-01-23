
const options = require('./options');

const Scout = require('zetta-scout');
const bmp183 = require('./bmp183');
const util = require('util');

const Bmp183Scout = module.exports = function(opts) {
    
  // see if any of the options were overridden in the server

  if (typeof opts !== 'undefined') {

    // copy all options defined in the server
    for (const key in opts) {
      if (typeof opts[key] !== 'undefined') {
        options[key] = opts[key];
      }
    }
  }

  Scout.call(this);
};

util.inherits(Bmp183Scout, Scout);

Bmp183Scout.prototype.init = function(next) {

  const self = this;

  const Bmp183 = new bmp183(options);

  const query = this.server.where({name: 'BMP183'});
  
  this.server.find(query, function(err, results) {
    if (results[0]) {
      self.provision(results[0], Bmp183, options);
      self.server.info('Provisioned BMP183');
    } else {
      self.discover(Bmp183, options);
      self.server.info('Discovered new device BMP183');
    }
  });

  next();

};
