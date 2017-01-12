/**
 * Created by Administrator on 2016/12/19.
 */
var thname='电信诈骗';
function zhexiantu() {
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
        $(".pretwomd").text(data.event_num);
        var myChart = echarts.init(document.getElementById('taltwo'));
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
    function nums() {
        var url = '/theme/theme_river/?theme_name'+thname;
        place.call_request(url,territory);
    }
    nums();
}
zhexiantu();

function guanlianrenwu() {
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
        $("#run2").empty();
        var data=eval(data);
        var str='';
        $.each(data,function (index,item) {
            var influe,name,huoyue,mingan,tag;
            if (item.importnace=='null'){
                influe='无';
            }else {
                influe=item.importnace.toFixed(2);
            };
            if (item.uname=='null'||item.uname=='unknown'){
                name='无';
            }else {
                name=item.uname;
            };
            var huoyue=item.activeness.toFixed(2);
            if (item.sensitive=='null'||item.sensitive=='unknown'){
                mingan='无';
            }else {
                mingan=item.sensitive.toFixed(2);
            };
            if (item.user_tag=='null'||item.sensitive=='unknown'){
                tag='无';
            }else {
                tag=item.user_tag;
            };
            str+='<div class="play">'+
                '<div class="play1">'+
                '<div class="p11">'+
                '<span class="xingming" style="color: #000;font-weight: 900;font-size: 18px;margin-left: 15px">'+name+'</span><!--'+
                '--><img style="margin-left: 15px;" src="/static/image/fensishu.png" alt=""'+
                'title=\'粉丝数\'><!--'+
                '--><span class="difang" style="font-size: 8px">'+item.fansnum+'</span><!--'+
                '--><img class=\'xin\' style="margin-left: 10px;" src="/static/image/heart.png">'+
                '</div>'+
                '<div class="p22" style="margin-top: 5px">'+
                '<img style="margin-left: 10px;" src="/static/image/influence.png" title="重要度">'+
                '<span class="influence">'+influe+'</span>'+
                '<img src="/static/image/huoyuedu.png" title="活跃度">'+
                '<span class="huoyuedu">'+huoyue+'</span>'+
                '<img src="/static/image/mingan.png" title="敏感度">'+
                '<span class="mingan">'+mingan+'</span>'+
                '</div>'+
                '</div>'+
                '<img class="play2" src="/static/image/pangzi.png" alt="">'+
                '<div class="play23" style="margin-left: 15px;">'+
                '<a href="" class="renzh1">认证类型:<span class="renzh11">'+item.topic_string+'</span></a>'+
                '<a href="" class="renzh2">领&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;域:<span class="renzh22">民生类_健康</span></a>'+
                '</div>'+
                '<div class="play3" style="display:block;margin-top: 10px;vertical-align:bottom;padding-left: 15px">'+
                '<a class="bus1">业务标签：</a>'+
                '<a class="bus2">'+tag+'</a>'+
                '</div>'+
                '<!--<div class="play4">-->'+
                '<!--<p class="shuoming">-->'+
                '<!--徐玉玉接到骗子电话后被骗9900元学费，报案回来的路上心脏骤停，离世。-->'+
                '<!--</p>-->'+
                '<!--</div>-->'+
                '<div class="play5" type="button" data-toggle="modal">'+
                '<a>加入群体探索</a>'+
                '</div>'+
                '</div>';
        });
        //卡片效果
        $.each($("#people .play"),function (index,item) {
            $(item).hover(function () {
                $(item).find(".play5").css({
                    "-webkit-transform":"translateY(-40px)",
                    "-moz-transform":"translateY(-40px)",
                    "-ms-transform":"translateY(-40px)",
                    "-o-transform":"translateY(-40px)",
                    "transform":"translateY(-40px)",
                })
            },function () {
                $(item).find(".play5").css({
                    "-webkit-transform":"translateY(40px)",
                    "-moz-transform":"translateY(40px)",
                    "-ms-transform":"translateY(40px)",
                    "-o-transform":"translateY(40px)",
                    "transform":"translateY(40px)",
                })
            });
        });
        $.each($("#people .play"),function (index,item) {
            var changecolorq=1;
            $(item).find(".play5").on('click',function(){
                if (changecolorq==1) {
                    $(this).parent('.play').css({backgroundColor:'#09F'});
                    $(this).find('a').text('取消群体探索');
                    changecolorq=2;
                    $('#join4').modal("show");
                } else {
                    $(this).parent('.play').css({backgroundColor:'#d2dcf7'});
                    $(this).find('a').text('加入群体探索');
                    changecolorq=1;
                }
            });
        });
        var heart=$(".play .play1 .p11 .xin");
        $.each(heart,function(index,item){
            var chan=1;
            $(item).on('click',function(){
                if (chan==1) {
                    $(this).attr('src','/static/image/focus.png');
                    chan=2;
                }else {
                    $(this).attr('src','/static/image/heart.png');
                    chan=1;
                }
            })
        });
        $("#run2").append(str);

    };
    var place=new place();

    function nums() {
        if($('#zhongyao').is(':checked')) { point='importnace'; };
        if($('#huoyue').is(':checked')) { point='activeness'; };
        if($('#mingan').is(':checked')) { point='sensitive'; }
        var point;
        var url = '/theme/user_in_theme/?theme_name='+thname+'&sort_flag='+point;
        place.call_request(url,territory);
    }
    $.each($("#container #people .peotwo .peotwo1 .radio input"),function (index,item) {
        $(item).on('click',function () {
            nums();
        });
    });
    nums();
}
guanlianrenwu();

