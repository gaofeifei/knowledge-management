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
    require(
        [
            'echarts',
            'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
        ],
        function (ec) {
            // 基于准备好的dom，初始化echarts图表
            var myChart = ec.init(document.getElementById('special'));

            var option = {
                title : {
                    // text: '世界人口总量',
                    // subtext: '数据来自网络'
                },
                tooltip : {
                    trigger: 'axis'
                },
                // legend: {
                //     data:['2011年']
                // },
                // toolbox: {
                //     show : true,
                    // feature : {
                    //     mark : {show: true},
                    //     dataView : {show: true, readOnly: false},
                    //     magicType: {show: true, type: ['line', 'bar']},
                    //     restore : {show: true},
                    //     saveAsImage : {show: true}
                    // }
                // },
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
                        data : ['巴西','印尼','美国','印度','中国']
                    }
                ],
                series : [
                    {
                        name:'2011年',
                        type:'bar',
                        data:[18203, 23489, 29034, 104970, 131744, 630230]
                    },
                    // {
                    //     name:'2012年',
                    //     type:'bar',
                    //     data:[19325, 23438, 31000, 121594, 134141, 681807]
                    // }
                ]
            };

            // 为echarts对象加载数据
            myChart.setOption(option);
        }
    );
}();