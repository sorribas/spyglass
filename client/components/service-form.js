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
    var self = this;
    var onsave = function(err, res) {
      if (err) return aler('OH NOES!');
      $('#modal').foundation('reveal', 'close');
      page('/remotes/' + self.props.remote);
    };

    var service = xtend(this.state);
    service.remote = this.props.remote;

    if (this.props.id) {
      service.name = this.props.id;
      return superagent.put('/api/services').send(service).end(onsave);
    }
    superagent.post('/api/services').send(service).end(onsave);
  },

  nameInput: function() {
    if (this.props.id) return <span />
    return <input type="text" value={this.state.name} placeholder="Name" onChange={this.change('name')} />;
  },

  render: function() {
    console.log(this.props.remote);
    return (
      <form action="">
        <h3>Add service</h3>
        {this.nameInput()}
        <input type="text" value={this.state.start} placeholder="Start script" onChange={this.change('start')} />
        <input type="text" value={this.state.build} placeholder="Build script" onChange={this.change('build')} />
        <input type="text" value={this.state.tags} placeholder="Tags (space separated)" onChange={this.change('tags')} />
        <a onClick={this.save} className="button">Save</a>
      </form>
    );
  }
});

module.exports = ServiceForm;