function baohanshijian() {
    function include() {
        //this.ajax_method='GET'; // body...
    }
    include.prototype= {
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
        $("#run").empty();
        var data=eval(data);
        var str='';
        $.each(data,function (index,item) {
            var weizhi,biaoqian,shuoming;
            if (item.location=='null'){
                weizhi='未知';
            }else {
                weizhi=item.location;
            };
            if (item.user_tag=='null'){
                biaoqian='暂无';
            }else {
                biaoqian=item.user_tag;
            };
            if (item.description=='null'){
                shuoming='暂无数据';
            }else {
                shuoming=item.user_tag;
            };
            function getLocalTime(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,18)
            };
            str+='<div class="play">'+
                '<div class="play1">'+
                '<div class="p11">'+
                '<span class="xingming" style="color: #000;font-weight: 900;font-size: 18px">'+item.name+'</span><!--'+
                '--><img src="/static/image/dingwei.png" title="位置"><!--'+
                '--><span class="difang" style="font-size: 8px">'+weizhi+'</span><!--'+
                '--><img class="xin" src="/static/image/heart.png" alt="">'+
                '</div>'+
                '<div class="p22">'+
                '<span class="fasheng" style="font-weight: bold">发生时间：</span>'+
                '<span class="riqi">'+getLocalTime(item.start_ts)+'</span>'+
                '</div>'+
                '</div>'+
                '<img class="play2" src="/static/image/xuyuyu.png" alt="">'+
                '<div class="play3" style="display: inline-block;margin-top: 10px;vertical-align:bottom;">'+
                '<a class="bus1">业务标签：</a>'+
                '<a class="bus2">'+biaoqian+'</a>'+
                '</div>'+
                '<div class="play4">'+
                '<p class="shuoming">'+
                shuoming+
                '</p>'+
                '</div>'+
                '<!-- <div class="play5" type="button" data-toggle="modal">'+
                '<a>加入专题</a>'+
                '</div> -->'+
                '</div>';
        });
        //卡片效果
        $.each($("#people .play"),function (index,item) {
            $(item).hover(function () {
                $(item).find(".play5").css({
                    "-webkit-transform":"translateY(-40px)",
                    "-moz-transform":"translateY(-40px)",
                    "-ms-transform":"translateY(-40px)",
                    "-o-transform":"translateY(-40px)",
                    "transform":"translateY(-40px)",
                })
            },function () {
                $(item).find(".play5").css({
                    "-webkit-transform":"translateY(40px)",
                    "-moz-transform":"translateY(40px)",
                    "-ms-transform":"translateY(40px)",
                    "-o-transform":"translateY(40px)",
                    "transform":"translateY(40px)",
                })
            });
        });
        $.each($("#people .play"),function (index,item) {
            var changecolorq=1;
            $(item).find(".play5").on('click',function(){
                if (changecolorq==1) {
                    $(this).parent('.play').css({backgroundColor:'#09F'});
                    $(this).find('a').text('取消群体探索');
                    changecolorq=2;
                    $('#join4').modal("show");
                } else {
                    $(this).parent('.play').css({backgroundColor:'#d2dcf7'});
                    $(this).find('a').text('加入群体探索');
                    changecolorq=1;
                }
            });
        });
        var heart=$(".play .play1 .p11 .xin");
        $.each(heart,function(index,item){
            var chan=1;
            $(item).on('click',function(){
                if (chan==1) {
                    $(this).attr('src','/static/image/focus.png');
                    chan=2;
                }else {
                    $(this).attr('src','/static/image/heart.png');
                    chan=1;
                }
            })
        });
        $("#run").append(str);
    }

    var include=new include();
    function nums() {
        var point;
        if($('#fasheng').is(':checked')) { point='start_ts'; };
        if($('#canyu').is(':checked')) { point='uid_counts'; };
        if($('#redu').is(':checked')) { point='weibo_counts'; };
        var url = '/theme/theme_detail/?theme_name='+thname+'&sort_flag='+point;
        include.call_request(url,territory);
    }
    $.each($("#container #similar .definite .defone .radio input"),function (index,item) {
        $(item).on('click',function () {
            nums();
        });
    });
    nums();
};
baohanshijian();







