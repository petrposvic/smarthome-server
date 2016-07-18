var express = require('express');
var db = require('../models/index');
var router = express.Router();

router.get('/', function(req, res) {
  db.Measurement
    .findAll()
    .then(function(objs) {
      res.send(objs);
    });
});

router.post('/', function(req, res) {
  var device = req.body.device;
  var t = req.body.temperature;
  var h = req.body.humidity;
  if (!device) device = req.body.dev;
  if (!t) t = req.body.t;
  if (!h) h = req.body.h;

  db.Measurement
    .create({
      device: device,
      temperature: t,
      humidity: h
    })
    .then(function(obj) {
      res
        .status(201)
        .send(obj);
    });
});

module.exports = router;
