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
    service.env = service.env || [];
    service.env = service.env.reduce(function(obj, envVar) {
      obj[envVar.key] = envVar.value;
      return obj;
    }, {});

    if (this.props.id) {
      service.name = this.props.id;
      return superagent.put('/api/services').send(service).end(onsave);
    }
    superagent.post('/api/services').send(service).end(onsave);
  },

  _setEnvs: function() {
    if (!this.state.env || Array.isArray(this.state.env)) return;
    var env = [];
    var self = this;
    Object.keys(this.state.env).forEach(function(key) {
      env.push({key: key, value: self.state.env[key]});
    });
    this.setState({env: env});
  },

  envs: function() {
    var rows;
    var self = this;
    var i = 0;
    if (!Array.isArray(this.state.env)) setTimeout(this._setEnvs.bind(this), 0);

    if (!this.state.env || !this.state.env.length) rows =  <div />;
    else rows = this.state.env.map(function(envVar) {
      var index = i++;
      var changeKey = function() {
        var env = self.state.env;
        env[index].key = event.target.value;
        self.setState({env: env});
      };

      var change = function(event) {
        var env = self.state.env;
        env[index].value = event.target.value;
        self.setState({env: env});
      };

      var remove = function() {
        var env = self.state.env;
        env.splice(index, 1);
        self.setState({env: env});
      };

      return (
        <div className="row">
          <div className="column large-4 small-4">
            <input value={self.state.env[index].key} type="text" placeholder="Variable" onChange={changeKey}/>
          </div>
          <div className="column large-6 small-6">
            <input value={self.state.env[index].value} type="text" placeholder="Value" onChange={change}/>
          </div>
          <div className="column large-2 small-2">
            <a className="button alert" onClick={remove}>X</a>
          </div>
        </div>
      );
    });

    var addEnv = function() {
      var env = self.state.env || [];
      env.push({key: '', value: ''});
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
