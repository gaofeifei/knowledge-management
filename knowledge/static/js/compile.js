var node_type,uids;
function leixing(value) {
    if (value=='人物'){
        node_type=1;
    }else {
        node_type=2;
    }
};
function jiedianbianji() {
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
        $('#crt2lf').bootstrapTable('load',data);
        if (node_type==1){
            $('#crt2lf').bootstrapTable({
                data:data,
                search: true,//是否搜索
                pagination: true,//是否分页
                pageSize: 5,//单页记录数
                pageList: [ 10, 20, 50],//分页步进值
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
                        title: "节点名称",//标题
                        field: "uname",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            if (!row[0].uname){
                                value=row[0].uid;
                            }else {
                                if (row[0].uname==''||row[0].uname=='unknown'){
                                    value=row[0].uid;
                                }else {
                                    value=row[0].uname;
                                }
                            }
                            return value
                        },
                    },
                    {
                        title: "修改",//标题
                        field: "",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            return "<a class='xiugai'>修改</a>";
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
                        //进行你的操作，如弹出新窗口
                        uids=row[0].uid;
                        if (row[0].photo_url==''||row[0].photo_url=='unknown'){
                            $("#join7 .main .topleft img").attr('src','/static/image/pan.jpg');
                        }else {
                            $("#join7 .main .topleft img").attr('src',row[0].photo_url);
                        };
                        //名字
                        if (row[0].uname==''||row[0].uname=='unknown'){
                            $("#join7 .sjmc").val(row[0].uid);
                        }else {
                            $("#join7 .sjmc").val(row[0].uname);
                        };
                        //粉丝
                        if (row[0].fansnum==''||row[0].fansnum=='unknown'){
                            $("#join7 .fss").val('暂无数据');
                        }else {
                            $("#join7 .fss").val(row[0].fansnum);
                        };
                        //影响力
                        if (row[0].influence==''||row[0].influence=='unknown'){
                            $("#join7 .fssj").val('暂无数据');
                        }else {
                            var n=row[0].influence;
                            $("#join7 .fssj").val(n.toFixed(2));
                        };
                        //活跃度
                        if (row[0].activeness==''||row[0].activeness=='unknown'){
                            $("#join7 .hyd").val('暂无数据');
                        }else {
                            var n=row[0].activeness;
                            $("#join7 .hyd").val(n.toFixed(2));
                        };
                        //敏感度
                        if (row[0].statusnum==''||row[0].statusnum=='unknown'){
                            $("#join7 .mgd").val('暂无数据');
                        }else {
                            var n=row[0].statusnum;
                            $("#join7 .mgd").val(n.toFixed(2));
                        };
                        //领域
                        if (row[0].domain==''||row[0].domain=='unknown'){
                            $("#join7 .ly").append('<option value="暂无数据">暂无数据</option>');
                        }else {
                            $("#join7 .ly").append('<option value="'+row[0].domain+'">'+row[0].domain+'</option>');
                        };
                        //注册地
                        if (row[0].location==''||row[0].location=='unknown'){
                            $("#join7 .zcd").val("暂无数据");
                        }else {
                            $("#join7 .zcd").val(row[0].location);
                        };
                        //活跃地
                        if (row[0].activity_geo==''||row[0].activity_geo=='unknown'){
                            $("#join7 .hydi").append('<option value="暂无数据">暂无数据</option>');
                        }else {
                            $("#join7 .hydi").append('<option value="'+row[0].activity_geo.replace(/&/g,' ')+'">'+row[0].activity_geo.replace(/&/g,' ')+'</option>');
                        };
                        $('#join7').modal("show");

                    };
                    if ($(tr.context).index()==3) {
                        uids=row[0].uid;
                        $('#join1').modal("show");
                    }
                },
                onClickCell:function (value,$element,row) {
                    if (value=='uname'){
                        $(".conright .crt3 .crt2rg").empty();
                        var influe,name,mingan,tag,photo,fensinum;
                        var fensi=Math.round((row[0].fansnum /10000) * 100) / 100;
                        if (fensi.toString().length>6){
                            fensinum=fensi.toFixed(2).substr(0,6)+'万';
                        }else {
                            fensinum=fensi.toFixed(2)+'万';
                        };
                        if (row[0].influence==''||row[0].influence=='unknown'){
                            influe=0;
                        }else {
                            var yingxiang=Math.round((row[0].influence /10000) * 100) / 100;
                            if (yingxiang.toString().length>6){
                                influe=yingxiang.toFixed(2).substr(0,6)+'万';
                            }else {
                                influe=yingxiang.toFixed(2)+'万';
                            };
                        };
                        if (row[0].uname==''||row[0].uname=='unknown'){
                            name=row[0].uid;
                        }else {
                            name=row[0].uname;
                        };
                        var huoyue=row[0].activeness.toFixed(0);
                        if (row[0].sensitive==''||row[0].sensitive=='unknown'){
                            mingan=0;
                        }else {
                            mingan=row[0].tendency.toFixed(0);
                        };
                        if (row[0].hashtag==''||row[0].hashtag=='unknown'||row[0].hashtag=='null'){
                            tag='无';
                        }else {
                            tag=row[0].hashtag.replace(/&/g,'');
                        };
                        if (row[0].photo_url==''||row[0].photo_url=='unknown'){
                            photo='/static/image/pangzi.png';
                        }else {
                            photo=row[0].photo_url;
                        };
                        $('.conright .crt3 .crt2rg').append(
                            '<div class="play">'+
                            '<div class="p_top" style="width: 100%"><img class="play2" src="'+photo+'" alt="">'+
                            '<img class=\'xin\' style="margin: -24px 0 0 100px" src="/static/image/heart.png">' +
                            '<span class="xingming" title="'+name+'" style="color: #000;display: block;text-align:center;' +
                            'width:100px;white-space:nowrap;margin: -13px auto 0;overflow: hidden;text-overflow: ellipsis">'+name+'</span>'+
                            '</div>'+
                            '<div class="play23" style="width: 110px;text-align: left;float: left">'+
                            '<a class="renzh1">身&nbsp;&nbsp;&nbsp;份:<span title="'+row[0].domain+'" class="renzh11">'+row[0].domain+'</span></a>'+
                            '<a class="renzh2">话&nbsp;&nbsp;&nbsp;题:<span title="'+row[0].topic_string.replace(/&/g,'  ')+'" class="renzh22">'+row[0].topic_string.replace(/&/g,'  ')+'</span></a>'+
                            '</div>'+
                            '<div style="float: left;width: 110px;margin-left: 10px">' +
                            '<div class="play3" style="text-align: left">'+
                            '<a class="bus1">业务标签：</a>'+
                            '<a class="bus2" title="'+tag+'">'+tag+'</a>'+
                            '</div>'+
                            '<div class="play1">'+
                            '<div class="p11">'+
                            '<span id="uid" style="display: none">'+row[0].uid+'</span>'+
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
                        $.each($('.play .xin'),function(index,item){
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
                        $('#container .result .re3 .xingming').on('click',function (index,item) {
                            window.open('/index/person/?p_uid='+$(this).parents('.re3').find('#uid').html());
                        })
                        $(".conright .crt3").show();
                    };
                }
            });
        }else {
            $('#crt2lf').bootstrapTable({
                data:data,
                search: true,//是否搜索
                pagination: true,//是否分页
                pageSize: 5,//单页记录数
                pageList: [ 10, 20, 50],//分页步进值
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
                        field: "name",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            return value
                        },
                    },
                    {
                        title: "修改",//标题
                        field: "",//键名
                        sortable: true,//是否可排序
                        order: "desc",//默认排序方式
                        align: "center",//水平
                        valign: "middle",//垂直
                        formatter: function (value, row, index) {
                            return "<a class='xiugai'>修改</a>";
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
                        //进行你的操作，如弹出新窗口
                        uids=row[0].uid;
                        if (row[0].photo_url==''||row[0].photo_url=='unknown'){
                            $("#join7 .main .topleft img").attr('src','/static/image/pan.jpg');
                        }else {
                            $("#join7 .main .topleft img").attr('src',row[0].photo_url);
                        };
                        //名字
                        if (row[0].uname==''||row[0].uname=='unknown'){
                            $("#join7 .sjmc").val(row[0].uid);
                        }else {
                            $("#join7 .sjmc").val(row[0].uname);
                        };
                        //粉丝
                        if (row[0].fansnum==''||row[0].fansnum=='unknown'){
                            $("#join7 .fss").val('暂无数据');
                        }else {
                            $("#join7 .fss").val(row[0].fansnum);
                        };
                        //影响力
                        if (row[0].influence==''||row[0].influence=='unknown'){
                            $("#join7 .fssj").val('暂无数据');
                        }else {
                            var n=row[0].influence;
                            $("#join7 .fssj").val(n.toFixed(2));
                        };
                        //活跃度
                        if (row[0].activeness==''||row[0].activeness=='unknown'){
                            $("#join7 .hyd").val('暂无数据');
                        }else {
                            var n=row[0].activeness;
                            $("#join7 .hyd").val(n.toFixed(2));
                        };
                        //敏感度
                        if (row[0].statusnum==''||row[0].statusnum=='unknown'){
                            $("#join7 .mgd").val('暂无数据');
                        }else {
                            var n=row[0].statusnum;
                            $("#join7 .mgd").val(n.toFixed(2));
                        };
                        //领域
                        if (row[0].domain==''||row[0].domain=='unknown'){
                            $("#join7 .ly").append('<option value="暂无数据">暂无数据</option>');
                        }else {
                            $("#join7 .ly").append('<option value="'+row[0].domain+'">'+row[0].domain+'</option>');
                        };
                        //注册地
                        if (row[0].location==''||row[0].location=='unknown'){
                            $("#join7 .zcd").val("暂无数据");
                        }else {
                            $("#join7 .zcd").val(row[0].location);
                        };
                        //活跃地
                        if (row[0].activity_geo==''||row[0].activity_geo=='unknown'){
                            $("#join7 .hydi").append('<option value="暂无数据">暂无数据</option>');
                        }else {
                            $("#join7 .hydi").append('<option value="'+row[0].activity_geo.replace(/&/g,' ')+'">'+row[0].activity_geo.replace(/&/g,' ')+'</option>');
                        };
                        $('#join7').modal("show");

                    };
                    if ($(tr.context).index()==3) {
                        uids=row[0].uid;
                        $('#join1').modal("show");
                    }
                },
                onClickCell:function (value,$element,row) {
                    if (value=='uname'){
                        $(".conright .crt3 .crt2rg").empty();
                        var influe,name,mingan,tag,photo,fensinum;
                        var fensi=Math.round((row[0].fansnum /10000) * 100) / 100;
                        if (fensi.toString().length>6){
                            fensinum=fensi.toFixed(2).substr(0,6)+'万';
                        }else {
                            fensinum=fensi.toFixed(2)+'万';
                        };
                        if (row[0].influence==''||row[0].influence=='unknown'){
                            influe=0;
                        }else {
                            var yingxiang=Math.round((row[0].influence /10000) * 100) / 100;
                            if (yingxiang.toString().length>6){
                                influe=yingxiang.toFixed(2).substr(0,6)+'万';
                            }else {
                                influe=yingxiang.toFixed(2)+'万';
                            };
                        };
                        if (row[0].uname==''||row[0].uname=='unknown'){
                            name=row[0].uid;
                        }else {
                            name=row[0].uname;
                        };
                        var huoyue=row[0].activeness.toFixed(0);
                        if (row[0].sensitive==''||row[0].sensitive=='unknown'){
                            mingan=0;
                        }else {
                            mingan=row[0].tendency.toFixed(0);
                        };
                        if (row[0].hashtag==''||row[0].hashtag=='unknown'||row[0].hashtag=='null'){
                            tag='无';
                        }else {
                            tag=row[0].hashtag.replace(/&/g,'');
                        };
                        if (row[0].photo_url==''||row[0].photo_url=='unknown'){
                            photo='/static/image/pangzi.png';
                        }else {
                            photo=row[0].photo_url;
                        };
                        $('.conright .crt3 .crt2rg').append(
                            '<div class="play">'+
                            '<div class="p_top" style="width: 100%"><img class="play2" src="'+photo+'" alt="">'+
                            '<img class=\'xin\' style="margin: -24px 0 0 100px" src="/static/image/heart.png">' +
                            '<span class="xingming" title="'+name+'" style="color: #000;display: block;text-align:center;' +
                            'width:100px;white-space:nowrap;margin: -13px auto 0;overflow: hidden;text-overflow: ellipsis">'+name+'</span>'+
                            '</div>'+
                            '<div class="play23" style="width: 110px;text-align: left;float: left">'+
                            '<a class="renzh1">身&nbsp;&nbsp;&nbsp;份:<span title="'+row[0].domain+'" class="renzh11">'+row[0].domain+'</span></a>'+
                            '<a class="renzh2">话&nbsp;&nbsp;&nbsp;题:<span title="'+row[0].topic_string.replace(/&/g,'  ')+'" class="renzh22">'+row[0].topic_string.replace(/&/g,'  ')+'</span></a>'+
                            '</div>'+
                            '<div style="float: left;width: 110px;margin-left: 10px">' +
                            '<div class="play3" style="text-align: left">'+
                            '<a class="bus1">业务标签：</a>'+
                            '<a class="bus2" title="'+tag+'">'+tag+'</a>'+
                            '</div>'+
                            '<div class="play1">'+
                            '<div class="p11">'+
                            '<span id="uid" style="display: none">'+row[0].uid+'</span>'+
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
                        $.each($('.play .xin'),function(index,item){
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
                        $('#container .result .re3 .xingming').on('click',function (index,item) {
                            window.open('/index/person/?p_uid='+$(this).parents('.re3').find('#uid').html());
                        })
                        $(".conright .crt3").show();
                    };
                }
            });
        }

    };
    var place=new place();
    function nums(node_type,uid) {
        var url = '/construction/fuzzy_query/?node_type='+node_type+'&uid='+uid;
        place.call_request(url,territory);
    }
    $("#container .conright .crt1 .crt133").on('click',function () {
        var uid=$("#container .conright .crt1 .crt122 .uidcc").val();
        nums(node_type,uid);
    });

    var lingyu,huoyuedi;
    function lingyu(value) {
        lingyu=value;
    };
    function huoyuedi(value) {
        huoyuedi=value;
    };
    function suregai() {
        var name=$("#join7 .sjmc").val();
        var fans=$("#join7 .fss").val();
        var influ=$("#join7 .fssj").val();
        var hyd=$("#join7 .hyd").val();
        var mgd=$("#join7 .mgd").val();
        var lingyu=lingyu;
        var zhucedi=$("#join7 .zcd").val();
        var huoyuedi=huoyuedi;
        var job = {
            "uname":name,"fansnum":fans, "influence":influ, "activeness":hyd,
            "domain":lingyu,"location":zhucedi,"activeness_geo":huoyuedi,
        };
        function boba() {
            //this.ajax_method='GET'; // body...
        }
        boba.prototype= {
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
        function maton(data) {
            var data=eval(data);
            if (data==0){
                $('#fail').modal("show");
            }else {
                $('#succ').modal("show");
            };
        };
        var boba=new boba();
        function nums2() {
            var url = '/construction/update_node/?node_type='+node_type+'&uid='+uids+'&attribute_dict='+job;
            boba.call_request(url,maton);
        }
        nums2();
    };

};
jiedianbianji();

function delt() {
    function bmw() {
    }
    bmw.prototype= {
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
    function dte(data) {
        var data=eval(data);
        if (data==0){
            $('#fail2').modal("show");
        }else {
            $('#succ2').modal("show");
        };
    }
    var bmw=new bmw();
    function nums3() {
        var url = '/construction/delete_node/?node_type='+node_type+'&uid='+uids;
        bmw.call_request(url,dte);
    }
    nums3();
}