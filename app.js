var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var plot = require('./libs/plotter').plot;
var db = require('./models/index');
var routes = require('./routes/index');
var alerts = require('./routes/alerts');
var beacons = require('./routes/beacons');
var measurements = require('./routes/measurements');
var sleeps = require('./routes/sleeps');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api/alerts', alerts);
app.use('/api/beacons', beacons);
app.use('/api/measurements', measurements);
app.use('/api/sleeps', sleeps);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

setInterval(function() {
  db.Measurement
    .findAll({
      limit: 500,
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
      tmps['bedroom'] = [];
      hmds['bedroom'] = [];
      tmps['bathroom'] = [];
      hmds['bathroom'] = [];
      tmps['birdhouse'] = [];
      tmps['wifi'] = [];
      hmds['wifi'] = [];
      tmps['raspi3'] = [];
      hmds['raspi3'] = [];

      for (var i = 0; i < objs.length; i++) {
        var time = new Date(objs[i].created_at).getTime() / 1000 + 60 * 60 * 2;
        if (
          objs[i].device === 'livingroom' ||
          objs[i].device === 'livingroom_cpu' ||
          objs[i].device === 'office' ||
          objs[i].device === 'office_cpu' ||
          objs[i].device === 'bedroom' ||
          objs[i].device === 'bathroom' ||
          objs[i].device === 'birdhouse' ||
          objs[i].device === 'wifi' ||
          objs[i].device === 'raspi3'
        ) {
          tmps[objs[i].device][time] = objs[i].temperature;
        }
        if (
            objs[i].device === 'livingroom' ||
            objs[i].device === 'office' ||
            objs[i].device === 'bedroom' ||
            objs[i].device === 'bathroom' ||
            objs[i].device === 'wifi' ||
            objs[i].device === 'raspi3'
        ) {
          hmds[objs[i].device][time] = objs[i].humidity;
        }
      }

      plot({
        data: {
          'Livingroom': tmps['livingroom'],
          'Office': tmps['office'],
          'Bedroom': tmps['bedroom'],
          'Bathroom': tmps['bathroom'],
          // 'WiFi': tmps['wifi'],
          'Raspi3': tmps['raspi3'],
          'Birdhouse': tmps['birdhouse']
        },
        filename: 'public/tmp/temperature.png',
        width: 750,
        title: 'Temperature',
        time: 'hours',
        others: ['set key left top']
      });
      plot({
        data: {
          'Livingroom': tmps['livingroom_cpu'],
          'Office': tmps['office_cpu']
        },
        filename: 'public/tmp/cpu.png',
        width: 750,
        title: 'CPU temperature',
        time: 'hours',
        others: ['set key left top']
      });
      plot({
        data: {
          'Livingroom': hmds['livingroom'],
          'Office': hmds['office'],
          'Bedroom': hmds['bedroom'],
          'Bathroom': hmds['bathroom'],
          // 'WiFi': hmds['wifi'],
          'Raspi3': hmds['raspi3']
        },
        filename: 'public/tmp/humidity.png',
        width: 750,
        title: 'Humidity',
        time: 'hours',
        others: ['set key left top']
      });
    });

  db.Sleep
    .findAll({
      limit: 150,
      order: 'created_at DESC'
    })
    .then(function(sleeps) {

      var vals = [];
      vals['petr'] = [];
      for (var i = 0; i < sleeps.length; i++) {
        var time = new Date(sleeps[i].created_at).getTime() / 1000 + 60 * 60 * 2;
        vals[sleeps[i].device][time] = sleeps[i].value;
      }

      plot({
        data: { 'Petr': vals['petr'] },
        filename: 'public/tmp/sleep.png',
        width: 1500,
        style: 'boxes',
        title: 'Sleep',
        time: 'hours',
        others: ['set xtics 1800', 'set style fill solid']
      });

    });
}, 60 * 1000);

module.exports = app;
