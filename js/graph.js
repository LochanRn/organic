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

var plotSpectrino = () => {
    var script_tag = document.getElementById('searcher');
    var c4 = script_tag.getAttribute("c4");
    var m4 = script_tag.getAttribute("m4");

    var layout4 = {
        title: 'Spectrino Data',
        xaxis4: {
            title: 'Pixel #',
            domain: [0, 1]
        },
        yaxis4: {
            title: 'Intensity',
            domain: [0, 0.90]
        },
    };

    var data = [
        tracecall('x4', 'y4', m4, c4), 
   ];

    Plotly.plot('graph4', [data[0]], layout4)
}

var plotSpecGraph = (msg) => {
    console.log(msg);

    Plotly.extendTraces('graph4', {
        x: [
            [msg.pixelNumber]
        ],
        y: [
            [msg.intensity]
        ]
    }, [0]);
    
    Plotly.relayout('graph4', {
        'xaxis4.range': [0,500],
        'yaxis4.range':[0,500]
    });
}

var  plotLayout = ()=> {
    var script_tag = document.getElementById('searcher')
    var c1 = script_tag.getAttribute("c1");
    var m1 = script_tag.getAttribute("m1");

    var c2 = script_tag.getAttribute("c2");
    var m2 = script_tag.getAttribute("m2");

    var c3 = script_tag.getAttribute("c3");
    var m3 = script_tag.getAttribute("m3");

    var layout1 = {
        title: 'Methane',
        
        xaxis: {
            title: 'Time',
            domain: [0, 1]
        },
        yaxis: {
            title: 'ppm',
            domain: [0, 0.90]
        },
    };

    var layout2 = {
        title: 'Natural Gas',
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
        title: 'C02',
        xaxis3: {
            title: 'Time',
            domain: [0, 1]
        },
        yaxis3: {
            title: 'ppm',
            domain: [0, 0.90]
        },
    };

    var data = [tracecall('x1', 'y1', m1, c1), 
                tracecall('x2', 'y2', m2, c2),
                tracecall('x3', 'y3', m3, c3), 
               ];
    // TO MAKE EMPTY GRAPHS
    Plotly.plot('graph1', [data[0]], layout2)
    Plotly.plot('graph2', [data[1]], layout1)
    Plotly.plot('graph3', [data[2]], layout3)
}

var plotGraph = (msg)=> {

        var time = new Date();

        Plotly.extendTraces('graph1', {
            x: [
                [time]
            ],
            y: [
                [msg[1]]
            ]
        }, [0]);

       
        Plotly.relayout('graph1', {
            'xaxis.range': [time - 5000, time]
        });
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
 }

module.exports.plotLayout = plotLayout;
module.exports.plotGraph = plotGraph;
module.exports.plotSpectrino = plotSpectrino;
module.exports.plotSpecGraph = plotSpecGraph;