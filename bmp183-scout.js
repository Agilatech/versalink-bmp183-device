const config = require('./config');

const Scout = require('zetta-scout');
const Bmp183 = require('./bmp183');

module.exports = class Bmp183Scout extends Scout {

  constructor(opts) {

    super();

    if (typeof opts !== 'undefined') {
      // copy all config options defined in the server
      for (const key in opts) {
        if (typeof opts[key] !== 'undefined') {
          config[key] = opts[key];
        }
      }
    }

    if (config.name === undefined) { config.name = "BMP183" }
    this.name = config.name;

    this.bmp183 = new Bmp183(config);

  }

  init(next) {
    const query = this.server.where({name: this.name});
  
    const self = this;

    this.server.find(query, function(err, results) {
      if (!err) {
        if (results[0]) {
          self.provision(results[0], self.bmp183);
          self.server.info('Provisioned known device ' + self.name);
        } else {
          self.discover(self.bmp183);
          self.server.info('Discovered new device ' + self.name);
        }
      }
      else {
        self.server.error(err);
      }
    });

    next();
  }

}
