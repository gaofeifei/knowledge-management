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
                //     data:yy
                // },
                // toolbox: {
                //     show : true,
                //     feature : {
                //         mark : {show: true},
                //         dataView : {show: true, readOnly: false},
                //         magicType: {show: true, type: ['line', 'bar']},
                //         restore : {show: true},
                //         saveAsImage : {show: true}
                //     }
                // },
                calculable : true,
                xAxis : [
                    {
                        type : 'value',
                        boundaryGap : [0, 0.01],
                        data:[]
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        data : []
                    }
                ],
                series : [
                    {
                        name:'事件名称',
                        type:'bar',
                        data : []
                    },
                    {
                        name:'数量',
                        type:'bar',
                        data:[]
                    }
                ]
            };

            //数据请求
            $.get('/index/count_special_event/').done(function (data) {
                // 填入数据
                var data=eval(data);
                xx=[];
                for(var i=0;i<data.length;i++){
                    xx.push(data[i][1]);
                }
                yy=[];
                for(var i=0;i<data.length;i++){
                    yy.push(data[i][0]);
                }
                myChart.setOption({
                    xAxis: {
                        type : 'value',
                        boundaryGap : [0, 0.01],
                        data: xx
                    },
                    yAxis: {
                        type : 'category',
                        data: yy
                    },
                    series: [
                        {
                            name:'事件名称',
                            type:'bar',
                            data : yy
                        },
                        {
                            name:'数量',
                            type:'bar',
                            data: xx
                        }
                    ]
                });
            });

            // 为echarts对象加载数据
            // myChart.setOption(option);
        }
    );
}();