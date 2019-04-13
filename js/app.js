var control = require('./keyboard');
var link = require('./communication');

var DATA_RATE = 1; //ms

control.initKeyboard();
link.setupServer(23911);

// console.log(link.test);

setInterval(function() {
    var data = control.processKeys();
    console.log(data);
    link.sendData("<" + data[0] + ">", 0);
}, DATA_RATE);
