Array.prototype.removeByValue = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
};
var node_ids=[],user_ids=[];
function quntixinjianyonghushijian() {
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
        if (data=="node does not exist"){
            alert('无新数据更新');
        }else {
            $(".con_bot .add #shijian .bag").show(20);
            var json=eval(data);
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
            var ecConfig = require('echarts/config');
            function eConsole(param) {
                if (typeof param.seriesIndex != 'undefined') {
                    if (param.color=='#a73cff'){
                        window.open('/index/search_result/?t_uid='+param.name);
                    }else {
                        window.open('/index/person/?p_uid='+param.data.id);
                    }

                }
            }
            myChart.on(ecConfig.EVENT.CLICK, eConsole);
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
        if (data=='node does not exist'){
            null
        }else {
            var data=eval(data);
            var str='';
            function getLocalTime(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,18);
            };
            var cwidth;
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
                    '<div class="play5" type="button" data-toggle="modal">'+
                    '<a>加入群体探索</a>'+
                    '</div>'+
                    '</div>';
            });
            $("#container .con_bot .add .sjmr #case33 #crmid33 #run00").append(str);
            var step=0;
            var shang=Math.floor(data.length/6);
            var yu=data.length%6;
            $('#container .con_bot .add .sjmr #case33 #crmid33 #run00').width((3*shang+yu)*245);
            $('#container .con_bot .add #shijian .bag .right').on('click',function () {
                if (data.length<=6){
                    alert('没有其他卡片内容了~~');
                }else {
                    step++;
                    var plays=$("#container .con_bot .add .sjmr #case33 #crmid33 #run00");
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
            $('#container .con_bot .add #shijian .bag .left').on('click',function () {
                if (data.length<=6){
                    alert('没有其他卡片内容了~~');
                }else {
                    step--;
                    if (step < 0){
                        alert('已经是第一页了~~');
                        step=0;
                    }else {
                        var plays=$("#container .con_bot .add .sjmr #case33 #crmid33 #run00");
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
            //卡片效果
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
                        node_ids.push($(this).parent('.play').find('#uid').html());
                        user_ids.push($(this).siblings('.p_top').find('.xingming').html());
                        $(this).find('a').text('取消群体探索');
                        $('#join3').modal("show");
                    } else {
                        $(this).parent('.play').find('.xingming').css({color:'#000'});
                        changecolor=1;
                        var $a = $(this).parent('.play').find('#uid').html();
                        node_ids.removeByValue($a);
                        var $a22 = $(this).siblings('.p_top').find('.xingming').html();
                        user_ids.removeByValue($a22);
                        $(this).find('a').text('加入群体探索');
                    }
                });
            });
            $.each( $(".xingming"),function(index,item){
                $(item).on('click',function () {
                    window.open('/index/person/?p_uid'+$('.con_bot .play #uid').html());
                });
            })
        }
    };
    var place=new place();
    var place2=new place2();
    function nums(name) {
        var url = '/group/search_related_people/?item='+name;
        place.call_request(url,territory);
    };
    function nums2(name,maths) {
        var url2 = '/group/search_related_people_card/?item='+name+'&layer='+maths;
        place2.call_request(url2,territory2);
    };
    var maths='all',s;
    $("#container .con_bot .sjt .sjt2").on('click',function () {
        $('#container .con_bot #shijian .bag .sjmr #crmid33 #run00').empty();
        s=$("#container .con_bot .sjt .sjt1").val();
        if (!s==''){
            nums(s);
            nums2(s,maths);
        }else {
            $('#join111').modal("show");
        };
    });

    $.each($("#shijian .bag .sjmr1 .direct1 input"),function (index,item) {
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

    $(".con_bot .add22").on('click',function () {
        $('#join6 .xinjian .shij .sjr').empty();
        $('#join6').modal("show");
        $(".xinjian").css({display:"block"});
        $.each(user_ids,function (index,item) {
            $('#join6 .xinjian .shij .sjr').append('<a class="sj1">'+item+'<b class="icon icon-remove det" style="color: red"></b></a>');
            $.each($('.det'),function (index,item) {
                $(item).on('click',function () {
                    $(this).parent().hide(100);
                    var $a3 = $(this).parent().html();
                    user_ids.removeByValue($a3);
                });
            });
        });
    });

};
quntixinjianyonghushijian();



function sureadd2() {
    var node_ids2=node_ids.join(',');
    var newpro=$("#shuru2").val();
    var newurl='/group/g_create_new_relation/?node1_id='+node_ids2+'&node2_id='+newpro;
    $.ajax({
        url: newurl,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:n_join
    });
    function n_join(data) {
        // var data=eval(data);
        // console.log(data)
        if (data==2){
            $('#chengong').modal("show");
        }else {
            $('#shibai').modal("show");
        }
    }
}