/**
 * Created by Administrator on 2016/11/30.
 */
// function events() {
//     // 路径配置
//     // 基于准备好的dom，初始化echarts图表
//     var myChart = echarts.init(document.getElementById('eventimg'));
//     myChart.showLoading();
//     $.getJSON('/group/group_node_filter/', function (json) {
//         var json=eval(json);
//         // var categories = [{name:'人物'},{name:'事件'}];
//
//         var node_value=[],link_value=[],event_value=[];
//         for (var key in json.user_nodes){
//             var num1=Math.random()*(-1000-700)+1000;
//             var num2=Math.random()*(-1000-700)+1000;
//             node_value.push(
//                 {
//                     x: num1,
//                     y: num2,
//                     id: key,
//                     name:json.user_nodes[key],
//                     symbolSize: 14,
//                     itemStyle: {
//                         normal: {
//                             color: '#00cc66'
//                         }
//                     }
//                 }
//             );
//         };
//         for (var key in json.event_nodes){
//             var num3=Math.random()*(-1000-700)+1000;
//             var num4=Math.random()*(-1000-700)+1000;
//             event_value.push(
//                 {
//                     x: num3,
//                     y: num4,
//                     id: key,
//                     name:json.event_nodes[key],
//                     symbolSize: 14,
//                     itemStyle: {
//                         normal: {
//                             color: '#a73cff'
//                         }
//                     }
//                 }
//             );
//         };
//         $.each(json.relation,function (index,item) {
//             link_value.push(
//                 {
//                     source: item[0],
//                     target: item[2]
//                 }
//             );
//         })
//         myChart.hideLoading();
//         myChart.setOption(option = {
//             title: {
//                 // text: 'NPM Dependencies'
//             },
//             legend: {
//                 data: ["人物","事件"]
//                 // data:categories.map(function (a) {
//                 //     return a;
//                 // })
//             },
//             animationDurationUpdate: 1500,
//             animationEasingUpdate: 'quinticInOut',
//             series : [
//                 {
//                     name:'人物',
//                     type: 'graph',
//                     layout: 'none',
//                     // progressiveThreshold: 700,
//                     data:node_value,
//                     edges: link_value,
//                     itemStyle:{
//                         normal:{
//                             color:'#00cc66'
//                         }
//                     },
//                     label: {
//                         emphasis: {
//                             position: 'right',
//                             show: true
//                         }
//                     },
//                     roam: true,
//                     focusNodeAdjacency: true,
//                     lineStyle: {
//                         normal: {
//                             width: 1.5,
//                             curveness: 0.3,
//                             opacity: 0.8
//                         }
//                     }
//                 },
//                 {
//                     name:'事件',
//                     type: 'graph',
//                     layout: 'none',
//                     // progressiveThreshold: 700,
//                     // data:node_value,
//                     // edges: link_value,
//                     itemStyle:{
//                         normal:{
//                             color:'#a73cff'
//                         }
//                     },
//                     label: {
//                         emphasis: {
//                             position: 'right',
//                             show: true
//                         }
//                     },
//                     roam: true,
//                     focusNodeAdjacency: true,
//                     lineStyle: {
//                         normal: {
//                             width: 1.5,
//                             curveness: 0.3,
//                             opacity: 0.8
//                         }
//                     }
//                 },
//             ]
//         }, true);
//
//
//     });
// }
// events();


//地图配置，地址请求
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
// function territory(data) {
//     var data=eval(data);
//     var plate=[],local={};
//     $.each(data, function (index, item) {
//         plate.push(
//             {name: item[0],value: item[1]}
//         );
//         var myGeo = new BMap.Geocoder();
//         // 将地址解析结果显示在地图上,并调整地图视野
//         myGeo.getPoint(item[0], function(home){
//             if (home) {
//                 // local.push({item[0]:[point.lng,point.lat]})
//                 local[item[0]]=[home.lng,home.lat];
//             }
//         }, item[0]);
//     });
//     var geoCoordMap = local;
//
//     var convertData = function (pl) {
//         var res = [];
//         for (var i = 0; i < pl.length; i++) {
//             var geoCoord = geoCoordMap[pl[i].name];
//             if (geoCoord) {
//                 res.push({
//                     name: pl[i].name,
//                     value: geoCoord.concat(pl[i].value)
//                 });
//             }
//         }
//         return res;
//     };
//     var myChart = echarts.init(document.getElementById('placeimg'));
//     option = {
//         backgroundColor: '#404a59',
//         title: {
//             // text: '全国主要城市空气质量',
//             // subtext: 'data from PM25.in',
//             // sublink: 'http://www.pm25.in',
//             // x:'center',
//             // textStyle: {
//             //     color: '#fff'
//             // }
//         },
//         tooltip: {
//             trigger: 'item',
//         },
//         legend: {
//             orient: 'vertical',
//             y: 'bottom',
//             x:'right',
//             data:['pm2.5'],
//             textStyle: {
//                 color: '#fff'
//             }
//         },
//         visualMap: {
//             min: 0,
//             max: 200,
//             calculable: true,
//             inRange: {
//                 color: ['#50a3ba', '#eac736', '#d94e5d']
//             },
//             textStyle: {
//                 color: '#fff'
//             }
//         },
//         geo: {
//             map: 'china',
//             label: {
//                 emphasis: {
//                     show: false
//                 }
//             },
//             roam: true,
//             itemStyle: {
//                 normal: {
//                     areaColor: '#323c48',
//                     borderColor: '#111'
//                 },
//                 emphasis: {
//                     areaColor: '#2a333d'
//                 }
//             }
//         },
//         series: [
//             {
//                 name: 'pm2.5',
//                 type: 'scatter',
//                 coordinateSystem: 'geo',
//                 data: convertData(plate),
//                 symbolSize: 12,
//                 label: {
//                     normal: {
//                         show: false
//                     },
//                     emphasis: {
//                         show: false
//                     }
//                 },
//                 itemStyle: {
//                     emphasis: {
//                         borderColor: '#fff',
//                         borderWidth: 1
//                     }
//                 }
//             }
//         ]
//     };
//     // 为echarts对象加载数据
//     myChart.setOption(option);
// }
function territory(data) {
    var data=eval(data);
    var plate=[];
    $.each(data, function (index, item) {
        plate.push(
            {name: item[0],value: item[1]}
        );
        // var myGeo = new BMap.Geocoder();
        // // 将地址解析结果显示在地图上,并调整地图视野
        // myGeo.getPoint(item[0], function(point){
        //     if (point) {
        //         local[item[0]]=[point.lng,point.lat];
        //     }
        // }, item[0]);
    });
    // console.log(local);
    var myChart = echarts.init(document.getElementById('placeimg'));
    var option = {
        tooltip : {
            trigger: 'item'
        },
        dataRange: {
            min : 0,
            max : 500,
            calculable : true,
            color: ['maroon','purple','red','orange','yellow','lightgreen']
        },
        calculable : true,
        series : [
            {
                name: '事件及人物',
                type: 'map',
                mapType: 'china',
                hoverable: false,
                //roam: true,
                data: [],
                markPoint: {
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
                    data: plate,
                },
                geoCoord: local,
            }
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