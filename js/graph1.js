var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var client = dgram.createSocket('udp4');

var PORT = 23911;
var HOST = '127.0.0.1';

var port = 3304;
var host = '192.168.1.39';

var ipAddress = document.getElementById("ipAddress");
var port = document.getElementById("port");

var allowData;
var override = false;
var keyMap = {
	"w": false,
	"2": false,
	"3": false,
	"4": false,
	"5": false,
	"6": false,
	"7": false,
	"8": false
};

server.on('listening', function () {
	var address = server.address();
	console.log('Listening on ' + address.address + ' : ' + address.port);
});

var message = "";
var msg = "";
server.on('message', function (message, remote) {
	var msgdec = " ";
	for (var i = 0; i < message.length; i++) {
		msgdec += (String.fromCharCode(message[i]));
	}
	msg = msgdec.split(",");
	for (i = 0; i < 7; i++) {
		console.log(msg[i]);
	}

});

server.bind(PORT, HOST);

$('#updStatus').click( (event)=> {
	host = $("#bioIp").val().split(":")[0];
	port = $("#bioIp").val().split(":")[1];
	console.log(host,port);
	if ($(this).hasClass('btn-warning')) {
		$(this).removeClass('btn-warning').addClass('btn-positive').html('Stop');
		allowData = true;
	} else if ($(this).hasClass('btn-positive')) {
		$(this).removeClass('btn-positive').addClass('btn-warning').html('Start');
		allowData = false;
	}
	connect();
});

setInterval(function () {
	$('body').keydown(function (event) {
		if (keyMap.hasOwnProperty(event.key))
			keyMap[event.key] = true;

	});
	$('body').keyup(function (event) {
		if (keyMap.hasOwnProperty(event.key))
			keyMap[event.key] = false;
	});

	if (allowData || override) {
		var output = "";
		Object.keys(keyMap).forEach(function (key) {
			output += (keyMap[key] ? "1" : "0");
		});
		var buf = parseInt(output.substring(0, 8), 2);
		var buf2 = String.fromCharCode(buf);
		var message = new Buffer(buf2);
		client.send(message, 0, message.length, port, host, function (err, bytes) {
			if (err) console.error(err);
			$("#up").html(` ${bytes}b`);
			// TODO create log

		});
		// console.log(data);
	}
}, 100);

