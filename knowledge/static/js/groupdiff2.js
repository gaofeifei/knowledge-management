/**
 * Created by Administrator on 2016/12/2.
 */
~function(){
    $("#nav").load("public_nav.html");
    var show = 0;
    $(".ptnew").on("click",function () {
        if (show==0) {
            $(".prethrmd").css({display:'inline-block'});
            show = 1;
        }else {
            $(".prethrmd").css({display:'none'});
            show = 0;
        }
    });
    //-----------点击按钮实现地图和关系图的切换
    $(".cdt211").on('click',function () {
        $("#eventimg").css({display:'block'});
        $("#placeimg").css({display:'block'});
        $("#eventimg2").css({display:'none'});
        $("#placeimg2").css({display:'none'});
    });
    $(".cdt222").on('click',function () {
        $("#eventimg").css({display:'none'});
        $("#placeimg").css({display:'none'});
        $("#eventimg2").css({display:'block'});
        $("#placeimg2").css({display:'block'});
    });
    //-------------微博区域隔行变色-----------
    $("#container #middle .textrast .tweets .txtleft .tlt:even").css("background-color","#eeeeee");
    $("#container #middle .textrast .tweets .txtright .tlt:even").css("background-color","#eeeeee");
    $("#container #middle .textrast .tweets .txtleft2 .tlt:even").css("background-color","#eeeeee");
    $("#container #middle .textrast .tweets .txtright2 .tlt:even").css("background-color","#eeeeee");

    //--------------点击按钮实现高影响力微博和敏感微博的切换
    $('#container #middle .textrast .textrast1 .tone').on('click',function () {
        $("#container #middle .textrast .tweets .txtleft").css({display:'inline-block'});
        $("#container #middle .textrast .tweets .txtright").css({display:'inline-block'});
        $("#container #middle .textrast .tweets .txtleft2").css({display:'none'});
        $("#container #middle .textrast .tweets .txtright2").css({display:'none'});
    });
    $('#container #middle .textrast .textrast1 .ttwo').on('click',function () {
        $("#container #middle .textrast .tweets .txtleft2").css({display:'inline-block'});
        $("#container #middle .textrast .tweets .txtright2").css({display:'inline-block'});
        $("#container #middle .textrast .tweets .txtleft").css({display:'none'});
        $("#container #middle .textrast .tweets .txtright").css({display:'none'});
    });
    //---------------相同的文字染色--------------
    var txtlf = $('#container #middle .textrast .tweets .txtleft .master .master1');
    var txtlf2 = $('#container #middle .textrast .tweets .txtleft2 .master .master1');
    var txtrg = $('#container #middle .textrast .tweets .txtright .master .master1');
    var txtrg2 = $('#container #middle .textrast .tweets .txtright2 .master .master1');
    for (var i=0;i<txtlf.length;i++) {
        var lfword = $(txtlf[i]).text();
        var lfword2 = $(txtlf2[i]).text();
        var rgword = $(txtrg[i]).text();
        var rgword2 = $(txtrg2[i]).text();
        for (var j=0;j<txtrg.length;j++) {
            var lfword = $(txtrg[j]).text();
            var lfword2 = $(txtrg[j]).text();
            var rgword = $(txtrg[j]).text();
            var rgword2 = $(txtrg[j]).text();
            if (lfword == rgword || lfword2==rgword2) {
                $(txtlf[i]).css({color:'red'});
                $(txtrg[j]).css({color:'red'});
                $(txtlf2[i]).css({color:'red'});
                $(txtrg2[j]).css({color:'red'});
            }
        }
    }
    //-----------左右箭头---------------
    $('#container #middle .thingtrast .lawyer2 .left').hover(function () {
        $(this).attr('src','../image/left_hv.png');
    },function () {
        $(this).attr('src','../image/left.png');
    });
    $('#container #middle .thingtrast .lawyer2 .right').hover(function () {
        $(this).attr('src','../image/right_hv.png');
    },function () {
        $(this).attr('src','../image/right.png');
    });
    $('#container #middle .thingtrast .safeguard2 .left').hover(function () {
        $(this).attr('src','../image/left_hv.png');
    },function () {
        $(this).attr('src','../image/left.png');
    });
    $('#container #middle .thingtrast .safeguard2 .right').hover(function () {
        $(this).attr('src','../image/right_hv.png');
    },function () {
        $(this).attr('src','../image/right.png');
    });

    //------------------滚动区域-----------------
    var go = 5;
    $('#container #middle .thingtrast .lawyer2 .right').on('click',function () {
        if(go==5){
            var plays=$("#container #middle .thingtrast .lawyer2 .play");
            $(plays).css({
                "-webkit-transform":"translateX(-1020px)",
                "-moz-transform":"translateX(-1020px)",
                "-ms-transform":"translateX(-1020px)",
                "-o-transform":"translateX(-1020px)",
                "transform":"translateX(-1020px)",
            });
            go = 8;
        } else{
            var plays=$("#container #middle .thingtrast .lawyer2 .play");
            $(plays).css({
                "-webkit-transform":"translateX(0px)",
                "-moz-transform":"translateX(0px)",
                "-ms-transform":"translateX(0px)",
                "-o-transform":"translateX(0px)",
                "transform":"translateX(0px)",
            });
            go = 5;
        }
    });
    $('#container #middle .thingtrast .lawyer2 .left').on('click',function () {
        if(go==5){
            var plays=$("#container #middle .thingtrast .lawyer2 .play");
            $(plays).css({
                "-webkit-transform":"translateX(-1020px)",
                "-moz-transform":"translateX(-1020px)",
                "-ms-transform":"translateX(-1020px)",
                "-o-transform":"translateX(-1020px)",
                "transform":"translateX(-1020px)",
            });
            go = 8;
        } else{
            var plays=$("#container #middle .thingtrast .lawyer2 .play");
            $(plays).css({
                "-webkit-transform":"translateX(0px)",
                "-moz-transform":"translateX(0px)",
                "-ms-transform":"translateX(0px)",
                "-o-transform":"translateX(0px)",
                "transform":"translateX(0px)",
            });
            go = 5;
        }
    });
    $('#container #middle .thingtrast .safeguard2 .right').on('click',function () {
        if(go==5){
            var plays=$("#container #middle .thingtrast .safeguard2 .play");
            $(plays).css({
                "-webkit-transform":"translateX(-1020px)",
                "-moz-transform":"translateX(-1020px)",
                "-ms-transform":"translateX(-1020px)",
                "-o-transform":"translateX(-1020px)",
                "transform":"translateX(-1020px)",
            });
            go = 8;
        } else{
            var plays=$("#container #middle .thingtrast .safeguard2 .play");
            $(plays).css({
                "-webkit-transform":"translateX(0px)",
                "-moz-transform":"translateX(0px)",
                "-ms-transform":"translateX(0px)",
                "-o-transform":"translateX(0px)",
                "transform":"translateX(0px)",
            });
            go = 5;
        }
    });
    $('#container #middle .thingtrast .safeguard2 .left').on('click',function () {
        if(go==5){
            var plays=$("#container #middle .thingtrast .safeguard2 .play");
            $(plays).css({
                "-webkit-transform":"translateX(-1020px)",
                "-moz-transform":"translateX(-1020px)",
                "-ms-transform":"translateX(-1020px)",
                "-o-transform":"translateX(-1020px)",
                "transform":"translateX(-1020px)",
            });
            go = 8;
        } else{
            var plays=$("#container #middle .thingtrast .safeguard2 .play");
            $(plays).css({
                "-webkit-transform":"translateX(0px)",
                "-moz-transform":"translateX(0px)",
                "-ms-transform":"translateX(0px)",
                "-o-transform":"translateX(0px)",
                "transform":"translateX(0px)",
            });
            go = 5;
        }
    });

}();