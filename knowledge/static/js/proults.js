/**
 * Created by Administrator on 2016/11/30.
 */
//------------群体详情--
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
var url='/group/group_node_filter/?group_name='+groupname;

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
var url2='/group/group_map_filter/?group_name='+groupname;
var friend='friend',relative='relative', colleague='colleague', user_tag='user_tag',
    join='join',pusher='pusher', maker='maker',other_rel='other_relationship',
    node_type;
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
$("#user_tag").change(function () {
    if($("#user_tag").prop("checked")) {
        //选中时的操作
        user_tag='user_tag';
    } else {
        user_tag='';
    }
});
$("#join").change(function () {
    if($("#join").prop("checked")) {
        //选中时的操作
        join='join';
    } else {
        join=' ';
    }
});
$("#pusher").change(function () {
    if($("#pusher").prop("checked")) {
        //选中时的操作
        pusher='pusher';
    } else {
        pusher=' ';
    }
});
$("#make").change(function () {
    if($("#make").prop("checked")) {
        //选中时的操作
        maker='maker';
    } else {
        maker=' ';
    }
});
$("#other").change(function () {
    if($("#other").prop("checked")) {
        //选中时的操作
        other_rel='other_relationship';
    } else {
        other_rel=' ';
    }
});

var layer;
function nums() {
    if ($("#event").is(":checked")){node_type='Event';}
    if ($("#user").is(":checked")){node_type='User';}
    if ($("#event").is(":checked")&&$("#user").is(":checked")){node_type='';}
    if($('#zero').is(':checked')) { layer=0; }
    if($('#onecg').is(':checked')) { layer=1; }
    if($('#twocg').is(':checked')) { layer=2; }
    url = '/group/group_node_filter/?group_name='+groupname+'&node_type='+node_type+'&relation_type='+friend+','+relative+
        ','+colleague+','+user_tag+','+join+','+pusher+
        ','+maker+','+other_rel+'&layer='+layer;
    url2 = '/group/group_map_filter/?group_name='+groupname+'&node_type='+node_type+'&relation_type='+friend+','+relative+
        ','+colleague+','+user_tag+','+join+','+pusher+
        ','+maker+','+other_rel+'&layer='+layer;
    peo.call_request(url,events);
    peo2.call_request(url2,ditu);
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
        if (!json.node.group){
            $('#eventimg').html('<p style="text-align: center;height: 500px;line-height: 500px;">无新数据更新</p>');
            $("#container .present .pretwo .pretwomd").html(0);
        }else {
            var node_value=[],link_value=[],g_down_nums=0;
            for (var key in json.node.uid){
                g_down_nums++;
                var num1=Math.random()*(-1000-700)+1000;
                var num2=Math.random()*(-1000-700)+1000;
                var name;
                if (json.node.uid[key]==''||json.node.uid[key]=="unknown") {
                    name=key;
                }else {
                    name=json.node.uid[key];
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
                                color: '#ffa500'
                            }
                        }
                    }
                );
            };
            $("#container .present .pretwo .pretwomd").html(g_down_nums);
            for (var key2 in json.node.group){
                var num3=Math.random()*(-1000-700)+1000;
                var num4=Math.random()*(-1000-700)+1000;
                var name2;
                if (json.node.group[key2]==''||json.node.group[key2]=="unknown") {
                    name2=key2;
                }else {
                    name2=json.node.group[key2];
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
                                color: 'blue'
                            }
                        }
                    }
                );
            };
            $.each(json.result_relation,function (index,item) {
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
            myChart.on('click', function (params) {
                if (typeof params.seriesIndex != 'undefined') {
                    if (params.color=='#ffa500'){
                        window.open('/index/person/?p_uid='+params.data.id);
                    }else {
                        window.open('/group/detail/?group_name='+params.name);
                    }

                }
            });
        }

    });
}
events();

