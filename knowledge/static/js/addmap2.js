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
        // console.log(json)
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


//添加节点中的----事件

var lx;
function check8(value) {
    lx=value;
};
function jiedianshijian() {
    //获取数据，准备传送
    //------------
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
    function event(data) {
        var data=eval(data);
        if (data=='1'){
            alert('创建成功');
        }else {
            alert('创建失败');
        }
    }
    var place=new place();
    function nums(sjmc,sjlx,timefrom,timeto,timestamp) {
        var url = '/construction/event_node_create/?event_name='+sjmc+'&event_type='+lx+
            '&start_time='+timefrom+'&end_time='+timeto+'&upload_time='+timestamp;
        place.call_request(url,event);
    }

    $("#container .conright .things .tsrg .tsrg3").on('click',function () {
        var sjmc=$("#container .conright .things .tslf .tslf2").val();
        var sjlx=lx;
        var start = $('#container .things .tsrg .tsrg2 .start').val();
        var end = $('#container .things .tsrg .tsrg2 .end').val();
        var timefrom = Date.parse(new Date(start)) / 1000;
        var timeto = Date.parse(new Date(end)) / 1000;
        if (sjmc==''){
            alert('请输入事件名称');
        }else {
            if (timefrom > timeto) {
                alert('您输入的时间有误，请选择正确的时间');
            }else{
                var timestamp=new Date().getTime();
                nums(sjmc,sjlx,timefrom,timeto,timestamp);
            }
        };

    })
}
jiedianshijian();

//--文件传输----
function handleFileSelect(evt){
    var files = evt;
    for(var i=0,f;f=files[i];i++){
        var reader = new FileReader();
        reader.onload = function (oFREvent) {
            var a = oFREvent.target.result;
            $.ajax({
                type:"POST",
                url:"/construction/read_file/",
                dataType: "json",
                async:false,
                data:{new_words:a},
                success: function(data){
                    if( data ){
                        var data=data;
                        wenjianchuanshu(data);
                        // alert("批量导入成功！");
                    }
                }
            });
        };
        reader.readAsText(f,'GB2312');
    }
}
function wenjianchuanshu(uid) {
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
        console.log(data);
    }
    var place=new place();
    function nums(timestamp) {
        var url = '/construction/user_upload_file/?uid_list='+uid+'&upload_time='+timestamp;
        place.call_request(url,territory);
    }

    $("#container .conright .crm .crm2").on('click',function () {
        var timestamp=new Date().getTime();
        nums(timestamp);
    });
};

