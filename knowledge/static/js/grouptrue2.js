/**
 * Created by Administrator on 2016/12/12.
 */
// $.each($(".det"),function(index,item){
//     $(item).on('click',function(){
//         $(this).parent().fadeOut(300);
//     })
// });
// $("#container #total .twright .twr1:even").css("background-color","#eeeeee");
// $("#container #total .twright2 .twr1:even").css("background-color","#eeeeee");
var show = 0;
$(".ptnew").on("click",function () {
    if (show==0) {
        $(".prethrmd").css({display:'inline-block'});
        show = 1;
        $('#container .present .prethr .prethrmd .ptm3').on('click',function(){
            var gnew_name=$('#container .present .prethr .prethrmd #ptm2').val();
            window.open("/group/detail/?group_name="+gnew_name);
        });
    }else {
        $(".prethrmd").css({display:'none'});
        show = 0;
    }
});
$("#container #similar .simtop .include").on('click',function () {
    $(this).css({backgroundColor:"#0C6"}).siblings().css({backgroundColor:"#09F"});
    $("#container #similar .definite").css({display:'block'});
    $("#container #similar .samevent").css({display:'none'});
});
$("#container #similar .simtop .same").on('click',function () {
    $(this).css({backgroundColor:"#0C6"}).siblings().css({backgroundColor:"#09F"});
    $("#container #similar .samevent").css({display:'block'});
    $("#container #similar .definite").css({display:'none'});
});
//鼠标滑过效果
$('#container #similar .definite .deftwo .left').hover(function () {
    $(this).attr('src','/static/image/left_hv.png');
},function () {
    $(this).attr('src','/static/image/left.png');
});
$('#container #similar .definite .deftwo .right').hover(function () {
    $(this).attr('src','/static/image/right_hv.png');
},function () {
    $(this).attr('src','/static/image/right.png');
});
$('#container #similar .samevent .sametwo .left').hover(function () {
    $(this).attr('src','/static/image/left_hv.png');
},function () {
    $(this).attr('src','/static/image/left.png');
});
$('#container #similar .samevent .sametwo .right').hover(function () {
    $(this).attr('src','/static/image/right_hv.png');
},function () {
    $(this).attr('src','/static/image/right.png');
});
$('#container #people .peotwo .peotwo2 .left').hover(function () {
    $(this).attr('src','/static/image/left_hv.png');
},function () {
    $(this).attr('src','/static/image/left.png');
});
$('#container #people .peotwo .peotwo2 .right').hover(function () {
    $(this).attr('src','/static/image/right_hv.png');
},function () {
    $(this).attr('src','/static/image/right.png');
});

//
var play=$(".play");
$.each(play,function (index,item) {
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
$.each(play,function (index,item) {
    var changecolor=1;
    $(item).find(".play5").on('click',function(){
        if (changecolor==1) {
            $(this).parent('.play').css({backgroundColor:'#09F'});
            changecolor=2;
            $(this).find('a').text('取消专题');
            $('#join4').modal("show");
        } else {
            $(this).parent('.play').css({backgroundColor:'#d2dcf7'});
            changecolor=1;
            $(this).find('a').text('加入专题');
        }
    });
});
$.each($("#people .play"),function (index,item) {
    var changecolor2=1;
    $(item).find(".play5").on('click',function(){
        if (changecolor2==1) {
            $(this).parent('.play').css({backgroundColor:'#09F'});
            changecolor2=2;
            $(this).find('a').text('取消群体探索');
            $('#join4').modal("show");
        } else {
            $(this).parent('.play').css({backgroundColor:'#d2dcf7'});
            changecolor2=1;
            $(this).find('a').text('加入群体探索');
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
$('#similar .add22').on('click',function () {
    $('#join5').modal("show");
});
$('#people .add22').on('click',function () {
    $('#join6').modal("show");
});
function check(value){
    if (value=='新建群体') {
        $('.shuru2').show();
    }else{
        $('.shuru2').hide();
    };
};
function check2(value){
    if (value=='新建专题') {
        $('.shuru2').show();
    }else{
        $('.shuru2').hide();
    };
};
// $.each($("#people .xingming"),function(index,item){
//     $(item).on('click',function () {
//         window.open('/index/person/');
//     });
// });
// $.each($("#similar .xingming"),function(index,item){
//     $(item).on('click',function () {
//         window.open('/index/search_result/');
//     });
// });

