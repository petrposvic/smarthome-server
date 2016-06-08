var express = require('express');
var db = require('../models/index');
var router = express.Router();

router.get('/', function(req, res) {
  db.Sleep
    .findAll()
    .then(function(objs) {
      res.send(objs);
    });
});

router.post('/', function(req, res) {
  db.Sleep
    .create({
      device: req.body.device,
      value: req.body.value
    })
    .then(function(obj) {
      res
        .status(201)
        .send(obj);
    });
});

module.exports = router;
