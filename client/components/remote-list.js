/** @jsx React.DOM */
var React = require('react');
var page = require('page');
var sublist = require('../sublist');

var Remote = React.createClass({

  onclick: function() {
    page('/remotes/' + this.props.remote.name);
  },

  render: function() {
    return(
      <div className="large-4 columns">
        <div className="panel remote">
          <h4><a onClick={this.onclick}>{this.props.remote.name}</a></h4>
          <p>Url: {this.props.remote.url}</p>
        </div>
      </div>
    );
  }
});

var RemoteRow = React.createClass({

  remote: function(r) {
    return (
      <Remote remote={r} />
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
        {this.props.remotes.map(this.remote)}
        {this.emptyColumns(this.props.remotes.length)}
      </div>
    );
  }
});

var RemoteList = React.createClass({

  row: function(rowEls) {
    return (<RemoteRow remotes={rowEls} />);
  },

  render: function() {
    return (
      <div>{sublist(this.props.remotes).map(this.row)}</div>
    );
  }
});

module.exports = RemoteList;
