(function () {
    var ohlcPlot = function(config, element_id, data) {
        this.init(config, element_id, data);
    };

    ohlcPlot.prototype.defaultHoverInFn = function(elem) {
        var datum = elem.data('datum'),
            bar = this.config.x_tick_size / 20,
            bb = elem.getBBox(),
            hovWidth = (this.config.x_tick_size / 4) * 3;
        var text = this.r.text(
            bb.x + bar,
            bb.y + (bb.height / 2),
            "Site: " + datum[0] +
            "\nMax: " + datum[1] +
            "\nMin: " + datum[2] +
            "\nAvg: " + datum[3] +
            "\nTot: " + datum[4]);
        elem.data('hover', [
            this.r.rect(
                bb.x - (hovWidth / 2) + bar,
                bb.y,
                hovWidth,
                bb.height)
            .attr('fill', '#fff')
            .attr('fill-opacity', 0.7).hover(function(){}, function(){ this.config.hoverOutFn(elem) }, null, this),
            text.toFront()
        ]);
    };
    
    ohlcPlot.prototype.defaultHoverOutFn = function(elem) {
        // provides a default hover function (hide the text)
        elem.attr('stroke', '#333');
        var bits = elem.data('hover');
        elem.data('hover', []);
        for (var i = 0; i < bits.length; i++) {
            bits[i].remove();
        }
    };


    var SIZE = 400;
    ohlcPlot.prototype.default_config = {
        height: SIZE,  // plot (i.e. plot area) height/width (square!)
        colours: [  // gradient colours
            ['#cfc', 0],
            ['#ffc', 33.3],
            ['#fcc', 100]
        ],
        y_ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        x_label: "",  // x axis label
        y_label: "Y LABEL",  // y axis label
//        clickFn: ohlcPlot.prototype.defaultClickFn,  // click a point and...
        hoverInFn: ohlcPlot.prototype.defaultHoverInFn,  // click a point and...
        hoverOutFn: ohlcPlot.prototype.defaultHoverOutFn  // click a point and...
    };

    ohlcPlot.prototype.drawLabels = function(data) {
        // add x, y axis labels and tick labels
        var text_width = this.config.text_width,
            padding = this.config.padding,
            width = this.config.width,
            height = this.config.height,
            x_tick_size = this.config.x_tick_size,
            y_ticks = this.config.y_ticks,
            y_tick_size = this.config.y_tick_size,
            r = this.r,
            x_label = this.config.x_label,
            y_label = this.config.y_label,
            self = this;

        // labels
        var xcount = 0;
        for (var key in data) {
            var label = r.text(
                padding + (xcount * x_tick_size) + (x_tick_size / 2),
                (2 * text_width) + height,
                key);
            label.rotate(-20);
            var bb = label.getBBox();
            label.attr('x',
                padding + (xcount * x_tick_size) + (x_tick_size / 2) - (bb.width / 2) - text_width
            );
            label.attr('y',
                (1.5 * text_width) + height 
            );
            if (label.getBBox().y + label.getBBox().height > height + padding + self.getLegendHeight()) {
                r.setSize(
                    width + (2 * padding),
                    label.getBBox().y + label.getBBox().height);
            }

            xcount++;
        }
        for (var yi in y_ticks) {
            r.text(
                padding - (2 * text_width),
                height - (y_tick_size * yi) + text_width,
                yi);
        }

        // x axis label
        var xl = r.text(
            padding - text_width + (width / 2),
            height + (padding - text_width),
            x_label);
        // y axis label
        var yl = r.text(
            text_width,
            text_width + (height / 2),
            y_label);
        yl.rotate(-90);

    };

    ohlcPlot.prototype.getColours = function () {
        // converts our list to an SVG gradient string
        var result = "90-";
        var colours = this.config.colours;
        for (var ci = 0; ci < colours.length; ci++) {
            var datum = colours[ci];
            switch (ci) {
                case 0:
                    result += datum[0];
                    break;
                case colours.length:
                    result += "-" + datum[0];
                    break;
                default:
                    result += "-" + datum[0] + ":" + datum[1];
            }
        }
        return result;
    };

    ohlcPlot.prototype.drawGrid = function() {
        // output the gradient and the lines
        var text_width = this.config.text_width,
            padding = this.config.padding,
            height = this.config.height,
            width = this.config.width,
            x_tick_size = this.config.x_tick_size,
            x_ticks = this.config.x_ticks,
            r = this.r;

        //gradient
        var background = r.rect(padding - text_width, text_width, width, height);
        background.attr('fill', this.getColours());
        var vpad = padding - text_width;
        r.path(  //axes / border
            "M" + (vpad) + "," + (text_width) +  // move to top
            "L" + (vpad) + "," + (height + text_width) +  // line to bottom
            "L" + (vpad + width) + "," + (height + text_width) +  // line to left
            "L" + (vpad + width) + "," + (text_width) +  // line to top
            "L" + (vpad) + "," + (text_width)  // line to right
        );

        // draw the tick lines
        for (var li in x_ticks) {
            var line = r.path(
                "M" + (vpad + (x_tick_size * li)) + "," + (text_width) + 
                "L" + (vpad + (x_tick_size * li)) + "," + (text_width + height)
            ).attr("stroke-width", 0.5);
        }

    };

    ohlcPlot.prototype.showLegend = function(data) {
    };

    ohlcPlot.prototype.makeBars = function(data) {
        var text_width = this.config.text_width,
            padding = this.config.padding,
            height = this.config.height,
            width = this.config.width,
            x_tick_size = this.config.x_tick_size,
            y_tick_size = this.config.y_tick_size,
            y_ticks = this.config.y_ticks,
            x_ticks = this.config.x_ticks,
            bar = this.config.x_tick_size / 20,
            hoverInFn = this.config.hoverInFn,
            hoverOutFn = this.config.hoverOutFn,
            r = this.r,
            self = this;

        var xcount = 0;
        for (var key in data) {
            var datum = data[key];
            var o = datum[0],
                h = datum[1],
                l = datum[2],
                c = datum[3],
                t = datum[4];
            var invert_y = y_ticks.length - 1; 
            var xpad = padding + (xcount * x_tick_size) + (x_tick_size / 2) - text_width;
            var path = "" +
                "M" + (xpad - bar) + "," + (height - y_tick_size * o + text_width) +
                "L" + (xpad) + "," + (height - y_tick_size * o + text_width) +
                "M" + (xpad) + "," + (height - y_tick_size * h + text_width) +
                "L" + (xpad) + "," + (height - y_tick_size * l + text_width) +
                "M" + (xpad) + "," + (height - y_tick_size * c + text_width) +
                "L" + (xpad + bar) + "," + (height - y_tick_size * c + text_width);

            var ohlcBar = r.path(path).attr('stroke-linecap', 'round').data('datum', datum);
            var bb = ohlcBar.getBBox();
            (function() {
                var bar = ohlcBar;
                r
                .rect(bb.x, bb.y, bb.width, bb.height)
                .attr('fill-opacity', 0)
                .attr('fill', '#000')
                .attr('stroke', 0)
                .hover(
                    function() {
                        bar.attr('stroke-width', 3);
                        hoverInFn.call(self, bar);
                    },
                    function() {
                        bar.attr('stroke-width', 1);
//                        hoverOutFn.call(self, bar);
                    }
                );
            })()
            xcount++;
        }

    };

    ohlcPlot.prototype.getLegendHeight = function() {
        return this.config.text_width * 2;
    }

    ohlcPlot.prototype.init = function(config, element_id, data) {
        var self = this;

        // update config with custom config
        this.config = {};
        for (var key in this.default_config) {
            if (config[key] !== undefined) {
                this.config[key] = config[key];
            } else {
                this.config[key] = this.default_config[key];
            }
        }
        var data_keys = [];
        for (key in data) {
            data_keys.push(key);
        }

        var height = this.config.height;
        var viewPort = document.getElementById(element_id).offsetWidth;
        var width =  viewPort / 10 * 8;
        this.config.width = width;
        //how far apart are the ticks?
        this.config.x_tick_size = width / data_keys.length;
        this.config.x_ticks = data_keys;
        this.config.y_tick_size = height / (this.config.y_ticks.length - 1);
        // how much LHS/Bottom extra do we need for axes etc?
        this.config.padding = width / 10;
        //hm, bit rough, but really height/width of chars.
        this.config.text_width = this.config.padding / 4;


        var padding = this.config.padding;

        this.r = Raphael(
            element_id,
            width + (2 * padding),
            height + padding + self.getLegendHeight());
        this.drawLabels(data);
        this.drawGrid();
        this.showLegend(data);
        this.makeBars(data);
    };

    window.ohlcPlot = ohlcPlot;
})()
