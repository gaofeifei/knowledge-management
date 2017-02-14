/**
 * Created by Administrator on 2016/12/2.
 */
~function(){
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
    $('#container #middle .textrast .textrast1 .tone').on('click',function () {
        $(this).css({backgroundColor:'#f60'});
        $('#container #middle .textrast .textrast1 .ttwo').css({backgroundColor:'#3c6'});
    });
    $('#container #middle .textrast .textrast1 .ttwo').on('click',function () {
        $(this).css({backgroundColor:'#f60'});
        $('#container #middle .textrast .textrast1 .tone').css({backgroundColor:'#3c6'});
    })

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

}();