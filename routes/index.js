var express = require('express');
var db = require('../models/index');
var router = express.Router();

router.get('/', function(req, res, next) {
  db.Measurement
    .findAll({
      limit: 250,
      order: 'created_at DESC'
    })
    .then(function(objs) {
      var tmps = [], hmds = [];
      tmps['livingroom'] = [];
      tmps['livingroom_cpu'] = [];
      hmds['livingroom'] = [];
      tmps['office'] = [];
      tmps['office_cpu'] = [];
      hmds['office'] = [];

      for (var i = 0; i < objs.length; i++) {
        var time = new Date(objs[i].created_at).getTime() / 1000 + 60 * 60 * 2;
        if (
          objs[i].device === 'livingroom' ||
          objs[i].device === 'livingroom_cpu' ||
          objs[i].device === 'office' ||
          objs[i].device === 'office_cpu'
        ) {
          tmps[objs[i].device][time] = objs[i].temperature;
        }
        if (
            objs[i].device === 'livingroom' ||
            objs[i].device === 'office'
        ) {
          hmds[objs[i].device][time] = objs[i].humidity;
        }
      }

      var plot = require('plotter').plot;
      plot({
        data: { 'Livingroom': tmps['livingroom'], 'Office': tmps['office'] },
        filename: 'public/tmp/temperature.png',
        title: 'Temperature',
        time: 'hours'
      });
      plot({
        data: { 'Livingroom': tmps['livingroom_cpu'], 'Office': tmps['office_cpu'] },
        filename: 'public/tmp/cpu.png',
        title: 'CPU temperature',
        time: 'hours'
      });
      plot({
        data: { 'Livingroom': hmds['livingroom'], 'Office': hmds['office'] },
        filename: 'public/tmp/humidity.png',
        title: 'Humidity',
        time: 'hours'
      });

      db.Beacon
        .findAll({
          limit: 50,
          order: 'created_at DESC'
        })
        .then(function(beacons) {

          var dist = {};
          for (var i = 0; i < beacons.length; i++) {
            var time = new Date(beacons[i].created_at).getTime() / 1000 + 60 * 60 * 2;
            dist[time] = beacons[i].rssi;
          }

          plot({
            data: { 'Stroller': dist },
            filename: 'public/tmp/stroller.png',
            time: 'hours'
          });

          res.render('index', {
            title: 'Smart Home',
            beacons: beacons
          });
        });
    });
});

module.exports = router;

