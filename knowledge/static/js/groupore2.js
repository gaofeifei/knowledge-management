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
        var weizhi,biaoqian,shuoming,cwidth;
        $.each(data,function (index,item) {
            var influe,name,huoyue,mingan,tag,photo;
            if (item.influence=='null'){
                influe=0;
            }else {
                influe=item.influence.toFixed(2);
            };
            if (item.uname==''||item.uname=='unknown'){
                name=item.uid;
            }else {
                name=item.uname;
            };
            var huoyue=item.activeness.toFixed(2);
            if (item.sensitive=='null'||item.sensitive=='unknown'){
                mingan=0;
            }else {
                mingan=item.sensitive.toFixed(2);
            };
            if (item.user_tag=='null'||item.sensitive=='unknown'){
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
                '<span id="uid" style="display:none;">'+item.uid+'</span>'+
                '<div class="play1">'+
                '<div class="p11">'+
                '<span class="xingming" style="color: #000;font-weight: 900;font-size: 18px;margin-left: 15px">'+name+'</span><!--'+
                '--><img style="margin-left: 15px;" src="/static/image/fensishu.png" alt=""'+
                'title=\'粉丝数\'><!--'+
                '--><span class="difang" style="font-size: 8px">'+item.fansnum+'</span><!--'+
                '--><img class=\'xin\' style="margin-left: 10px;" src="/static/image/heart.png">'+
                '</div>'+
                '<div class="p22" style="margin-top: 5px">'+
                '<img style="margin-left: 10px;" src="/static/image/influence.png" title="影响力">'+
                '<span class="influence">'+influe+'</span>'+
                '<img src="/static/image/huoyuedu.png" title="活跃度">'+
                '<span class="huoyuedu">'+huoyue+'</span>'+
                '<img src="/static/image/mingan.png" title="敏感度">'+
                '<span class="mingan">'+mingan+'</span>'+
                '</div>'+
                '</div>'+
                '<img class="play2" src="'+photo+'" alt="">'+
                '<div class="play23" style="margin-left: 15px;">'+
                '<a class="renzh1">认证类型:<span class="renzh11">'+item.topic_string.replace(/&/g,'  ')+'</span></a>'+
                '<a class="renzh2">领&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;域:<span class="renzh22">'+item.topic_string.replace(/&/g,'  ')+'</span></a>'+
                '</div>'+
                '<div class="play3" style="display:block;margin-top: 10px;vertical-align:bottom;padding-left: 15px">'+
                '<a class="bus1">业务标签：</a>'+
                '<a class="bus2">'+tag+'</a>'+
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
                    user_ids.push($(this).siblings('.play1').find('.xingming').html());
                    $(this).find('a').text('取消群体探索');
                    $('#join3').modal("show");
                } else {
                    $(this).parent('.play').css({backgroundColor:'#d2dcf7'});
                    changecolor=1;
                    var $a = $(this).siblings('#uid').html();
                    node_ids.removeByValue($a);
                    var $a22 = $(this).siblings('.play1').find('.xingming').html();
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
        var data=eval(data);
        console.log(data)
        if (data==2){
            $('#chengong').modal("show");
        }else {
            $('#shibai').modal("show");
        }
    }
}