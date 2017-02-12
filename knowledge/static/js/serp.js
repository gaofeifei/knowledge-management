/**
 * Created by Administrator on 2016/11/30.
 */
var search_url='/index/search_basic_graph/?item='+search_uid;
$.ajax({
    url: search_url,
    type: 'GET',
    dataType: 'json',
    async: true,
    success:sch_result
});
function sch_result(data) {
    if (data=='node does not exist'){
        alert('无数据~~');
    }else {
        var json=eval(data);
        console.log(json);
        var myChart = echarts.init(document.getElementById('statis1'));
        myChart.showLoading();
        var node_value=[],link_value=[];
        for (var key in json.event.node.event_id){
            var num1=Math.random()*(-1000-700)+1000;
            var num2=Math.random()*(-1000-700)+1000;
            var name;
            if (json.event.node.event_id[key]==''||json.event.node.event_id[key]=="unknown") {
                name=key;
            }else {
                name=json.event.node.event_id[key];
            };
            node_value.push(
                {
                    x: num1,
                    y: num2,
                    id: key,
                    name:name,
                    symbolSize: 14,
                    itemStyle: {
                        normal: {
                            color: '#00cc66'
                        }
                    }
                }
            );
        };
        for (var key2 in json.event.node.event_nodes){
            var num3=Math.random()*(-1000-700)+1000;
            var num4=Math.random()*(-1000-700)+1000;
            var name2;
            if (json.event.event_nodes[key2]==''||json.event.event_nodes[key2]=="unknown") {
                name2=key2;
            }else {
                name2=json.event.event_nodes[key2];
            }
            node_value.push(
                {
                    x: num3,
                    y: num4,
                    id: key2,
                    name:name2,
                    symbolSize: 14,
                    itemStyle: {
                        normal: {
                            color: '#a73cff'
                        }
                    }
                }
            );
        };

        for (var key3 in json.user.user_nodes){
            var num1=Math.random()*(-1000-700)+1000;
            var num2=Math.random()*(-1000-700)+1000;
            var name;
            if (json.user.user_nodes[key3]==''||json.user.user_nodes[key3]=="unknown") {
                name=key3;
            }else {
                name=json.user.user_nodes[key3];
            };
            node_value.push(
                {
                    x: num1,
                    y: num2,
                    id: key,
                    name:name,
                    symbolSize: 14,
                    itemStyle: {
                        normal: {
                            color: '#00cc66'
                        }
                    }
                }
            );
        };
        for (var key4 in json.user.event_nodes){
            var num3=Math.random()*(-1000-700)+1000;
            var num4=Math.random()*(-1000-700)+1000;
            var name2;
            if (json.user.event_nodes[key4]==''||json.user.event_nodes[key4]=="unknown") {
                name2=key4;
            }else {
                name2=json.user.event_nodes[key4];
            }
            node_value.push(
                {
                    x: num3,
                    y: num4,
                    id: key2,
                    name:name2,
                    symbolSize: 14,
                    itemStyle: {
                        normal: {
                            color: '#a73cff'
                        }
                    }
                }
            );
        };
        $.each(json.event.result_relation,function (index,item) {
            link_value.push(
                {
                    source: item[0],
                    target: ""+item[2]+""
                }
            );
        });
        myChart.hideLoading();
        myChart.setOption(option = {
            title: {
                // text: 'NPM Dependencies'
            },
            legend: {
                // data: ["人物","事件"]
                // data:categories.map(function (a) {
                //     return a;
                // })
            },
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series : [
                {
                    // name:'人物',
                    type: 'graph',
                    layout: 'none',
                    // progressiveThreshold: 700,
                    data: node_value,
                    edges: link_value,
                    itemStyle:{
                        normal:{
                            color:'#00cc66'
                        }
                    },
                    label: {
                        emphasis: {
                            position: 'right',
                            show: true
                        }
                    },
                    focusNodeAdjacency: true,
                    lineStyle: {
                        normal: {
                            width: 1.5,
                            curveness: 0.3,
                            opacity: 0.8
                        }
                    }
                },
            ]
        }, true);
    }
};



var point='1';
function card() {
    var card_url='/index/search_basic_card/?item='+search_uid+'&layer='+point;
    $.ajax({
        url: card_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:card_result
    });
}
card();

