var exec = require('child_process').exec;

var fork = function(script) {
	var proc = exec(script);
	proc.stderr.pipe(process.stderr);
	proc.stdout.pipe(process.stdout);
	process.stdin.pipe(proc.stdin);
}

process.stdin.resume();
fork('node .');
fork('./node_modules/.bin/watchify client/main.js -o public/js/bundle.js -t reactify');
