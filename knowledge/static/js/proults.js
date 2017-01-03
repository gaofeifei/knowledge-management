/**
 * Created by Administrator on 2016/11/30.
 */

//事件人物点配置
function peo() {
    //this.ajax_method='GET'; // body...
}
peo.prototype= {
    call_request:function(url,callback) {
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            async: true,
            success:events
        });
    },
};
var peo=new peo();
var url='/group/group_node_filter/';
var friend='friend',relative='relative', colleague='colleague',leader_member='leader_member',
    user_tag='user_tag',node_type;
$("#friend").change(function () {
    if($("#friend").prop("checked")) {
        //选中时的操作
        friend='friend';
    } else {
        friend='';
    }
});
$("#relative").change(function () {
    if($("#relative").prop("checked")) {
        //选中时的操作
        relative='relative';
    } else {
        relative='';
    }
});
$("#colleague").change(function () {
    if($("#colleague").prop("checked")) {
        //选中时的操作
        colleague='colleague';
    } else {
        colleague='';
    }
});
$("#leader_member").change(function () {
    if($("#leader_member").prop("checked")) {
        //选中时的操作
        leader_member='leader_member';
    } else {
        leader_member='';
    }
});
$("#user_tag").change(function () {
    if($("#user_tag").prop("checked")) {
        //选中时的操作
        user_tag='user_tag';
    } else {
        user_tag='';
    }
});

var layer;
function nums() {
    if ($("#event").is(":checked")){node_type='Event';}
    if ($("#user").is(":checked")){node_type='User';}
    if ($("#event").is(":checked")&&$("#user").is(":checked")){node_type='';}
    if($('#onecg').is(':checked')) { layer=1; }
    if($('#twocg').is(':checked')) { layer=2; }
    url = '/group/group_node_filter/?node_type='+node_type+'&relation_type='+friend+','+relative+
        ','+colleague+','+leader_member+','+user_tag+'&layer='+layer;
    peo.call_request(url,events);
};

$(".cdt5").on("click",function () {
    nums();
});
function events() {
    // 路径配置
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById('eventimg'));
    myChart.showLoading();
    $.getJSON(url, function (json) {
        var json=eval(json);
        // var categories = [{name:'人物'},{name:'事件'}];
        var node_value=[],link_value=[];
            // ,event_value=[];
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
                    target: item[2]
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
                    data:node_value,
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
                // {
                //     name:'事件',
                //     type: 'graph',
                //     layout: 'none',
                //     // progressiveThreshold: 700,
                //     // data:node_value,
                //     // edges: link_value,
                //     itemStyle:{
                //         normal:{
                //             color:'#a73cff'
                //         }
                //     },
                //     label: {
                //         emphasis: {
                //             position: 'right',
                //             show: true
                //         }
                //     },
                //     focusNodeAdjacency: true,
                //     lineStyle: {
                //         normal: {
                //             width: 1.5,
                //             curveness: 0.3,
                //             opacity: 0.8
                //         }
                //     }
                // },
            ]
        }, true);


    });
}
// events();


//地图配置，地址请求
function ditu() {
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
        var plate=[],local={};
        $.each(data, function (index, item) {
            plate.push(
                {name: item[0],value: item[1]}
            );
            var myGeo = new BMap.Geocoder();
            // 将地址解析结果显示在地图上,并调整地图视野
            myGeo.getPoint(item[0], function(home){
                if (home) {
                    // local.push({item[0]:[point.lng,point.lat]})
                    local[item[0]]=[home.lng,home.lat];
                }
            }, item[0]);
            return false;
        });
        console.log(plate);
        console.log(local);
        var myChart = echarts.init(document.getElementById('placeimg'));
        option = {
            title : {
                text: '全国主要城市空气质量（pm2.5）',
                x:'center'
            },
            tooltip : {
                trigger: 'item'
            },
            // legend: {
            //     orient: 'vertical',
            //     x:'left',
            //     data:['pm2.5']
            // },
            dataRange: {
                min : 0,
                max : 500,
                calculable : true,
                color: ['maroon','purple','red','orange','yellow','lightgreen']
            },
            series : [
                {
                    name: 'pm2.5',
                    type: 'map',
                    mapType: 'china',
                    hoverable: false,
                    roam:true,
                    data : [],
                    markPoint : {
                        symbolSize: 5,       // 标注大小，半宽（半径）参数，当图形为方向或菱形则总宽度为symbolSize * 2
                        itemStyle: {
                            normal: {
                                borderColor: '#87cefa',
                                borderWidth: 1,            // 标注边线线宽，单位px，默认为1
                                label: {
                                    show: false
                                }
                            },
                            emphasis: {
                                borderColor: '#1e90ff',
                                borderWidth: 5,
                                label: {
                                    show: false
                                }
                            }
                        },
                        data : plate,
                    },
                    geoCoord: {
                        "北京":[116.3956451,39.929986],
                    },
                },
            ]
        };
        // 为echarts对象加载数据
        myChart.setOption(option);
    }

    var place=new place();
    function nums() {
        var url = '/group/group_map_filter/';
        place.call_request(url,territory);
    }
    nums();
};
// ditu();


function guanlianrenwu() {
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
            var influe,name,huoyue,mingan,tag;
            if (item.importnace=='null'){
                influe='暂无';
            }else {
                influe=item.importnace.toFixed(2);
            };
            if (item.uname=='null'||item.uname=='unknown'||item.uname==''){
                name='暂无';
            }else {
                name=item.uname;
            };
            var huoyue=item.activeness.toFixed(2);
            if (item.sensitive=='null'||item.sensitive=='unknown'){
                mingan='暂无';
            }else {
                mingan=item.sensitive.toFixed(2);
            };
            if (item.user_tag=='null'||item.sensitive=='unknown'){
                tag='暂无';
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
        $("#run").append(str);
        //卡片效果
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
    }

    var include=new include();
    function nums() {
        if($('#zhongyao').is(':checked')) { point='importnace'; };
        if($('#huoyue').is(':checked')) { point='activeness'; };
        if($('#mingan').is(':checked')) { point='sensitive'; };
        var point;
        var thname='法律人士';
        var url = '/group/user_in_group/?group_name='+thname+'&sort_flag='+point;
        include.call_request(url,territory);
    }
    $.each($("#container #similar .definite .defone .radio input"),function (index,item) {
        $(item).on('click',function () {
            nums();
        });
    });
    nums();
};
guanlianrenwu();

function guanlianshijian() {
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
        $("#run2").empty();
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
                biaoqian='暂无数据';
            }else {
                biaoqian=item.user_tag;
            };
            function getLocalTime(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,17)
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
        $("#run2").append(str);
    }

    var include=new include();
    function nums() {
        if($('#fasheng2').is(':checked')) { point='start_ts'; };
        if($('#canyu2').is(':checked')) { point='uid_counts'; };
        if($('#redu2').is(':checked')) { point='weibo_counts'; };
        var point;
        var thname='法律人士';
        var url = '/group/group_detail/?group_name='+thname+'&sort_flag='+point;
        include.call_request(url,territory);
        console.log(url)
    }
    $.each($("#container #people .peotwo .peotwo1 .radio input"),function (index,item) {
        $(item).on('click',function () {
            nums();
        });
    });
    nums();
};
guanlianshijian();
