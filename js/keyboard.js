var keyMap = {
    "1": false,
    "2": false,
    "3": false,
    "4": false,
    "5": false,
    "6": false,
    "7": false,
    "8": false,
    "w": false,
    "s": false
};

var initKeyboard = function () {
    $('body').keydown(function (event) {
        if (keyMap.hasOwnProperty(event.key))
            keyMap[event.key] = true;
    });
    $('body').keyup(function (event) {
        if (keyMap.hasOwnProperty(event.key))
            keyMap[event.key] = false;
    });
}

var processKeys = function () {
    var output = "";
    Object.keys(keyMap).forEach(function (key) {
        output += (keyMap[key] ? "1" : "0");
    });
    var innerServoControls = parseInt(output.substring(0, 8), 2);
    var outterServoControls = parseInt(output.substring(8, 10), 2);
    return [innerServoControls,outterServoControls];
}

module.exports.initKeyboard = initKeyboard;
module.exports.processKeys = processKeys;