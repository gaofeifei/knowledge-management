function guanlianrenwu() {
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
        var str='',str1='',str2='',str3='';
        var name,name1,name2,name3,picture,picture1,picture2,picture3;
        if (!data.join){
            $("#container .associat .assleft .assleft2 .often .oftenimg").text('<span style="text-align: center">暂无数据~~</span>');
        }else {
            $.each(data.join,function (index,item) {
                if (item[1]==''){
                    name=item[0];
                }else {
                    name=item[1];
                };
                if (item[2]==''){
                    picture='/static/image/pangzi.png';
                }else {
                    picture=item[2];
                };
                str+='<dl style="width: 55px;margin-right: 15px;display: inline-block;">'+
                    '<dt><img src="'+picture+'" alt=""></dt>'+
                    '<dd style="width: 55px;white-space:nowrap;overflow:hidden;text-overflow: ellipsis;text-align: center;' +
                    'font-size: 8px;margin-top: 5px">'+name+'</dd>'+
                    '</dl>';
            });
            $("#container .associat .assleft .assleft2 .often .oftenimg").append(str);
        }
        if (!data.pusher){
            $("#container .associat .assleft .assleft2 .social .oftenimg").append('<span style="text-align: center">暂无数据~~</span>');
        }else {
            $.each(data.pusher,function (index,item) {
                if (item[1]==''){
                    name1=item[0];
                }else {
                    name1=item[1];
                };
                if (item[2]==''){
                    picture1='/static/image/pangzi.png';
                }else {
                    picture1=item[2];
                };
                str1+='<dl style="width: 55px;margin-right: 15px;display: inline-block;">'+
                    '<dt><img src="'+picture1+'" alt=""></dt>'+
                    '<dd style="width: 55px;white-space:nowrap;overflow:hidden;text-overflow: ellipsis;text-align: center;' +
                    'font-size: 8px;margin-top: 5px">'+name1+'</dd>'+
                    '</dl>';
            });
            $("#container .associat .assleft .assleft2 .social .oftenimg").append(str1);
        }
        if (!data.maker){
            $("#container .associat .assleft .assleft2 .make .oftenimg").append('<span style="text-align: center">暂无数据~~</span>');
        }else {
            $.each(data.maker,function (index,item) {
                if (item[1]==''){
                    name2=item[0];
                }else {
                    name2=item[1];
                };
                if (item[2]==''){
                    picture2='/static/image/pangzi.png';
                }else {
                    picture2=item[2];
                };
                str2+='<dl style="width: 55px;margin-right: 15px;display: inline-block;">'+
                    '<dt><img src="'+picture2+'" alt=""></dt>'+
                    '<dd style="width: 55px;white-space:nowrap;overflow:hidden;text-overflow: ellipsis;text-align: center;' +
                    'font-size: 8px;margin-top: 5px">'+name2+'</dd>'+
                    '</dl>';
            });
            $("#container .associat .assleft .assleft2 .make .oftenimg").append(str2);
        }
        if (!data.other_rel){
            $("#container .associat .assleft .assleft2 .other .oftenimg").append('<span style="text-align: center">暂无数据~~</span>');
        }else{
            $.each(data.other_rel,function (index,item) {
                if (item[1]==''){
                    name3=item[0];
                }else {
                    name3=item[1];
                };
                if (item[2]==''){
                    picture3='/static/image/pangzi.png';
                }else {
                    picture3=item[2];
                };
                str3+='<dl style="width: 55px;margin-right: 15px;display: inline-block;">'+
                    '<dt><img src="'+picture3+'" alt=""></dt>'+
                    '<dd style="width: 55px;white-space:nowrap;overflow:hidden;text-overflow: ellipsis;text-align: center;' +
                    'font-size: 8px;margin-top: 5px">'+name3+'</dd>'+
                    '</dl>';
            });
            $("#container .associat .assleft .assleft2 .other .oftenimg").append(str3);
        }

    }
    var place=new place();
    function nums() {
        var url = '/index/event_detail_people/';
        place.call_request(url,territory);
    }
    nums();
};
guanlianrenwu();

function guanlianshijian() {
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
        if (data.length% 2 == 0){
            cwidth=(data.length*490)/4;
        }else {
            cwidth=(data.length*490)/4 + 490;
        }

        $("#container .associat .assright .assright2 #case #crmid").width(cwidth);
        $("#container .associat .assright .assright2 #case #crmid #run").append(str);
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
    }

    var touch=new touch();
    function nums() {
        var url = '/index/event_detail_event/';
        touch.call_request(url,things);
    }
    nums();
};
guanlianshijian();