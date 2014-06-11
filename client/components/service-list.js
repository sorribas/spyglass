/** @jsx React.DOM */
var React = require('react');
var ServiceForm = require('./service-form');
var page = require('page');
var sublist = require('../sublist');

var Service = React.createClass({

  getInitialState: function() {
    return {hover: false};
  },

  onclick: function() {
    page('/services/edit/' + this.props.remote + '/' + this.props.service.id);
    var comp = React.renderComponent(<ServiceForm id={this.props.service.id} remote={this.props.remote} />, $('#modal')[0]);
    $('#modal form')[0].reset();
    comp.replaceState(this.props.service);
    $('#modal').foundation('reveal', 'open');
  },

  hover: function() {
    this.setState({hover: true});
  },

  unhover: function() {
    this.setState({hover: false});
  },

  remove: function() {
    var promptText = 'Are you sure you want to remove the service? Write the service name to confirm';
    if (prompt(promptText) === this.props.service.id) page('/services/remove/' + this.props.remote+ '/' + this.props.service.id);
    else alert('Wrong service name.');
  },

  icon: function() {
    if (this.state.hover) return <i onClick={this.remove} className="gen-enclosed foundicon-remove remove-service"></i>
    return <span />
  },

  render: function() {
    return(
      <div className="large-4 columns">
        <div onMouseEnter={this.hover} onMouseLeave={this.unhover} className="panel service">
          <h4><a onClick={this.onclick}>{this.props.service.id}</a></h4>
          <div><strong>Start script:</strong> {this.props.service.start}</div>
          <div><strong>Revision:</strong> {this.props.service.revision}</div>
          <div><strong>Status:</strong> {this.props.process.status}</div>
          {this.icon()}
        </div>
      </div>
    );
  }
});

var ServiceRow = React.createClass({

  findProcess: function(name) {
    var r;
    this.props.processes[0].list.forEach(function(ps) { // TODO WAT?
      if (ps.id === name) r = ps;
    });

    return r || {status: 'stopped'};
  },

  service: function(r) {
    return (
      <Service service={r} process={this.findProcess(r.id)} remote={this.props.remote} />
    );
  },

  emptyColumns: function(l) {
    var length = 3 - l;
    return Array(length).join(',').split(',').map(function() {
      return <div className="large-4 columns"> </div>
    });
  },

  render: function() {
    return (
      <div className="row">
        {this.props.services.map(this.service)}
        {this.emptyColumns(this.props.services.length)}
      </div>
    );
  }
});

var ServiceList = React.createClass({

  row: function(rowEls) {
    return (<ServiceRow remote={this.props.remote} services={rowEls} processes={this.props.processes}/>);
  },

  addService: function() {
    page('/services/new/' + this.props.remote);
  },

  render: function() {
    return (
      <div className="row">
        <div className="columns large-12">
          <a onClick={this.addService} className="button">+</a>
        </div>
        <div className="columns large-12">{sublist(this.props.services).map(this.row)}</div>
      </div>
    );
  }
});

module.exports = ServiceList;
