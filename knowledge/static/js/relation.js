/**
 * Created by Administrator on 2016/11/25.
 */
var node_type1,node_type2,m=0,n=0,point_type1,point_type2;
function leixing1(value) {
    if (value=='人物'){
        node_type1='User';
    }else {
        node_type1='Event';
    }
    m=1;
}
function leixing2(value) {
    if (value=='人物'){
        node_type2='User';
    }else {
        node_type2='Event';
    }
    n=1;
}
function guanxitansuo() {
    $('#join8 .left .leftlist').empty();
    $('#join8 .right .rightlist').empty();
    var value1=$("#container .contop .cp2 .more").val();
    var value2=$("#container .contop .cp3 .mores").val();
    var search_url='/relation/search_node/?item1='+value1+'&node_type1='+node_type1+'&item2='+value2+
            '&node_type2='+node_type2;
    $.ajax({
        url: search_url,
        type: 'GET',
        dataType: 'json',
        async: true,
        success:relation_list
    });
    function relation_list(data) {
        var data=eval(data);
        point_type1=data.node_type1;
        point_type2=data.node_type2;
        if (data.node1.length==0){
            $("#join8 .left .leftlist").append('<p>暂无数据~~</p>');
        }else {
            var str=''
            $.each(data.node1,function (index,item) {
                var name_uid;
                if (!(item[1]) || item[1]=='unknown'){
                    name_uid=item[0]
                }else {
                    name_uid=item[1];
                }
                str+='<div class="radio" style="margin-left:35px;">'+
                    '<label>'+
                    '<input type="radio" name="guanxi" value="'+item[0]+'">'+name_uid+
                    '</label>'+
                    '</div>';
            });
            $('#join8 .left .leftlist').append(str);
        };

        if (data.node2.length==0){
            $("#join8 .right .rightlist").append('<p>暂无数据~~</p>');
        }else {
            var str2=''
            $.each(data.node2,function (index,item) {
                var name_uid2;
                if (!(item[1])||item[1]=='unknown'){
                    name_uid2=item[0];
                }else {
                    name_uid2=item[1];
                }
                str2+='<div class="radio" style="margin-left:35px;">'+
                    '<label>'+
                    '<input type="radio" name="guanxi2" value="'+item[0]+'">'+name_uid2+
                    '</label>'+
                    '</div>';
            })
            $('#join8 .right .rightlist').append(str2);
        };
        $('#join8').modal("show");
    };
};
$('#container .contop .cp4').on('click',function () {
    if (m==1 && n==1){
        guanxitansuo();
    }else {
        $('#join5').modal("show");
    }
});

