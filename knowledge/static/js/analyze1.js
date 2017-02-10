/**
 * Created by Administrator on 2016/11/24.
 */
Array.prototype.removeByValue = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
};
var theme_list=[];
var thname1,thname2,m=0,n=0,node_ids=[],t_name;
function chakan(value) {
    thname1=value;
    t_name=thname1;
    m=1;
};
function bianji(value) {
    thname2=value;
    n=1;
};
function zong() {
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
        var anlname=[],anlnum=[];
        $.each(data,function (index,item) {
            $("#container .choose1 .menu form #list").append('<option value="'+item[0]+'">'+item[0]+'</option>');
            $(".xinzeng #list1").append('<option value="'+item[0]+'">'+item[0]+'</option>');
            $("#container .choose1 .menu #condet .condet1").after('<span class="condet2"><i>'+item[0]+'</i></span>')
            anlname.push(item[0]);
            anlnum.push(item[1]);
        });

        var condet2ss=$('#container .choose1 .menu #condet .condet2');
        $.each(condet2ss,function (index,item) {
            var aa=1;
            $(item).on('click',function () {
                if (aa==1){
                    $(this).css({backgroundColor:'rgb(76, 174, 76)'});
                    aa=2;
                    theme_list.push($(this).find('i').html());
                }else {
                    $(this).css({backgroundColor:'#0099FF'});
                    var $a = $(this).find('i').html();
                    theme_list.removeByValue($a);
                    aa=1;
                }
            });
        });

        // 路径配置
        require.config({
            paths: {
                echarts: 'http://echarts.baidu.com/build/dist'
            }
        });
        //第一个图表
        require(
            [
                'echarts',
                'echarts/chart/bar' // 使用柱状图就加载bar模块，按需加载
            ],
            function (ec) {
                // 基于准备好的dom，初始化echarts图表
                var myChart = ec.init(document.getElementById('spread'));
                var option = {
                    // title: {
                    //     x: 'center',
                    //     text: '专题名称',
                        // subtext: 'Rainbow bar example',
                        // link: 'http://echarts.baidu.com/doc/example.html'
                    // },
                    tooltip: {
                        trigger: 'item'
                    },
                    grid: {
                        borderWidth: 0,
                        y: 80,
                        y2: 60
                    },
                    xAxis: [
                        {
                            type: 'category',
                            show: false,
                            // data: ['Line', 'Bar', 'Scatter', 'K', 'Pie', 'Radar', 'Chord', 'Force', 'Map', 'Gauge', 'Funnel']
                            data:anlname,
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            show: false
                        }
                    ],
                    series: [
                        {
                            // name: 'ECharts例子个数统计',
                            type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: function(params) {
                                        // build a color map as your need.
                                        var colorList = [
                                            '#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
                                            '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
                                            '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                        ];
                                        return colorList[params.dataIndex]
                                    },
                                    label: {
                                        show: true,
                                        position: 'top',
                                        formatter: '{b}\n{c}'
                                    }
                                }
                            },
                            // data: [12,21,10,4,12,5,6,5,25,23,7],
                            data:anlnum,
                        }
                    ]
                };

                // 为echarts对象加载数据
                myChart.setOption(option);
            }
        );


    }

    var place=new place();
    function nums() {
        var url = '/theme/overview/';
        place.call_request(url,territory);
    }
    nums();
};
zong();

$("#container .choose1 .menu .msure").on('click',function () {
    if (!m==1){
        $("#join99").modal("show");
    }else {
        // window.open("/theme/detail/?theme_explanation="+thname1);
        window.open("/theme/detail/?t_name="+t_name);
    }
});
$("#container .choose1 .menu .compare").on('click',function () {
    if (!m==1){
        $("#join99").modal("show");
    }else {
        $('#condet').show(30);
    }
});
function zhutibianjibiaoge() {
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
        $('#sheet2').bootstrapTable('load',data);
        $('#sheet2').bootstrapTable({
            //url: influ_url,
            data:data,
            search: true,//是否搜索
            pagination: true,//是否分页
            pageSize: 2,//单页记录数
            pageList: [2, 4, 8, 20],//分页步进值
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
                    title: "事件名称",//标题
                    field: "",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        return row[1];
                    },
                },
                {
                    title: "删除",//标题
                    field: "",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        return "<a class='delt' data-toggle='modal'>删除</a>";
                    },
                },

            ],
            onClickRow: function (row, tr) {
                if ($(tr.context).index()==2) {
                    del_eventuid=row[0];
                    $('#del_ject').modal("show");
                }
            }
        });
    };
    var place=new place();
    function nums() {
        var url = '/theme/event_in_theme/?theme_name='+thname2;
        // var url = '/theme/event_in_theme/';
        place.call_request(url,territory);
    }
    $(".xinzeng .add99").on('click',function () {
        $('#site2').empty();
        $('#container .xinzeng .instr #case #run').empty();
        if (!n==1){
            $("#join99").modal("show");
        }else {
            nums();
            biaogeshijian();
            $('.instr').show(20);
        };
    });
};
zhutibianjibiaoge();

