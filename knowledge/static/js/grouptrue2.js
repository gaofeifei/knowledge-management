/**
 * Created by Administrator on 2016/12/12.
 */
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

$('#similar .add22').on('click',function () {
    $('#join5').modal("show");
});

var url = '/theme/overview/';
$.ajax({
    url: url,
    type: 'GET',
    dataType: 'json',
    async: true,
    success:theme
});
function theme(data) {
    var data=eval(data);
    $.each(data,function (index,item) {
        $(".xinzeng #list1").append('<option value="'+item[0]+'">'+item[0]+'</option>');

    });
}
function check(value){
    if (value=='新建专题') {
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

