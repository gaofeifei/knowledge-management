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
function getLocalTime(nS) {
    return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,10);
};
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
    $('#container .result .re3 .left').unbind("click");
    $('#container .result .re3 .right').unbind("click");
    var json=eval(data);
    if (json==0){
        alert('你输入的2个节点之间不存在任何关系。');
    }else {
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
        myChart.on('click', function (params) {
            if (typeof params.seriesIndex != 'undefined') {
                if (params.color=='#00cc66'){
                    window.open('/index/person/?p_uid='+params.data.id);
                }else {
                    window.open('/group/detail/?group_name='+params.name);
                }

            }
        });
        //--------------------
        var uname1,uname2;
        if (json.start_node_card.uid){
            if (json.start_node_card.uname==''||json.start_node_card.uname=='unknown'){
                uname1=json.start_node_card.uid;
            }else {
                uname1=json.start_node_card.uname;
            };
            var influe,name,mingan,tag,photo,fensinum;
            var fensi=Math.round((json.start_node_card.fansnum /10000) * 100) / 100;
            if (fensi.toString().length>6){
                fensinum=fensi.toFixed(2).substr(0,6)+'万';
            }else {
                fensinum=fensi.toFixed(2)+'万';
            };
            if (json.start_node_card.influence==''||json.start_node_card.influence=='unknown'){
                influe=0;
            }else {
                var yingxiang=Math.round((json.start_node_card.influence /10000) * 100) / 100;
                if (yingxiang.toString().length>6){
                    influe=yingxiang.toFixed(2).substr(0,6)+'万';
                }else {
                    influe=yingxiang.toFixed(2)+'万';
                };
            };
            if (json.start_node_card.uname==''||json.start_node_card.uname=='unknown'){
                name=json.start_node_card.uid;
            }else {
                name=json.start_node_card.uname;
            };
            var huoyue=json.start_node_card.activeness.toFixed(0);
            if (json.start_node_card.sensitive==''||json.start_node_card.sensitive=='unknown'){
                mingan=0;
            }else {
                mingan=json.start_node_card.sensitive.toFixed(0);
            };
            if (json.start_node_card.user_tag==''||json.start_node_card.user_tag=='unknown'||json.start_node_card.user_tag=='null'){
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
                '<div class="p_top" style="width: 100%"><img class="play2" src="'+photo+'" alt="">'+
                '<img class=\'xin\' style="margin: -24px 0 0 100px" src="/static/image/heart.png">' +
                '<span class="xingming" title="'+name+'" style="color: #000;display: block;text-align:center;' +
                'width:100px;white-space:nowrap;margin: -13px auto 0;overflow: hidden;text-overflow: ellipsis">'+name+'</span>'+
                '</div>'+
                '<div class="play23" style="width: 110px;text-align: left;float: left">'+
                '<a class="renzh1">身&nbsp;&nbsp;&nbsp;份:<span title="'+json.start_node_card.domain+'" class="renzh11">'+json.start_node_card.domain+'</span></a>'+
                '<a class="renzh2">话&nbsp;&nbsp;&nbsp;题:<span title="'+json.start_node_card.topic_string.replace(/&/g,'  ')+'" class="renzh22">'+json.start_node_card.topic_string.replace(/&/g,'  ')+'</span></a>'+
                '</div>'+
                '<div style="float: left;width: 110px;margin-left: 10px">' +
                '<div class="play3" style="text-align: left">'+
                '<a class="bus1">业务标签：</a>'+
                '<a class="bus2" title="'+tag+'">'+tag+'</a>'+
                '</div>'+
                '<div class="play1">'+
                '<div class="p11">'+
                '<span id="uid" style="display: none">'+json.start_node_card.uid+'</span>'+
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
                '</div>'
            );
        }else {
            uname1=json.start_node_card.name;
            var weizhi,biaoqian,shuoming,weibonums,canyunums;
            var weibo=Math.round((json.start_node_card.weibo_counts /10000) * 100) / 100;
            var canyu=Math.round((json.start_node_card.uid_counts /10000) * 100) / 100;
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
            if (json.start_node_card.location=='null'||json.start_node_card.location==''){
                weizhi='未知';
            }else {
                weizhi=json.start_node_card.location;
            };
            if (json.start_node_card.user_tag=='null'){
                biaoqian='暂无';
            }else {
                biaoqian=json.start_node_card.user_tag;
            };
            if (json.start_node_card.description=='null'||json.start_node_card.description==''){
                shuoming='暂无数据';
            }else {
                shuoming=json.start_node_card.user_tag;
            };
            $('#container .result .re3 .re3lf #se_ka').append(
                '<div class="play_the" id="play">'+
                '<div class="play1" style="float:left;">'+
                '<div class="p11" style="text-align: left;padding-left: 30px">'+
                '<span class="xingming" title="'+json.start_node_card.name+'" ' +
                'style="display:block;color: #fff;font-weight: 900;font-size: 18px;width: 80px;white-space: nowrap;overflow: hidden;text-overflow:ellipsis;">' +json.start_node_card.name+'</span>'+
                '<div class="p22">'+
                '<span class="fasheng" style="width: 80px">发生时间：</span>'+
                '<span class="riqi">'+getLocalTime(json.start_node_card.start_ts)+'</span>'+
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
                '</div>'
            );
        };

        if (json.end_node_card.uid){
            if (json.end_node_card.uname==''||json.end_node_card.uname=='unknown'){
                uname2=json.end_node_card.uid;
            }else {
                uname2=json.end_node_card.uname;
            };
            var influe2,name2,mingan2,tag2,photo2,fensinum2;
            var fensi2=Math.round((json.end_node_card.fansnum /10000) * 100) / 100;
            if (fensi2.toString().length>6){
                fensinum2=fensi2.toFixed(2).substr(0,6)+'万';
            }else {
                fensinum2=fensi2.toFixed(2)+'万';
            };
            if (json.end_node_card.influence==''||json.end_node_card.influence=='unknown'){
                influe2=0;
            }else {
                var yingxiang2=Math.round((json.end_node_card.influence /10000) * 100) / 100;
                if (yingxiang2.toString().length>6){
                    influe2=yingxiang2.toFixed(2).substr(0,6)+'万';
                }else {
                    influe2=yingxiang2.toFixed(2)+'万';
                };
            };
            if (json.end_node_card.uname==''||json.end_node_card.uname=='unknown'){
                name2=json.end_node_card.uid;
            }else {
                name2=json.end_node_card.uname;
            };
            var huoyue2=json.end_node_card.activeness.toFixed(0);
            if (json.end_node_card.sensitive==''||json.end_node_card.sensitive=='unknown'){
                mingan2=0;
            }else {
                mingan2=json.end_node_card.sensitive.toFixed(0);
            };
            if (json.end_node_card.user_tag==''||json.end_node_card.user_tag=='unknown'||json.end_node_card.user_tag=='null'){
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
                '<div class="p_top" style="width: 100%"><img class="play2" src="'+photo2+'" alt="">'+
                '<img class=\'xin\' style="margin: -24px 0 0 100px" src="/static/image/heart.png">' +
                '<span class="xingming" title="'+name2+'" style="color: #000;display: block;text-align:center;' +
                'width:100px;white-space:nowrap;margin: -13px auto 0;overflow: hidden;text-overflow: ellipsis">'+name2+'</span>'+
                '</div>'+
                '<div class="play23" style="width: 110px;text-align: left;float: left">'+
                '<a class="renzh1">身&nbsp;&nbsp;&nbsp;份:<span title="'+json.end_node_card.domain+'" class="renzh11">'+json.end_node_card.domain+'</span></a>'+
                '<a class="renzh2">话&nbsp;&nbsp;&nbsp;题:<span title="'+json.end_node_card.topic_string.replace(/&/g,'  ')+'" class="renzh22">'+json.end_node_card.topic_string.replace(/&/g,'  ')+'</span></a>'+
                '</div>'+
                '<div style="float: left;width: 110px;margin-left: 10px">' +
                '<div class="play3" style="text-align: left">'+
                '<a class="bus1">业务标签：</a>'+
                '<a class="bus2" title="'+tag2+'">'+tag2+'</a>'+
                '</div>'+
                '<div class="play1">'+
                '<div class="p11">'+
                '<span id="uid" style="display: none">'+json.end_node_card.uid+'</span>'+
                '</div>'+
                '<div class="p22" style="float:left;margin-top: -5px">'+
                '<div><img src="/static/image/fensishu.png"'+
                'title=\'粉丝数\'><!--'+
                '--><span class="difang" style="display: inline-block;width:50.06px;">'+fensinum2+'</span>'+
                '<img src="/static/image/mingan.png" title="敏感度">'+
                '<span class="mingan">'+mingan2+'</span></div>'+
                '<div><img src="/static/image/influence.png" title="影响力">'+
                '<span class="influence" style="display: inline-block;width:50.06px;">'+influe2+'</span>'+
                '<img src="/static/image/huoyuedu.png" title="活跃度">'+
                '<span class="huoyuedu">'+huoyue2+'</span></div>'+
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
                '</div>'
            );

        }else {
            uname2=json.end_node_card.name;
            var weizhi2,biaoqian2,shuoming2,weibonums2,canyunums2;
            var weibo2=Math.round((json.end_node_card.weibo_counts /10000) * 100) / 100;
            var canyu2=Math.round((json.end_node_card.uid_counts /10000) * 100) / 100;
            if (weibo2.toString().length>6){
                weibonums2=weibo2.toFixed(2).substr(0,6)+'万';
            }else {
                weibonums2=weibo2.toFixed(2)+'万';
            };
            if (canyu2.toString().length>6){
                canyunums2=canyu2.toFixed(2).substr(0,6)+'万';
            }else {
                canyunums2=canyu2.toFixed(2)+'万';
            };
            if (json.end_node_card.location=='null'||json.end_node_card.location==''){
                weizhi2='未知';
            }else {
                weizhi2=json.end_node_card.location;
            };
            if (json.end_node_card.user_tag=='null'){
                biaoqian2='暂无';
            }else {
                biaoqian2=json.end_node_card.user_tag;
            };
            if (json.end_node_card.description=='null'||json.end_node_card.description==''){
                shuoming2='暂无数据';
            }else {
                shuoming2=json.end_node_card.user_tag;
            };
            function getLocalTime(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,10)
            };
            $('#container .result .re3 .re3lf #se_ka').append(
                '<div class="play_the" id="play">'+
                '<div class="play1" style="float:left;">'+
                '<div class="p11" style="text-align: left;padding-left: 30px">'+
                '<span class="xingming" title="'+json.end_node_card.name+'" ' +
                'style="display:block;color: #fff;font-weight: 900;font-size: 18px;width: 80px;white-space: nowrap;overflow: hidden;text-overflow:ellipsis;">' +json.end_node_card.name+'</span>'+
                '<div class="p22">'+
                '<span class="fasheng" style="width: 80px">发生时间：</span>'+
                '<span class="riqi">'+getLocalTime(json.end_node_card.start_ts)+'</span>'+
                '</div>'+
                '</div>'+
                '</div>'+
                '<div style="float:left;margin: 10px 0 0 34px"><div style="display: inline-block"><img src="/static/image/dingwei.png" title="位置"><!--'+
                '--><span class="difang" style="font-size: 8px">'+weizhi2+'</span><!--'+
                '--><img class="xin" src="/static/image/heart2.png" alt="">' +
                '<div><div style="text-align: center"><img src="/static/image/weiboshu.png" title="微博数"><!--'+
                '--><span class="weiboshu" style="font-size: 8px">'+weibonums2+'</span></div>'+
                '<div style="text-align: center"><img class="canyuren" src="/static/image/canyuren.png" title="参与人数"><span style="font-size: 8px">'+canyunums2+'</span></div></div></div>'+
                '<img class="play2" style="margin-top: -50px" src="/static/image/xuyuyu.png" alt=""></div>'+
                '<div class="play3" style="width: 103px;display: inline-block;margin: 10px 0 0 40px;vertical-align:bottom;">'+
                '<a class="bus1">业务标签：</a>'+
                '<a class="bus2" title="'+biaoqian2+'">'+biaoqian2+'</a>'+
                '</div>'+
                '<div class="play4">'+
                '<p class="shuoming">'+
                shuoming2+
                '</p>'+
                '</div>'+
                // '<div class="play5" type="button" data-toggle="modal">'+
                // '<a>加入专题</a>'+
                // '</div>'+
                '</div>'
            );
        };

        $('#container .result .re3 .re3lf .route .path').html(uname1+'-'+uname2);
        $('#container .result .re3 .re3lf .route .dote .geshu').html(json.middle_card.length);
        var line_mid='';
        $.each(json.middle_card,function (index,item) {
            if (item.uid){
                if (item.domain){
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
                    $('#container .result .re3 .re3rg .midd .midd2').append(
                        '<div class="play">'+
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
                        '</div>'
                    );
                }
            }else {
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
                $('#container .result .re3 .re3rg .midd .midd2').append(
                    '<div class="play_the" id="play">'+
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
                    '</div>'
                );
            }
        });
        $("#container .result .re3 .re3rg .midd .midd2").append(line_mid);

        var step=0;
        $('#container .result .re3 .re3rg .midd .midd2').width((json.middle_card.length)*245);
        $('#container .result .re3 .re3rg .right').on('click',function () {
            step++;
            var plays=$("#container .result .re3 .re3rg .midd .midd2");
            walk=(-980)*step;
            $(plays).css({
                "-webkit-transform":"translateX("+walk+"px)",
                "-moz-transform":"translateX("+walk+"px)",
                "-ms-transform":"translateX("+walk+"px)",
                "-o-transform":"translateX("+walk+"px)",
                "transform":"translateX("+walk+"px)",
            });
            if (step >= json.middle_card.length/4){
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
        $('#container .result .re3 .re3rg .left').on('click',function () {
            step--;
            if (step < 0){
                alert('已经是第一页了~~');
                step=0;
            }else {
                var plays=$("#container .result .re3 .re3rg .midd .midd2");
                walk=(-980)*step;
                $(plays).css({
                    "-webkit-transform":"translateX("+walk+"px)",
                    "-moz-transform":"translateX("+walk+"px)",
                    "-ms-transform":"translateX("+walk+"px)",
                    "-o-transform":"translateX("+walk+"px)",
                    "transform":"translateX("+walk+"px)",
                });
            }
        });
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
                    $(this).parents('.play').find('.xingming').css({color:'red'});
                    $(this).find('a').text('取消群体探索');
                    changecolorq=2;
                    $('#join4').modal("show");
                } else {
                    $(this).parents('.play').find('.xingming').css({color:'#000'});
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
        $.each($('#play .xin'),function(index,item){
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
        $('#container .result .re3 .xingming').on('click',function (index,item) {
            if (isNaN($(this).html())){
                window.open('/index/search_result/?t_uid='+$(this).html());
            }else {
                window.open('/index/person/?p_uid='+$(this).parents('.re3').find('#uid').html());
            }
        })
    }

}

