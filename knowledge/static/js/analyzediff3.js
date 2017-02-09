/**
 * Created by Administrator on 2016/12/19.
 */
var themename1=theme_diff.theme1;
var themename2=theme_diff.theme2;
function left() {
    function place() {
        //this.ajax_method='GET'; // body...
    }
    place.prototype= {
        call_request:function(url,callback) {
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                async: true,
                success:callback
            });
        },
    };
    function territory(data) {
        var data=eval(data);
        // $(".pretwomd").text(data.event_num);
        var myChart = echarts.init(document.getElementById('txtleft'));
        var thingname=[],thingnum=[],leng=[];
        var s_series=[];
        for (var key in data.river_data){
            thingname.push(key);
            leng.push(data.river_data[key].length);
            var nums2=[];
            $.each(data.river_data[key],function (index,item) {
                nums2.push(item[1]);
            });
            s_series.push({
                name: key,
                type: 'line',
                data: nums2
            });
        };
        var xx=[];
        var xmax=Math.max.apply(null, leng);
        for (var x=0;x<xmax;x++){
            xx.push(x+1);
        };
        var option = {
            title: {
                // text: '折线图堆叠'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                // data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
                data:thingname,
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                // data: ['周一','周二','周三','周四','周五','周六','周日']
                data:xx,
            },
            yAxis: {
                type: 'value'
            },
            series: s_series
        };
        myChart.setOption(option);
    };
    function place2() {
        //this.ajax_method='GET'; // body...
    }
    place2.prototype= {
        call_request:function(url,callback) {
            $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                async: true,
                success:callback
            });
        },
    };
    function territory2(data) {
        var data=eval(data);
        // $(".pretwomd").text(data.event_num);
        var myChart = echarts.init(document.getElementById('txtright'));
        var thingname=[],thingnum=[],leng=[];
        var s_series=[];
        for (var key in data.river_data){
            thingname.push(key);
            leng.push(data.river_data[key].length);
            var nums2=[];
            $.each(data.river_data[key],function (index,item) {
                nums2.push(item[1]);
            });
            s_series.push({
                name: key,
                type: 'line',
                data: nums2
            });
        };
        var xx=[];
        var xmax=Math.max.apply(null, leng);
        for (var x=0;x<xmax;x++){
            xx.push(x+1);
        };
        var option = {
            title: {
                // text: '折线图堆叠'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                // data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
                data:thingname,
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                // data: ['周一','周二','周三','周四','周五','周六','周日']
                data:xx,
            },
            yAxis: {
                type: 'value'
            },
            series: s_series
        };
        myChart.setOption(option);
    }

    var place=new place();
    var place2=new place2();
    function nums() {
        var url = '/theme/theme_river/?theme_name='+themename1;
        var url2 = '/theme/theme_river/?theme_name='+themename2;
        place.call_request(url,territory);
        place2.call_request(url2,territory2);
    }
    nums();
}
left();
