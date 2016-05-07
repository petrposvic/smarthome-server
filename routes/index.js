var express = require('express');
var db = require('../models/index');
var router = express.Router();

router.get('/', function(req, res, next) {
  db.Measurement
    .findAll()
    .then(function(objs) {
      var tmps = {}, hmds = {};
      for (var i = Math.max(0, objs.length - 200); i < objs.length; i++) {
        var time = new Date(objs[i].created_at).getTime() / 1000;
        tmps[time] = objs[i].temperature;
        hmds[time] = objs[i].humidity;
      }

      var plot = require('plotter').plot;
      plot({
        data: { 'Temperature': tmps },
        filename: 'public/tmp/temperature.png',
        time: 'hours'
      });
      plot({
        data: { 'Humidity': hmds },
        filename: 'public/tmp/humidity.png',
        time: 'hours'
      });

      db.Beacon
        .findAll({
          order: 'id DESC',
          limit: 5
        })
        .then(function(beacons) {
          res.render('index', {
            title: 'Smart Home',
            beacons: beacons
          });
        });
    });
});

module.exports = router;

