/**
 * Created by Administrator on 2016/11/24.
 */
var g_myChart = echarts.init(document.getElementById('groupevents'));
$.get('/index/count_group/',function (data) {
    // 填入数据
    var data=eval(data);
    var gxx=[],gyy=[];
    for(var i=0;i<data.length;i++){
        gxx.push(data[i][1]);
    };
    for(var j=0;j<data.length;j++){
        gyy.push(data[j][0]);
    };
    g_myChart.setOption(option = {
        title: {
            // text: '专题名称',
            // subtext: '数据来自网络'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        // legend: {
        //     data: yy
        // },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
        },
        yAxis: {
            type: 'category',
            data: gyy
        },
        itemStyle:{
            normal:{
                color:'#fc8213',
            }
        },
        series: [
            {
                name: '包含人数',
                type: 'bar',
                data: gxx,
            },
        ]
    });
});