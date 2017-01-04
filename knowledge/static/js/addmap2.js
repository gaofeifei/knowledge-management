/**
 * Created by Administrator on 2016/11/28.
 */

//事件关系图
function things() {
    // 路径配置
    // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById('complex22'));
    myChart.showLoading();
    $.getJSON('/construction/select_event/', function (json) {
        var json=eval(json);
        console.log(json)
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
                            color: 'purple'
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
                            width: 2.5,
                            curveness: 0.3,
                            opacity: 0.8
                        }
                    }
                },
            ]
        }, true);


    });
}
things();

//事件卡片信息
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
    console.log(data)
    var str='';
    $.each(data,function (index,item) {
        var weizhi='未知',biaoqian='暂无',shuoming;
        // if (item.location=='null'||item.location==''){
        //     weizhi='未知';
        // }else {
        //     weizhi=item[0].location;
        // };
        // if (item.user_tag=='null'||item.user_tag==''){
        //     biaoqian='暂无';
        // }else {
        //     biaoqian=item.user_tag;
        // };
        // if (item.description=='null'){
        //     biaoqian='暂无数据';
        // }else {
        //     biaoqian=item.user_tag;
        // };
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
            '<span class="riqi">'+getLocalTime(item.start_ts)+'0</span>'+
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
    });
    $('#container .relevanttwo .relevant3 .re3lf').append(str);
}

var people=new people();
function nums() {
    var url = '/construction/select_event_node/';
    people.call_request(url,monkey);
}
nums();

