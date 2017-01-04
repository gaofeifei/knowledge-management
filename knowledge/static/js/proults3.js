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
var url='/theme/theme_node_filter/';
var contain='contain',casual='casual', colleague='colleague',happen_together='happen_together',
    event_other='event_other',node_type;
$("#contain").change(function () {
    if($("#contain").prop("checked")) {
        //选中时的操作
        contain='contain';
    } else {
        contain=' ';
    }
});
$("#casual").change(function () {
    if($("#casual").prop("checked")) {
        //选中时的操作
        casual='casual';
    } else {
        casual=' ';
    }
});
$("#happen_together").change(function () {
    if($("#happen_together").prop("checked")) {
        //选中时的操作
        happen_together='happen_together';
    } else {
        happen_together=' ';
    }
});
$("#event_other").change(function () {
    if($("#event_other").prop("checked")) {
        //选中时的操作
        event_other='event_other';
    } else {
        event_other=' ';
    }
});

var layer;
function nums() {
    if ($("#event").is(":checked")){node_type='Event';}
    if ($("#user").is(":checked")){node_type='User';}
    if ($("#event").is(":checked")&&$("#user").is(":checked")){node_type='';}
    if($('#oneone').is(':checked')) { layer=1; }
    if($('#twotwo').is(':checked')) { layer=2; }
    url = '/theme/theme_node_filter/?node_type='+node_type+'&relation_type='+contain+','+casual+
        ','+happen_together+','+event_other+'&layer='+layer;
    peo.call_request(url,events);
    // console.log(url);
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
        var node_value=[], event_link=[];
            // link_value=[],event_value=[],
        for (var key in json.user_nodes){
            var num1=Math.random()*(-1000-700)+1000;
            var num2=Math.random()*(-1000-700)+1000;
            var name;
            if (json.user_nodes[key]==''||json.user_nodes[key]=="unknow") {
                name=key;
            }else {
                name=json.user_nodes[key];
            };
            node_value.push(
                {
                    x: num1,
                    y: num2,
                    id: key,
                    // name:json.user_nodes[key],
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
            if (json.event_nodes[key2]==''||json.event_nodes[key2]=="unknow") {
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
            event_link.push(
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
                // data: ["人物"]
                // data:categories.map(function (a) {
                //     return a;
                // })
            },
            // edgeLabel: {
            //     normal: {
            //         show: false,
            //         position: 'middle',
            //         formatter:'{b} : {c}',
            //     },
            // },
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series : [
                {
                    // name:'人物',
                    type: 'graph',
                    layout: 'none',
                    // progressiveThreshold: 700,
                    data:node_value,
                    edges: event_link,
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
                //     progressiveThreshold: 700,
                //     data:event_value,
                //     edges: event_link,
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
events();


//地图配置，地址请求

function maps(data) {
    // 路径配置
    var data=eval(data);
    require.config({
        paths: {
            echarts: 'http://echarts.baidu.com/build/dist'
        }
    });
    require(
        [
            'echarts',
            'echarts/chart/map' // 使用柱状图就加载bar模块，按需加载
        ],
        function (ec) {
            // 基于准备好的dom，初始化echarts图表
            var myChart = ec.init(document.getElementById('placeimg'));

            var option;
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

                option = {
                    title : {
                        text: '全国主要城市空气质量（pm2.5）',
                        subtext: 'data from PM25.in',
                        sublink: 'http://www.pm25.in',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        x:'left',
                        data:['pm2.5']
                    },
                    dataRange: {
                        min : 0,
                        max : 500,
                        calculable : true,
                        color: ['maroon','purple','red','orange','yellow','lightgreen']
                    },
                    toolbox: {
                        show : true,
                        orient : 'vertical',
                        x: 'right',
                        y: 'center',
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
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
                                data : plate
                            },
                            geoCoord: local
                        },
                    ]
                };
            });
            // 为echarts对象加载数据
            myChart.setOption(option);
        }
    );
}
var url="/group/group_map_filter/";
$.ajax({
    type: "GET",
    dataType: "JSON",
    async: true,
    url: url,
    success:maps
});
