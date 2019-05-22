var  plotLayout = ()=> {
    var script_tag = document.getElementById('searcher')
    var c1 = script_tag.getAttribute("c1");
    var m1 = script_tag.getAttribute("m1");

    var c2 = script_tag.getAttribute("c2");
    var m2 = script_tag.getAttribute("m2");

    var c3 = script_tag.getAttribute("c3");
    var m3 = script_tag.getAttribute("m3");

    var c4 = script_tag.getAttribute("c4");
    var m4 = script_tag.getAttribute("m4");

    // var c5 = script_tag.getAttribute("c5");
    // var m5 = script_tag.getAttribute("m5");


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
        title: 'Natural Gas',
        xaxis3: {
            title: 'Time',
            domain: [0, 1]
        },
        yaxis3: {
            title: 'ppm',
            domain: [0, 0.90]
        },
    };

    // var layout4 = {
    //     title: 'Natural Gas',
    //     xaxis4: {
    //         title: 'Time',
    //         domain: [0, 1]
    //     },
    //     yaxis4: {
    //         title: 'ppm',
    //         domain: [0, 0.90]
    //     },
    // };

    // var layout5 = {
    //     title: 'Spectrometer',
    //     xaxis5: {
    //         title: 'Time',
    //         domain: [0, 1]
    //     },
    //     yaxis5: {
    //         title: 'voltage(V)',
    //         domain: [0, 0.90]
    //     },
    // };

    var data = [tracecall('x1', 'y1', m1, c1), 
                tracecall('x2', 'y2', m2, c2),
                tracecall('x3', 'y3', m3, c3), 
                // tracecall('x4', 'y4', m4, c4), 
                // tracecall('x5', 'y5', m5, c5)
               ];
    

    // TO MAKE EMPTY GRAPHS
    Plotly.plot('graph1', [data[0]], layout2)
    Plotly.plot('graph2', [data[1]], layout1)
    Plotly.plot('graph3', [data[2]], layout3)
    // Plotly.plot('graph4', [data[3]], layout4)
    // Plotly.plot('graph5', [data[4]], layout5)
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

        

        var time = new Date();

        // Plotly.extendTraces('graph4', {
        //     x: [
        //         [time]
        //     ],
        //     y: [
        //         [msg[4]]
        //     ]
        // }, [0]);
        
        // Plotly.relayout('graph4', {
        //     'xaxis4.range': [time - 5000, time]
        // });

        

        // var time = new Date();

        // Plotly.extendTraces('graph5', {
        //     x: [
        //         [time]
        //     ],
        //     y: [
        //         [msg[5]]
        //     ]
        // }, [0]);
        
        // Plotly.relayout('graph5', {
        //     'xaxis5.range': [time - 5000, time]
        // });
 }

module.exports.plotLayout = plotLayout;
module.exports.plotGraph = plotGraph;
