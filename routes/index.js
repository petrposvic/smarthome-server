var express = require('express');
var db = require('../models/index');
var router = express.Router();

router.get('/', function(req, res, next) {
  db.Measurement
    .findAll()
    .then(function(objs) {
      var tmps = [], hmds = [];
      var max = Math.max(0, objs.length - 200);
      for (var i = max; i < objs.length; i++) {
        tmps.push(objs[i].temperature);
        hmds.push(objs[i].humidity);
      }

      var plot = require('plotter').plot;
      plot({
        data: { 'Temperature': tmps },
        filename: 'public/tmp/temperature.png'
      });
      plot({
        data: { 'Humidity': hmds },
        filename: 'public/tmp/humidity.png'
      });
      res.render('index', { title: 'Smart Home', min:  objs[max].created_at, max: objs[objs.length - 1].created_at});
    });
});

module.exports = router;

