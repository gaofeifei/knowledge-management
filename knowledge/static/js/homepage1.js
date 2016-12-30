/**
 * Created by Administrator on 2016/11/23.
 */
function picture() {
    var myChart = echarts.init(document.getElementById('statis1'));
    myChart.showLoading();
    $.getJSON('/index/new_relationship/', function (json) {
        var json=eval(json);
        console.log(json);
        var domain=[],location=[],event=[],user=[],link=[];
        for (var key in json.Domain) {
            var num1=Math.random()*(-1000-700)+1000;
            var num2=Math.random()*(-1000-700)+1000;
            domain.push(
                {
                    x: num1,
                    y: num2,
                    id: key,
                    name:json.Domain[key],
                    symbolSize: 14,
                    itemStyle: {
                        normal: {
                            color: 'blue'
                        }
                    }
                }
            );
        };
        for (var key in json.Location) {
            var num1=Math.random()*(-1000-700)+1000;
            var num2=Math.random()*(-1000-700)+1000;
            domain.push(
                {
                    x: num1,
                    y: num2,
                    id: key,
                    name:json.Location[key],
                    symbolSize: 14,
                    itemStyle: {
                        normal: {
                            color: 'red'
                        }
                    }
                }
            );
        };
        for (var key in json.event_node) {
            var num1=Math.random()*(-1000-700)+1000;
            var num2=Math.random()*(-1000-700)+1000;
            domain.push(
                {
                    x: num1,
                    y: num2,
                    id: key,
                    name:json.event_node[key],
                    symbolSize: 14,
                    itemStyle: {
                        normal: {
                            color: 'purple'
                        }
                    }
                }
            );
        };
        for (var key in json.user_nodes) {
            var num1=Math.random()*(-1000-700)+1000;
            var num2=Math.random()*(-1000-700)+1000;
            var name;
            if (json.user_nodes[key]==''||json.user_nodes[key]=="unknown") {
                name=key;
            }else {
                name=json.user_nodes[key];
            };
            domain.push(
                {
                    x: num1,
                    y: num2,
                    id: key,
                    name:name,
                    symbolSize: 14,
                    itemStyle: {
                        normal: {
                            color: 'green'
                        }
                    }
                }
            );
        };
        for (var key in json.relations)
        $.each(json.relations,function (index,item) {
            link.push(
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
            // legend: {
            //     orient: 'top',
            //     x:'left',
            //     data:['社会','地方','事件','人物'],
            // },
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series : [
                {
                    // name:'社会',
                    type: 'graph',
                    layout: 'none',
                    // progressiveThreshold: 700,
                    data:domain,
                    edges: link,
                    label: {
                        emphasis: {
                            position: 'left',
                            show: true
                        }
                    },
                    focusNodeAdjacency: true,
                    lineStyle: {
                        normal: {
                            width: 1.5,
                            curveness: 0.3,
                            opacity: 0.7
                        }
                    }
                },
                // {
                //     name:'社会',
                //     type: 'graph',
                //     layout: 'none',
                //     // progressiveThreshold: 700,
                //     // data:domain,
                //     // edges: link,
                //     label: {
                //         emphasis: {
                //             position: 'left',
                //             show: true
                //         }
                //     },
                //     focusNodeAdjacency: true,
                //     lineStyle: {
                //         normal: {
                //             width: 1.5,
                //             curveness: 0.3,
                //             opacity: 0.7
                //         }
                //     }
                // },
                // {
                //     name:'地方',
                //     type: 'graph',
                //     layout: 'none',
                //     // progressiveThreshold: 700,
                //     // data:location,
                //     // edges: [],
                //     label: {
                //         emphasis: {
                //             position: 'left',
                //             show: true
                //         }
                //     },
                //     focusNodeAdjacency: true,
                //     lineStyle: {
                //         normal: {
                //             width: 1.5,
                //             curveness: 0.3,
                //             opacity: 0.7
                //         }
                //     }
                // },
                // {
                //     name:'事件',
                //     type: 'graph',
                //     layout: 'none',
                //     // progressiveThreshold: 700,
                //     // data:event,
                //     // edges: [],
                //     label: {
                //         emphasis: {
                //             position: 'left',
                //             show: true
                //         }
                //     },
                //     focusNodeAdjacency: true,
                //     lineStyle: {
                //         normal: {
                //             width: 1.5,
                //             curveness: 0.3,
                //             opacity: 0.7
                //         }
                //     }
                // },
                // {
                //     name:'人物',
                //     type: 'graph',
                //     layout: 'none',
                //     // progressiveThreshold: 700,
                //     // data:user,
                //     // edges: [],
                //     label: {
                //         emphasis: {
                //             position: 'left',
                //             show: true
                //         }
                //     },
                //     focusNodeAdjacency: true,
                //     lineStyle: {
                //         normal: {
                //             width: 1.5,
                //             curveness: 0.3,
                //             opacity: 0.7
                //         }
                //     }
                // }
            ]
        }, true);
    });
}
picture();

// 地图配置，地址请求
function fly() {
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
    var place=new place();
    function nums() {
        var url = '/index/new_map/';
        place.call_request(url,bird);
    }
    nums();
    function bird(data) {
        var data=eval(data);
        var plate=[];
        $.each(data, function (index, item) {
            plate.push(
                {name: item[0], value: item[1]}
            );
        });
        // console.log(plate)
        // 路径配置
        var myChart = echarts.init(document.getElementById('statis2'));
        var option = {
            title : {
                // text: '全国主要城市空气质量（pm2.5）',
                // subtext: 'data from PM25.in',
                // sublink: 'http://www.pm25.in',
                // x:'center'
            },
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
                    // name: '事件及人物',
                    type: 'map',
                    mapType: 'china',
                    hoverable: false,
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
                        "海门":[121.15,31.89],
                        "鄂尔多斯":[109.781327,39.608266],
                        "招远":[120.38,37.35],
                        "舟山":[122.207216,29.985295],
                        "齐齐哈尔":[123.97,47.33],
                        "盐城":[120.13,33.38],
                        "赤峰":[118.87,42.28],
                        "青岛":[120.33,36.07],
                        "乳山":[121.52,36.89],
                        "金昌":[102.188043,38.520089],
                        "泉州":[118.58,24.93],
                        "莱西":[120.53,36.86],
                        "日照":[119.46,35.42],
                        "胶南":[119.97,35.88],
                        "南通":[121.05,32.08],
                        "拉萨":[91.11,29.97],
                        "云浮":[112.02,22.93],
                        "梅州":[116.1,24.55],
                        "文登":[122.05,37.2],
                        "上海":[121.48,31.22],
                        "攀枝花":[101.718637,26.582347],
                        "威海":[122.1,37.5],
                        "承德":[117.93,40.97],
                        "厦门":[118.1,24.46],
                        "汕尾":[115.375279,22.786211],
                        "潮州":[116.63,23.68],
                        "丹东":[124.37,40.13],
                        "太仓":[121.1,31.45],
                        "曲靖":[103.79,25.51],
                        "烟台":[121.39,37.52],
                        "福州":[119.3,26.08],
                        "瓦房店":[121.979603,39.627114],
                        "即墨":[120.45,36.38],
                        "抚顺":[123.97,41.97],
                        "玉溪":[102.52,24.35],
                        "张家口":[114.87,40.82],
                        "阳泉":[113.57,37.85],
                        "莱州":[119.942327,37.177017],
                        "湖州":[120.1,30.86],
                        "汕头":[116.69,23.39],
                        "昆山":[120.95,31.39],
                        "宁波":[121.56,29.86],
                        "湛江":[110.359377,21.270708],
                        "揭阳":[116.35,23.55],
                        "荣成":[122.41,37.16],
                        "连云港":[119.16,34.59],
                        "葫芦岛":[120.836932,40.711052],
                        "常熟":[120.74,31.64],
                        "东莞":[113.75,23.04],
                        "河源":[114.68,23.73],
                        "淮安":[119.15,33.5],
                        "泰州":[119.9,32.49],
                        "南宁":[108.33,22.84],
                        "营口":[122.18,40.65],
                        "惠州":[114.4,23.09],
                        "江阴":[120.26,31.91],
                        "蓬莱":[120.75,37.8],
                        "韶关":[113.62,24.84],
                        "嘉峪关":[98.289152,39.77313],
                        "广州":[113.23,23.16],
                        "延安":[109.47,36.6],
                        "太原":[112.53,37.87],
                        "清远":[113.01,23.7],
                        "中山":[113.38,22.52],
                        "昆明":[102.73,25.04],
                        "寿光":[118.73,36.86],
                        "盘锦":[122.070714,41.119997],
                        "长治":[113.08,36.18],
                        "深圳":[114.07,22.62],
                        "珠海":[113.52,22.3],
                        "宿迁":[118.3,33.96],
                        "咸阳":[108.72,34.36],
                        "铜川":[109.11,35.09],
                        "平度":[119.97,36.77],
                        "佛山":[113.11,23.05],
                        "海口":[110.35,20.02],
                        "江门":[113.06,22.61],
                        "章丘":[117.53,36.72],
                        "肇庆":[112.44,23.05],
                        "大连":[121.62,38.92],
                        "临汾":[111.5,36.08],
                        "吴江":[120.63,31.16],
                        "石嘴山":[106.39,39.04],
                        "沈阳":[123.38,41.8],
                        "苏州":[120.62,31.32],
                        "茂名":[110.88,21.68],
                        "嘉兴":[120.76,30.77],
                        "长春":[125.35,43.88],
                        "胶州":[120.03336,36.264622],
                        "银川":[106.27,38.47],
                        "张家港":[120.555821,31.875428],
                        "三门峡":[111.19,34.76],
                        "锦州":[121.15,41.13],
                        "南昌":[115.89,28.68],
                        "柳州":[109.4,24.33],
                        "三亚":[109.511909,18.252847],
                        "自贡":[104.778442,29.33903],
                        "吉林":[126.57,43.87],
                        "阳江":[111.95,21.85],
                        "泸州":[105.39,28.91],
                        "西宁":[101.74,36.56],
                        "宜宾":[104.56,29.77],
                        "呼和浩特":[111.65,40.82],
                        "成都":[104.06,30.67],
                        "大同":[113.3,40.12],
                        "镇江":[119.44,32.2],
                        "桂林":[110.28,25.29],
                        "张家界":[110.479191,29.117096],
                        "宜兴":[119.82,31.36],
                        "北海":[109.12,21.49],
                        "西安":[108.95,34.27],
                        "金坛":[119.56,31.74],
                        "东营":[118.49,37.46],
                        "牡丹江":[129.58,44.6],
                        "遵义":[106.9,27.7],
                        "绍兴":[120.58,30.01],
                        "扬州":[119.42,32.39],
                        "常州":[119.95,31.79],
                        "潍坊":[119.1,36.62],
                        "重庆":[106.54,29.59],
                        "台州":[121.420757,28.656386],
                        "南京":[118.78,32.04],
                        "滨州":[118.03,37.36],
                        "贵阳":[106.71,26.57],
                        "无锡":[120.29,31.59],
                        "本溪":[123.73,41.3],
                        "克拉玛依":[84.77,45.59],
                        "渭南":[109.5,34.52],
                        "马鞍山":[118.48,31.56],
                        "宝鸡":[107.15,34.38],
                        "焦作":[113.21,35.24],
                        "句容":[119.16,31.95],
                        "北京":[116.46,39.92],
                        "徐州":[117.2,34.26],
                        "衡水":[115.72,37.72],
                        "包头":[110,40.58],
                        "绵阳":[104.73,31.48],
                        "乌鲁木齐":[87.68,43.77],
                        "枣庄":[117.57,34.86],
                        "杭州":[120.19,30.26],
                        "淄博":[118.05,36.78],
                        "鞍山":[122.85,41.12],
                        "溧阳":[119.48,31.43],
                        "库尔勒":[86.06,41.68],
                        "安阳":[114.35,36.1],
                        "开封":[114.35,34.79],
                        "济南":[117,36.65],
                        "德阳":[104.37,31.13],
                        "温州":[120.65,28.01],
                        "九江":[115.97,29.71],
                        "邯郸":[114.47,36.6],
                        "临安":[119.72,30.23],
                        "兰州":[103.73,36.03],
                        "沧州":[116.83,38.33],
                        "临沂":[118.35,35.05],
                        "南充":[106.110698,30.837793],
                        "天津":[117.2,39.13],
                        "富阳":[119.95,30.07],
                        "泰安":[117.13,36.18],
                        "诸暨":[120.23,29.71],
                        "郑州":[113.65,34.76],
                        "哈尔滨":[126.63,45.75],
                        "聊城":[115.97,36.45],
                        "芜湖":[118.38,31.33],
                        "唐山":[118.02,39.63],
                        "平顶山":[113.29,33.75],
                        "邢台":[114.48,37.05],
                        "德州":[116.29,37.45],
                        "济宁":[116.59,35.38],
                        "荆州":[112.239741,30.335165],
                        "宜昌":[111.3,30.7],
                        "义乌":[120.06,29.32],
                        "丽水":[119.92,28.45],
                        "洛阳":[112.44,34.7],
                        "秦皇岛":[119.57,39.95],
                        "株洲":[113.16,27.83],
                        "石家庄":[114.48,38.03],
                        "莱芜":[117.67,36.19],
                        "常德":[111.69,29.05],
                        "保定":[115.48,38.85],
                        "湘潭":[112.91,27.87],
                        "金华":[119.64,29.12],
                        "岳阳":[113.09,29.37],
                        "长沙":[113,28.21],
                        "衢州":[118.88,28.97],
                        "廊坊":[116.7,39.53],
                        "菏泽":[115.480656,35.23375],
                        "合肥":[117.27,31.86],
                        "武汉":[114.31,30.52],
                        "大庆":[125.03,46.58]
                    }
                },
                // {
                //     name: 'Top5',
                //     type: 'map',
                //     mapType: 'china',
                //     data:[],
                //     markPoint : {
                //         symbol:'emptyCircle',
                //         symbolSize : function (v){
                //             return 10 + v/100
                //         },
                //         effect : {
                //             show: true,
                //             shadowBlur : 0
                //         },
                //         itemStyle:{
                //             normal:{
                //                 label:{show:false}
                //             }
                //         },
                //         data : [plate[0]]
                //     }
                // }
            ]
        };
        // 为echarts对象加载数据
        myChart.setOption(option);


    }
}
fly();