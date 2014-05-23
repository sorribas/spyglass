var app = require('./lib/app');
var remotes = require('./routes/remotes');
var services = require('./routes/services');

app.get('/api/remotes', remotes.list);
app.get('/api/services/{remote}', services.list);
app.get('/api/services/ps/{remote}', services.ps);
app.post('/api/services', services.add);
app.put('/api/services', services.edit);
app.del('/api/services/{remote}/{service}', services.delete);

app.get('*', function(req, res) {
  res.render('index.hbs');
});

app.listen(process.env.PORT || 3000, function(err, server) {
  console.log('Spyglass server listening on port', server.address().port);
});
