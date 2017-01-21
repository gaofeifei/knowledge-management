/**
 * Created by Administrator on 2016/11/24.
 */
function theme_newbuild_searchut() {
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
            var myChart = echarts.init(document.getElementById('site2'));
            myChart.showLoading();
            var node_value=[],link_value=[];
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
theme_newbuild_searchut();

Array.prototype.removeByValue = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
};
var node_ids=[];
function theme_newbuild_searchut() {
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
        var myChart = echarts.init(document.getElementById('site2'));
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
        $(".con_bot .add #shijian .bag").show(20);
        var data=eval(data);
        var str='';
        function getLocalTime(nS) {
            return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,18);
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
        $("#container .con_bot .add .sjmr #case #crmid #run33").append(str);
        //卡片效果
        var heart=$(".con_bot .play .play1 .p11 .xin");
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
        $.each($(".con_bot .play"),function (index,item) {
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
        $.each($(".con_bot .play"),function (index,item) {
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
    $("#container .con_bot .sjt .sjt2").on('click',function () {
        s=$("#container .con_bot .sjt .sjt1").val();
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
theme_newbuild_searchut();

function theme_add2() {
    var a=[];
    for(var i=0;i<node_ids.length;i++){
        if (a.indexOf(node_ids[i])===-1){
            a.push(node_ids[i]);
        }
    }
    var node_ids2=a.join(',');
    var thenewpro=$("#shuru2").val();
    var thenewurl='/theme/create_new_relation/?node1_id='+node_ids2+'&node2_id='+thenewpro;
    $.ajax({
        url: thenewurl,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:the_join
    });
    function the_join(data) {
        var data=eval(data);
        console.log(data)
        if (data==2){
            $('#chengong').modal("show");
        }else {
            $('#shibai').modal("show");
        }
    }
}