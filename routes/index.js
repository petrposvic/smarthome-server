var express = require('express');
var db = require('../models/index');
var router = express.Router();

router.get('/', function(req, res, next) {
  db.Measurement
    .findAll()
    .then(function(objs) {
      var tmps = [], hmds = [];
      for (var i = 0; i < objs.length; i++) {
        tmps.push(objs[i].temperature);
        hmds.push(objs[i].humidity);
      }

      var plot = require('plotter').plot;
      plot({
        data: { 'Temperature': tmps, 'Humidity': hmds },
        filename: 'public/tmp/output.png'
      });
      plot({
        data: { 'Temperature': tmps },
        filename: 'public/tmp/temperature.png'
      });
      plot({
        data: { 'Humidity': hmds },
        filename: 'public/tmp/humidity.png'
      });
      res.render('index', { title: 'Express' });
    });
});

module.exports = router;

