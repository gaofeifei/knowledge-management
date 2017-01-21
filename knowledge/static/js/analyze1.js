/**
 * Created by Administrator on 2016/11/24.
 */
var theme_list=[];
var thname1,thname2,m,n,node_ids=[];
function chakan(value) {
    thname1=value;
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
            $("#container .choose1 .menu #condet .condet1").after('<span class="condet2"><i>'+item[0]+'</i><b class="icon icon-remove det"></b></span>')
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
                    aa=1;
                }
            });
        })

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
        window.open("/theme/detail/");
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
    function things(data) {
        var data=eval(data);
        var str='';
        function getLocalTime(nS) {
            return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,18);
        };
        var weizhi,biaoqian,shuoming,photo,cwidth;
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
                '<div class="play1">'+
                '<div class="p11">'+
                '<span class="xingming" style="color: #000;font-weight: 900;font-size: 18px">'+item.name+'</span><!--'+
                '--><img src="/static/image/dingwei.png" title="位置"><!--'+
                '--><span class="difang" style="font-size: 8px">'+weizhi+'</span><!--'+
                '--><img class="xin" src="/static/image/heart.png" alt="">'+
                '</div>'+
                '<div class="p22">'+
                '<span class="fasheng" style="font-weight: bold">发生时间：</span>'+
                '<span class="riqi">'+getLocalTime(item.start_ts)+'</span>'+
                '</div>'+
                '</div>'+
                '<img class="play2" src="'+photo+'" alt="">'+
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
        // if (data.length% 2 == 0){
        //     cwidth=(data.length*490)/4;
        // }else {
        //     cwidth=(data.length*490)/4 + 490;
        // }

        // $("#container .associat .assright .assright2 #case #crmid").width(cwidth);
        $(".xinzeng .sjmr .sjmr1 #case #crmid #run").append(str);
        //卡片效果
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
    };
    var touch=new touch();
    function nums() {
        var url = '/theme/theme_detail/?theme_name='+thname2;
        touch.call_request(url,things);
    }
    nums();
};

function yonghushijian() {
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
        var json=eval(data);
        if (json=='node does not exist'){
            alert('无数据~~');
        }else {
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
        var data=eval(data);
        if (data=='node does not exist'){
            alert('无数据~~');
        }else {
            $(".xinzeng #shijian2 .bag").show(20);
            var str='';
            function getLocalTime(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,18);
            };
            var weizhi,biaoqian,shuoming,photo,cwidth;
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
                    '<span id="uid" style="display:none;">'+item.en_name+'</span>'+
                    '<div class="play1">'+
                    '<div class="p11">'+
                    '<span class="xingming" style="color: #000;font-weight: 900;font-size: 18px">'+item.name+'</span><!--'+
                    '--><img src="/static/image/dingwei.png" title="位置"><!--'+
                    '--><span class="difang" style="font-size: 8px">'+weizhi+'</span><!--'+
                    '--><img class="xin" src="/static/image/heart.png" alt="">'+
                    '</div>'+
                    '<div class="p22">'+
                    '<span class="fasheng" style="font-weight: bold">发生时间：</span>'+
                    '<span class="riqi">'+getLocalTime(item.start_ts)+'</span>'+
                    '</div>'+
                    '</div>'+
                    '<img class="play2" src="'+photo+'" alt="">'+
                    '<div class="play3" style="display: inline-block;margin-top: 10px;vertical-align:bottom;">'+
                    '<a class="bus1">业务标签：</a>'+
                    '<a class="bus2">'+biaoqian+'</a>'+
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
            // if (data.length% 2 == 0){
            //     cwidth=(data.length*490)/4;
            // }else {
            //     cwidth=(data.length*490)/4 + 490;
            // }

            // $("#container .associat .assright .assright2 #case #crmid").width(cwidth);
            $(".xinzeng .sjmr .sjmr1 #case #crmid #run12").append(str);
            //卡片效果

        }
        //卡片效果
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
                    $(this).parent('.play').css({backgroundColor:'#09F'});
                    changecolor=2;
                    node_ids.push($(this).siblings('#uid').html());
                    $(this).find('a').text('取消专题');
                    $('#join2').modal("show");
                } else {
                    $(this).parent('.play').css({backgroundColor:'#d2dcf7'});
                    changecolor=1;
                    var $a = $(this).siblings('#uid').html();
                    node_ids.removeByValue($a);
                    $(this).find('a').text('加入专题');
                }
                console.log(node_ids);
            });
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
        s=$(" #shijian2 .sjt .sjt1").val();
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


};
yonghushijian();

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