/**
 * Created by Administrator on 2016/12/16.
 */
~function(){
    // var show = 0;
    // $(".ptnew").on("click",function () {
    //     if (show==0) {
    //         $(".prethrmd").css({display:'inline-block'});
    //         show = 1;
    //     }else {
    //         $(".prethrmd").css({display:'none'});
    //         show = 0;
    //     }
    // });
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
    // $("#container #middle .textrast .tweets .txtleft .tlt:even").css("background-color","#eeeeee");
    // $("#container #middle .textrast .tweets .txtright .tlt:even").css("background-color","#eeeeee");
    // $("#container #middle .textrast .tweets .txtleft2 .tlt:even").css("background-color","#eeeeee");
    // $("#container #middle .textrast .tweets .txtright2 .tlt:even").css("background-color","#eeeeee");

    //--------------点击按钮实现高影响力微博和敏感微博的切换
    // $('#container #middle .textrast .textrast1 .tone').on('click',function () {
    //     $("#container #middle .textrast .tweets .txtleft").css({display:'inline-block'});
    //     $("#container #middle .textrast .tweets .txtright").css({display:'inline-block'});
    //     $("#container #middle .textrast .tweets .txtleft2").css({display:'none'});
    //     $("#container #middle .textrast .tweets .txtright2").css({display:'none'});
    // });
    // $('#container #middle .textrast .textrast1 .ttwo').on('click',function () {
    //     $("#container #middle .textrast .tweets .txtleft2").css({display:'inline-block'});
    //     $("#container #middle .textrast .tweets .txtright2").css({display:'inline-block'});
    //     $("#container #middle .textrast .tweets .txtleft").css({display:'none'});
    //     $("#container #middle .textrast .tweets .txtright").css({display:'none'});
    // });
    //---------------相同的文字染色--------------
    // var tr1=$(".tab1 tbody tr");
    // var tr2=$(".tab2 tbody tr");
    // for (var i = 0;i<tr1.length;i++) {
    //     name1 =$(tr1[i]).find('td').eq(1).text();
    //     for (var j = 0; j < tr2.length; j++) {
    //         name2 =$(tr2[j]).find('td').eq(1).text();
    //         if (name1==name2) {
    //             $(tr1[i]).css({backgroundColor:'#FFC107'});
    //             $(tr2[j]).css({backgroundColor:'#FFC107'});
    //         };
    //     };
    // };
    // var txtlf = $('#container #middle .textrast .tweets .txtleft .master .master1');
    // var txtlf2 = $('#container #middle .textrast .tweets .txtleft2 .master .master1');
    // var txtrg = $('#container #middle .textrast .tweets .txtright .master .master1');
    // var txtrg2 = $('#container #middle .textrast .tweets .txtright2 .master .master1');
    // var lfword,lfword2,rgword,rgeowd2;
    // var all=[];
    // var sim=[];
    // var diff=[];
    // var all2=[];
    // var sim2=[];
    // var diff2=[];
    // for (var i=0;i<txtlf.length;i++) {
    //     lfword = $(txtlf[i]).text();
    //     all.push($(txtlf[i]).parent().parent());
    //     for (var j=0;j<txtrg.length;j++) {
    //         rgword = $(txtrg[j]).text();
    //         all2.push($(txtrg[j]).parent().parent());
    //         if ( lfword == rgword ) {
    //             sim.push($(txtlf[i]).parent().parent());
    //             sim2.push($(txtrg[j]).parent().parent());
    //             // $(txtlf[i]).css({color:'red'});
    //             // $(txtrg[j]).css({color:'red'});
    //         }else {
    //             diff.push($(txtlf[i]).parent().parent());
    //             diff2.push($(txtrg[j]).parent().parent());
    //         }
    //     }
    //
    // }
    // for (var i=0;i<txtlf2.length;i++) {
    //     lfword2 = $(txtlf2[i]).text();
    //     for (var j=0;j<txtrg.length;j++) {
    //         rgword2 = $(txtrg2[j]).text();
    //         if (lfword2 == rgword2 ) {
    //             $(txtlf2[i]).css({color:'red'});
    //             $(txtrg2[j]).css({color:'red'});
    //         }
    //     }
    // }
    // $(".xiangtong").on('click',function () {
    //     $(".sim").html(sim);
    //     $(".sim2").html(sim2);
    //
    // });
    // $(".butong").on('click',function () {
    //     $(".diff").html(diff);
    //     $(".diff2").html(diff2);
    //
    // });
    // $(".all").on('click',function () {
    //     $(".all").html(all);
    //     $(".pager").show();
    // });
    //----------------------文字染色结束----------

    //-----------左右箭头---------------
    $('#container #middle .thingtrast .lawyer2 .left').hover(function () {
        $(this).attr('src','/static/image/left_hv.png');
    },function () {
        $(this).attr('src','/static/image/left.png');
    });
    $('#container #middle .thingtrast .lawyer2 .right').hover(function () {
        $(this).attr('src','/static/image/right_hv.png');
    },function () {
        $(this).attr('src','/static/image/right.png');
    });
    $('#container #middle .thingtrast .safeguard2 .left').hover(function () {
        $(this).attr('src','/static/image/left_hv.png');
    },function () {
        $(this).attr('src','/static/image/left.png');
    });
    $('#container #middle .thingtrast .safeguard2 .right').hover(function () {
        $(this).attr('src','/static/image/right_hv.png');
    },function () {
        $(this).attr('src','/static/image/right.png');
    });

    //------------------滚动区域-----------------
    var go = 5;
    $('#container #middle .thingtrast .lawyer2 .right').on('click',function () {
        if(go==5){
            var plays=$("#container #middle .thingtrast .lawyer2 .play");
            $(plays).css({
                "-webkit-transform":"translateX(-1050px)",
                "-moz-transform":"translateX(-1050px)",
                "-ms-transform":"translateX(-1050px)",
                "-o-transform":"translateX(-1050px)",
                "transform":"translateX(-1050px)",
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
                "-webkit-transform":"translateX(-1050px)",
                "-moz-transform":"translateX(-1050px)",
                "-ms-transform":"translateX(-1050px)",
                "-o-transform":"translateX(-1050px)",
                "transform":"translateX(-1050px)",
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
                "-webkit-transform":"translateX(-1050px)",
                "-moz-transform":"translateX(-1050px)",
                "-ms-transform":"translateX(-1050px)",
                "-o-transform":"translateX(-1050px)",
                "transform":"translateX(-1050px)",
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
                "-webkit-transform":"translateX(-1050px)",
                "-moz-transform":"translateX(-1050px)",
                "-ms-transform":"translateX(-1050px)",
                "-o-transform":"translateX(-1050px)",
                "transform":"translateX(-1050px)",
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