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
      tmps['wifi'] = [];
      hmds['wifi'] = [];

      for (var i = 0; i < objs.length; i++) {
        var time = new Date(objs[i].created_at).getTime() / 1000 + 60 * 60 * 2;
        if (
          objs[i].device === 'livingroom' ||
          objs[i].device === 'livingroom_cpu' ||
          objs[i].device === 'office' ||
          objs[i].device === 'office_cpu' ||
          objs[i].device === 'wifi'
        ) {
          tmps[objs[i].device][time] = objs[i].temperature;
        }
        if (
            objs[i].device === 'livingroom' ||
            objs[i].device === 'office' ||
            objs[i].device === 'wifi'
        ) {
          hmds[objs[i].device][time] = objs[i].humidity;
        }
      }

      var plot = require('plotter').plot;
      plot({
        data: { 'Livingroom': tmps['livingroom'], 'Office': tmps['office'], 'WiFi': tmps['wifi'] },
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
        data: { 'Livingroom': hmds['livingroom'], 'Office': hmds['office'], 'WiFi': hmds['wifi'] },
        filename: 'public/tmp/humidity.png',
        title: 'Humidity',
        time: 'hours'
      });

      db.Beacon
        .findAll({
          limit: 200,
          order: 'created_at DESC'
        })
        .then(function(beacons) {

          var dist = [];
          dist['livingroom'] = [];
          dist['garage'] = [];
          dist['gate'] = [];
          dist['office'] = [];
          for (var i = 0; i < beacons.length; i++) {
            var time = new Date(beacons[i].created_at).getTime() / 1000 + 60 * 60 * 2;
            dist[beacons[i].uuid][time] = beacons[i].rssi;
          }

          plot({
            data: { 'Livingroom': dist['livingroom'], 'Garage': dist['garage'], 'Gate': dist['gate'], 'Office': dist['office'] },
            filename: 'public/tmp/stroller.png',
            title: 'Stroller',
            time: 'hours'
          });

          db.Sleep
            .findAll({
              limit: 200,
              order: 'created_at DESC'
            })
            .then(function(sleeps) {console.log(JSON.stringify(sleeps));

              var vals = [];
              vals['petr'] = [];
              for (var i = 0; i < sleeps.length; i++) {
                var time = new Date(sleeps[i].created_at).getTime() / 1000 + 60 * 60 * 2;
                vals[sleeps[i].device][time] = sleeps[i].value;
              }

              plot({
                data: { 'Petr': vals['petr'] },
                filename: 'public/tmp/sleep.png',
                title: 'Sleep',
                time: 'hours'
              });

              res.render('index', {
                title: 'Smart Home',
                beacons: beacons
              });

            });
        });
    });
});

module.exports = router;

