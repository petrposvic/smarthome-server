var Sequelize = require('sequelize');

var sequelize = new Sequelize('smart_home', 'htpc', 'heslo', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log,
  define: {
    underscored: true
  }
});

var Measurement = sequelize.define('measurement', {
  device: {
    type: Sequelize.STRING
  },
  temperature: {
    type: Sequelize.FLOAT
  },
  humidity: {
    type: Sequelize.FLOAT
  },
  light: {
    type: Sequelize.FLOAT
  },
  noise: {
    type: Sequelize.FLOAT
  }
});

var Beacon = sequelize.define('beacon', {
  name: {
    type: Sequelize.STRING
  },
  tx: {
    type: Sequelize.INTEGER
  },
  rssi: {
    type: Sequelize.INTEGER
  }
});

/*sequelize.sync({
  force: true
}).then(function() {
  return Measurement.create({
    device: 'obyvak',
    temperature: 22.1,
    humidity: 55,
    light: 2,
    noise: 1
  });
}).then(function(obj) {
  console.log(obj.get({
    plain: true
  }));
});*/

module.exports = {
  sequelize: sequelize,
  Sequelize: Sequelize,
  Measurement: Measurement,
  Beacon: Beacon
};
