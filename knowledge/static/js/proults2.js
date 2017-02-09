/**
 * Created by Administrator on 2016/12/19.
 */
var thname=theme_explanation;
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
                return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,10)
            };
            str+='<div class="play">'+
                '<div class="play1" style="float:left;">'+
                '<div class="p11" style="text-align: left;padding-left: 30px">'+
                '<span class="xingming" title="'+item.name+'" ' +
                'style="display:block;color: #fff;font-weight: 900;font-size: 18px;width: 80px;white-space: nowrap;overflow: hidden;text-overflow:ellipsis;">' +item.name+'</span>'+
                '<div class="p22">'+
                '<span class="fasheng" style="width: 80px">发生时间：</span>'+
                '<span class="riqi">'+getLocalTime(item.start_ts)+'</span>'+
                '</div>'+
                '</div>'+
                '</div>'+
                '<div style="float:left;margin: 30px 0 0 30px"><div style="display: inline-block"><img src="/static/image/dingwei.png" title="位置"><!--'+
                '--><span class="difang" style="font-size: 8px">'+weizhi+'</span><!--'+
                '--><img class="xin" src="/static/image/heart.png" alt=""></div>'+
                '<img class="play2" src="/static/image/xuyuyu.png" alt=""></div>'+
                '<div class="play3" style="width: 103px;display: inline-block;margin: 10px 0 0 30px;vertical-align:bottom;">'+
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
        $("#run").append(str);
        //卡片效果
        var step=0;
        $('#container #similar .deftwo #case #run').width((data.length)*255);
        $('#container #similar .definite .deftwo .right').on('click',function () {
            if (data.length<=4){
                alert('没有其他卡片内容了~~');
            }else {
                step++;
                var plays=$("#container #similar .peotwo #case #run");
                walk=(-1020)*step;
                $(plays).css({
                    "-webkit-transform":"translateX("+walk+"px)",
                    "-moz-transform":"translateX("+walk+"px)",
                    "-ms-transform":"translateX("+walk+"px)",
                    "-o-transform":"translateX("+walk+"px)",
                    "transform":"translateX("+walk+"px)",
                });
                if (step >= data.length/4){
                    alert('已经是最后一页了~~');
                    $(plays).css({
                        "-webkit-transform":"translateX(0px)",
                        "-moz-transform":"translateX(0px)",
                        "-ms-transform":"translateX(0px)",
                        "-o-transform":"translateX(0px)",
                        "transform":"translateX(0px)",
                    });
                    step=0;
                }
            }
        });
        $('#container #similar .definite .deftwo .left').on('click',function () {
            if (data.length<=4){
                alert('没有其他卡片内容了~~');
            }else {
                step--;
                if (step < 0){
                    alert('已经是第一页了~~');
                    step=0;
                }else {
                    var plays=$("#container #similar .peotwo #case #run");
                    walk=(-1020)*step;
                    $(plays).css({
                        "-webkit-transform":"translateX("+walk+"px)",
                        "-moz-transform":"translateX("+walk+"px)",
                        "-ms-transform":"translateX("+walk+"px)",
                        "-o-transform":"translateX("+walk+"px)",
                        "transform":"translateX("+walk+"px)",
                    });
                }
            };

        });
        $.each($(".play"),function (index,item) {
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
        $.each($("play"),function (index,item) {
            var changecolorq=1;
            $(item).find(".play5").on('click',function(){
                if (changecolorq==1) {
                    $(this).parent('.play').find('.xingming').css({color:'red'});
                    $(this).find('a').text('取消专题');
                    changecolorq=2;
                    $('#join4').modal("show");
                } else {
                    $(this).parent('.play').find('.xingming').css({color:'#000'});
                    $(this).find('a').text('加入专题');
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
        $.each($("#similar .xingming"),function(index,item){
            $(item).on('click',function () {
                var t_uid=$(this).html();
                window.open('/index/search_result/?t_uid='+t_uid);
            });
        })
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
        function insert_flg(str,flg,sn){
            var newstr="";
            for(var i=0;i<str.length;i+=sn){
                var tmp=str.substring(i, i+sn);
                newstr+=tmp+flg;
            }
            return newstr;
        }
        $.each(data,function (index,item) {
            var fensi,influe,name,mingan,tag,photo;
            // var fensizfc=item.fansnum.toString();
            // if (fensizfc.length>=5){
            //     var fensi2=fensizfc.substr(0,fensizfc.length-3);
            //     var fensi3=insert_flg(fensi2,'.',fensi2.length-4);
            //     fensi=fensi3.substring(0,fensi3.length-1)+'万';
            // }
            if (item.influence==''||item.influence=='unknown'){
                influe=0;
            }else {
                influe=item.influence.toFixed(0);
            };
            if (item.uname==''||item.uname=='unknown'){
                name=item.uid;
            }else {
                name=item.uname;
            };
            var huoyue=item.activeness.toFixed(0);
            if (item.sensitive==''||item.sensitive=='unknown'){
                mingan=0;
            }else {
                mingan=item.sensitive.toFixed(0);
            };
            if (item.user_tag==''||item.user_tag=='unknown'||item.user_tag=='null'){
                tag='无';
            }else {
                tag=item.user_tag;
            };
            if (item.photo_url==''||item.photo_url=='unknown'){
                photo='/static/image/pangzi.png';
            }else {
                photo=item.photo_url;
            };
            str+='<div class="play">'+
                '<div class="p_top" style="width: 100%"><img class="play2" src="'+photo+'" alt="">'+
                '<img class=\'xin\' style="margin-top: -24px" src="/static/image/heart.png">' +
                '<span class="xingming" title="'+name+'" style="color: #000;display: block;' +
                'width:100px;white-space:nowrap;margin: -13px auto 0;overflow: hidden;text-overflow: ellipsis">'+name+'</span>'+
                '</div>'+
                '<div class="play23" style="width: 110px;text-align: left;float: left">'+
                '<a class="renzh1">认证类型:<span title="'+item.topic_string.replace(/&/g,'  ')+'" class="renzh11">'+item.topic_string.replace(/&/g,'  ')+'</span></a>'+
                '<a class="renzh2">领&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;域:<span title="'+item.topic_string.replace(/&/g,'  ')+'" class="renzh22">'+item.topic_string.replace(/&/g,'  ')+'</span></a>'+
                '</div>'+
                '<div style="float: left;width: 110px;margin-left: 10px">' +
                '<div class="play3" style="text-align: left">'+
                '<a class="bus1">业务标签：</a>'+
                '<a class="bus2">'+tag+'</a>'+
                '</div>'+
                '<div class="play1">'+
                '<div class="p11">'+
                '<span id="uid" style="display: none">'+item.uid+'</span>'+
                '</div>'+
                '<div class="p22" style="float:left;margin-top: -5px">'+
                '<div><img src="/static/image/fensishu.png" alt=""'+
                'title=\'粉丝数\'><!--'+
                '--><span class="difang" style="font-size: 8px">'+item.fansnum+'</span>'+
                '<img src="/static/image/mingan.png" title="敏感度">'+
                '<span class="mingan">'+mingan+'</span></div>'+
                '<div><img src="/static/image/influence.png" title="影响力">'+
                '<span class="influence">'+influe+'</span>'+
                '<img src="/static/image/huoyuedu.png" title="活跃度">'+
                '<span class="huoyuedu">'+huoyue+'</span></div>'+
                '</div>'+
                '</div>'+
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
        $("#run2").append(str);
        var step=0;
        $('#container #people .peotwo .peotwo2 #run2').width((data.length)*255);
        $('#container #people .peotwo .peotwo2 .right').on('click',function () {
            step++;
            var plays=$("#container #people .peotwo .peotwo2 #run2");
            walk=(-1020)*step;
            $(plays).css({
                "-webkit-transform":"translateX("+walk+"px)",
                "-moz-transform":"translateX("+walk+"px)",
                "-ms-transform":"translateX("+walk+"px)",
                "-o-transform":"translateX("+walk+"px)",
                "transform":"translateX("+walk+"px)",
            });
            if (step >= data.length/4){
                alert('已经是最后一页了~~');
                $(plays).css({
                    "-webkit-transform":"translateX(0px)",
                    "-moz-transform":"translateX(0px)",
                    "-ms-transform":"translateX(0px)",
                    "-o-transform":"translateX(0px)",
                    "transform":"translateX(0px)",
                });
                step=0;
            }
        });
        $('#container #people .peotwo .peotwo2 .left').on('click',function () {
            step--;
            if (step < 0){
                alert('已经是第一页了~~');
                step=0;
            }else {
                var plays=$("#container #people .peotwo .peotwo2 #run2");
                walk=(-1020)*step;
                $(plays).css({
                    "-webkit-transform":"translateX("+walk+"px)",
                    "-moz-transform":"translateX("+walk+"px)",
                    "-ms-transform":"translateX("+walk+"px)",
                    "-o-transform":"translateX("+walk+"px)",
                    "transform":"translateX("+walk+"px)",
                });
            }
        });
        //卡片效果
        $.each($("#people .play"),function (index,item) {
            $(item).hover(function () {
                $(item).find(".play5").css({
                    "-webkit-transform":"translateY(0px)",
                    "-moz-transform":"translateY(0px)",
                    "-ms-transform":"translateY(0px)",
                    "-o-transform":"translateY(0px)",
                    "transform":"translateY(0px)",
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
                    $(this).parent('.play').find('.xingming').css({color:'red'});
                    $(this).find('a').text('取消群体探索');
                    changecolorq=2;
                    $('#join4').modal("show");
                } else {
                    $(this).parent('.play').find('.xingming').css({color:'#000'});
                    $(this).find('a').text('加入群体探索');
                    changecolorq=1;
                }
            });
        });
        var heart=$(".play .xin");
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
        $.each($("#people .xingming"),function(index,item){
            $(item).on('click',function () {
                var p_uid=$(this).siblings('#uid').html();
                window.open('/index/person/?p_uid='+p_uid);
            });
        })
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
        // $(".pretwomd").text(data.event_num);
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







