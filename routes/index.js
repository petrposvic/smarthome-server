var express = require('express');
var router = express.Router();

router.get('/test', function(req, res) {
  console.log('GET OK');
  res.send('GET OK');
});

router.post('/test', function(req, res) {
  console.log('POST OK ' + JSON.stringify(req.body));
  res.send('POST OK');
});

router.get('/', function(req, res) {
  res.render('index', {
    title: 'Smart Home'
  });
});

module.exports = router;

