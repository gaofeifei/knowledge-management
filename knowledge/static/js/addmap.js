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
        // var categories = [{name:'人物'},{name:'事件'}];
        var node_value=[], link_value=[];
        // link_value=[],event_value=[],
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
            title: {
                // text: 'NPM Dependencies'
            },
            legend: {
                // data: ["人物"]
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
            ]
        }, true);


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
    // console.log(data);
    $.each(data,function (index,item) {
        // console.log(item[0].influence);
        var name,influence,active;
        if (item[0].uname==''||item[0].uname=='unknown') {
            name=item[0].uid;
        }else {
            name=item[0].uname;
        }
        influence=item[0].influence.toFixed(0);
        active=item[0].activeness.toFixed(2);
        var str='';
        str+='<div class="play">'+
            '<div class="play1">'+
            '<div class="p11">'+
            '<span class="xingming" style="color: #000;font-weight: 900;font-size: 18px;margin-left: 15px">'+name+'</span><!--'+
            '--><img style="margin-left: 15px;" src="/static/image/fensishu.png" alt=""><!--'+
            '--><span class="difang" style="font-size: 8px">'+item[0].fansnum+'</span><!--'+
            '--><img class="xin" style="margin-left: 10px;" src="/static/image/heart.png">'+
            '</div>'+
            '<div class="p22">'+
            '<img style="margin-left: 10px;" src="/static/image/influence.png" alt="">'+
            '<span class="influence">'+influence+'</span>'+
            '<img src="/static/image/huoyuedu.png" alt="">'+
            '<span class="huoyuedu">'+active+'</span>'+
            '<img src="/static/image/mingan.png" alt="">'+
            '<span class="mingan">'+item[0].sensitive+'</span>'+
            '</div>'+
            '</div>'+
            '<img class="play2" src="/static/image/pangzi.png" alt="">'+
            '<div class="play23" style="margin-left: 15px;">'+
            '<a href="###" class="renzh1">认证类型:<span class="renzh11">'+item[0].verified+'</span></a>'+
            '<a href="###" class="renzh2">领&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;域:<span class="renzh22">'+item[0].domain+'</span></a>'+
            '</div>'+
            '<div class="play3" style="display:block;margin-top: 10px;vertical-align:bottom;padding-left: 15px">'+
            '<a class="bus1">业务标签：</a>'+
            '<a class="bus2">律师</a>'+
            '<a class="bus2">法律人士</a>'+
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
        $("#container .relevant .relevant3 .re3lf").append(str);
    });


    //效果实现
    var heart=$("#container .relevant2 .play .p11 .xin");
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

    var play=$("#container .relevant3 .play");
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
                $(this).parent('.play').css({backgroundColor:'#09F'});
                changecolor=2;
                $('#join4').modal("show");
                $(this).find("a").text('取消加入群体');
            } else {
                $(this).parent('.play').css({backgroundColor:'#d2dcf7'});
                changecolor=1;
                $(this).find("a").text('加入群体探索');
            }
        });
    });
    $.each( $(".relevant .xingming"),function(index,item){
        $(item).on('click',function () {
            window.open('/index/person/');
        });
    })
    $.each( $(".relevanttwo .xingming"),function(index,item){
        $(item).on('click',function () {
            window.open('/index/search_result/');
        });
    })
}

var people=new people();
function nums() {
    var url = '/construction/select_node';
    people.call_request(url,monkey);
}
nums();

