/**
 * Created by Administrator on 2016/12/19.
 */
//-----------------事件详情=-----
Array.prototype.removeByValue = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
};
function search(arr,dst){
    var i = arr.length;
    while(i-=1){
        if (arr[i] == dst){
            return i;
        }
    }
    return false;
}
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
            var weizhi,biaoqian,shuoming,weibonums,canyunums;
            var weibo=Math.round((item.weibo_counts /10000) * 100) / 100;
            var canyu=Math.round((item.uid_counts /10000) * 100) / 100;
            if (weibo.toString().length>6){
                weibonums=weibo.toFixed(2).substr(0,6)+'万';
            }else {
                weibonums=weibo.toFixed(2)+'万';
            };
            if (canyu.toString().length>6){
                canyunums=canyu.toFixed(2).substr(0,6)+'万';
            }else {
                canyunums=canyu.toFixed(2)+'万';
            };
            if (item.location=='null'||item.location==''){
                weizhi='未知';
            }else {
                weizhi=item.location;
            };
            if (item.user_tag=='null'){
                biaoqian='暂无';
            }else {
                biaoqian=item.user_tag;
            };
            if (item.description=='null'||item.description==''){
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
                '<div style="float:left;margin: 10px 0 0 34px"><div style="display: inline-block"><img src="/static/image/dingwei.png" title="位置"><!--'+
                '--><span class="difang" style="font-size: 8px">'+weizhi+'</span><!--'+
                '--><im class="xin" src="/static/image/heart2.png" alt="">' +
                '<div><div style="text-align: center"><img src="/static/image/weiboshu.png" title="微博数"><!--'+
                '--><span class="weiboshu" style="font-size: 8px">'+weibonums+'</span></div>'+
                '<div style="text-align: center"><img class="canyuren" src="/static/image/canyuren.png" title="参与人数"><span style="font-size: 8px">'+canyunums+'</span></div></div></div>'+
                '<img class="play2" style="margin-top: -50px" src="/static/image/xuyuyu.png" alt=""></div>'+
                '<div class="play3" style="width: 103px;display: inline-block;margin: 10px 0 0 40px;vertical-align:bottom;">'+
                '<a class="bus1">业务标签：</a>'+
                '<a class="bus2" title="'+biaoqian+'">'+biaoqian+'</a>'+
                '</div>'+
                '<div class="play4">'+
                '<p class="shuoming">'+
                shuoming+
                '</p>'+
                '</div>'+
                // '<div class="play5" type="button" data-toggle="modal">'+
                // '<a>加入专题</a>'+
                // '</div>'+
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
        $.each($(".play"),function (index,item) {
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
        var heart=$("#similar .play .xin");
        $.each(heart,function(index,item){
            var chan=1;
            $(item).on('click',function(){
                if (chan==1) {
                    $(this).attr('src','/static/image/focus2.png');
                    chan=2;
                }else {
                    $(this).attr('src','/static/image/heart2.png');
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

var uid_list=[],uid_list2=[];
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
            var influe,name,mingan,tag,photo,fensinum;
            var fensi=Math.round((item.fansnum /10000) * 100) / 100;
            if (fensi.toString().length>6){
                fensinum=fensi.toFixed(2).substr(0,6)+'万';
            }else {
                fensinum=fensi.toFixed(2)+'万';
            };
            if (item.influence==''||item.influence=='unknown'){
                influe=0;
            }else {
                var yingxiang=Math.round((item.influence /10000) * 100) / 100;
                if (yingxiang.toString().length>6){
                    influe=yingxiang.toFixed(2).substr(0,6)+'万';
                }else {
                    influe=yingxiang.toFixed(2)+'万';
                };
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
                '<span id="uid" style="display: none;">'+item.uid +'</span>'+
                '<div class="p_top" style="width: 100%"><img class="play2" src="'+photo+'" alt="">'+
                '<img class=\'xin\' style="margin-top: -24px" src="/static/image/heart.png">' +
                '<span class="xingming" title="'+name+'" style="color: #000;display: block;' +
                'width:100px;white-space:nowrap;margin: -13px auto 0;overflow: hidden;text-overflow: ellipsis">'+name+'</span>'+
                '</div>'+
                '<div class="play23" style="width: 110px;text-align: left;float: left">'+
                '<a class="renzh1">身&nbsp;&nbsp;&nbsp;份:<span title="'+item.domain+'" class="renzh11">'+item.domain+'</span></a>'+
                '<a class="renzh2">话&nbsp;&nbsp;&nbsp;题:<span title="'+item.topic_string.replace(/&/g,'  ')+'" class="renzh22">'+item.topic_string.replace(/&/g,'  ')+'</span></a>'+
                '</div>'+
                '<div style="float: left;width: 110px;margin-left: 10px">' +
                '<div class="play3" style="text-align: left">'+
                '<a class="bus1">业务标签：</a>'+
                '<a class="bus2" title="'+tag+'">'+tag+'</a>'+
                '</div>'+
                '<div class="play1">'+
                '<div class="p11">'+
                '<span id="uid" style="display: none">'+item.uid+'</span>'+
                '</div>'+
                '<div class="p22" style="float:left;margin-top: -5px">'+
                '<div><img src="/static/image/fensishu.png"'+
                'title=\'粉丝数\'><!--'+
                '--><span class="difang" style="font-size: 8px;display: inline-block;width: 50.06px">'+fensinum+'</span>'+
                '<img src="/static/image/mingan.png" title="敏感度">'+
                '<span class="mingan">'+mingan+'</span></div>'+
                '<div><img src="/static/image/influence.png" title="影响力">'+
                '<span class="influence" style="display: inline-block;width: 50.06px">'+influe+'</span>'+
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
                    $(this).parent('.play').find('.xingming').css({color:'red'});
                    $(this).find('a').text('取消群体探索');
                    uid_list.push($(this).parent('.play').find('.xingming').html());
                    uid_list2.push($(this).parent('.play').find('#uid').html());
                    changecolorq=2;
                    $('#join4').modal("show");
                } else {
                    $(this).parent('.play').find('.xingming').css({color:'#000'});
                    $(this).find('a').text('加入群体探索');
                    changecolorq=1;
                    var $a = $(this).parent('.play').find('.xingming').html();
                    uid_list.removeByValue($a);
                    var $a2 = $(this).parent('.play').find('#uid').html();
                    uid_list2.removeByValue($a2);
                }
            });
        });
        var heart=$("#people .play .xin");
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
                var p_uid=$(this).parents('.play').find('#uid').html();
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
        var url = '/theme/theme_river/?theme_name='+thname;
        place.call_request(url,territory);
    }
    nums();
}
zhexiantu();


var gg_group='/group/overview/';
$.ajax({
    url: gg_group,
    type: 'GET',
    dataType: 'json',
    async: true,
    success:group_list
});
function group_list(data) {
    var data=eval(data);
    $.each(data,function (index,item) {
        $("#join6 .xinzeng #list1").append('<option value="'+item[0]+'">'+item[0]+'</option>');
    });

}
var newpro;
function group_t1(value) {
    if (value=='新建群体'){
        $("#join6 .xinzeng .shuru2").show();
        newpro=$("#join6 .xinzeng .shuru2").val();
    }else {
        $("#join6 .xinzeng .shuru2").hide();
        newpro=value;
    }
};
var $a3;
$('#people .add22').on('click',function () {
    $('#join6 .xinzeng .shij .sjr').empty();
    $.each(uid_list,function (index,item) {
        $('#join6 .xinzeng .shij .sjr').append('<a class="sj1"><b>'+item+'</b><b class="icon icon-remove det" style="color: red"></b></a>');
    });
    $('#join6').modal("show");
    $.each($('.det'),function (index,item) {
        $(item).on('click',function () {
            $(this).parent().hide(100);
            $a3 = $(this).parent().find('b').text();
            uid_list.removeByValue($a3);
        });
    });
});


function group_add() {
    var node_ids2=uid_list.join(',');
    var newurl='/group/g_create_new_relation/?node1_id='+node_ids2+'&node2_id='+newpro;
    console.log(newurl)
    $.ajax({
        url: newurl,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:n_join
    });
    function n_join(data) {
        if (data=='group already exist'){
            alert('加入失败');
        }else {
            var data=eval(data);
            if (data=='2'){
                $('#chengong').modal("show");
            }else {
                $('#shibai').modal("show");
            }
        }

    }
}







