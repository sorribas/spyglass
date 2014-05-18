var root = require('root');
var fs = require('fs');
var handlebars = require('handlebars');
var send = require('send');
var rcookie = require('routil-cookie');
var cookieSignature = require('cookie-signature');
var app = root();

var templates = {};

app.use('response.render', function(file, vars) {
  var res = this;

  if (templates[file]) return res.send(templates[file](vars));

  fs.readFile('./views/' + file, {encoding: 'utf8'}, function(err, data) {
    templates[file] = handlebars.compile(data);
    res.send(templates[file](vars));
  });
});

app.get("/foundation/*", function(req, res) {
  send(req, './node_modules/bower-foundation/'+req.params.glob).pipe(res);
});

app.get("/foundation-icons/*", function(req, res) {
  send(req, './node_modules/foundation-icons/'+req.params.glob).pipe(res);
});

app.get("/js/*", function(req, res) {
  send(req, './public/js/'+req.params.glob).pipe(res);
});

app.get("/css/*", function(req, res) {
  send(req, './public/css/'+req.params.glob).pipe(res);
});

app.get("/img/*", function(req, res) {
  send(req, './public/img/'+req.params.glob).pipe(res);
});

module.exports = app;
