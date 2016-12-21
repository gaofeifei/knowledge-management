/**
 * Created by Administrator on 2016/11/28.
 */
var myChart = echarts.init(document.getElementById('complex22'));
myChart.showLoading();
$.get('/static/echarts/dep.json', function (webkitDep) {
    myChart.hideLoading();
    option = {
        // legend: {
        //     data: ['HTMLElement', 'WebGL', 'SVG', 'CSS', 'Other']
        // },
        series: [{
            type: 'graph',
            layout: 'force',
            animation: false,
            label: {
                normal: {
                    position: 'right',
                    formatter: '{b}'
                }
            },
            draggable: true,
            data: webkitDep.nodes.map(function (node, idx) {
                node.id = idx;
                return node;
            }),
            categories: webkitDep.categories,
            force: {
                // initLayout: 'circular'
                // repulsion: 20,
                edgeLength: 5,
                repulsion: 20,
                gravity: 0.2
            },
            edges: webkitDep.links
        }]
    };

    myChart.setOption(option);
});