/**
 * Created by Administrator on 2016/11/24.
 */
var myChart = echarts.init(document.getElementById('special'));
$.get('/index/count_special_event/',function (data) {
    // 填入数据
    var data=eval(data);
    var xx=[],yy=[];
    for(var i=0;i<data.length;i++){
        xx.push(data[i][1]);
    };
    for(var j=0;j<data.length;j++){
        yy.push(data[j][0]);
    };
    myChart.setOption(option = {
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
            data: yy
        },
        itemStyle:{
            normal:{
                color:'#68ae00',
            }
        },
        series: [
            {
                name: '发生次数',
                type: 'bar',
                data: xx,
            },
        ]
    });
});