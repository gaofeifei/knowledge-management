/**
 * Created by Administrator on 2016/11/24.
 */

Array.prototype.removeByValue = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
};
var node_ids2=[],node_ids=[];
function theme_newbuild_searchut() {
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
    function territory11(data) {
        if (data=='node does not exist'){
            alert('无数据~~');
        }else {
            $(".con_bot .add #shijian .bag").show(20);
            var json=eval(data);
            var myChart = echarts.init(document.getElementById('site2'));
            myChart.showLoading();
            var node_value=[],link_value=[];
            for (var key in json.user_nodes){
                var num1=Math.random()*(-1000-700)+1000;
                var num2=Math.random()*(-1000-700)+1000;
                var name;
                if (json.user_nodes[key]==''||json.user_nodes[key]=="unknown") {
                    name=key;
                }else {
                    name=json.user_nodes[key];
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
            for (var key2 in json.event_nodes){
                var num3=Math.random()*(-1000-700)+1000;
                var num4=Math.random()*(-1000-700)+1000;
                var name2;
                if (json.event_nodes[key2]==''||json.event_nodes[key2]=="unknown") {
                    name2=key2;
                }else {
                    name2=json.event_nodes[key2];
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
            $.each(json.relation,function (index,item) {
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

    }
    function place2() {
        //this.ajax_method='GET'; // body...
    }
    place2.prototype= {
        call_request:function(url2,callback) {
            $.ajax({
                url: url2,
                type: 'GET',
                dataType: 'json',
                async: true,
                success:callback
            });
        },
    };
    function territory22(data) {
        if (data=='node does not exist') {
            // alert('无数据~~');
            null;
        }else {
            $('#container .con_bot .add #shijian .bag .left').unbind("click");
            $('#container .con_bot .add #shijian .bag .right').unbind("click");
            var data=eval(data);
            var str='';
            function getLocalTime(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,10);
            };
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
                        '<span id="tid" style="display: none">'+item.en_name+'</span>'+
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
            $("#container .con_bot .add .sjmr #case33 #crmid33 #run33").append(str);
            //卡片效果
            var step=0;
            var shang=Math.floor(data.length/6);
            var yu=data.length%6;
            // $('#container .con_bot .add .sjmr #case33 #crmid33 #run33').width(((data.length+4)*245)/2);
            $('#container .con_bot .add .sjmr #case33 #crmid33 #run33').width((3*shang+yu)*245);
            $('#container .con_bot .add #shijian .bag .right').on('click',function () {
                if (data.length<=6){
                    alert('没有其他卡片内容了~~');
                }else {
                    step++;
                    var plays=$("#container .con_bot .add .sjmr #case33 #crmid33 #run33");
                    walk=(-735)*step;
                    $(plays).css({
                        "-webkit-transform":"translateX("+walk+"px)",
                        "-moz-transform":"translateX("+walk+"px)",
                        "-ms-transform":"translateX("+walk+"px)",
                        "-o-transform":"translateX("+walk+"px)",
                        "transform":"translateX("+walk+"px)",
                    });
                    if (step >= data.length/6){
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
            $('#container .con_bot .add #shijian .bag .left').on('click',function () {
                if (data.length<=6){
                    alert('没有其他卡片内容了~~');
                }else {
                    step--;
                    if (step < 0){
                        alert('已经是第一页了~~');
                        step=0;
                    }else {
                        var plays=$("#container .con_bot .add .sjmr #case33 #crmid33 #run33");
                        walk=(-735)*step;
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

            var heart=$(".con_bot .play .xin");
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
            $.each($(".con_bot .play"),function (index,item) {
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
            $.each($(".con_bot .play"),function (index,item) {
                var changecolor=1;
                $(item).find(".play5").on('click',function(){
                    if (changecolor==1) {
                        $(this).parent('.play').find('.xingming').css({color:'red'});
                        changecolor=2;
                        node_ids2.push($(this).siblings('#tid').html());
                        node_ids.push($(this).siblings('.play1').find('.xingming').html());
                        $(this).find('a').text('取消专题');
                        $('#join2').modal("show");
                    } else {
                        $(this).parent('.play').find('.xingming').css({color:'#fff'});
                        changecolor=1;
                        var $a = $(this).siblings('.play1').find('.xingming').html();
                        node_ids.removeByValue($a);
                        var $a2 = $(this).siblings('#tid').html();
                        node_ids2.removeByValue($a2);
                        $(this).find('a').text('加入专题');
                    }
                });
            });
            $.each($('#container .con_bot .add .sjmr #case33 #crmid33 #run33 .xingming'),function(index,item){
                $(item).on('click',function(){
                    window.open('/index/search_result/?t_uid='+$(this).html());
                })
            });
        }

    };
    var place=new place();
    var place2=new place2();
    function nums(name) {
        var url = '/theme/search_related_event/?item='+name;
        place.call_request(url,territory11);
    };
    function nums2(name,maths) {
        var url2 = '/theme/search_related_event_card/?item='+name+'&layer='+maths;
        place2.call_request(url2,territory22);
    };
    var maths='all',s;
    $("#container .con_bot .sjt .sjt2").on('click',function () {
        $('#site2').empty();
        $('#container .con_bot .add #case33 #run33').empty();
        s=$("#container .con_bot .sjt .sjt1").val();
        if (!s==''){
            nums(s);
            nums2(s,maths);
        }else {
            $('#join3').modal("show");
        };
    });
    $.each($("#container .con_bot .add #shijian .bag .direct1 input"),function (index,item) {
        $(item).on('click',function () {
            if (index==0){
                maths=1;
                nums2(s,maths);
            }else if (index==1){
                maths=2;
                nums2(s,maths);
            }else {
                maths='all';
                nums2(s,maths);
            }
        });

    });
    $('.add22').on('click',function () {
        $('#join .xinjian .shij .sjr').empty();
        $('#join').modal("show");
        $(".xinjian").css({display:"block"});
        $.each(node_ids,function (index,item) {
            $('#join .xinjian .shij .sjr').append('<a class="sj1">'+item+'<b class="icon icon-remove det" style="color: red"></b></a>');
            $.each($('.det'),function (index,item) {
                $(item).on('click',function () {
                    $(this).parent().hide(100);
                    var $a3 = $(this).parent().html();
                    node_ids2.removeByValue($a3);
                });
            });
        });
    });

};
theme_newbuild_searchut();

function theme_add2() {
    var a=[];
    for(var i=0;i<node_ids2.length;i++){
        if (a.indexOf(node_ids2[i])===-1){
            a.push(node_ids2[i]);
        }
    }
    var node_ids3=a.join(',');
    var thenewpro=$("#shuru2").val();
    var thenewurl='/theme/create_new_relation/?node1_id='+node_ids3+'&node2_id='+thenewpro;
    console.log(thenewurl)
    $.ajax({
        url: thenewurl,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:the_join
    });
    function the_join(data) {
        var data=eval(data);
        if (data==2){
            $('#chengong').modal("show");
        }else {
            $('#shibai').modal("show");
        }
    }
}