//地图配置，地址请求
function ditu() {
    var myChart = echarts.init(document.getElementById('placeimg'));
    $.getJSON(url2, function (data3) {
        var data2=eval(data3);
        if (data2.length==0){
            $('#placeimg').html('<p style="text-align: center;height: 500px;line-height: 500px;">无新数据更新</p>');
        }else {
            var data = [];
            $.each(data2, function (index, item) {
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
                        name: 'TOP 20',
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
                    var nums_length;
                    if (mainSeries.dataIndex.length>=5){
                        nums_length=5;
                    }else {
                        nums_length=mainSeries.dataIndex.length;
                    }
                    for (var i = 0; i < nums_length; i++) {
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
                $('#placeimg').html('<p style="text-align: center;height: 500px;line-height: 500px;">无新数据更新</p>');
            }
        }

    });
};
ditu();

Array.prototype.removeByValue = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
};

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
        $('#container #similar .definite .deftwo .left').unbind("click");
        $('#container #similar .definite .deftwo .right').unbind("click");
        $("#run").empty();
        var data=eval(data);
        var str='';
        if (data){
            $.each(data,function (index,item) {
                var influe,name,mingan,tag,photo,fensinum;
                var fensi=Math.round((item.fansnum /10000) * 100) / 100;
                if (fensi.toString().length>6){
                    fensinum=fensi.toFixed(2).substr(0,6)+'万';
                }else {
                    fensinum=fensi.toFixed(2)+'万';
                };
                if (item.influence==''||item.influence=='unknown'){
                    influe=0;
                }else {
                    var yingxiang=Math.round((item.influence /10000) * 100) / 100;
                    if (yingxiang.toString().length>6){
                        influe=yingxiang.toFixed(2).substr(0,6)+'万';
                    }else {
                        influe=yingxiang.toFixed(2)+'万';
                    };
                };
                if (item.uname==''||item.uname=='unknown'){
                    name=item.uid;
                }else {
                    name=item.uname;
                };
                var huoyue=item.activeness.toFixed(0);
                if (item.sensitive==''||item.sensitive=='unknown'){
                    mingan=0;
                }else {
                    mingan=item.sensitive.toFixed(0);
                };
                if (item.user_tag==''||item.user_tag=='unknown'||item.user_tag=='null'){
                    tag='无';
                }else {
                    tag=item.user_tag;
                };
                if (item.photo_url==''||item.photo_url=='unknown'){
                    photo='/static/image/pangzi.png';
                }else {
                    photo=item.photo_url;
                };
                str+='<div class="play">'+
                    '<div class="p_top" style="width: 100%"><img class="play2" src="'+photo+'" alt="">'+
                    '<img class=\'xin\' style="margin: -24px 0 0 100px" src="/static/image/heart.png">' +
                    '<span class="xingming" title="'+name+'" style="color: #000;display: block;text-align:center;' +
                    'width:100px;white-space:nowrap;margin: -13px auto 0;overflow: hidden;text-overflow: ellipsis">'+name+'</span>'+
                    '</div>'+
                    '<div class="play23" style="width: 110px;text-align: left;float: left">'+
                    '<a class="renzh1">身&nbsp;&nbsp;&nbsp;份:<span title="'+item.domain+'" class="renzh11">'+item.domain+'</span></a>'+
                    '<a class="renzh2">话&nbsp;&nbsp;&nbsp;题:<span title="'+item.topic_string.replace(/&/g,'  ')+'" class="renzh22">'+item.topic_string.replace(/&/g,'  ')+'</span></a>'+
                    '</div>'+
                    '<div style="float: left;width: 110px;margin-left: 10px">' +
                    '<div class="play3" style="text-align: left">'+
                    '<a class="bus1">业务标签：</a>'+
                    '<a class="bus2" title="'+tag+'">'+tag+'</a>'+
                    '</div>'+
                    '<div class="play1">'+
                    '<div class="p11">'+
                    '<span id="uid" style="display: none">'+item.uid+'</span>'+
                    '</div>'+
                    '<div class="p22" style="float:left;margin-top: -5px">'+
                    '<div><img src="/static/image/fensishu.png"'+
                    'title=\'粉丝数\'><!--'+
                    '--><span class="difang" style="display: inline-block;width:50.06px;">'+fensinum+'</span>'+
                    '<img src="/static/image/mingan.png" title="敏感度">'+
                    '<span class="mingan">'+mingan+'</span></div>'+
                    '<div><img src="/static/image/influence.png" title="影响力">'+
                    '<span class="influence" style="display: inline-block;width:50.06px;">'+influe+'</span>'+
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
                    // '<div class="play5" type="button" data-toggle="modal">'+
                    // '<a>加入群体探索</a>'+
                    // '</div>'+
                    '</div>';
            });
            $("#run").append(str);
            var step=0;
            $('#run').width((data.length)*255);
            $('#container #similar .definite .deftwo .right').on('click',function () {
                step++;
                var plays=$("#run");
                walk=(-1020)*step;
                $(plays).css({
                    "-webkit-transform":"translateX("+walk+"px)",
                    "-moz-transform":"translateX("+walk+"px)",
                    "-ms-transform":"translateX("+walk+"px)",
                    "-o-transform":"translateX("+walk+"px)",
                    "transform":"translateX("+walk+"px)",
                });
                if (step >= data.length/4){
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
            });
            $('#container #similar .definite .deftwo .left').on('click',function () {
                step--;
                if (step < 0){
                    alert('已经是第一页了~~');
                    step=0;
                }else {
                    var plays=$("#run");
                    walk=(-1020)*step;
                    $(plays).css({
                        "-webkit-transform":"translateX("+walk+"px)",
                        "-moz-transform":"translateX("+walk+"px)",
                        "-ms-transform":"translateX("+walk+"px)",
                        "-o-transform":"translateX("+walk+"px)",
                        "transform":"translateX("+walk+"px)",
                    });
                }
            });
            $.each( $("#container #similar .definite .deftwo .xingming"),function(index,item){
                $(item).on('click',function () {
                    var uid=$(this).parents('.play').find('#uid').html();
                    console.log('/index/person/?p_uid='+uid)
                    window.open('/index/person/?p_uid='+uid);
                });
            });
        }else {
            $("#run").html('<p style="width: 1050px;text-align: center;height: 190px;line-height: 190px;">无新数据更新</p>');
        }

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
                    $(this).parent('.play').find('.xingming').css({color:'red'});
                    $(this).find('a').text('取消群体探索');
                    changecolorq=2;
                    $('#join4').modal("show");
                } else {
                    $(this).parent('.play').find('.xingming').css({color:'#000'});
                    $(this).find('a').text('加入群体探索');
                    changecolorq=1;
                }
            });
        });
        var heart=$(".play .xin");
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
        var url = '/group/user_in_group/?group_name='+groupname+'&sort_flag='+point;
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
    $('#container #people .peotwo .peotwo2 .left').unbind("click");
    $('#container #people .peotwo .peotwo2 .right').unbind("click");
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
    var theme_ids=[];
    function territory(data) {
        $("#run2").empty();
        var data=eval(data);
        var str='';
        if (!data==[]){
            $("#run2").html('<p style="width: 1050px;text-align: center;height: 190px;line-height: 190px;">无新数据更新</p>');
        }else {
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
            $("#run2").append(str);
            var step=0;
            $('#run2').width((data.length)*255);
            $('#container #people .peotwo .peotwo2 .right').on('click',function () {
                step++;
                var plays=$("#run");
                walk=(-1020)*step;
                $(plays).css({
                    "-webkit-transform":"translateX("+walk+"px)",
                    "-moz-transform":"translateX("+walk+"px)",
                    "-ms-transform":"translateX("+walk+"px)",
                    "-o-transform":"translateX("+walk+"px)",
                    "transform":"translateX("+walk+"px)",
                });
                if (step >= data.length/4){
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
            });
            $('#container #people .peotwo .peotwo2 .left').on('click',function () {
                step--;
                if (step < 0){
                    alert('已经是第一页了~~');
                    step=0;
                }else {
                    var plays=$("#run");
                    walk=(-1020)*step;
                    $(plays).css({
                        "-webkit-transform":"translateX("+walk+"px)",
                        "-moz-transform":"translateX("+walk+"px)",
                        "-ms-transform":"translateX("+walk+"px)",
                        "-o-transform":"translateX("+walk+"px)",
                        "transform":"translateX("+walk+"px)",
                    });
                }
            });
        }

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
                    $(this).find('a').text('取消专题');
                    theme_ids.push($(this).siblings('.play1').find('.xingming').html());
                    changecolorq=2;
                    $('#join4').modal("show");
                } else {
                    $(this).parent('.play').css({backgroundColor:'#d2dcf7'});
                    $(this).find('a').text('加入专题');
                    var $a = $(this).siblings('.play1').find('.xingming').html();
                    theme_ids.removeByValue($a);
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
        $.each($('#people .xingming'),function(index,item){
            $(item).on('click',function(){
                window.open('/index/search_result/?t_uid='+$(this).html());
            })
        });
    };
    var include=new include();
    function nums() {
        var point;
        if($('#fasheng2').is(':checked')) { point='start_ts'; };
        if($('#canyu2').is(':checked')) { point='uid_counts'; };
        if($('#redu2').is(':checked')) { point='weibo_counts'; };
        var url = '/group/group_detail/?group_name='+groupname+'&sort_flag='+point;
        include.call_request(url,territory);
    }
    $.each($("#container #people .peotwo .peotwo1 .radio input"),function (index,item) {
        $(item).on('click',function () {
            nums();
        });
    });
    nums();
};
guanlianshijian();