function show(){
    var relation_radios_left=$('#join8 .relations .left .radio input');
    var relation_radios_right=$('#join8 .relations .right .radio input');
    var point1,point2;
    $.each(relation_radios_left,function (index,item) {
        if ($(item).is(":checked")){
            point1=this.value;
        }
    });
    $.each(relation_radios_right,function (index,item) {
        if ($(item).is(":checked")){
            point2=this.value;
        }
    })
    var show_url='/relation/find_min_way/?item1='+point1+'&item2='+point2+'&node_type1='+point_type1+
        '&node_type2='+point_type2;
    if ((!point1)||(!point2)){
        $('#join2').modal("show");
    }else {
        $(".result").show(300);
        $.ajax({
            url: show_url,
            type: 'GET',
            dataType: 'json',
            async: true,
            success:relation_line
        });
    }
};
function relation_line(data) {
    $("#container .result .re3 .re3rg .midd .midd2").empty();
    $('#container .result .re3 .re3lf .route .path').empty();
    $('#container .result .re3 .re3lf .route .dote .geshu').empty();
    $('#container .result .re3 .re3lf #se_ka').empty();
    var json=eval(data);
    var myChart = echarts.init(document.getElementById('complex'));
    myChart.showLoading();
    var node_value=[],link_value=[];
    for (var key in json.user_nodes){
        var num1=Math.random()*(-10000-700)+10000;
        var num2=Math.random()*(-500-700)+500;
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
        var num3=Math.random()*(-10000-700)+10000;
        var num4=Math.random()*(-500-700)+500;
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
                source: item[0][0],
                target: ""+item[1][0]+""
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

    //--------------------
    var uname1,uname2;
    if (json.start_node_card.uid){
        if (json.start_node_card.uname==''){
            uname1=json.start_node_card.uid;
        }else {
            uname1=json.start_node_card.uname;
        };
        var influe,name,huoyue,mingan,tag,photo;
        if (json.start_node_card.influence=='null'){
            influe=0;
        }else {
            influe=json.start_node_card.influence.toFixed(2);
        };
        if (json.start_node_card.uname==''||json.start_node_card.uname=='unknown'){
            name=json.start_node_card.uid;
        }else {
            name=json.start_node_card.uname;
        };
        var huoyue=json.start_node_card.activeness.toFixed(2);
        if (json.start_node_card.sensitive=='null'||json.start_node_card.sensitive=='unknown'){
            mingan=0;
        }else {
            mingan=json.start_node_card.sensitive.toFixed(2);
        };
        if (json.start_node_card.user_tag=='null'||json.start_node_card.sensitive=='unknown'){
            tag='无';
        }else {
            tag=json.start_node_card.user_tag;
        };
        if (json.start_node_card.photo_url==''||json.start_node_card.photo_url=='unknown'){
            photo='/static/image/pangzi.png';
        }else {
            photo=json.start_node_card.photo_url;
        };
        $('#container .result .re3 .re3lf #se_ka').append(
            '<div class="play">'+
            '<span id="uid" style="display:none;">'+json.start_node_card.uid+'</span>'+
            '<div class="play1">'+
            '<div class="p11">'+
            '<span class="xingming" style="color: #000;font-weight: 900;font-size: 18px;margin-left: 15px">'+name+'</span><!--'+
            '--><img style="margin-left: 15px;" src="/static/image/fensishu.png" alt=""'+
            'title=\'粉丝数\'><!--'+
            '--><span class="difang" style="font-size: 8px">'+json.start_node_card.fansnum+'</span><!--'+
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
            '<a href="###" class="renzh1">认证类型:<span class="renzh11">'+json.start_node_card.topic_string.replace(/&/g,'  ')+'</span></a>'+
            '<a href="###" class="renzh2">领&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;域:<span class="renzh22">'+json.start_node_card.topic_string.replace(/&/g,'  ')+'</span></a>'+
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
            '</div>'
        );
        $.each( $(".xingming"),function(index,item){
            $(item).on('click',function () {
                window.open('/index/person/?p_uid'+$('.play #uid').html());
            });
        })
    }else {
        uname1=json.start_node_card.name;
        var weizhi,biaoqian,shuoming,photo;
        if (json.start_node_card.location=='null'){
            weizhi='未知';
        }else {
            weizhi=json.start_node_card.location;
        };
        if (json.start_node_card.photo_url=='null'){
            photo='/static/image/xuyuyu.png';
        }else {
            photo=json.start_node_card.photo_url;
        };
        if (json.start_node_card.user_tag=='null'){
            biaoqian='暂无';
        }else {
            biaoqian=json.start_node_card.user_tag;
        };
        if (json.start_node_card.description=='null'){
            shuoming ='暂无数据';
        }else {
            shuoming=json.start_node_card.user_tag;
        };
        $('#container .result .re3 .re3lf #se_ka').append(
            '<div class="play">'+
            '<div class="play1">'+
            '<div class="p11">'+
            '<span class="xingming" style="color: #000;font-weight: 900;font-size: 18px">'+json.start_node_card.name+'</span><!--'+
            '--><img src="/static/image/dingwei.png" title="位置"><!--'+
            '--><span class="difang" style="font-size: 8px">'+weizhi+'</span><!--'+
            '--><img class="xin" src="/static/image/heart.png" alt="">'+
            '</div>'+
            '<div class="p22">'+
            '<span class="fasheng" style="font-weight: bold">发生时间：</span>'+
            '<span class="riqi">'+getLocalTime(json.start_node_card.start_ts)+'</span>'+
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
            '</div>'
        );
        $.each($('.xingming'),function(index,item){
            $(item).on('click',function(){
                window.open('/index/search_result/?t_uid='+$(this).html());
            })
        });
    };

    if (json.end_node_card.uid){
        if (json.end_node_card.uname==''){
            uname2=json.end_node_card.uid;
        }else {
            uname2=json.end_node_card.uname;
        };
        var influe2,name2,huoyue2,mingan2,tag2,photo2;
        if (json.end_node_card.influence=='null'){
            influe2=0;
        }else {
            influe2=json.end_node_card.influence.toFixed(2);
        };
        if (json.end_node_card.uname==''||json.end_node_card.uname=='unknown'){
            name2=json.end_node_card.uid;
        }else {
            name2=json.end_node_card.uname;
        };
        var huoyue2=json.end_node_card.activeness.toFixed(2);
        if (json.end_node_card.sensitive=='null'||json.end_node_card.sensitive=='unknown'){
            mingan2=0;
        }else {
            mingan2=json.end_node_card.sensitive.toFixed(2);
        };
        if (json.end_node_card.user_tag=='null'||json.end_node_card.sensitive=='unknown'){
            tag2='无';
        }else {
            tag2=json.end_node_card.user_tag;
        };
        if (json.end_node_card.photo_url==''||json.end_node_card.photo_url=='unknown'){
            photo2='/static/image/pangzi.png';
        }else {
            photo2=json.end_node_card.photo_url;
        };
        $('#container .result .re3 .re3lf #se_ka').append(
            '<div class="play">'+
            '<span id="uid" style="display:none;">'+json.end_node_card.uid+'</span>'+
            '<div class="play1">'+
            '<div class="p11">'+
            '<span class="xingming" style="color: #000;font-weight: 900;font-size: 18px;margin-left: 15px">'+name2+'</span><!--'+
            '--><img style="margin-left: 15px;" src="/static/image/fensishu.png" alt=""'+
            'title=\'粉丝数\'><!--'+
            '--><span class="difang" style="font-size: 8px">'+json.end_node_card.fansnum+'</span><!--'+
            '--><img class=\'xin\' style="margin-left: 10px;" src="/static/image/heart.png">'+
            '</div>'+
            '<div class="p22" style="margin-top: 5px">'+
            '<img style="margin-left: 10px;" src="/static/image/influence.png" title="影响力">'+
            '<span class="influence">'+influe2+'</span>'+
            '<img src="/static/image/huoyuedu.png" title="活跃度">'+
            '<span class="huoyuedu">'+huoyue2+'</span>'+
            '<img src="/static/image/mingan.png" title="敏感度">'+
            '<span class="mingan">'+mingan2+'</span>'+
            '</div>'+
            '</div>'+
            '<img class="play2" src="'+photo2+'" alt="">'+
            '<div class="play23" style="margin-left: 15px;">'+
            '<a href="###" class="renzh1">认证类型:<span class="renzh11">'+json.end_node_card.topic_string.replace(/&/g,'  ')+'</span></a>'+
            '<a href="###" class="renzh2">领&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;域:<span class="renzh22">'+json.end_node_card.topic_string.replace(/&/g,'  ')+'</span></a>'+
            '</div>'+
            '<div class="play3" style="display:block;margin-top: 10px;vertical-align:bottom;padding-left: 15px">'+
            '<a class="bus1">业务标签：</a>'+
            '<a class="bus2">'+tag2+'</a>'+
            '</div>'+
            '<!--<div class="play4">-->'+
            '<!--<p class="shuoming">-->'+
            '<!--徐玉玉接到骗子电话后被骗9900元学费，报案回来的路上心脏骤停，离世。-->'+
            '<!--</p>-->'+
            '<!--</div>-->'+
            '<div class="play5" type="button" data-toggle="modal">'+
            '<a>加入群体探索</a>'+
            '</div>'+
            '</div>'
        );
        $.each( $(".xingming"),function(index,item){
            $(item).on('click',function () {
                window.open('/index/person/?p_uid'+$('.play #uid').html());
            });
        })
    }else {
        uname2=json.end_node_card.name;
        var weizhi2,biaoqian2,shuoming2,photo2;
        if (json.end_node_card.location=='null'){
            weizhi2='未知';
        }else {
            weizhi2=json.end_node_card.location;
        };
        if (json.end_node_card.photo_url=='null'){
            photo2='/static/image/xuyuyu.png';
        }else {
            photo2=item.photo_url;
        };
        if (json.end_node_card.user_tag=='null'){
            biaoqian2='暂无';
        }else {
            biaoqian2=json.end_node_card.user_tag;
        };
        if (json.end_node_card.description=='null'){
            shuoming2='暂无数据';
        }else {
            shuoming2=json.end_node_card.user_tag;
        };
        $('#container .result .re3 .re3lf #se_ka').append(
            '<div class="play">'+
            '<div class="play1">'+
            '<div class="p11">'+
            '<span class="xingming" style="color: #000;font-weight: 900;font-size: 18px">'+json.end_node_card.name+'</span><!--'+
            '--><img src="/static/image/dingwei.png" title="位置"><!--'+
            '--><span class="difang" style="font-size: 8px">'+weizhi2+'</span><!--'+
            '--><img class="xin" src="/static/image/heart.png" alt="">'+
            '</div>'+
            '<div class="p22">'+
            '<span class="fasheng" style="font-weight: bold">发生时间：</span>'+
            '<span class="riqi">'+getLocalTime(json.end_node_card.start_ts)+'</span>'+
            '</div>'+
            '</div>'+
            '<img class="play2" src="'+photo2+'" alt="">'+
            '<div class="play3" style="display: inline-block;margin-top: 10px;vertical-align:bottom;">'+
            '<a class="bus1">业务标签：</a>'+
            '<a class="bus2">'+biaoqian2+'</a>'+
            '</div>'+
            '<div class="play4">'+
            '<p class="shuoming">'+
            shuoming2+
            '</p>'+
            '</div>'+
            '<!-- <div class="play5" type="button" data-toggle="modal">'+
            '<a>加入专题</a>'+
            '</div> -->'+
            '</div>'
        );
        $.each($('.xingming'),function(index,item){
            $(item).on('click',function(){
                window.open('/index/search_result/?t_uid='+$(this).html());
            })
        });
    };
    $('#container .result .re3 .re3lf .route .path').html(uname1+'-'+uname2);
    $('#container .result .re3 .re3lf .route .dote .geshu').html(json.middle_card.length);
    var line_mid='';
    $.each(json.middle_card,function (index,item) {
        if (item.uid){
            var influe,name,huoyue,mingan,tag,photo;
            if (item.influence==''){
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
            line_mid+='<div class="play">'+
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
                '<a href="" class="renzh1">认证类型:<span class="renzh11">'+item.topic_string.replace(/&/g,'  ')+'</span></a>'+
                '<a href="" class="renzh2">领&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;域:<span class="renzh22">'+item.topic_string.replace(/&/g,'  ')+'</span></a>'+
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
            $.each( $(".xingming"),function(index,item){
                $(item).on('click',function () {
                    window.open('/index/person/?p_uid'+$('.play #uid').html());
                });
            })
        }else {
            var weizhi,biaoqian,shuoming;
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
            line_mid+='<div class="play">'+
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
            $.each($('.xingming'),function(index,item){
                $(item).on('click',function(){
                    window.open('/index/search_result/?t_uid='+$(this).html());
                })
            });
        }
    });
    $("#container .result .re3 .re3rg .midd .midd2").append(line_mid);
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
                $(this).parent('.play').css({backgroundColor:'#09F'});
                $(this).find('a').text('取消群体探索');
                changecolorq=2;
                $('#join4').modal("show");
            } else {
                $(this).parent('.play').css({backgroundColor:'#d2dcf7'});
                $(this).find('a').text('加入群体探索');
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
}
function getLocalTime(nS) {
    return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,18);
};
