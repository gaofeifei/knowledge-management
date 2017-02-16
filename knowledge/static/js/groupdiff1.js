/**
 * Created by Administrator on 2016/11/30.
 */

//图谱地图对比
function picmap() {
    var point=0,numberd=0;
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

    function peo2() {
        //this.ajax_method='GET'; // body...
    }
    peo2.prototype= {
        call_request:function(url2,callback) {
            $.ajax({
                url: url2,
                type: 'GET',
                dataType: 'json',
                async: true,
                success:ditu,
            });
        },
    };
    var peo2=new peo2();

    function nums() {
        if($('#bu').is(':checked')) { point=0; };
        if($('#yi').is(':checked')) { point=1; };
        if($('#er').is(':checked')) { point=2; };
        if($('#quan').is(':checked')) { numberd=0; };
        if($('#xiangtong').is(':checked')) { numberd=1; };
        if($('#butong').is(':checked')) { numberd=2; };
        url='/group/g_compare_graph/?group_name1='+groupname1+'&group_name2='+groupname2+'&layer='+
            point+'&diff='+numberd;
        url2='/group/g_compare_map/?group_name1='+groupname1+'&group_name2='+groupname2+'&layer='+
            point+'&diff='+numberd;
        peo.call_request(url,events);
        peo2.call_request(url2,ditu);
    };
    nums();
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
            var node_value=[],link_value=[];
            // for (var key in json.u1.node.event_id){
            //     var num1=Math.random()*(-1000-700)+1000;
            //     var num2=Math.random()*(-1000-700)+1000;
            //     var name=json.e1.node.event_id[key];
            //     node_value.push(
            //         {
            //             x: num1,
            //             y: num2,
            //             id: key,
            //             name:name,
            //             symbolSize: 14,
            //             itemStyle: {
            //                 normal: {
            //                     color: '#00cc66'
            //                 }
            //             }
            //         }
            //     );
            // };
            var g_down_peo1=0;
            for (var key2 in json.u1.node.uid){
                g_down_peo1++;
                var num3=Math.random()*(-1000-700)+1000;
                var num4=Math.random()*(-1000-700)+1000;
                var name2;
                if (json.u1.node.uid[key2]==''||json.u1.node.uid[key2]=="unknown") {
                    name2=key2;
                }else {
                    name2=json.u1.node.uid[key2];
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
                                color: '#ffa500'
                            }
                        }
                    }
                );
            };
            $("#container #middle .centre .midleft .conevents .peonum").html(g_down_peo1);
            // for (var key3 in json.u1.node.event){
            //     var num5=Math.random()*(-1000-700)+1000;
            //     var num6=Math.random()*(-1000-700)+1000;
            //     var name3=json.e1.node.event[key3];;
            //     node_value.push(
            //         {
            //             x: num5,
            //             y: num6,
            //             id: key3,
            //             name:name3,
            //             symbolSize: 14,
            //             itemStyle: {
            //                 normal: {
            //                     color: '#a73cff'
            //                 }
            //             }
            //         }
            //     );
            // };
            // for (var key4 in json.u1.node.group){
            //     var num7=Math.random()*(-1000-700)+1000;
            //     var num8=Math.random()*(-1000-700)+1000;
            //     var name4;
            //     if (json.e1.node.group[key4]==''||json.e1.node.group[key4]=="unknown") {
            //         name4=key4;
            //     }else {
            //         name4=json.e1.node.group[key4];
            //     }
            //     node_value.push(
            //         {
            //             x: num7,
            //             y: num8,
            //             id: key4,
            //             name:name4,
            //             symbolSize: 14,
            //             itemStyle: {
            //                 normal: {
            //                     color: '#a73cff'
            //                 }
            //             }
            //         }
            //     );
            // };
            $.each(json.u1.result_relation,function (index,item) {
                link_value.push(
                    {
                        source: ""+item[0]+"",
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

        var myChart2 = echarts.init(document.getElementById('placeimg'));
        myChart2.showLoading();
        $.getJSON(url, function (json) {
            var json=eval(json);
            // var categories = [{name:'人物'},{name:'事件'}];
            var node_value2=[],link_value2=[];
            // ,event_value=[];
            for (var key in json.u2.node.User){
                var num1=Math.random()*(-1000-700)+1000;
                var num2=Math.random()*(-1000-700)+1000;
                var name=json.u2.node.User[key];
                node_value2.push(
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
            var g_down_peo2=0;
            for (var key2 in json.u2.node.uid){
                g_down_peo2++;
                var num3=Math.random()*(-1000-700)+1000;
                var num4=Math.random()*(-1000-700)+1000;
                var name2;
                if (json.u2.node.uid[key2]==''||json.u2.node.uid[key2]=="unknown") {
                    name2=key2;
                }else {
                    name2=json.u2.node.uid[key2];
                }
                node_value2.push(
                    {
                        x: num3,
                        y: num4,
                        id: key2,
                        name:name2,
                        symbolSize: 14,
                        itemStyle: {
                            normal: {
                                color: '#ffa500'
                            }
                        }
                    }
                );
            };
            $("#container #middle .centre .midright .placet .peonum").html(g_down_peo2);
            // for (var key3 in json.u2.node.event){
            //     var num5=Math.random()*(-1000-700)+1000;
            //     var num6=Math.random()*(-1000-700)+1000;
            //     node_value2.push(
            //         {
            //             x: num5,
            //             y: num6,
            //             id: key3,
            //             name:key3,
            //             symbolSize: 14,
            //             itemStyle: {
            //                 normal: {
            //                     color: '#a73cff'
            //                 }
            //             }
            //         }
            //     );
            // };
            // for (var key4 in json.e2.node.group){
            //     var num7=Math.random()*(-1000-700)+1000;
            //     var num8=Math.random()*(-1000-700)+1000;
            //     var name4;
            //     if (json.e2.node.group[key4]==''||json.e2.node.group[key4]=="unknown") {
            //         name4=key4;
            //     }else {
            //         name4=json.e2.node.group[key4];
            //     }
            //     node_value2.push(
            //         {
            //             x: num3,
            //             y: num4,
            //             id: key4,
            //             name:name4,
            //             symbolSize: 14,
            //             itemStyle: {
            //                 normal: {
            //                     color: '#a73cff'
            //                 }
            //             }
            //         }
            //     );
            // };
            $.each(json.u2.result_relation,function (index,item) {
                link_value2.push(
                    {
                        source: ""+item[0]+"",
                        target: ""+item[2]+""
                    }
                );
            });
            myChart2.hideLoading();
            myChart2.setOption(option = {
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
                        data:node_value2,
                        edges: link_value2,
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
    events();

    function ditu() {
        var myChart = echarts.init(document.getElementById('eventimg2'));
        $.getJSON(url2, function (json2) {
            var data2=eval(json2);
            var data = [];
            $.each(data2.u1, function (index, item) {
                data.push(
                    {name: item[0],value: item[1]}
                );
            });
            var geoCoordMap = {
                '香港':[114.15,22.15],
                "鹰潭": [117.03,28.14],
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
                "大庆":[125.03,46.58],
                "鹰潭":[28.14, 117.03],
            };
            if (data.length>0){
                var convertData = function (data) {
                    var res = [];
                    for (var i = 0; i < data.length; i++) {
                        var geoCoord = geoCoordMap[data[i].name];
                        if (geoCoord) {
                            res.push({
                                name: data[i].name,
                                value: geoCoord.concat(data[i].value)
                            });
                        }
                    }
                    return res;
                };

                var convertedData = [
                    convertData(data),
                    convertData(data.sort(function (a, b) {
                        return b.value - a.value;
                    }).slice(0, 6))
                ];

                option = {
                    backgroundColor: '#404a59',
                    animation: true,
                    animationDuration: 1000,
                    animationEasing: 'cubicInOut',
                    animationDurationUpdate: 1000,
                    animationEasingUpdate: 'cubicInOut',
                    title: [
                        {
                            id: 'statistic',
                            right: 120,
                            top: 40,
                            width: 100,
                            textStyle: {
                                color: '#fff',
                                fontSize: 16
                            }
                        }
                    ],
                    toolbox: {
                        iconStyle: {
                            normal: {
                                borderColor: '#fff'
                            },
                            emphasis: {
                                borderColor: '#b1e4ff'
                            }
                        }
                    },
                    brush: {
                        outOfBrush: {
                            color: '#abc'
                        },
                        brushStyle: {
                            borderWidth: 2,
                            color: 'rgba(0,0,0,0.2)',
                            borderColor: 'rgba(0,0,0,0.5)',
                        },
                        seriesIndex: [0, 1],
                        throttleType: 'debounce',
                        throttleDelay: 300,
                        geoIndex: 0
                    },
                    geo: {
                        map: 'china',
                        left: '700',
                        right: '95%',
                        center: [117.98561551896913, 31.205000490896193],
                        zoom: 0,
                        label: {
                            emphasis: {
                                show: false
                            }
                        },
                        roam: true,
                        itemStyle: {
                            normal: {
                                areaColor: '#323c48',
                                borderColor: '#111'
                            },
                            emphasis: {
                                areaColor: '#2a333d'
                            }
                        }
                    },
                    tooltip : {
                        trigger: 'item'
                    },
                    grid: {
                        // right: 40,
                        top: 300,
                        bottom: 40,
                        width: '30%',
                        height:'40%'
                    },
                    xAxis: {
                        type: 'value',
                        scale: true,
                        position: 'top',
                        boundaryGap: false,
                        splitLine: {show: false},
                        axisLine: {show: false},
                        axisTick: {show: false},
                        axisLabel: {margin: 2, textStyle: {color: '#aaa'}},
                    },
                    yAxis: {
                        type: 'category',
                        name: 'TOP 5',
                        nameGap: 16,
                        axisLine: {show: false, lineStyle: {color: '#ddd'}},
                        axisTick: {show: false, lineStyle: {color: '#ddd'}},
                        axisLabel: {interval: 0, textStyle: {color: '#ddd'}},
                        data: []
                    },
                    series : [
                        {
                            name: '',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            data: convertedData[0],
                            symbolSize: function (val) {
                                return Math.max(val[2] / 10000, 5);
                            },
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#ddb926'
                                }
                            }
                        },
                        {
                            name: 'Top 5',
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            data: convertedData[1],
                            symbolSize: function (val) {
                                return Math.max(val[2] / 10000, 5);
                            },
                            showEffectOn: 'emphasis',
                            rippleEffect: {
                                brushType: 'stroke'
                            },
                            hoverAnimation: true,
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#f4e925',
                                    shadowBlur: 10,
                                    shadowColor: '#333'
                                }
                            },
                            zlevel: 1
                        },
                        {
                            id: 'bar',
                            zlevel: 2,
                            type: 'bar',
                            symbol: 'none',
                            itemStyle: {
                                normal: {
                                    color: '#ddb926'
                                }
                            },
                            data: []
                        }
                    ]
                };

                myChart.on('brushselected', renderBrushed);

                myChart.setOption(option);

                setTimeout(function () {
                    myChart.dispatchAction({
                        type: 'brush',
                        areas: [
                            {
                                geoIndex: 0,
                                brushType: 'polygon',
                                coordRange: [[119.72,34.85],[119.68,34.85],[119.5,34.84],[119.19,34.77],[118.76,34.63],[118.6,34.6],[118.46,34.6],[118.33,34.57],[118.05,34.56],[117.6,34.56],[117.41,34.56],[117.25,34.56],[117.11,34.56],[117.02,34.56],[117,34.56],[116.94,34.56],[116.94,34.55],[116.9,34.5],[116.88,34.44],[116.88,34.37],[116.88,34.33],[116.88,34.24],[116.92,34.15],[116.98,34.09],[117.05,34.06],[117.19,33.96],[117.29,33.9],[117.43,33.8],[117.49,33.75],[117.54,33.68],[117.6,33.65],[117.62,33.61],[117.64,33.59],[117.68,33.58],[117.7,33.52],[117.74,33.5],[117.74,33.46],[117.8,33.44],[117.82,33.41],[117.86,33.37],[117.9,33.3],[117.9,33.28],[117.9,33.27],[118.09,32.97],[118.21,32.7],[118.29,32.56],[118.31,32.5],[118.35,32.46],[118.35,32.42],[118.35,32.36],[118.35,32.34],[118.37,32.24],[118.37,32.14],[118.37,32.09],[118.44,32.05],[118.46,32.01],[118.54,31.98],[118.6,31.93],[118.68,31.86],[118.72,31.8],[118.74,31.78],[118.76,31.74],[118.78,31.7],[118.82,31.64],[118.82,31.62],[118.86,31.58],[118.86,31.55],[118.88,31.54],[118.88,31.52],[118.9,31.51],[118.91,31.48],[118.93,31.43],[118.95,31.4],[118.97,31.39],[118.97,31.37],[118.97,31.34],[118.97,31.27],[118.97,31.21],[118.97,31.17],[118.97,31.12],[118.97,31.02],[118.97,30.93],[118.97,30.87],[118.97,30.85],[118.95,30.8],[118.95,30.77],[118.95,30.76],[118.93,30.7],[118.91,30.63],[118.91,30.61],[118.91,30.6],[118.9,30.6],[118.88,30.54],[118.88,30.51],[118.86,30.51],[118.86,30.46],[118.72,30.18],[118.68,30.1],[118.66,30.07],[118.62,29.91],[118.56,29.73],[118.52,29.63],[118.48,29.51],[118.44,29.42],[118.44,29.32],[118.43,29.19],[118.43,29.14],[118.43,29.08],[118.44,29.05],[118.46,29.05],[118.6,28.95],[118.64,28.94],[119.07,28.51],[119.25,28.41],[119.36,28.28],[119.46,28.19],[119.54,28.13],[119.66,28.03],[119.78,28],[119.87,27.94],[120.03,27.86],[120.17,27.79],[120.23,27.76],[120.3,27.72],[120.42,27.66],[120.52,27.64],[120.58,27.63],[120.64,27.63],[120.77,27.63],[120.89,27.61],[120.97,27.6],[121.07,27.59],[121.15,27.59],[121.28,27.59],[121.38,27.61],[121.56,27.73],[121.73,27.89],[122.03,28.2],[122.3,28.5],[122.46,28.72],[122.5,28.77],[122.54,28.82],[122.56,28.82],[122.58,28.85],[122.6,28.86],[122.61,28.91],[122.71,29.02],[122.73,29.08],[122.93,29.44],[122.99,29.54],[123.03,29.66],[123.05,29.73],[123.16,29.92],[123.24,30.02],[123.28,30.13],[123.32,30.29],[123.36,30.36],[123.36,30.55],[123.36,30.74],[123.36,31.05],[123.36,31.14],[123.36,31.26],[123.38,31.42],[123.46,31.74],[123.48,31.83],[123.48,31.95],[123.46,32.09],[123.34,32.25],[123.22,32.39],[123.12,32.46],[123.07,32.48],[123.05,32.49],[122.97,32.53],[122.91,32.59],[122.83,32.81],[122.77,32.87],[122.71,32.9],[122.56,32.97],[122.38,33.05],[122.3,33.12],[122.26,33.15],[122.22,33.21],[122.22,33.3],[122.22,33.39],[122.18,33.44],[122.07,33.56],[121.99,33.69],[121.89,33.78],[121.69,34.02],[121.66,34.05],[121.64,34.08]]
                            }
                        ]
                    });
                }, 0);
                function renderBrushed(params) {
                    var mainSeries = params.batch[0].selected[0];

                    var selectedItems = [];
                    var categoryData = [];
                    var barData = [];
                    var maxBar = 30;
                    var sum = 0;
                    var count = 0;

                    for (var i = 0; i < 5; i++) {
                        var rawIndex = mainSeries.dataIndex[i];
                        var dataItem = convertedData[0][rawIndex];
                        var pmValue = dataItem.value[2];

                        sum += pmValue;
                        count++;

                        selectedItems.push(dataItem);
                    }

                    selectedItems.sort(function (a, b) {
                        return a.value[2] - b.value[2];
                    });

                    for (var i = 0; i < Math.min(selectedItems.length, maxBar); i++) {
                        categoryData.push(selectedItems[i].name);
                        barData.push(selectedItems[i].value[2]);
                    }

                    this.setOption({
                        yAxis: {
                            data: categoryData
                        },
                        xAxis: {
                            axisLabel: {show: !!count}
                        },
                        title: {
                            id: 'statistic',
                            text: count ? '平均: ' + (sum / count).toFixed(4) : ''
                        },
                        series: {
                            id: 'bar',
                            data: barData
                        }
                    });
                };
                // myChart.setOption(option);
            }else {
                $("#eventimg2").html('<p style="text-align: center;height: 500px;line-height: 500px;">无新数据更新</p>');
            }
        });

        var myChart2 = echarts.init(document.getElementById('placeimg2'));
        $.getJSON(url2, function (json3) {
            var data3=eval(json3);
            var data = [];
            $.each(data3.u2, function (index, item) {
                data.push(
                    {name: item[0],value: item[1]}
                );
            });
            var geoCoordMap = {
                '香港':[114.15,22.15],
                "鹰潭": [117.03,28.14],
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
                "大庆":[125.03,46.58],
                "鹰潭":[28.14, 117.03],
            };
            if (data.length>0){
                var convertData = function (data) {
                    var res = [];
                    for (var i = 0; i < data.length; i++) {
                        var geoCoord = geoCoordMap[data[i].name];
                        if (geoCoord) {
                            res.push({
                                name: data[i].name,
                                value: geoCoord.concat(data[i].value)
                            });
                        }
                    }
                    return res;
                };

                var convertedData = [
                    convertData(data),
                    convertData(data.sort(function (a, b) {
                        return b.value - a.value;
                    }).slice(0, 6))
                ];

                option = {
                    backgroundColor: '#404a59',
                    animation: true,
                    animationDuration: 1000,
                    animationEasing: 'cubicInOut',
                    animationDurationUpdate: 1000,
                    animationEasingUpdate: 'cubicInOut',
                    title: [
                        {
                            id: 'statistic',
                            right: 120,
                            top: 40,
                            width: 100,
                            textStyle: {
                                color: '#fff',
                                fontSize: 16
                            }
                        }
                    ],
                    toolbox: {
                        iconStyle: {
                            normal: {
                                borderColor: '#fff'
                            },
                            emphasis: {
                                borderColor: '#b1e4ff'
                            }
                        }
                    },
                    brush: {
                        outOfBrush: {
                            color: '#abc'
                        },
                        brushStyle: {
                            borderWidth: 2,
                            color: 'rgba(0,0,0,0.2)',
                            borderColor: 'rgba(0,0,0,0.5)',
                        },
                        seriesIndex: [0, 1],
                        throttleType: 'debounce',
                        throttleDelay: 300,
                        geoIndex: 0
                    },
                    geo: {
                        map: 'china',
                        left: '700',
                        right: '95%',
                        center: [117.98561551896913, 31.205000490896193],
                        zoom: 0,
                        label: {
                            emphasis: {
                                show: false
                            }
                        },
                        roam: true,
                        itemStyle: {
                            normal: {
                                areaColor: '#323c48',
                                borderColor: '#111'
                            },
                            emphasis: {
                                areaColor: '#2a333d'
                            }
                        }
                    },
                    tooltip : {
                        trigger: 'item'
                    },
                    grid: {
                        // right: 40,
                        top: 300,
                        bottom: 40,
                        width: '30%',
                        height:'40%'
                    },
                    xAxis: {
                        type: 'value',
                        scale: true,
                        position: 'top',
                        boundaryGap: false,
                        splitLine: {show: false},
                        axisLine: {show: false},
                        axisTick: {show: false},
                        axisLabel: {margin: 2, textStyle: {color: '#aaa'}},
                    },
                    yAxis: {
                        type: 'category',
                        name: 'TOP 5',
                        nameGap: 16,
                        axisLine: {show: false, lineStyle: {color: '#ddd'}},
                        axisTick: {show: false, lineStyle: {color: '#ddd'}},
                        axisLabel: {interval: 0, textStyle: {color: '#ddd'}},
                        data: []
                    },
                    series : [
                        {
                            name: '',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            data: convertedData[0],
                            symbolSize: function (val) {
                                return Math.max(val[2] / 10000, 5);
                            },
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#ddb926'
                                }
                            }
                        },
                        {
                            name: 'Top 5',
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            data: convertedData[1],
                            symbolSize: function (val) {
                                return Math.max(val[2] / 10000, 5);
                            },
                            showEffectOn: 'emphasis',
                            rippleEffect: {
                                brushType: 'stroke'
                            },
                            hoverAnimation: true,
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#f4e925',
                                    shadowBlur: 10,
                                    shadowColor: '#333'
                                }
                            },
                            zlevel: 1
                        },
                        {
                            id: 'bar',
                            zlevel: 2,
                            type: 'bar',
                            symbol: 'none',
                            itemStyle: {
                                normal: {
                                    color: '#ddb926'
                                }
                            },
                            data: []
                        }
                    ]
                };

                myChart2.on('brushselected', renderBrushed);

                myChart2.setOption(option);

                setTimeout(function () {
                    myChart2.dispatchAction({
                        type: 'brush',
                        areas: [
                            {
                                geoIndex: 0,
                                brushType: 'polygon',
                                coordRange: [[119.72,34.85],[119.68,34.85],[119.5,34.84],[119.19,34.77],[118.76,34.63],[118.6,34.6],[118.46,34.6],[118.33,34.57],[118.05,34.56],[117.6,34.56],[117.41,34.56],[117.25,34.56],[117.11,34.56],[117.02,34.56],[117,34.56],[116.94,34.56],[116.94,34.55],[116.9,34.5],[116.88,34.44],[116.88,34.37],[116.88,34.33],[116.88,34.24],[116.92,34.15],[116.98,34.09],[117.05,34.06],[117.19,33.96],[117.29,33.9],[117.43,33.8],[117.49,33.75],[117.54,33.68],[117.6,33.65],[117.62,33.61],[117.64,33.59],[117.68,33.58],[117.7,33.52],[117.74,33.5],[117.74,33.46],[117.8,33.44],[117.82,33.41],[117.86,33.37],[117.9,33.3],[117.9,33.28],[117.9,33.27],[118.09,32.97],[118.21,32.7],[118.29,32.56],[118.31,32.5],[118.35,32.46],[118.35,32.42],[118.35,32.36],[118.35,32.34],[118.37,32.24],[118.37,32.14],[118.37,32.09],[118.44,32.05],[118.46,32.01],[118.54,31.98],[118.6,31.93],[118.68,31.86],[118.72,31.8],[118.74,31.78],[118.76,31.74],[118.78,31.7],[118.82,31.64],[118.82,31.62],[118.86,31.58],[118.86,31.55],[118.88,31.54],[118.88,31.52],[118.9,31.51],[118.91,31.48],[118.93,31.43],[118.95,31.4],[118.97,31.39],[118.97,31.37],[118.97,31.34],[118.97,31.27],[118.97,31.21],[118.97,31.17],[118.97,31.12],[118.97,31.02],[118.97,30.93],[118.97,30.87],[118.97,30.85],[118.95,30.8],[118.95,30.77],[118.95,30.76],[118.93,30.7],[118.91,30.63],[118.91,30.61],[118.91,30.6],[118.9,30.6],[118.88,30.54],[118.88,30.51],[118.86,30.51],[118.86,30.46],[118.72,30.18],[118.68,30.1],[118.66,30.07],[118.62,29.91],[118.56,29.73],[118.52,29.63],[118.48,29.51],[118.44,29.42],[118.44,29.32],[118.43,29.19],[118.43,29.14],[118.43,29.08],[118.44,29.05],[118.46,29.05],[118.6,28.95],[118.64,28.94],[119.07,28.51],[119.25,28.41],[119.36,28.28],[119.46,28.19],[119.54,28.13],[119.66,28.03],[119.78,28],[119.87,27.94],[120.03,27.86],[120.17,27.79],[120.23,27.76],[120.3,27.72],[120.42,27.66],[120.52,27.64],[120.58,27.63],[120.64,27.63],[120.77,27.63],[120.89,27.61],[120.97,27.6],[121.07,27.59],[121.15,27.59],[121.28,27.59],[121.38,27.61],[121.56,27.73],[121.73,27.89],[122.03,28.2],[122.3,28.5],[122.46,28.72],[122.5,28.77],[122.54,28.82],[122.56,28.82],[122.58,28.85],[122.6,28.86],[122.61,28.91],[122.71,29.02],[122.73,29.08],[122.93,29.44],[122.99,29.54],[123.03,29.66],[123.05,29.73],[123.16,29.92],[123.24,30.02],[123.28,30.13],[123.32,30.29],[123.36,30.36],[123.36,30.55],[123.36,30.74],[123.36,31.05],[123.36,31.14],[123.36,31.26],[123.38,31.42],[123.46,31.74],[123.48,31.83],[123.48,31.95],[123.46,32.09],[123.34,32.25],[123.22,32.39],[123.12,32.46],[123.07,32.48],[123.05,32.49],[122.97,32.53],[122.91,32.59],[122.83,32.81],[122.77,32.87],[122.71,32.9],[122.56,32.97],[122.38,33.05],[122.3,33.12],[122.26,33.15],[122.22,33.21],[122.22,33.3],[122.22,33.39],[122.18,33.44],[122.07,33.56],[121.99,33.69],[121.89,33.78],[121.69,34.02],[121.66,34.05],[121.64,34.08]]
                            }
                        ]
                    });
                }, 0);
                function renderBrushed(params) {
                    var mainSeries = params.batch[0].selected[0];

                    var selectedItems = [];
                    var categoryData = [];
                    var barData = [];
                    var maxBar = 30;
                    var sum = 0;
                    var count = 0;

                    for (var i = 0; i < 5; i++) {
                        var rawIndex = mainSeries.dataIndex[i];
                        var dataItem = convertedData[0][rawIndex];
                        var pmValue = dataItem.value[2];

                        sum += pmValue;
                        count++;

                        selectedItems.push(dataItem);
                    }

                    selectedItems.sort(function (a, b) {
                        return a.value[2] - b.value[2];
                    });

                    for (var i = 0; i < Math.min(selectedItems.length, maxBar); i++) {
                        categoryData.push(selectedItems[i].name);
                        barData.push(selectedItems[i].value[2]);
                    }

                    this.setOption({
                        yAxis: {
                            data: categoryData
                        },
                        xAxis: {
                            axisLabel: {show: !!count}
                        },
                        title: {
                            id: 'statistic',
                            text: count ? '平均: ' + (sum / count).toFixed(4) : ''
                        },
                        series: {
                            id: 'bar',
                            data: barData
                        }
                    });
                };
                // myChart.setOption(option);
            }else {
                $("#placeimg2").html('<p style="text-align: center;height: 500px;line-height: 500px;">无新数据更新</p>');
            }
        });
    };
    ditu();
};
picmap();


//人物对比
function renwuduibi(numa2) {
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
    function territory2(data) {
        var data=eval(data);
        $('#tab1').bootstrapTable('load',data.detail_result1);
        $('#tab2').bootstrapTable('load',data.detail_result2);
        $('#tab1').bootstrapTable({
            //url: influ_url,
            data:data.detail_result1,
            search: true,//是否搜索
            pagination: true,//是否分页
            pageSize: 5,//单页记录数
            pageList: [5, 10, 20, 50],//分页步进值
            sidePagination: "client",//服务端分页
            searchAlign: "left",
            searchOnEnterKey: false,//回车搜索
            showRefresh: true,//刷新按钮
            showColumns: true,//列选择按钮
            buttonsAlign: "right",//按钮对齐方式
            locale: "zh-CN",//中文支持
            detailView: false,
            showToggle:true,
            sortName:'bci',
            sortOrder:"desc",
            columns: [
                {
                    title: "序号",//标题
                    field: "",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        return index+1;
                    }
                },
                {
                    title: "姓名",//标题
                    field: "uname",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if (row.uname==""||row.uname=="unknown"){
                            return row.uid;
                        }else {
                            return row.uname;
                        };
                    },
                },
                {
                    title: "影响力",//标题
                    field: "influence",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        return row.influence.toFixed(2);
                    },
                },
                {
                    title: "活跃度",//标题
                    field: "activeness",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        return row.activeness.toFixed(2);
                    },
                },
                {
                    title: "敏感度",//标题
                    field: "sensitive",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        return row.sensitive.toFixed(2);
                    },
                },
                {
                    title: "业务标签",//标题
                    field: "user_tag",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if (row.user_tag=='null'){
                            return "暂无";
                        }
                    },
                },

            ],

        });
        $('#tab2').bootstrapTable({
            //url: influ_url,
            data:data.detail_result2,
            search: true,//是否搜索
            pagination: true,//是否分页
            pageSize: 5,//单页记录数
            pageList: [5, 10, 20, 50],//分页步进值
            sidePagination: "client",//服务端分页
            searchAlign: "left",
            searchOnEnterKey: false,//回车搜索
            showRefresh: true,//刷新按钮
            showColumns: true,//列选择按钮
            buttonsAlign: "right",//按钮对齐方式
            locale: "zh-CN",//中文支持
            detailView: false,
            showToggle:true,
            sortName:'bci',
            sortOrder:"desc",
            columns: [
                {
                    title: "序号",//标题
                    field: "",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        return index+1;
                    }
                },
                {
                    title: "姓名",//标题
                    field: "uname",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if (row.uname==""||row.uname=="unknown"){
                            return row.uid;
                        }else {
                            return row.uname;
                        };
                    },
                },
                {
                    title: "影响力",//标题
                    field: "influence",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        return row.influence.toFixed(2);
                    },
                },
                {
                    title: "活跃度",//标题
                    field: "activeness",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        return row.activeness.toFixed(2);
                    },
                },
                {
                    title: "敏感度",//标题
                    field: "sensitive",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        return row.sensitive.toFixed(2);
                    },
                },
                {
                    title: "业务标签",//标题
                    field: "user_tag",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if (row.user_tag=='null'){
                            return "暂无";
                        }
                    },
                },

            ],

        });
    }
    var people=new people();
    var point2,numberd2=numa2;
    function nums2() {
        if($('#option1').is(':checked')) { point2='activeness'; };
        if($('#option2').is(':checked')) { point2='influence'; };
        if($('#option3').is(':checked')) { point2='sensitive'; };
        var url = '/group/g_compare_user/?group_name1='+groupname1+'&group_name2='+groupname2+'&sort_flag='+
            point2+'&diff='+numberd2;
        people.call_request(url,territory2);
    };
    $.each($("#container #middle .peotrast .ptsone input"),function (index,item) {
        $(item).on('click',function () {
            nums2();
        });
    });
    nums2();
}
$('#container #middle .peotrast .ptsone .quanbu').on('click',function () {
    renwuduibi(0);
});
$('#container #middle .peotrast .ptsone .xiangtong').on('click',function () {
    renwuduibi(1);
});
$('#container #middle .peotrast .ptsone .butong').on('click',function () {
    renwuduibi(2);
});
renwuduibi(0);

