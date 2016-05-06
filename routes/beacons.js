var express = require('express');
var db = require('../models/index');
var router = express.Router();

router.get('/', function(req, res) {
  db.Beacon
    .findAll()
    .then(function(objs) {
      res.send(objs);
    });
});

router.post('/', function(req, res) {
  var beacons = req.body.beacons;
  var data = [];

  for (var i = 0; i < beacons.length; i++) {
    data.push({
      name: beacons[i].id,
      tx: beacons[i].tx,
      rssi: beacons[i].rssi
    });
  }

  db.Beacon
    .bulkCreate(data)
    .then(function(obj) {
      res
        .status(201)
        .send(obj);
    });
});

module.exports = router;