function card_result(data) {
    $("#container .con_right .re3lf").empty();
    $('#container .con_right .left').unbind("click");
    $('#container .con_right .right').unbind("click");
    var data=eval(data);
    var str='';
    $.each(data.event,function (index,item) {
        var weizhi,biaoqian,shuoming,weibonums,canyunums;
        var weibo=Math.round((item.weibo_counts /10000) * 100) / 100;
        var canyu=Math.round((item.uid_counts /10000) * 100) / 100;
        if (weibo.toString().length>6){
            weibonums=weibo.toFixed().substr(0,6)+'万';
        }else {
            weibonums=weibo.toFixed(2)+'万';
        };
        if (canyu.toString().length>6){
            canyunums=canyu.toFixed().substr(0,6)+'万';
        }else {
            canyunums=canyu.toFixed(2)+'万';
        };
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
            '<div style="float:left;margin: 10px 0 0 34px"><div style="display: inline-block"><img src="/static/image/dingwei.png" title="位置"><!--'+
            '--><span class="difang" style="font-size: 8px">'+weizhi+'</span><!--'+
            '--><img class="xin" src="/static/image/heart2.png" alt="">' +
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
            '<div class="play5" type="button" data-toggle="modal">'+
            '<a>加入专题</a>'+
            '</div>'+
            '</div>';
    });
    // $.each(data.user,function (index,item) {
    //     var influe,name,mingan,tag,photo;
    //     if (item.influence==''||item.influence=='unknown'){
    //         influe=0;
    //     }else {
    //         influe=item.influence.toFixed(0);
    //     };
    //     if (item.uname==''||item.uname=='unknown'){
    //         name=item.uid;
    //     }else {
    //         name=item.uname;
    //     };
    //     var huoyue=item.activeness.toFixed(0);
    //     if (item.sensitive==''||item.sensitive=='unknown'){
    //         mingan=0;
    //     }else {
    //         mingan=item.sensitive.toFixed(0);
    //     };
    //     if (item.user_tag==''||item.user_tag=='unknown'||item.user_tag=='null'){
    //         tag='无';
    //     }else {
    //         tag=item.user_tag;
    //     };
    //     if (item.photo_url==''||item.photo_url=='unknown'){
    //         photo='/static/image/pangzi.png';
    //     }else {
    //         photo=item.photo_url;
    //     };
    //     str+='<div class="play">'+
    //         '<div class="p_top" style="width: 100%"><img class="play2" src="'+photo+'" alt="">'+
    //         '<img class=\'xin\' style="margin-top: -24px" src="/static/image/heart.png">' +
    //         '<span class="xingming" title="'+name+'" style="color: #000;display: block;' +
    //         'width:100px;white-space:nowrap;margin: -13px auto 0;overflow: hidden;text-overflow: ellipsis">'+name+'</span>'+
    //         '</div>'+
    //         '<div class="play23" style="width: 110px;text-align: left;float: left">'+
    //         '<a class="renzh1">认证类型:<span title="'+item.topic_string.replace(/&/g,'  ')+'" class="renzh11">'+item.topic_string.replace(/&/g,'  ')+'</span></a>'+
    //         '<a class="renzh2">领&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;域:<span title="'+item.topic_string.replace(/&/g,'  ')+'" class="renzh22">'+item.topic_string.replace(/&/g,'  ')+'</span></a>'+
    //         '</div>'+
    //         '<div style="float: left;width: 110px;margin-left: 10px">' +
    //         '<div class="play3" style="text-align: left">'+
    //         '<a class="bus1">业务标签：</a>'+
    //         '<a class="bus2" title="'+tag+'">'+tag+'</a>'+
    //         '</div>'+
    //         '<div class="play1">'+
    //         '<div class="p11">'+
    //         '<span id="uid" style="display: none">'+item.uid+'</span>'+
    //         '</div>'+
    //         '<div class="p22" style="float:left;margin-top: -5px">'+
    //         '<div><img src="/static/image/fensishu.png"'+
    //         'title=\'粉丝数\'><!--'+
    //         '--><span class="difang" style="font-size: 8px">'+item.fansnum+'</span>'+
    //         '<img src="/static/image/mingan.png" title="敏感度">'+
    //         '<span class="mingan">'+mingan+'</span></div>'+
    //         '<div><img src="/static/image/influence.png" title="影响力">'+
    //         '<span class="influence">'+influe+'</span>'+
    //         '<img src="/static/image/huoyuedu.png" title="活跃度">'+
    //         '<span class="huoyuedu">'+huoyue+'</span></div>'+
    //         '</div>'+
    //         '</div>'+
    //         '</div>'+
    //         '<!--<div class="play4">-->'+
    //         '<!--<p class="shuoming">-->'+
    //         '<!--徐玉玉接到骗子电话后被骗9900元学费，报案回来的路上心脏骤停，离世。-->'+
    //         '<!--</p>-->'+
    //         '<!--</div>-->'+
    //         '<div class="play5" type="button" data-toggle="modal">'+
    //         '<a>加入群体探索</a>'+
    //         '</div>'+
    //         '</div>';
    // });
    $("#container .con_right .re3lf").append(str);
    //卡片效果
    var step=0;
    var shang=Math.floor(data.event.length/3);
    var yu=data.event.length%3;
    $('#container .con_right .re3lf').width((1*shang+yu)*245);
    $('#container .con_right .right').on('click',function () {
        if (data.event.length<=6){
            alert('没有其他卡片内容了~~');
        }else {
            step++;
            var plays=$("#container .con_right .re3lf");
            walk=(-490)*step;
            $(plays).css({
                "-webkit-transform":"translateX("+walk+"px)",
                "-moz-transform":"translateX("+walk+"px)",
                "-ms-transform":"translateX("+walk+"px)",
                "-o-transform":"translateX("+walk+"px)",
                "transform":"translateX("+walk+"px)",
            });
            if (step >= data.event.length/6){
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
    $('#container .con_right .left').on('click',function () {
        if (data.event.length<=6){
            alert('没有其他卡片内容了~~');
        }else {
            step--;
            if (step < 0){
                alert('已经是第一页了~~');
                step=0;
            }else {
                var plays=$("#container .con_right .re3lf");
                walk=(-490)*step;
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
                $('#join2').modal("show");
            } else {
                $(this).parent('.play').find('.xingming').css({color:'#fff'});
                $(this).find('a').text('加入专题');
                changecolorq=1;
            }
        });
    });
    var heart=$(".play .xin");
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
    $.each($(".con_right .xingming"),function(index,item){
        $(item).on('click',function () {
            var t_uid=$(this).html();
            window.open('/index/search_result/?t_uid='+t_uid);
        });
    })
};
$.each($("#container .con_right .zou input"),function (index,item) {
    $(item).on('click',function () {
        if (index==0){
            point=1;
            card();
        }else if (index==1){
            point=2;
            card();
        }else {
            point='all';
            card();
        }
    });
});
