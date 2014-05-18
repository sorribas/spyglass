module.exports = function(xs) {
  var rs = [];
  var cs = [];
  var i = 0;

  xs.forEach(function(el) {
    if (i++ === 3) {
      i = 1;
      rs.push(cs);
      cs = [];
    }
    cs.push(el);
  });
  rs.push(cs);

  return rs
};