function biaogeshijian() {
    $('#container .xinzeng .instr .sjmr .sjmr1 .left').unbind("click");
    $('#container .xinzeng .instr .sjmr .sjmr1 .right').unbind("click");
    function touch() {
        //this.ajax_method='GET'; // body...
    }
    touch.prototype= {
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
    var cwidth;
    function things(data) {
        var data=eval(data);
        cwidth=data.length;
        var str='';
        function getLocalTime(nS) {
            return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,10);
        };
        var weizhi,biaoqian,shuoming,photo;
        $.each(data,function (index,item) {
            if (item.location=='null'){
                weizhi='未知';
            }else {
                weizhi=item.location;
            };
            if (item.photo_url=='null'){
                photo='/static/image/xuyuyu.png';
            }else {
                photo=item.photo_url;
            };
            if (item.user_tag=='null'){
                biaoqian='暂无';
            }else {
                biaoqian=item.user_tag;
            };
            if (item.description=='null'){
                shuoming ='暂无数据';
            }else {
                shuoming=item.user_tag;
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
                '--><span class="weiboshu" style="font-size: 8px">'+item.weibo_counts+'</span></div>'+
                '<div style="text-align: center"><img class="canyuren" src="/static/image/canyuren.png" title="参与人数"><span style="font-size: 8px">'+item.uid_counts+'</span></div></div></div>'+
                '<img class="play2" style="margin-top: -50px" src="/static/image/xuyuyu.png" alt=""></div>'+
                '<div class="play3" style="width: 103px;display: inline-block;margin: 10px 0 0 39px;vertical-align:bottom;">'+
                '<a class="bus1">业务标签：</a>'+
                '<a class="bus2" title="'+biaoqian+'">'+biaoqian+'</a>'+
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
        $(".xinzeng .sjmr .sjmr1 #case #crmid #run").append(str);
    //卡片效果
        var heart=$(".xin");
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
        $.each($('.xingming'),function(index,item){
            $(item).on('click',function(){
                window.open('/index/search_result/?t_uid='+$(this).html());
            })
        });
    };

    var step=0;
    var shang=Math.floor(cwidth/6);
    var yu=cwidth%6;
    $('#container .xinzeng .instr .sjmr1 #case #crmid #run').width((3*shang+yu)*245);
    $('#container .xinzeng .instr .sjmr .sjmr1 .right').on('click',function () {
        if (cwidth<=6){
            alert('没有其他卡片内容了~~');
        }else {
            step++;
            var plays=$("#container .xinzeng .instr .sjmr1 #case #crmid #run");
            walk=(-735)*step;
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
    $('#container .xinzeng .instr .sjmr .sjmr1 .left').on('click',function () {
        if (cwidth<=6){
            alert('没有其他卡片内容了~~');
        }else {
            step--;
            if (step < 0){
                alert('已经是第一页了~~');
                step=0;
            }else {
                var plays=$("#container .xinzeng .instr .sjmr1 #case #crmid #run");
                walk=(-735)*step;
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
    var touch=new touch();
    function nums() {
        var url = '/theme/theme_detail/?theme_name='+thname2;
        touch.call_request(url,things);
    }
    nums();
};

//--------用户事件
~function () {
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
        if (data=='node does not exist'){
            alert('无数据~~');
        }else {
            var json=eval(data);
            var myChart = echarts.init(document.getElementById('site'));
            myChart.showLoading();
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
                        data: node_value,
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
        }

    }
    function place2() {
        //this.ajax_method='GET'; // body...
    }
    place2.prototype= {
        call_request:function(url2,callback) {
            $.ajax({
                url: url2,
                type: 'GET',
                dataType: 'json',
                async: true,
                success:callback
            });
        },
    };
    function territory2(data) {
        $('#container .xinzeng #shijian2 .bag .sjmr .sjmr1 .left').unbind("click");
        $('#container .xinzeng #shijian2 .bag .sjmr .sjmr1 .right').unbind("click");
        if (data=='node does not exist'){
            alert('无数据~~');
        }else {
            var data=eval(data);
            $(".xinzeng #shijian2 .bag").show(20);
            var str='';
            function getLocalTime(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,10);
            };
            var weizhi,biaoqian,shuoming,photo;
            $.each(data,function (index,item) {
                if (item.location=='null'){
                    weizhi='未知';
                }else {
                    weizhi=item.location;
                };
                if (item.photo_url=='null'){
                    photo='/static/image/xuyuyu.png';
                }else {
                    photo=item.photo_url;
                };
                if (item.user_tag=='null'){
                    biaoqian='暂无';
                }else {
                    biaoqian=item.user_tag;
                };
                if (item.description=='null'){
                    shuoming ='暂无数据';
                }else {
                    shuoming=item.user_tag;
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
                    '--><span class="weiboshu" style="font-size: 8px">'+item.weibo_counts+'</span></div>'+
                    '<div style="text-align: center"><img class="canyuren" src="/static/image/canyuren.png" title="参与人数"><span style="font-size: 8px">'+item.uid_counts+'</span></div></div></div>'+
                    '<img class="play2" style="margin-top: -50px" src="/static/image/xuyuyu.png" alt=""></div>'+
                    '<div class="play3" style="width: 103px;display: inline-block;margin: 10px 0 0 39px;vertical-align:bottom;">'+
                    '<a class="bus1">业务标签：</a>'+
                    '<a class="bus2" title="'+biaoqian+'">'+biaoqian+'</a>'+
                    '</div>'+
                    '<div class="play4">'+
                    '<p class="shuoming">'+
                    shuoming+
                    '</p>'+
                    '</div>'+
                    '<div class="play5" type="button" data-toggle="modal">'+
                    '<a>加入专题</a>'+
                    '</div>'+
                    '</div>';
            });
            $(".xinzeng .sjmr .sjmr1 #case12 #crmid12 #run12").append(str);
            var step=0;
            var shang=Math.floor(data.length/6);
            var yu=data.length%6;
            $('#container .xinzeng #shijian2 .bag #case12 #crmid12 #run12').width((3*shang+yu)*245);
            $('#container .xinzeng #shijian2 .bag .sjmr .sjmr1 .right').on('click',function () {
                if (data.length<=6){
                    alert('没有其他卡片内容了~~');
                }else {
                    step++;
                    var plays=$("#container .xinzeng #shijian2 .sjmr1 #case12 #crmid12 #run12");
                    walk=(-735)*step;
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
            $('#container .xinzeng #shijian2 .bag .sjmr .sjmr1 .left').on('click',function () {
                if (data.length<=6){
                    alert('没有其他卡片内容了~~');
                }else {
                    step--;
                    if (step < 0){
                        alert('已经是第一页了~~');
                        step=0;
                    }else {
                        var plays=$("#container .xinzeng #shijian2 .sjmr1 #case12 #crmid12 #run12");
                        walk=(-735)*step;
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
        }
        //卡片效果
        var heart=$(".play .xin");
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
            var changecolor=1;
            $(item).find(".play5").on('click',function(){
                if (changecolor==1) {
                    $(this).parent('.play').find('.xingming').css({color:'red'});
                    changecolor=2;
                    node_ids.push($(this).siblings('#uid').html());
                    $(this).find('a').text('取消专题');
                    $('#join2').modal("show");
                } else {
                    $(this).parent('.play').find('.xingming').css({color:'#fff'});
                    changecolor=1;
                    var $a = $(this).siblings('#uid').html();
                    node_ids.removeByValue($a);
                    $(this).find('a').text('加入专题');
                }
                // console.log(node_ids);
            });
        });
        $.each($('.xinzeng .sjmr .sjmr1 #case12 #crmid12 #run12 .xingming'),function(index,item){
            $(item).on('click',function(){
                window.open('/index/search_result/?t_uid='+$(this).html());
            })
        });


    };
    var place=new place();
    var place2=new place2();
    function nums(name) {
        var url = '/theme/search_related_event/?item='+name;
        place.call_request(url,territory);
    };
    function nums2(name,maths) {
        var url2 = '/theme/search_related_event_card/?item='+name+'&layer='+maths;
        place2.call_request(url2,territory2);
    };
    var maths='all',s;
    $("#shijian2 .sjt .sjt2").on('click',function () {
        $('#site').empty();
        $('#container .xinzeng #shijian2 #site').empty();
        $('#container .xinzeng #shijian2 .bag #case12 #crmid12 #run12').empty();
        s=$("#shijian2 .sjt .sjt1").val();
        if (!s==''){
            nums(s);
            nums2(s,maths);
        }else {
            $('#join3').modal("show");
        };

    });
    $.each($("#shijian2 .bag .sjmr1 .direct1 input"),function (index,item) {
        $(item).on('click',function () {
            if (index==0){
                maths=1;
                nums2(s,maths);
            }else if (index==1){
                maths=2;
                nums2(s,maths);
            }else {
                maths='all';
                nums2(s,maths);
            }
        });

    });
}();

var del_eventuid;
function delete_yes() {
    var del_eventurl='/theme/del_event_in_theme/?theme_name='+thname2+'&event_id='+del_eventuid;
    $.ajax({
        url: del_eventurl,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:del_eventsure
    });
    function del_eventsure(data) {
        var data=eval(data);
        if (data=='true'){
            $("#del_cg").modal("show");
        }else {
            $("#del_sb").modal("show");
        }
    }
}


function theme_add() {
    var node_ids2=node_ids.join(',');
    var theme_addurl='/theme/create_relation/?node1_id='+node_ids2+'&node2_id='+thname2;
    $.ajax({
        url: theme_addurl,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:theme_join
    });
    function theme_join(data) {
        var data=eval(data);
        if (data==2){
            $('#chengong').find('p').text('添加成功');
            $('#chengong').modal("show");
        }else {
            $('#shibai').find('p').text('添加失败');
            $('#shibai').modal("show");
        }
    }
}

Array.prototype.removeByValue = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}