var themename1=theme_diff.theme1;
var themename2=theme_diff.theme2;
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
        var data=eval(data);
        var str1='';
        var str2='';
        if (data.detail_result1.length==0){
            $("#run4").html('<p style="width:1020px;text-align:center;height: 190px;line-height: 190px">无数据更新</p>');
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
                    '<span id="tid" style="display: none">'+item.en_name+'</span>'+
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
        };
        if (data.detail_result2.length==0){
            $("#run5").html('<p style="width:1020px;text-align:center;height: 190px;line-height: 190px">无数据更新</p>');
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
                    '<span id="tid" style="display: none">'+item.en_name+'</span>'+
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
        }

        $("#run4").append(str1);
        $("#run5").append(str2);
        //卡片效果
        $.each($('.xingming'),function(index,item){
            $(item).on('click',function(){
                window.open('/index/search_result/?t_uid='+$(this).html());
            })
        });
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

        var step4=0,step5=0;
        $('#run4').width((data.detail_result1.length)*255);
        $('#run5').width((data.detail_result2.length)*255);
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
    }
    var thing=new thing();
    var point,numberd=numa;
    function nums() {
        if($('#option1').is(':checked')) { point='start_ts'; };
        if($('#option2').is(':checked')) { point='uid_counts'; };
        if($('#option3').is(':checked')) { point='weibo_counts'; };
        var url = '/theme/e_compare_event/?theme_name1='+themename1+'&theme_name2='+themename2+'&sort_flag='+
            point+'&diff='+numberd;
        thing.call_request(url,territory);
    };
    $.each($("#container #middle .thingtrast .ttone input"),function (index,item) {
        $(item).on('click',function () {
            nums();
        });
    });
    nums();
};
$('#container #middle .thingtrast .lawyer .lawyer1 .quanbu').on('click',function () {
    shijianduibi(0);
});
$('#container #middle .thingtrast .lawyer .lawyer1 .xiangtong').on('click',function () {
    shijianduibi(1);
});
$('#container #middle .thingtrast .lawyer .lawyer1 .butong').on('click',function () {
    shijianduibi(2);
});
shijianduibi(0);


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
        $('#tab1').bootstrapTable('load',data);
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
        $('#tab2').bootstrapTable('load',data);
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
        if($('#option12').is(':checked')) { point2='activeness'; };
        if($('#option22').is(':checked')) { point2='influence'; };
        if($('#option32').is(':checked')) { point2='sensitive'; };
        var url = '/theme/e_compare_user/?theme_name1='+themename1+'&theme_name2='+themename2+'&sort_flag='+
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
$('#container #middle .peotrast .ptsone .quanbu2').on('click',function () {
    renwuduibi(0);
});
$('#container #middle .peotrast .ptsone .xiangtong2').on('click',function () {
    renwuduibi(1);
});
$('#container #middle .peotrast .ptsone .butong2').on('click',function () {
    renwuduibi(2);
});
renwuduibi(0);