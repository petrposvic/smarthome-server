var express = require('express');
var db = require('../models/index');
var router = express.Router();

router.get('/', function(req, res, next) {
  db.Measurement
    .findAll()
    .then(function(objs) {
      var tmps = {}, hmds = {};
      var max = Math.max(0, objs.length - 200);
      for (var i = max; i < objs.length; i++) {
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
      res.render('index', { title: 'Smart Home', min:  objs[max].created_at, max: objs[objs.length - 1].created_at});
    });
});

module.exports = router;

