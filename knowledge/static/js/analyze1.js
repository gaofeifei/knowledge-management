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
                title : {
                    text: '世界人口总量',
                    subtext: '数据来自网络'
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['2011年', '2012年']
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'value',
                        boundaryGap : [0, 0.01]
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        data : ['巴西','印尼','美国','印度','中国','世界人口(万)']
                    }
                ],
                series : [
                    {
                        name:'2011年',
                        type:'bar',
                        data:[18203, 23489, 29034, 104970, 131744, 630230]
                    },
                    {
                        name:'2012年',
                        type:'bar',
                        data:[19325, 23438, 31000, 121594, 134141, 681807]
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
                    console.log("选中了边 " + sourceNode.name + ' -> ' + targetNode.name + ' (' + data.weight + ')');
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