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
        $.each(data.detail_result1,function (index,item) {
            var weizhi,biaoqian,shuoming;
            if (item.location=='null'){
                weizhi='未知';
            }else {
                weizhi=item.location;
            };
            if (item.user_tag=='null'){
                biaoqian='暂无';
            }else {
                biaoqian=item.user_tag;
            };
            if (item.description=='null'){
                shuoming='暂无数据';
            }else {
                shuoming=item.user_tag;
            };
            function getLocalTime(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,18)
            };
            str1+='<div class="play">'+
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
        $.each(data.detail_result2,function (index,item) {
            var weizhi,biaoqian,shuoming;
            if (item.location=='null'){
                weizhi='未知';
            }else {
                weizhi=item.location;
            };
            if (item.user_tag=='null'){
                biaoqian='暂无';
            }else {
                biaoqian=item.user_tag;
            };
            if (item.description=='null'){
                shuoming='暂无数据';
            }else {
                shuoming=item.user_tag;
            };
            function getLocalTime(nS) {
                return new Date(parseInt(nS) * 1000).toLocaleString().substr(0,18)
            };
            str2+='<div class="play">'+
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
        $("#run4").append(str1);
        $("#run5").append(str2);
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