function connect() {
	var a = 0,
		b = 0,
		c = 0;
	var script_tag = document.getElementById('searcher')
	var c1 = script_tag.getAttribute("c1");
	var m1 = script_tag.getAttribute("m1");

	var c2 = script_tag.getAttribute("c2");
	var m2 = script_tag.getAttribute("m2");

	var c3 = script_tag.getAttribute("c3");
	var m3 = script_tag.getAttribute("m3");

	var c4 = script_tag.getAttribute("c4");
	var m4 = script_tag.getAttribute("m4");

	var c5 = script_tag.getAttribute("c5");
	var m5 = script_tag.getAttribute("m5");

	// var c6 = script_tag.getAttribute("c6");
	// var m6 = script_tag.getAttribute("m6");

	// var c7 = script_tag.getAttribute("c7");
	// var m7 = script_tag.getAttribute("m7");

	function tracecall(x, y, m, c) {
		var trace = {
			x: [],
			y: [],
			xaxis: x,
			yaxis: y,
			type: m,
			line: {
				color: c
			}
		};

		return trace;
	}


	var layout1 = {
		title: 'Methane',
		//grid: {rows: 1, columns: 1, pattern: 'independent'},
		xaxis1: {
			title: 'Time',
			domain: [0, 1]
		},
		yaxis1: {
			title: 'ppm',
			domain: [0, 0.90]
		},
	};

	var layout2 = {
		title: 'Carbon Dioxide',
		xaxis2: {
			title: 'Time',
			domain: [0, 1]
		},
		yaxis2: {
			title: 'ppm',
			domain: [0, 0.90]
		},
	};

	var layout3 = {
		title: 'Propane',
		xaxis3: {
			title: 'Time',
			domain: [0, 1]
		},
		yaxis3: {
			title: 'ppm',
			domain: [0, 0.90]
		},
	};

	var layout4 = {
		title: 'Natural Gas',
		xaxis4: {
			title: 'Time',
			domain: [0, 1]
		},
		yaxis4: {
			title: 'ppm',
			domain: [0, 0.90]
		},
	};

	var layout5 = {
		title: 'Spectrometer',
		xaxis5: {
			title: 'Time',
			domain: [0, 1]
		},
		yaxis5: {
			title: 'voltage(V)',
			domain: [0, 0.90]
		},
	};

	var data = [tracecall('x1', 'y1', m1, c1), tracecall('x2', 'y2', m2, c2), tracecall('x3', 'y3', m3, c3), tracecall('x4', 'y4', m4, c4), tracecall('x5', 'y5', m5, c5)];
	//, tracecall('x6' , 'y6', m6, c6), tracecall('x7' , 'y7', m7, c7)];

	// TO MAKE EMPTY GRAPHS
	Plotly.plot('graph2', [data[1]], layout1)
	Plotly.plot('graph', [data[0]], layout2)
	Plotly.plot('graph3', [data[2]], layout3)
	Plotly.plot('graph4', [data[3]], layout4)
	Plotly.plot('graph5', [data[4]], layout5)
	//Plotly.plot('graph6',[data[5]],layoutcall('Carbon Dioxide'))
	//Plotly.plot('graph7',[data[6]],layoutcall('Spectrometer'))

	//RUNS NON STOP---->
	var interval = setInterval(function () {

		var time = new Date();

		Plotly.extendTraces('graph', {
			x: [
				[time]
			],
			y: [
				[msg[1]]
			]
		}, [0]);
		Plotly.relayout('graph', {
			'xaxis1.range': [time - 5000, time]
		});

	}, 100);

	var interval = setInterval(function () {

		var time = new Date();

		Plotly.extendTraces('graph2', {
			x: [
				[time]
			],
			y: [
				[msg[2]]
			]
		}, [0]);
		Plotly.relayout('graph2', {
			'xaxis2.range': [time - 5000, time]
		});
	}, 100);




	var interval = setInterval(function () {

		var time = new Date();

		Plotly.extendTraces('graph3', {
			x: [
				[time]
			],
			y: [
				[msg[3]]
			]
		}, [0]);
		Plotly.relayout('graph3', {
			'xaxis3.range': [time - 5000, time]
		});
	}, 100);




	var interval = setInterval(function () {

		var time = new Date();

		Plotly.extendTraces('graph4', {
			x: [
				[time]
			],
			y: [
				[msg[4]]
			]
		}, [0]);
		Plotly.relayout('graph4', {
			'xaxis4.range': [time - 5000, time]
		});
	}, 100);





	var interval = setInterval(function () {

		var time = new Date();

		Plotly.extendTraces('graph5', {
			x: [
				[time]
			],
			y: [
				[msg[5]]
			]
		}, [0]);
		Plotly.relayout('graph5', {
			'xaxis5.range': [time - 5000, time]
		});
	}, 100);





	// var interval = setInterval(function() {

	// 	var time = new Date();


	// Plotly.extendTraces('graph6', {x:[[time]],y:[[msg[6]]]},[0]);
	// Plotly.relayout('graph6', {'xaxis6.range':[time-5000,time]});
	// }, 100);






	// var interval = setInterval(function() {

	// 	var time = new Date();


	// Plotly.extendTraces('graph7', {x:[[time]],y:[[msg[7]]]},[0]);
	// Plotly.relayout('graph7', {'xaxis7.range':[time-5000,time]});
	// }, 100);


	HOST = ipAddress.value;
	PORT = port.value;
}