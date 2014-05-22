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

  envs: function() {
    var rows;
    var self = this;
    if (!this.state.env) rows =  <div />;
    else rows = Object.keys(this.state.env).map(function(key) {

      var changeKey = function() {
        var env = self.state.env;
        env[event.target.value] = env[key];
        delete env[key];
        self.setState({env: env});
      };

      var change = function(event) {
        var env = self.state.env;
        env[key] = event.target.value;
        self.setState({env: env});
      };

      var remove = function() {
        var env = self.state.env;
        delete env[key];
        self.setState({env: env});
      };

      return (
        <div className="row">
          <div className="column large-4 small-4">
            <input value={key} type="text" placeholder="Variable" onChange={changeKey}/>
          </div>
          <div className="column large-6 small-6">
            <input value={self.state.env[key]} type="text" placeholder="Value" onChange={change}/>
          </div>
          <div className="column large-2 small-2">
            <a className="button alert" onClick={remove}>X</a>
          </div>
        </div>
      );
    });

    var addEnv = function() {
      var env = self.state.env || {};
      env[''] = '';
      self.setState({env: env});
    };

    return (
        <div>
          <h4>Environment Variables</h4>
          {rows}
          <a className="button" onClick={addEnv}>+</a>
        </div>
    );
  },

  nameInput: function() {
    if (this.props.id) return <span />
    return <input type="text" value={this.state.name} placeholder="Name" onChange={this.change('name')} />;
  },

  render: function() {
    return (
      <form action="">
        <h3>Add service</h3>
        {this.nameInput()}
        <input type="text" value={this.state.start} placeholder="Start script" onChange={this.change('start')} />
        <input type="text" value={this.state.build} placeholder="Build script" onChange={this.change('build')} />
        <input type="text" value={this.state.tags} placeholder="Tags (space separated)" onChange={this.change('tags')} />
        {this.envs()}
        <a onClick={this.save} className="button">Save</a>
      </form>
    );
  }
});

module.exports = ServiceForm;
