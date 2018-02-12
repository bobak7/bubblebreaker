function HighScores (idBase, count) {
    
    this.chart = [];
    
    this.initChart = function () {
        var i = 0;
        for (i = 0; i < count; i++) {
            this.chart[i] = {score: 0, playerName: ''};
        }
    };
    this.initChart();
    
    this.draw = function () {
        var i = 0;
        for (i = 0; i < this.chart.length; i++) {
            document.getElementById(idBase + i).innerHTML =
                '<td>' + this.chart[i].score + '</td>' +
                '<td>' + this.chart[i].playerName + '</td>';
        }
    };
    
    this.consider = function (record) {
        this.chart.push(record);
        this.chart.sort(function (a, b) {return b.score - a.score});
        this.chart.pop();
        this.draw();
    };
    
    this.load = function (chart) {
        this.chart = JSON.parse(chart);
        this.draw();
    };
    
    this.save = function () {
        return JSON.stringify(this.chart);
    };
    
}