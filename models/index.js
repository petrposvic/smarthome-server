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
  uuid: {
    type: Sequelize.STRING
  },
  tx: {
    type: Sequelize.INTEGER
  },
  rssi: {
    type: Sequelize.INTEGER
  },
  active: {
    type: Sequelize.BOOLEAN
  }
});

var Alert = sequelize.define('alert', {
  note: {
    type: Sequelize.STRING
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
  return Alert.create({
    note: 'Beacon "Kocar" se vzdalil'
  });
}).then(function(obj) {
  return Alert.create({
    note: 'Beacon "Kocar" se objevil'
  });
}).then(function(obj) {
  return Beacon.create({
    uuid: 'kocar1',
    tx: 6,
    rssi: -75,
    active: true
  });
}).then(function(obj) {
  return Beacon.create({
    uuid: 'kocar2',
    tx: 6,
    rssi: -75,
    active: false
  });
});*/

module.exports = {
  sequelize: sequelize,
  Sequelize: Sequelize,
  Alert: Alert,
  Beacon: Beacon,
  Measurement: Measurement
};
