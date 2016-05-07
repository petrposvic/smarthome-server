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
  db.Beacon
    .create(req.body)
    .then(function(obj) {
      res
        .status(201)
        .send(obj);
    });
});

module.exports = router;
