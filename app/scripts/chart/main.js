///<reference path="../../../typings/bundle.d.ts" />
var mod = angular.module('chart', []);
var MainCtrl = (function () {
    function MainCtrl($scope) {
        var _this = this;
        this.$scope = $scope;
        this.chartTypes = [
            { label: 'Line Chart', value: 'LineChart' },
            { label: 'Bar Chart', value: 'BarChart' },
            { label: 'Column Chart', value: 'ColumnChart' },
            { label: 'Combo Chart', value: 'ComboChart' },
            { label: 'Pie Chart', value: 'PieChart' },
            { label: 'Scatter Chart', value: 'ScatterChart' },
            { label: 'Bubble Chart', value: 'BubbleChart' },
            { label: 'Calendar Chart', value: 'Calendar' },
            { label: 'Histograms', value: 'Histogram' }
        ];
        this.chartType = 'LineChart';
        window.addEventListener('message', function (event) {
            _this.dataTable = _this.ensureDataTable(event.data.dataTable);
            _this.drawChart(_this.dataTable);
        }, false);
        $scope.$watch('main.chartType', this.render.bind(this));
    }
    MainCtrl.prototype.ensureDataTable = function (input) {
        var row = 0, col = 0;
        var r, colType, val;
        for (row = 0; row < input.rows.length; row++) {
            for (col = 0; col < input.cols.length; col++) {
                colType = input.cols[col].type;
                r = input.rows[row];
                val = r.c[col].v;
                if (colType === 'number') {
                    r.c[col].v = Number(val);
                }
                else if (colType === 'date') {
                    r.c[col].v = (new Function('return new ' + val))();
                }
                else if (colType === 'boolean') {
                    r.c[col].v = !!(val.toLowerCase() === 'true');
                }
                else if (colType === 'datetime') {
                }
                else if (colType === 'timeofday') {
                }
            }
        }
        return input;
    };
    MainCtrl.prototype.render = function () {
        if (!this.dataTable)
            return;
        this.drawChart(this.dataTable);
    };
    MainCtrl.prototype.drawChart = function (dataTable) {
        var cols;
        var dt = new google.visualization.DataTable(dataTable);
        var view = new google.visualization.DataView(dt);
        var option = {
            width: 960, height: 480
        };
        if (this.cols && this.cols.length) {
            cols = this.cols.split(/[^\d]/).filter(function (t) { return !!t.length; }).map(function (d) { return parseInt(d); });
        }
        var chart = new google.visualization[this.chartType](document.getElementById('chart'));
        if (cols && cols.length)
            view.setColumns(cols);
        chart.draw(view, option);
    };
    return MainCtrl;
})();
mod.controller('MainCtrl', MainCtrl);
