/** @jsx React.DOM */
var React = require('react');
var xtend = require('xtend');
var superagent = require('superagent');
var page = require('page');

var ServiceForm = React.createClass({

  getInitialState: function() {
    return {};
  },

  change: function(value) {
    var self = this;

    return function(event) {
      var obj = {};
      obj[value] = event.target.value;
      self.setState(obj);
    }
  },

  save: function() {
    var service = xtend(this.state);
    service.remote = this.props.remote;
    superagent.post('/api/services').send(service).end(function(err, res) {
      if (err) return aler('OH NOES!');
      $('#modal').foundation('reveal', 'close');
      page('/remotes/' + this.props.remote);
    });
  },

  render: function() {
    return (
      <form action="">
        <h3>Add service</h3>
        <input type="text" value={this.state.name} placeholder="Name" onChange={this.change('name')} />
        <input type="text" value={this.state.start} placeholder="Start script" onChange={this.change('start')} />
        <input type="text" value={this.state.tags} placeholder="Tags (comma separated)" onChange={this.change('tags')} />
        <a onClick={this.save} className="button">Save</a>
      </form>
    );
  }
});

module.exports = ServiceForm;
