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
        var name;
        $.each(data.join,function (index,item) {
            if (item[1]==''){
                name=item[0];
            }else {
                name=item[1];
            };
             str+='<dl style="width: 55px;margin-right: 15px;display: inline-block">'+
                 '<dt><img src="'+item[2]+'" alt=""></dt>'+
                 '<dd style="text-align: center;font-size: 8px;margin-top: 5px">'+name+'</dd>'+
                 '</dl>';
        });
        $("#container .associat .assleft .assleft2 .often .oftenimg").append(str);

        $.each(data.pusher,function (index,item) {
            if (item[1]==''){
                name=item[0];
            }else {
                name=item[1];
            };
            str1+='<dl style="width: 55px;margin-right: 15px;display: inline-block">'+
                '<dt><img src="'+item[2]+'" alt=""></dt>'+
                '<dd style="text-align: center;font-size: 8px;margin-top: 5px">'+name+'</dd>'+
                '</dl>';
        });
        $("#container .associat .assleft .assleft2 .social .oftenimg").append(str1);

        $.each(data.maker,function (index,item) {
            if (item[1]==''){
                name=item[0];
            }else {
                name=item[1];
            };
            str2+='<dl style="width: 55px;margin-right: 15px;display: inline-block">'+
                '<dt><img src="'+item[2]+'" alt=""></dt>'+
                '<dd style="text-align: center;font-size: 8px;margin-top: 5px">'+name+'</dd>'+
                '</dl>';
        });
        $("#container .associat .assleft .assleft2 .make .oftenimg").append(str2);

        $.each(data.other_rel,function (index,item) {
            if (item[1]==''){
                name=item[0];
            }else {
                name=item[1];
            };
            str3+='<dl style="width: 55px;margin-right: 15px;display: inline-block">'+
                '<dt><img src="'+item[2]+'" alt=""></dt>'+
                '<dd style="text-align: center;font-size: 8px;margin-top: 5px">'+name+'</dd>'+
                '</dl>';
        });
        $("#container .associat .assleft .assleft2 .other .oftenimg").append(str3);
    }

    var place=new place();
    function nums() {
        var url = '/index/event_detail_people/';
        place.call_request(url,territory);
    }
    nums();
};
guanlianrenwu();