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
    $.each(data,function (index,item) {
        var str='';
        str+='<div class="play">'+
            '<div class="play1">'+
            '<div class="p11">'+
            '<span class="xingming" style="color: #000;font-weight: 900;font-size: 18px;margin-left: 15px">潘强</span><!--'+
            '--><img style="margin-left: 15px;" src="/static/image/fensishu.png" alt=""><!--'+
            '--><span class="difang" style="font-size: 8px">6720</span><!--'+
            '--><img class="xin" style="margin-left: 10px;" src="/static/image/heart.png">'+
            '</div>'+
            '<div class="p22">'+
            '<img style="margin-left: 10px;" src="/static/image/influence.png" alt="">'+
            '<span class="influence">3083</span>'+
            '<img src="/static/image/huoyuedu.png" alt="">'+
            '<span class="huoyuedu">254</span>'+
            '<img src="/static/image/mingan.png" alt="">'+
            '<span class="mingan">80</span>'+
            '</div>'+
            '</div>'+
            '<img class="play2" src="/static/image/pangzi.png" alt="">'+
            '<div class="play23" style="margin-left: 15px;">'+
            '<a href="###" class="renzh1">认证类型:<span class="renzh11">法律机构及人士</span></a>'+
            '<a href="###" class="renzh2">领&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;域:<span class="renzh22">民生类_健康</span></a>'+
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
}

var people=new people();
function nums() {
    var url = '/construction/select_node';
    people.call_request(url,monkey);
}
nums();

