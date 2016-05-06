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
  db.Measurement
    .create({
      device: req.body.device,
      temperature: req.body.temperature,
      humidity: req.body.humidity
    })
    .then(function(obj) {
      res
        .status(201)
        .send(obj);
    });
});

module.exports = router;
