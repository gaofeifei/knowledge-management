/**
 * Created by Administrator on 2016/11/28.
 */
//人物关系图
function maps() {
    // 路径配置
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById('complex1'));
    myChart.showLoading();
    $.getJSON('/construction/select_relation', function (json) {
        var json=eval(json);
        var node_value=[], link_value=[];
        for (var i=0;i<json.node.length;i++){
            var num1=Math.random()*(-1000-700)+1000;
            var num2=Math.random()*(-1000-700)+1000;
            node_value.push(
                {
                    x: num1,
                    y: num2,
                    id: json.node[i],
                    // name:json.user_nodes[key],
                    name:json.node[i],
                    symbolSize: 14,
                    itemStyle: {
                        normal: {
                            color: '#00cc66'
                        }
                    }
                }
            )
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
            ]
        }, true);
        myChart.on('click', function (param) {
            if (typeof param.seriesIndex != 'undefined') {
                window.open('/index/person/?p_uid='+param.data.id);
            }
        });
    });
}
maps();

//人物卡片信息

function people() {
    //this.ajax_method='GET'; // body...
}
people.prototype= {
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
function monkey(data) {
    var data=eval(data);
    var str='';
    $.each(data,function (index,item) {
        var influe,name,mingan,tag,photo;
        if (item[0].influence==''||item[0].influence=='unknown'){
            influe=0;
        }else {
            influe=item[0].influence.toFixed(0);
        };
        if (item[0].uname==''||item[0].uname=='unknown'){
            name=item[0].uid;
        }else {
            name=item[0].uname;
        };
        var huoyue=item[0].activeness.toFixed(0);
        if (item[0].sensitive==''||item[0].sensitive=='unknown'){
            mingan=0;
        }else {
            mingan=item[0].sensitive.toFixed(0);
        };
        if (item[0].user_tag=='undefined'||item[0].user_tag=='unknown'||item[0].user_tag=='null'){
            tag='无';
        }else {
            tag=item[0].user_tag;
        };
        if (item[0].photo_url==''||item[0].photo_url=='unknown'){
            photo='/static/image/pangzi.png';
        }else {
            photo=item[0].photo_url;
        };
        str+='<div class="play">'+
            '<div class="p_top" style="width: 100%"><img class="play2" src="'+photo+'" alt="">'+
            '<img class=\'xin\' style="margin-top: -24px;margin-left: 100px;" src="/static/image/heart.png">' +
            '<span class="xingming" title="'+name+'" style="color: #000;display: block;' +
            'width:100px;white-space:nowrap;margin: -13px auto 0;overflow: hidden;text-overflow: ellipsis">'+name+'</span>'+
            '</div>'+
            '<div class="play23" style="width: 110px;text-align: left;float: left">'+
            '<a class="renzh1">认证类型:<span title="'+item[0].topic_string.replace(/&/g,'  ')+'" class="renzh11">'+item[0].topic_string.replace(/&/g,'  ')+'</span></a>'+
            '<a class="renzh2">领&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;域:<span title="'+item[0].topic_string.replace(/&/g,'  ')+'" class="renzh22">'+item[0].topic_string.replace(/&/g,'  ')+'</span></a>'+
            '</div>'+
            '<div style="float: left;width: 110px;margin-left: 10px">' +
            '<div class="play3" style="text-align: left">'+
            '<a class="bus1">业务标签：</a>'+
            '<a class="bus2" title="'+tag+'">'+tag+'</a>'+
            '</div>'+
            '<div class="play1">'+
            '<div class="p11">'+
            '<span id="uid" style="display: none">'+item[0].uid+'</span>'+
            '</div>'+
            '<div class="p22" style="float:left;margin-top: -5px">'+
            '<div><img src="/static/image/fensishu.png"'+
            'title=\'粉丝数\'><!--'+
            '--><span class="difang" style="font-size: 8px">'+item[0].fansnum+'</span>'+
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
    $("#container .relevant .relevant3 .re3lf").append(str);

    //效果实现
    var step=0;
    var shang=Math.floor(data.length/3);
    var yu=data.length%3;
    $('#container .relevant .relevant3 .re3lf').width((1*shang+yu)*245);
    $('#container .conright .relevant .right').on('click',function () {
        if (data.length<=6){
            alert('没有其他卡片内容了~~');
        }else {
            step++;
            var plays=$("#container .relevant .relevant3 .re3lf");
            walk=(-490)*step;
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
    $('#container .conright .relevant .left').on('click',function () {
        if (data.length<=6){
            alert('没有其他卡片内容了~~');
        }else {
            step--;
            if (step < 0){
                alert('已经是第一页了~~');
                step=0;
            }else {
                var plays=$("#container .relevant .relevant3 .re3lf");
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
    var heart=$("#container .relevant .xin");
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

    var play=$("#container .relevant .play");
    $.each(play,function (index,item) {
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
    $.each(play,function (index,item) {
        var changecolor=1;
        $(item).find(".play5").on('click',function(){
            if (changecolor==1) {
                $(this).parent('.play').find('.xingming').css({color:'red'});
                changecolor=2;
                $('#join4').modal("show");
                $(this).find("a").text('取消加入群体');
            } else {
                $(this).parent('.play').find('.xingming').css({color:'#000'});
                changecolor=1;
                $(this).find("a").text('加入群体探索');
            }
        });
    });
    $.each( $(".relevant .xingming"),function(index,item){
        $(item).on('click',function () {
            var p_uid=$(this).siblings('#uid').html();
            window.open('/index/person/?p_uid='+p_uid);
        });
    })
}

var people=new people();
function nums() {
    var url = '/construction/select_node';
    people.call_request(url,monkey);
}
nums();

