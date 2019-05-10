var control = require('./keyboard');
var link = require('./communication');

var DATA_RATE = 1; //ms

control.initKeyboard();
link.setupServer(23912);

setInterval(function() {
    var data = control.processKeys();
    link.sendData("<" + data[0] + data[1] + ">", 0);
}, DATA_RATE);