//事件对比
function shijianduibi(numa) {
    function thing() {
        //this.ajax_method='GET'; // body...
    }
    thing.prototype= {
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
        $("#run4").empty();
        $("#run5").empty();
        var step4=0,step5=0;
        var data=eval(data);
        var str1='';
        var str2='';
        if (data.detail_result1.length==0){
            $("#run4").html('<p style="text-align: center;height: 190px;line-height: 190px;">无新数据更新</p>');
        }else {
            $.each(data.detail_result1,function (index,item) {
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
                str1+='<div class="play">'+
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
                    // '<div class="play5" type="button" data-toggle="modal">'+
                    // '<a>加入专题</a>'+
                    // '</div>'+
                    '</div>';
            });
            $("#run4").append(str1);
            $('#run4').width((data.detail_result1.length)*255);
        };
        if (data.detail_result2.length==0){
            $("#run5").html('<p style="text-align: center;height: 190px;line-height: 190px;">无新数据更新</p>');
        }else {
            $.each(data.detail_result2,function (index,item) {
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
                str2+='<div class="play">'+
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
                    // '<div class="play5" type="button" data-toggle="modal">'+
                    // '<a>加入专题</a>'+
                    // '</div>'+
                    '</div>';
            });
            $("#run5").append(str2);
            $('#run5').width((data.detail_result2.length)*255);
        }
        $('#container #middle .thingtrast .lawyer2 .right').on('click',function () {
            if (data.detail_result1.length<=4){
                alert('没有其他卡片内容了~~');
            }else {
                step4++;
                var plays=$("#run4");
                walk=(-1020)*step4;
                $(plays).css({
                    "-webkit-transform":"translateX("+walk+"px)",
                    "-moz-transform":"translateX("+walk+"px)",
                    "-ms-transform":"translateX("+walk+"px)",
                    "-o-transform":"translateX("+walk+"px)",
                    "transform":"translateX("+walk+"px)",
                });
                if (step4 >= data.detail_result1.length/4){
                    alert('已经是最后一页了~~');
                    $(plays).css({
                        "-webkit-transform":"translateX(0px)",
                        "-moz-transform":"translateX(0px)",
                        "-ms-transform":"translateX(0px)",
                        "-o-transform":"translateX(0px)",
                        "transform":"translateX(0px)",
                    });
                    step4=0;
                }
            }
        });
        $('#container #middle .thingtrast .lawyer2 .left').on('click',function () {
            if (data.detail_result1.length<=4){
                alert('没有其他卡片内容了~~');
            }else {
                step4--;
                if (step4 < 0){
                    alert('已经是第一页了~~');
                    step4=0;
                }else {
                    var plays=$("#run4");
                    walk=(-1020)*step4;
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
        $('#container #middle .thingtrast .safeguard2 .right').on('click',function () {
            if (data.detail_result2.length<=4){
                alert('没有其他卡片内容了~~');
            }else {
                step5++;
                var plays=$("#run5");
                walk=(-1020)*step5;
                $(plays).css({
                    "-webkit-transform":"translateX("+walk+"px)",
                    "-moz-transform":"translateX("+walk+"px)",
                    "-ms-transform":"translateX("+walk+"px)",
                    "-o-transform":"translateX("+walk+"px)",
                    "transform":"translateX("+walk+"px)",
                });
                if (step5 >= data.detail_result2.length/4){
                    alert('已经是最后一页了~~');
                    $(plays).css({
                        "-webkit-transform":"translateX(0px)",
                        "-moz-transform":"translateX(0px)",
                        "-ms-transform":"translateX(0px)",
                        "-o-transform":"translateX(0px)",
                        "transform":"translateX(0px)",
                    });
                    step5=0;
                }
            }
        });
        $('#container #middle .thingtrast .safeguard2 .left').on('click',function () {
            if (data.detail_result2.length<=4){
                alert('没有其他卡片内容了~~');
            }else {
                step5--;
                if (step < 0){
                    alert('已经是第一页了~~');
                    step5=0;
                }else {
                    var plays=$("#run5");
                    walk=(-1020)*step5;
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
        //卡片效果
        var heart=$("#container .play .xin");
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
    }
    var thing=new thing();
    var point,numberd=numa;
    function nums() {
        if($('#option12').is(':checked')) { point='start_ts'; };
        if($('#option22').is(':checked')) { point='uid_counts'; };
        if($('#option32').is(':checked')) { point='weibo_counts'; };
        var url = '/group/g_compare_event/?group_name1='+groupname1+'&group_name2='+groupname2+'&sort_flag='+
            point+'&diff='+numberd;
        console.log(url)
        thing.call_request(url,territory);
    };
    $.each($("#container #middle .thingtrast .ttone input"),function (index,item) {
        $(item).on('click',function () {
            nums();
        });
    });
    nums();
};
$('#container #middle .thingtrast .lawyer .lawyer1 .quanbu2').on('click',function () {
    shijianduibi(0);
});
$('#container #middle .thingtrast .lawyer .lawyer1 .xiangtong2').on('click',function () {
    shijianduibi(1);
});
$('#container #middle .thingtrast .lawyer .lawyer1 .butong2').on('click',function () {
    shijianduibi(2);
});
shijianduibi(0);

function wenbenduibi() {
    function getLocalTime(nS) {
        return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,20)
    };
    function weibo() {
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
            Draw_weibo_table(data);
        };
        var place=new place();
        var flag='retweeted',diff=0;
        function nums() {
            var url = '/group/g_compare_weibo/?group_name1='+groupname1+'&group_name2='+
                groupname2+'&sort_flag='+flag+'&diff='+diff;
            place.call_request(url,territory);
        }
        nums();
        $("#container #middle .textrast .textrast1 .tone").on('click',function () {
            flag='retweeted';
            nums();
        });
        $("#container #middle .textrast .textrast1 .ttwo").on('click',function () {
            flag='sensitive';
            nums();
        });
        $('.xiangtong3').on('click',function () {
            diff=1;
            nums();
        });
        $('.butong3').on('click',function () {
            diff=2;
            nums();
        });
        $('.quanbu3').on('click',function () {
            diff=0;
            nums();
        });
        function Draw_weibo_table(data){
            $('#group_emotion_loading').css('display', 'none');
            $('#input-table').css('display', 'block');
            var dataArray = data.detail_result1;
            var PageNo=document.getElementById('PageNo');                   //设置每页显示行数
            var InTb=document.getElementById('input-table');               //表格
            var Fp=document.getElementById('F-page');                      //首页
            var Nep=document.getElementById('Nex-page');                  //下一页
            var Prp=document.getElementById('Pre-page');                  //上一页
            var Lp=document.getElementById('L-page');                     //尾页
            var S1=document.getElementById('s1');                         //总页数
            var S2=document.getElementById('s2');                         //当前页数
            var currentPage;                                              //定义变量表示当前页数
            var SumPage;

            if(PageNo.value!="")                                       //判断每页显示是否为空
            {
                InTb.innerHTML='';                                     //每次进来都清空表格
                S2.innerHTML='';                                        //每次进来清空当前页数
                currentPage=1;                                          //首页为1
                S2.appendChild(document.createTextNode(currentPage));
                S1.innerHTML='';                                        //每次进来清空总页数
                if(dataArray.length%PageNo.value==0)                    //判断总的页数
                {
                    SumPage=parseInt(dataArray.length/PageNo.value);
                }
                else
                {
                    SumPage=parseInt(dataArray.length/PageNo.value)+1
                }
                S1.appendChild(document.createTextNode(SumPage));
                var oTBody=document.createElement('tbody');               //创建tbody
                oTBody.setAttribute('class','In-table');                   //定义class
                InTb.appendChild(oTBody);
                //将创建的tbody添加入table
                var html_c = '';
                if(dataArray==''){
                    html_c = "<div style='width:100%;'><span>用户未发布任何微博</span></div>";
                    oTBody.innerHTML = html_c;
                }else{

                    for(i=0;i<parseInt(PageNo.value);i++)
                    {                                                          //循环打印数组值
                        oTBody.insertRow(i);
                        var name;
                        if (dataArray[i].uname==''||dataArray[i].uname=='unknown') {
                            name=dataArray[i].uid;
                        }else {
                            name=dataArray[i].uname;
                        };
                        var _ci=dataArray[i].sensitive_words_string.replace(/&/g,'');
                        html_c = '<div class="twr1">'+
                            '                        <p class="master">'+
                            '                            微博内容：'+
                            '                            <span class="master1">'+
                            dataArray[i].text+
                            '                            </span>'+
                            '                        </p>'+
                            '                        <p class="time">'+
                            '                            <span class="time1">来自微博用户：</span>&nbsp;&nbsp;'+
                            '                            <a class="time2">'+name+'</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
                            '                            <span class="time3">发表于&nbsp;&nbsp;<i>'+
                            getLocalTime(dataArray[i].timestamp)+'</i></span>'+
                            '                            <p><span class="time4" style="display: inline-block;">转发数（'+dataArray[i].retweeted+'）</span>|&nbsp;'+
                            '                            <span class="time5">评论数（'+dataArray[i].comment+'）</span>|&nbsp;'+
                            '                            <span class="time6">言论敏感度（'+dataArray[i].sensitive+'）</span></p>'+
                            '                        </p>'+
                            '                    </div>';
                        oTBody.rows[i].insertCell(0);
                        oTBody.rows[i].cells[0].innerHTML = html_c;
                        if (dataArray[i].sensitive_words_string==''){
                            null;
                        }else {
                            for (var i=0;i<_ci.length;i++){
                                var reg = new RegExp("(" + _ci[i] + ")", "g");
                                $('.master1').html($('.master1').html().replace(reg,"<font color=red>$1</font>"));
                            }
                        }
                    }
                }
            };
            Fp.onclick=function()
            {

                if(PageNo.value!="")                                       //判断每页显示是否为空
                {
                    InTb.innerHTML='';                                     //每次进来都清空表格
                    S2.innerHTML='';                                        //每次进来清空当前页数
                    currentPage=1;                                          //首页为1
                    S2.appendChild(document.createTextNode(currentPage));
                    S1.innerHTML='';                                        //每次进来清空总页数
                    if(dataArray.length%PageNo.value==0)                    //判断总的页数
                    {
                        SumPage=parseInt(dataArray.length/PageNo.value);
                    }
                    else
                    {
                        SumPage=parseInt(dataArray.length/PageNo.value)+1
                    }
                    S1.appendChild(document.createTextNode(SumPage));
                    var oTBody=document.createElement('tbody');               //创建tbody
                    oTBody.setAttribute('class','In-table');                   //定义class
                    InTb.appendChild(oTBody);                                     //将创建的tbody添加入table
                    var html_c = '';

                    if(dataArray==''){
                        html_c = "<div style='width:100%;'><span style='margin-left:20px;'>用户未发布任何微博</span></div>";
                        oTBody.rows[0].cells[0].innerHTML = html_c;
                    }else{

                        for(i=0;i<parseInt(PageNo.value);i++)
                        {                                                          //循环打印数组值
                            oTBody.insertRow(i);
                            var name;
                            if (dataArray[i].uname==''||dataArray[i].uname=='unknown') {
                                name=dataArray[i].uid;
                            }else {
                                name=dataArray[i].uname;
                            };
                            html_c = '<div class="twr1">'+
                                '                        <p class="master">'+
                                '                            微博内容：'+
                                '                            <span class="master1">'+
                                dataArray[i].text+
                                '                            </span>'+
                                '                        </p>'+
                                '                        <p class="time">'+
                                '                            <span class="time1">来自微博用户：</span>&nbsp;&nbsp;'+
                                '                            <a class="time2">'+name+'</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
                                '                            <span class="time3">发表于&nbsp;&nbsp;<i>'+
                                getLocalTime(dataArray[i].timestamp)+'</i></span>'+
                                '                            <p><span class="time4" style="display: inline-block;">转发数（'+dataArray[i].retweeted+'）</span>|&nbsp;'+
                                '                            <span class="time5">评论数（'+dataArray[i].comment+'）</span>|&nbsp;'+
                                '                            <span class="time6">言论敏感度（'+dataArray[i].sensitive+'）</span></p>'+
                                '                        </p>'+
                                '                    </div>';
                            oTBody.rows[i].insertCell(0);
                            oTBody.rows[i].cells[0].innerHTML = html_c;
                            if (dataArray[i].sensitive_words_string==''){
                                null;
                            }else {
                                var _ci=dataArray[i].sensitive_words_string.replace(/&/g,'');
                                for (var i=0;i<_ci.length;i++){
                                    var reg = new RegExp("(" + _ci[i] + ")", "g");
                                    $('.master1').html($('.master1').html().replace(reg,"<font color=red>$1</font>"));
                                }
                            }
                        }
                    }
                }
            };
            Nep.onclick=function()
            {
                if(currentPage<SumPage)                                 //判断当前页数小于总页数
                {
                    InTb.innerHTML='';
                    S1.innerHTML='';
                    if(dataArray.length%PageNo.value==0)
                    {
                        SumPage=parseInt(dataArray.length/PageNo.value);
                    }
                    else
                    {
                        SumPage=parseInt(dataArray.length/PageNo.value)+1
                    }
                    S1.appendChild(document.createTextNode(SumPage));
                    S2.innerHTML='';
                    currentPage=currentPage+1;
                    S2.appendChild(document.createTextNode(currentPage));
                    var oTBody=document.createElement('tbody');
                    oTBody.setAttribute('class','In-table');
                    InTb.appendChild(oTBody);
                    var a;                                                 //定义变量a
                    a=PageNo.value*(currentPage-1);                       //a等于每页显示的行数乘以上一页数
                    var c;                                                  //定义变量c
                    if(dataArray.length-a>=PageNo.value)                  //判断下一页数组数据是否小于每页显示行数
                    {
                        c=PageNo.value;
                    }
                    else
                    {
                        c=dataArray.length-a;
                    }
                    for(i=0;i<c;i++)
                    {
                        oTBody.insertRow(i);
                        var name;
                        if (dataArray[i+a].uname==''||dataArray[i+a].uname=='unknown') {
                            name=dataArray[i+a].uid;
                        }else {
                            name=dataArray[i+a].uname;
                        };
                        oTBody.rows[i].insertCell(0);
                        html_c = '<div class="twr1">'+
                            '                        <p class="master">'+
                            '                            微博内容：'+
                            '                            <span class="master1">'+
                            dataArray[i+a].text+
                            '                            </span>'+
                            '                        </p>'+
                            '                        <p class="time">'+
                            '                            <span class="time1">来自微博用户：</span>&nbsp;&nbsp;'+
                            '                            <a class="time2">'+name+'</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
                            '                            <span class="time3">发表于&nbsp;&nbsp;<i>'+
                            getLocalTime(dataArray[i+a].timestamp)+'</i></span>'+
                            '                            <p><span class="time4" style="display: inline-block;">转发数（'+dataArray[i+a].retweeted+'）</span>|&nbsp;'+
                            '                            <span class="time5">评论数（'+dataArray[i+a].comment+'）</span>|&nbsp;'+
                            '                            <span class="time6">言论敏感度（'+dataArray[i+a].sensitive+'）</span></p>'+
                            '                        </p>'+
                            '                    </div>';
                        oTBody.rows[i].cells[0].innerHTML = html_c;
                        //数组从第i+a开始取值
                        if (dataArray[i+a].sensitive_words_string==''){
                            null;
                        }else {
                            var _ci=dataArray[i+a].sensitive_words_string.replace(/&/g,'');
                            for (var i=0;i<_ci.length;i++){
                                var reg = new RegExp("(" + _ci[i] + ")", "g");
                                $('.master1').html($('.master1').html().replace(reg,"<font color=red>$1</font>"));
                            }
                        }
                    }
                }
            };

            Prp.onclick=function()
            {
                if(currentPage>1)                        //判断当前是否在第一页
                {
                    InTb.innerHTML='';
                    S1.innerHTML='';
                    if(dataArray.length%PageNo.value==0)
                    {
                        SumPage=parseInt(dataArray.length/PageNo.value);
                    }
                    else
                    {
                        SumPage=parseInt(dataArray.length/PageNo.value)+1
                    }
                    S1.appendChild(document.createTextNode(SumPage));
                    S2.innerHTML='';
                    currentPage=currentPage-1;
                    S2.appendChild(document.createTextNode(currentPage));
                    var oTBody=document.createElement('tbody');
                    oTBody.setAttribute('class','In-table');
                    InTb.appendChild(oTBody);
                    var a;
                    a=PageNo.value*(currentPage-1);
                    for(i=0;i<parseInt(PageNo.value);i++)
                    {
                        oTBody.insertRow(i);
                        var name;
                        if (dataArray[i+a].uname==''||dataArray[i].uname=='unknown') {
                            name=dataArray[i+a].uid;
                        }else {
                            name=dataArray[i+a].uname;
                        };
                        oTBody.rows[i].insertCell(0);
                        html_c = '<div class="twr1">'+
                            '                        <p class="master">'+
                            '                            微博内容：'+
                            '                            <span class="master1">'+
                            dataArray[i+a].text+
                            '                            </span>'+
                            '                        </p>'+
                            '                        <p class="time">'+
                            '                            <span class="time1">来自微博用户：</span>&nbsp;&nbsp;'+
                            '                            <a class="time2">'+name+'</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
                            '                            <span class="time3">发表于&nbsp;&nbsp;<i>'+
                            getLocalTime(dataArray[i+a].timestamp)+'</i></span>'+
                            '                            <p><span class="time4" style="display: inline-block;">转发数（'+dataArray[i+a].retweeted+'）</span>|&nbsp;'+
                            '                            <span class="time5">评论数（'+dataArray[i+a].comment+'）</span>|&nbsp;'+
                            '                            <span class="time6">言论敏感度（'+dataArray[i+a].sensitive+'）</span></p>'+
                            '                        </p>'+
                            '                    </div>';
                        oTBody.rows[i].cells[0].innerHTML = html_c;
                        if (dataArray[i+a].sensitive_words_string==''){
                            null;
                        }else {
                            var _ci=dataArray[i+a].sensitive_words_string.replace(/&/g,'');
                            for (var i=0;i<_ci.length;i++){
                                var reg = new RegExp("(" + _ci[i] + ")", "g");
                                $('.master1').html($('.master1').html().replace(reg,"<font color=red>$1</font>"));
                            }
                        }
                    }
                }
            };

            Lp.onclick=function()
            {
                InTb.innerHTML='';
                S1.innerHTML='';
                if(dataArray.length%PageNo.value==0)
                {
                    SumPage=parseInt(dataArray.length/PageNo.value);
                }
                else
                {
                    SumPage=parseInt(dataArray.length/PageNo.value)+1
                }
                S1.appendChild(document.createTextNode(SumPage));
                S2.innerHTML='';
                currentPage=SumPage;
                S2.appendChild(document.createTextNode(currentPage));
                var oTBody=document.createElement('tbody');
                oTBody.setAttribute('class','In-table');
                InTb.appendChild(oTBody);
                var a;
                a=PageNo.value*(currentPage-1);
                var c;
                if(dataArray.length-a>=PageNo.value)
                {
                    c=PageNo.value;
                }
                else
                {
                    c=dataArray.length-a;
                }
                for(i=0;i<c;i++)
                {
                    oTBody.insertRow(i);
                    var name;
                    if (dataArray[i+a].uname==''||dataArray[i+a].uname=='unknown') {
                        name=dataArray[i+a].uid;
                    }else {
                        name=dataArray[i+a].uname;
                    };
                    oTBody.rows[i].insertCell(0);
                    html_c = '<div class="twr1">'+
                        '                        <p class="master">'+
                        '                            微博内容：'+
                        '                            <span class="master1">'+
                        dataArray[i+a].text+
                        '                            </span>'+
                        '                        </p>'+
                        '                        <p class="time">'+
                        '                            <span class="time1">来自微博用户：</span>&nbsp;&nbsp;'+
                        '                            <a class="time2">'+name+'</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
                        '                            <span class="time3">发表于&nbsp;&nbsp;<i>'+
                        getLocalTime(dataArray[i+a].timestamp)+'</i></span>'+
                        '                            <p><span class="time4" style="display: inline-block;">转发数（'+dataArray[i+a].retweeted+'）</span>|&nbsp;'+
                        '                            <span class="time5">评论数（'+dataArray[i+a].comment+'）</span>|&nbsp;'+
                        '                            <span class="time6">言论敏感度（'+dataArray[i+a].sensitive+'）</span></p>'+
                        '                        </p>'+
                        '                    </div>';
                    oTBody.rows[i].cells[0].innerHTML = html_c;
                    if (dataArray[i+a].sensitive_words_string==''){
                        null;
                    }else {
                        var _ci=dataArray[i+a].sensitive_words_string.replace(/&/g,'');
                        for (var i=0;i<_ci.length;i++){
                            var reg = new RegExp("(" + _ci[i] + ")", "g");
                            $('.master1').html($('.master1').html().replace(reg,"<font color=red>$1</font>"));
                        }
                    }
                }
            };
            // -------------------------

            $('#group_emotion_loading2').css('display', 'none');
            $('#input-table2').css('display', 'block');
            var dataArray2 = data.detail_result2;
            var PageNo2=document.getElementById('PageNo2');                   //设置每页显示行数
            var InTb2=document.getElementById('input-table2');               //表格
            var Fp2=document.getElementById('F-page2');                      //首页
            var Nep2=document.getElementById('Nex-page2');                  //下一页
            var Prp2=document.getElementById('Pre-page2');                  //上一页
            var Lp2=document.getElementById('L-page2');                     //尾页
            var S12=document.getElementById('s12');                         //总页数
            var S22=document.getElementById('s22');                         //当前页数
            var currentPage2;                                              //定义变量表示当前页数
            var SumPage2;

            if(PageNo2.value!="")                                       //判断每页显示是否为空
            {
                InTb2.innerHTML='';                                     //每次进来都清空表格
                S22.innerHTML='';                                        //每次进来清空当前页数
                currentPage2=1;                                          //首页为1
                S22.appendChild(document.createTextNode(currentPage2));
                S12.innerHTML='';                                        //每次进来清空总页数
                if(dataArray2.length%PageNo2.value==0)                    //判断总的页数
                {
                    SumPage2=parseInt(dataArray2.length/PageNo2.value);
                }
                else
                {
                    SumPage2=parseInt(dataArray2.length/PageNo2.value)+1
                }
                S12.appendChild(document.createTextNode(SumPage2));
                var oTBody=document.createElement('tbody');               //创建tbody
                oTBody.setAttribute('class','In-table');                   //定义class
                InTb2.appendChild(oTBody);
                //将创建的tbody添加入table
                var html_c = '';
                if(dataArray2==''){
                    html_c = "<div style='width:100%;'><span>用户未发布任何微博</span></div>";
                    oTBody.innerHTML = html_c;
                }else{

                    for(i=0;i<parseInt(PageNo2.value);i++)
                    {                                                          //循环打印数组值
                        oTBody.insertRow(i);
                        var name;
                        if (dataArray2[i].uname==''||dataArray2[i].uname=='unknown') {
                            name=dataArray2[i].uid;
                        }else {
                            name=dataArray2[i].uname;
                        };
                        html_c = '<div class="twr1">'+
                            '                        <p class="master">'+
                            '                            微博内容：'+
                            '                            <span class="master1">'+
                            dataArray2[i].text+
                            '                            </span>'+
                            '                        </p>'+
                            '                        <p class="time">'+
                            '                            <span class="time1">来自微博用户：</span>&nbsp;&nbsp;'+
                            '                            <a class="time2">'+name+'</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
                            '                            <span class="time3">发表于&nbsp;&nbsp;<i>'+
                            getLocalTime(dataArray2[i].timestamp)+'</i></span>'+
                            '                            <p><span class="time4" style="display: inline-block;">转发数（'+dataArray2[i].retweeted+'）</span>|&nbsp;'+
                            '                            <span class="time5">评论数（'+dataArray2[i].comment+'）</span>|&nbsp;'+
                            '                            <span class="time6">言论敏感度（'+dataArray2[i].sensitive+'）</span></p>'+
                            '                        </p>'+
                            '                    </div>';
                        oTBody.rows[i].insertCell(0);
                        oTBody.rows[i].cells[0].innerHTML = html_c;
                        if (dataArray2[i].sensitive_words_string==''){
                            null;
                        }else {
                            var _ci=dataArray2[i].sensitive_words_string.replace(/&/g,'');
                            for (var i=0;i<_ci.length;i++){
                                var reg = new RegExp("(" + _ci[i] + ")", "g");
                                $('.master1').html($('.master1').html().replace(reg,"<font color=red>$1</font>"));
                            }
                        }
                    }
                }
            }
            Fp2.onclick=function()
            {

                if(PageNo2.value!="")                                       //判断每页显示是否为空
                {
                    InTb2.innerHTML='';                                     //每次进来都清空表格
                    S22.innerHTML='';                                        //每次进来清空当前页数
                    currentPage2=1;                                          //首页为1
                    S22.appendChild(document.createTextNode(currentPage2));
                    S12.innerHTML='';                                        //每次进来清空总页数
                    if(dataArray2.length%PageNo2.value==0)                    //判断总的页数
                    {
                        SumPage2=parseInt(dataArray2.length/PageNo2.value);
                    }
                    else
                    {
                        SumPage2=parseInt(dataArray2.length/PageNo2.value)+1
                    }
                    S12.appendChild(document.createTextNode(SumPage2));
                    var oTBody=document.createElement('tbody');               //创建tbody
                    oTBody.setAttribute('class','In-table');                   //定义class
                    InTb2.appendChild(oTBody);                                     //将创建的tbody添加入table
                    var html_c = '';

                    if(dataArray2==''){
                        html_c = "<div style='width:100%;'><span style='margin-left:20px;'>用户未发布任何微博</span></div>";
                        oTBody.rows[0].cells[0].innerHTML = html_c;
                    }else{

                        for(i=0;i<parseInt(PageNo2.value);i++)
                        {                                                          //循环打印数组值
                            oTBody.insertRow(i);
                            var name;
                            if (dataArray2[i].uname==''||dataArray2[i].uname=='unknown') {
                                name=dataArray2[i].uid;
                            }else {
                                name=dataArray2[i].uname;
                            };
                            html_c = '<div class="twr1">'+
                                '                        <p class="master">'+
                                '                            微博内容：'+
                                '                            <span class="master1">'+
                                dataArray2[i].text+
                                '                            </span>'+
                                '                        </p>'+
                                '                        <p class="time">'+
                                '                            <span class="time1">来自微博用户：</span>&nbsp;&nbsp;'+
                                '                            <a class="time2">'+name+'</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
                                '                            <span class="time3">发表于&nbsp;&nbsp;<i>'+
                                getLocalTime(dataArray2[i].timestamp)+'</i></span>'+
                                '                            <p><span class="time4" style="display: inline-block;">转发数（'+dataArray2[i].retweeted+'）</span>|&nbsp;'+
                                '                            <span class="time5">评论数（'+dataArray2[i].comment+'）</span>|&nbsp;'+
                                '                            <span class="time6">言论敏感度（'+dataArray2[i].sensitive+'）</span></p>'+
                                '                        </p>'+
                                '                    </div>';
                            oTBody.rows[i].insertCell(0);
                            oTBody.rows[i].cells[0].innerHTML = html_c;
                            if (dataArray2[i].sensitive_words_string==''){
                                null;
                            }else {
                                var _ci=dataArray2[i].sensitive_words_string.replace(/&/g,'');
                                for (var i=0;i<_ci.length;i++){
                                    var reg = new RegExp("(" + _ci[i] + ")", "g");
                                    $('.master1').html($('.master1').html().replace(reg,"<font color=red>$1</font>"));
                                }
                            }
                        }
                    }
                }
            }
            Nep2.onclick=function()
            {
                if(currentPage2<SumPage2)                                 //判断当前页数小于总页数
                {
                    InTb2.innerHTML='';
                    S12.innerHTML='';
                    if(dataArray2.length%PageNo2.value==0)
                    {
                        SumPage2=parseInt(dataArray2.length/PageNo2.value);
                    }
                    else
                    {
                        SumPage2=parseInt(dataArray2.length/PageNo2.value)+1
                    }
                    S12.appendChild(document.createTextNode(SumPage2));
                    S22.innerHTML='';
                    currentPage2=currentPage2+1;
                    S22.appendChild(document.createTextNode(currentPage2));
                    var oTBody=document.createElement('tbody');
                    oTBody.setAttribute('class','In-table');
                    InTb2.appendChild(oTBody);
                    var a;                                                 //定义变量a
                    a=PageNo2.value*(currentPage2-1);                       //a等于每页显示的行数乘以上一页数
                    var c;                                                  //定义变量c
                    if(dataArray2.length-a>=PageNo2.value)                  //判断下一页数组数据是否小于每页显示行数
                    {
                        c=PageNo2.value;
                    }
                    else
                    {
                        c=dataArray2.length-a;
                    }
                    for(i=0;i<c;i++)
                    {
                        oTBody.insertRow(i);
                        var name;
                        if (dataArray2[i+a].uname==''||dataArray2[i+a].uname=='unknown') {
                            name=dataArray2[i+a].uid;
                        }else {
                            name=dataArray2[i+a].uname;
                        };
                        oTBody.rows[i].insertCell(0);
                        html_c = '<div class="twr1">'+
                            '                        <p class="master">'+
                            '                            微博内容：'+
                            '                            <span class="master1">'+
                            dataArray2[i+a].text+
                            '                            </span>'+
                            '                        </p>'+
                            '                        <p class="time">'+
                            '                            <span class="time1">来自微博用户：</span>&nbsp;&nbsp;'+
                            '                            <a class="time2">'+name+'</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
                            '                            <span class="time3">发表于&nbsp;&nbsp;<i>'+
                            getLocalTime(dataArray2[i+a].timestamp)+'</i></span>'+
                            '                            <p><span class="time4" style="display: inline-block;">转发数（'+dataArray2[i+a].retweeted+'）</span>|&nbsp;'+
                            '                            <span class="time5">评论数（'+dataArray2[i+a].comment+'）</span>|&nbsp;'+
                            '                            <span class="time6">言论敏感度（'+dataArray2[i+a].sensitive+'）</span></p>'+
                            '                        </p>'+
                            '                    </div>';
                        oTBody.rows[i].cells[0].innerHTML = html_c;
                        //数组从第i+a开始取值
                        if (dataArray2[i+a].sensitive_words_string==''){
                            null;
                        }else {
                            var _ci=dataArray2[i+a].sensitive_words_string.replace(/&/g,'');
                            for (var i=0;i<_ci.length;i++){
                                var reg = new RegExp("(" + _ci[i] + ")", "g");
                                $('.master1').html($('.master1').html().replace(reg,"<font color=red>$1</font>"));
                            }
                        }
                    }
                }
            }

            Prp2.onclick=function()
            {
                if(currentPage2>1)                        //判断当前是否在第一页
                {
                    InTb2.innerHTML='';
                    S12.innerHTML='';
                    if(dataArray2.length%PageNo2.value==0)
                    {
                        SumPage2=parseInt(dataArray2.length/PageNo2.value);
                    }
                    else
                    {
                        SumPage2=parseInt(dataArray2.length/PageNo2.value)+1
                    }
                    S12.appendChild(document.createTextNode(SumPage2));
                    S22.innerHTML='';
                    currentPage2=currentPage2-1;
                    S22.appendChild(document.createTextNode(currentPage2));
                    var oTBody=document.createElement('tbody');
                    oTBody.setAttribute('class','In-table');
                    InTb2.appendChild(oTBody);
                    var a;
                    a=PageNo2.value*(currentPage2-1);
                    for(i=0;i<parseInt(PageNo2.value);i++)
                    {
                        oTBody.insertRow(i);
                        var name;
                        if (dataArray2[i+a].uname==''||dataArray2[i].uname=='unknown') {
                            name=dataArray2[i+a].uid;
                        }else {
                            name=dataArray2[i+a].uname;
                        };
                        oTBody.rows[i].insertCell(0);
                        html_c = '<div class="twr1">'+
                            '                        <p class="master">'+
                            '                            微博内容：'+
                            '                            <span class="master1">'+
                            dataArray2[i+a].text+
                            '                            </span>'+
                            '                        </p>'+
                            '                        <p class="time">'+
                            '                            <span class="time1">来自微博用户：</span>&nbsp;&nbsp;'+
                            '                            <a class="time2">'+name+'</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
                            '                            <span class="time3">发表于&nbsp;&nbsp;<i>'+
                            getLocalTime(dataArray2[i+a].timestamp)+'</i></span>'+
                            '                            <p><span class="time4" style="display: inline-block;">转发数（'+dataArray2[i+a].retweeted+'）</span>|&nbsp;'+
                            '                            <span class="time5">评论数（'+dataArray2[i+a].comment+'）</span>|&nbsp;'+
                            '                            <span class="time6">言论敏感度（'+dataArray2[i+a].sensitive+'）</span></p>'+
                            '                        </p>'+
                            '                    </div>';
                        oTBody.rows[i].cells[0].innerHTML = html_c;
                        if (dataArray2[i+a].sensitive_words_string==''){
                            null;
                        }else {
                            var _ci=dataArray2[i+a].sensitive_words_string.replace(/&/g,'');
                            for (var i=0;i<_ci.length;i++){
                                var reg = new RegExp("(" + _ci[i] + ")", "g");
                                $('.master1').html($('.master1').html().replace(reg,"<font color=red>$1</font>"));
                            }
                        }
                    }
                }
            }

            Lp2.onclick=function()
            {
                InTb2.innerHTML='';
                S12.innerHTML='';
                if(dataArray2.length%PageNo2.value==0)
                {
                    SumPage2=parseInt(dataArray2.length/PageNo2.value);
                }
                else
                {
                    SumPage2=parseInt(dataArray2.length/PageNo2.value)+1
                }
                S12.appendChild(document.createTextNode(SumPage2));
                S22.innerHTML='';
                currentPage2=SumPage2;
                S22.appendChild(document.createTextNode(currentPage2));
                var oTBody=document.createElement('tbody');
                oTBody.setAttribute('class','In-table');
                InTb2.appendChild(oTBody);
                var a;
                a=PageNo2.value*(currentPage2-1);
                var c;
                if(dataArray2.length-a>=PageNo2.value)
                {
                    c=PageNo2.value;
                }
                else
                {
                    c=dataArray2.length-a;
                }
                for(i=0;i<c;i++)
                {
                    oTBody.insertRow(i);
                    var name;
                    if (dataArray2[i+a].uname==''||dataArray2[i+a].uname=='unknown') {
                        name=dataArray2[i+a].uid;
                    }else {
                        name=dataArray2[i+a].uname;
                    };
                    oTBody.rows[i].insertCell(0);
                    html_c = '<div class="twr1">'+
                        '                        <p class="master">'+
                        '                            微博内容：'+
                        '                            <span class="master1">'+
                        dataArray2[i+a].text+
                        '                            </span>'+
                        '                        </p>'+
                        '                        <p class="time">'+
                        '                            <span class="time1">来自微博用户：</span>&nbsp;&nbsp;'+
                        '                            <a class="time2">'+name+'</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
                        '                            <span class="time3">发表于&nbsp;&nbsp;<i>'+
                        getLocalTime(dataArray2[i+a].timestamp)+'</i></span>'+
                        '                            <p><span class="time4" style="display: inline-block;">转发数（'+dataArray2[i+a].retweeted+'）</span>|&nbsp;'+
                        '                            <span class="time5">评论数（'+dataArray2[i+a].comment+'）</span>|&nbsp;'+
                        '                            <span class="time6">言论敏感度（'+dataArray2[i+a].sensitive+'）</span></p>'+
                        '                        </p>'+
                        '                    </div>';
                    oTBody.rows[i].cells[0].innerHTML = html_c;
                    if (dataArray2[i+a].sensitive_words_string==''){
                        null;
                    }else {
                        var _ci=dataArray2[i+a].sensitive_words_string.replace(/&/g,'');
                        for (var i=0;i<_ci.length;i++){
                            var reg = new RegExp("(" + _ci[i] + ")", "g");
                            $('.master1').html($('.master1').html().replace(reg,"<font color=red>$1</font>"));
                        }
                    }
                }
            }

        }
    };
    weibo();
};
wenbenduibi();