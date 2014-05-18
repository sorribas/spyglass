var path = require('path');
var fs = require('fs');

var home = process.env.HOME || process.env.USERPROFILE;
var file = path.join(home, '.hms.json');

exports.list = function(req, res) {
  fs.readFile(file, function(err, contents) {
    var obj;
    try{
      obj = JSON.parse(contents);
    } catch(err) {
      obj = {};
    }

    res.send(Object.keys(obj).map(function(key) {
      return {name: key, url: obj[key].url}
    }));
  });
};
