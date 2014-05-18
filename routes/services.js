var hms = require('hms');
var remotes = require('hms/lib/remotes');

var clients = { };

var client = function(rem) {
  if (clients[rem]) return clients[rem];

  var remote = remotes.read(rem);
  return clients[rem] = hms(remote);
};

exports.list = function(req, res) {
  var c = client(req.params.remote);

  c.list(function(err, services) {
    if (err) return res.error(500);
    res.send(services);
  });
};

exports.ps = function(req, res) {
  var c = client(req.params.remote);

  c.ps(function(err, services) {
    if (err) return res.error(500);
    res.send(services);
  });

};

exports.add = function(req, res) {
  req.on('json', function(service) {
    var c = client(service.remote);
    var id = service.name;

    delete service.name;
    delete service.remote;

    c.add(id, service, function(err) {
      if (err) return res.error(500);
      res.send({ok: true});
    });
  });
};

exports.delete = function(req, res) {
  var c = client(req.params.remote);

  c.remove(req.params.service, function(err) {
    if (err) return res.error(500);
    res.statusCode = 204;
    res.send('');
  });
};
