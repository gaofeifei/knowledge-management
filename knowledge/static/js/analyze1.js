/**
 * Created by Administrator on 2016/11/24.
 */
~function(){
    // 路径配置
    require.config({
        paths: {
            echarts: 'http://echarts.baidu.com/build/dist'
        }
    });
    //第一个图表
    require(
        [
            'echarts',
            'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
        ],
        function (ec) {
            // 基于准备好的dom，初始化echarts图表
            var myChart = ec.init(document.getElementById('spread'));

            var option = {
                title: {
                    x: 'center',
                    text: 'ECharts例子个数统计',
                    subtext: 'Rainbow bar example',
                    link: 'http://echarts.baidu.com/doc/example.html'
                },
                tooltip: {
                    trigger: 'item'
                },
                // toolbox: {
                //     show: true,
                //     feature: {
                //         dataView: {show: true, readOnly: false},
                //         restore: {show: true},
                //         saveAsImage: {show: true}
                //     }
                // },
                grid: {
                    borderWidth: 0,
                    y: 80,
                    y2: 60
                },
                xAxis: [
                    {
                        type: 'category',
                        show: false,
                        data: ['Line', 'Bar', 'Scatter', 'K', 'Pie', 'Radar', 'Chord', 'Force', 'Map', 'Gauge', 'Funnel']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        show: false
                    }
                ],
                series: [
                    {
                        name: 'ECharts例子个数统计',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: function(params) {
                                    // build a color map as your need.
                                    var colorList = [
                                        '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                        '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                        '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                    ];
                                    return colorList[params.dataIndex]
                                },
                                label: {
                                    show: true,
                                    position: 'top',
                                    formatter: '{b}\n{c}'
                                }
                            }
                        },
                        data: [12,21,10,4,12,5,6,5,25,23,7],
                        // markPoint: {
                        //     tooltip: {
                        //         trigger: 'item',
                        //         backgroundColor: 'rgba(0,0,0,0)',
                        //     },
                        //     data: [
                        //         {xAxis:0, y: 350, name:'Line', symbolSize:20},
                        //         {xAxis:1, y: 350, name:'Bar', symbolSize:20},
                        //         {xAxis:2, y: 350, name:'Scatter', symbolSize:20},
                        //         {xAxis:3, y: 350, name:'K', symbolSize:20},
                        //         {xAxis:4, y: 350, name:'Pie', symbolSize:20},
                        //         {xAxis:5, y: 350, name:'Radar', symbolSize:20},
                        //         {xAxis:6, y: 350, name:'Chord', symbolSize:20},
                        //         {xAxis:7, y: 350, name:'Force', symbolSize:20},
                        //         {xAxis:8, y: 350, name:'Map', symbolSize:20},
                        //         {xAxis:9, y: 350, name:'Gauge', symbolSize:20},
                        //         {xAxis:10, y: 350, name:'Funnel', symbolSize:20},
                        //     ]
                        // }
                    }
                ]
            };

            // 为echarts对象加载数据
            myChart.setOption(option);
        }
    );
    //第二个图表
    require(
        [
            'echarts',
            'echarts/chart/force' // 使用柱状图就加载bar模块，按需加载
        ],
        function (ec) {
            // 基于准备好的dom，初始化echarts图表
            var myChart = ec.init(document.getElementById('site'));

            var option = {
                title : {
                    text: '人物关系：乔布斯',
                    subtext: '数据来自人立方',
                    x:'right',
                    y:'bottom'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: '{a} : {b}'
                },
                legend: {
                    x: 'left',
                    data:['家人','朋友']
                },
                series : [
                    {
                        type:'force',
                        name : "人物关系",
                        ribbonType: false,
                        categories : [
                            {
                                name: '人物'
                            },
                            {
                                name: '家人'
                            },
                            {
                                name:'朋友'
                            }
                        ],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    textStyle: {
                                        color: '#333'
                                    }
                                },
                                nodeStyle : {
                                    brushType : 'both',
                                    borderColor : 'rgba(255,215,0,0.4)',
                                    borderWidth : 1
                                },
                                linkStyle: {
                                    type: 'curve'
                                }
                            },
                            emphasis: {
                                label: {
                                    show: false
                                    // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                                },
                                nodeStyle : {
                                    //r: 30
                                },
                                linkStyle : {}
                            }
                        },
                        useWorker: false,
                        minRadius : 15,
                        maxRadius : 25,
                        gravity: 1.1,
                        scaling: 1.1,
                        roam: 'move',
                        nodes:[
                            {category:0, name: '乔布斯', value : 10, label: '乔布斯\n（主要）'},
                            {category:1, name: '丽萨-乔布斯',value : 2},
                            {category:1, name: '保罗-乔布斯',value : 3},
                            {category:1, name: '克拉拉-乔布斯',value : 3},
                            {category:1, name: '劳伦-鲍威尔',value : 7},
                            {category:2, name: '史蒂夫-沃兹尼艾克',value : 5},
                            {category:2, name: '奥巴马',value : 8},
                        ],
                        links : [
                            {source : '丽萨-乔布斯', target : '乔布斯', weight : 1, name: '女儿'},
                            {source : '保罗-乔布斯', target : '乔布斯', weight : 2, name: '父亲'},
                            {source : '克拉拉-乔布斯', target : '乔布斯', weight : 1, name: '母亲'},
                            {source : '劳伦-鲍威尔', target : '乔布斯', weight : 2},
                            {source : '史蒂夫-沃兹尼艾克', target : '乔布斯', weight : 3, name: '合伙人'},
                            {source : '奥巴马', target : '乔布斯', weight : 1},
                        ]
                    }
                ]
            };
            var ecConfig = require('echarts/config');
            function focus(param) {
                var data = param.data;
                var links = option.series[0].links;
                var nodes = option.series[0].nodes;
                if (
                    data.source !== undefined
                    && data.target !== undefined
                ) { //点击的是边
                    var sourceNode = nodes.filter(function (n) {return n.name == data.source})[0];
                    var targetNode = nodes.filter(function (n) {return n.name == data.target})[0];
                    //console.log("选中了边 " + sourceNode.name + ' -> ' + targetNode.name + ' (' + data.weight + ')');
                } else { // 点击的是点
                    console.log("选中了" + data.name + '(' + data.value + ')');
                }
            }
            myChart.on(ecConfig.EVENT.CLICK, focus);

            myChart.on(ecConfig.EVENT.FORCE_LAYOUT_END, function () {
                // console.log(myChart.chart.force.getPosition());
            });

            // 为echarts对象加载数据
            myChart.setOption(option);
        }
    );
}();