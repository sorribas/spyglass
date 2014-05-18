/** @jsx React.DOM */
var $ = require('jquery');
var page = require('page');
var superagent = require('superagent');
var afterAll = require('after-all');
var React = require('react');
var RemoteList = require('./components/remote-list');
var ServiceList = require('./components/service-list');
var ServiceForm = require('./components/service-form');

var onerror = function() {
  var component = function() {
    return (
    <div className="row">
      <h2>Oh noes!</h2>
      <img width="800" src="http://upload.wikimedia.org/wikipedia/commons/b/b1/A_Costa_Concordia_kiemel%C3%A9se.jpg" />
    </div>);
  };
  React.renderComponent(component(), $('#main')[0]);
};

page('/', function() {
  $('#loading').show();
  superagent.get('/api/remotes', function(err, res) {
    $('#loading').hide();
    if (err) return onerror(err);
    React.renderComponent(<RemoteList remotes={res.body} />, $('#main')[0]);
  });
});

page('/remotes/:name', function(ctx) {
  $('#loading').show();

  var services, processes;
  var next = afterAll(function(err) {
    $('#loading').hide();
    if (err) return onerror(err);
    React.renderComponent(<ServiceList services={services} processes={processes} remote={ctx.params.name} />, $('#main')[0]);
  });

  superagent.get('/api/services/' + ctx.params.name, next(function(res) {
    services = res.body;
  }));

  superagent.get('/api/services/ps/' + ctx.params.name, next(function(res) {
    processes = res.body;
  }));
});

page('/services/new/:remote', function(ctx) {
  $(function() {
    var comp = React.renderComponent(<ServiceForm remote={ctx.params.remote} />, $('#modal')[0]);
    comp.replaceState({});
    $('#modal form')[0].reset();
    $('#modal').foundation('reveal', 'open');
  });
});

page('/services/remove/:remote/:service', function(ctx) {
  superagent.del('/api/services/' + ctx.params.remote + '/' + ctx.params.service, function(err, res) {
    if (err) return onerror(err);
    page('/remotes/' + ctx.params.remote);
  });
});

page('/services/edit/:remote/:serice', function() {
  // ignore
});

page();

$('#modal').on('close', function() {
  window.history.back();
});

$('#title').click(function() {
  page('/');
});

window.$ = $;
window.jQuery = $;
