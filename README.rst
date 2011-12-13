OHLC plot
============

An open-high-low-close plot that uses Raphael (thus works on IE 7/8), and supports multiple
series.

Requirements
------------

    1. Raphael

    *tada*


Demo additional requirements
----------------------------

    1. jQuery


Usage
-----

    1. Include raphael-min.js
    2. Include raphael.ohlc.js
    3. Make a new ohlc plot, with optional overide config as first arg::

        var sp = new ohlcPlot({
            size: 400,  // plot (i.e. plot area) height
            colours: [  // background colours
                ['#CF171F', 0, 33.3],
                ['#F47721', 33.4, 66.6],
                ['#FFC80B', 66.7, 100]
            ],
            x_label: "",  // x axis label
            y_label: "",  // y axis label
            clickFn: function(elem) {...},  // click a point and...
            hoverInFn: function(elem) {...},
            hoverOutFn: function(elem) {...}
        },
        "some-container-id",
        {
            'series1': [
                [2, 4, 1, 3, 44]  // [open, high, low, close, count]
            ],
            'series2': [
                [6, 8, 5, 7, 99]
            ]
        });

    4. If you want to change the bars::

        sp.makeBars({'series x': [...]});

License
-------

Copyright (c) 2011 Steve Pike

Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
