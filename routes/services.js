var fs = require('fs');
var path = require('path');
var hms = require('hms');
var valid = require('../schema')

var clients = { };

var home = process.env.HOME || process.env.USERPROFILE;
var file = path.join(home, '.hms.json');

var client = function(rem, cb) {
  if (clients[rem]) return process.nextTick(function() {
    cb(null, clients[rem]);
  });

  fs.readFile(file, function(err, contents) {
    if (err) return cb(err);
    var remotes;
    try{
      remotes = JSON.parse(contents);
    } catch(err) {
      remotes = {};
    }

    cb(null, clients[rem] = hms(remotes[rem]));
  });
};

exports.list = function(req, res) {
  client(req.params.remote, function(err, c) {
    if (err) return res.error(500);

    c.list(function(err, services) {
      if (err) return res.error(500);

      res.send(services.sort(function(a, b) {
        return a.id.localeCompare(b.id);
      }));
    });
  });
};

exports.ps = function(req, res) {
  client(req.params.remote, function(err, c) {
    if (err) return res.error(500);
    c.ps(function(err, services) {
      if (err) return res.error(500);
      res.send(services);
    });
  });
};

exports.add = function(req, res) {
  req.on('json', function(service) {
    if (!valid(service)) return res.error(400, 'Invalid data:' + valid.errorsText());
    client(service.remote, function(err, c) {
      if (err) return res.error(500);
      var id = service.name;

      delete service.name;
      delete service.remote;

      c.add(id, service, function(err) {
        if (err) return res.error(500);
        res.send({ok: true});
      });
    });
  })
};

exports.edit = function(req, res) {
  req.on('json', function(service) {
    client(service.remote, function(err, c) {
      if (err) return res.error(500);
      var id = service.name;

      delete service.name;
      delete service.remote;

      c.update(id, service, function(err) {
        if (err) return res.error(500);
        res.send({ok: true});
      });
    });
  });
};

exports.delete = function(req, res) {
  client(req.params.remote, function(err, c) {
    if (err) return res.error(500);
    c.remove(req.params.service, function(err) {
      if (err) return res.error(500);
      res.statusCode = 204;
      res.send('');
    });
  });
};
