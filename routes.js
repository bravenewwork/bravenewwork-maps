#!/usr/bin/env node

var fs = require('fs'),
	project = JSON.parse(fs.readFileSync(__dirname + '/project.mml'))
	route = process.argv[2],
	start = route.substring(0,2),
	Rsync = require('rsync'),
	end = route.substring(2,4),
	projectName = "bnw-" + route

if (!route) {
	console.error("Usage: ", process.argv[1], "<routeName>")
	process.exit(1)
}
else {
	console.log('[routes] rendering', start, 'to', end)
}

for (var i = project.Layer.length - 1; i >= 0; i--) {
	if (['audiowalk-marker', 'audiowalk-route'].indexOf(project.Layer[i]["class"]) >= 0) {
		var status = (start == project.Layer[i].id || end == project.Layer[i].id || route == project.Layer[i].id) ? 'on' : 'off'
	
		project.Layer[i].status = status
	}
}

project.name = projectName

var rsync = new Rsync().flags('urlv').source(__dirname + "/").destination(__dirname + '/../' + projectName)

console.log('[routes] rsyncing')

rsync.execute(function(error, code, cmd) {
	if (error) {
		console.error('broken', error, code, cmd)
	}
	else {
		fs.writeFileSync(__dirname + '/../' + projectName + '/project.mml', JSON.stringify(project))	
	}
})
