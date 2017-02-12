var chos1_type,chos2_type;
function choselx1(value) {
    if (value=='人物'){
        chos1_type=1;
    }else {
        chos1_type=2;
    }
};
function choselx2(value) {
    if (value=='人物'){
        chos2_type=1;
    }else {
        chos2_type=2;
    }
};

function guanxibianji() {
    var node1,node2,oldrel,newrel;
    $("#container .conright2 .editor .editor3").on('click',function () {
        node1=$("#container .conright2 .editor .editor111").val();
        node2=$("#container .conright2 .editor .editor222").val();
        go();
        // if ($("#node1").is(':checked')&&$("#node2").is(':checked')){
        //     node1=$("#container .conright2 .editor .editor111").val();
        //     node2=$("#container .conright2 .editor .editor222").val();
        //     go();
        // }else {
        //     $('#please').modal("show");
        // }

    });

    function run() {
        //this.ajax_method='GET'; // body...
    }
    run.prototype= {
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
    function relt(data) {
        var data=eval(data);
        console.log(data)
        $('#lcleft').bootstrapTable('load',data);
        $('#lcleft').bootstrapTable({
            //url: influ_url,
            data:data,
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
                    title: "节点1",//标题
                    field: "uname1",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if (value=='' || value=='unknown'){
                            return row.uid1;
                        }else {
                            return value;
                        }
                    },
                },
                {
                    title: "节点2",//标题
                    field: "uname2",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if (value=='' || value=='unknown'){
                            return row.uid2;
                        }else {
                            return value;
                        }
                    },
                },
                {
                    title: "关系",//标题
                    field: "rel",//键名
                    sortable: true,//是否可排序
                    order: "desc",//默认排序方式
                    align: "center",//水平
                    valign: "middle",//垂直
                    formatter: function (value, row, index) {
                        if (row.rel==''||row.rel=='unknown'){
                            value='暂无数据';
                        }else {
                            value=row.rel;
                            oldrel=row.rel;
                        }
                        return value;
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
            onClickRow: function (rows, tr) {
                if ($(tr.context).index()==4) {
                    //进行你的操作，如弹出新窗口
                    var node_o,node_t;
                    if (rows.uname1==''||rows.uname1=='unknown'){
                        node_o=rows.uid1;
                    }else {
                        node_o=rows.uname1;
                    };
                    if (rows.uname2==''||rows.uname2=='unknown'){
                        node_t=rows.uid2;
                    }else {
                        node_t=rows.uname2;
                    };
                    $("#container .conright2 .listcell .lcright .lcr1 .lcrone").text(node_o);
                    $("#container .conright2 .listcell .lcright .lcr1 .lcrtwo").text(node_t);
                    $('.lcright').show(20);
                };
                if ($(tr.context).index()==5) {
                    $('#join55').modal("show");
                }
            },
            
        });
    }
    $('.yes').on('click',function () {
        revamprel();
        // $('.yes22').modal("show");
    });
    var run=new run();
    function go() {
        var url = '/construction/node_or_node_query/?node1_uid='+node1+'&node2_uid='+node2;
        run.call_request(url,relt);
    }
    function revamprel() {
        function amend() {
            //this.ajax_method='GET'; // body...
        }
        amend.prototype= {
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
        function amends(data) {
            var data=eval(data);
            //console.log(data);
            if (data==0){
                $('#fail').modal("show");
            }else {
                $('#succ').modal("show");
            };
        }
        var amend=new amend();
        var url = '/construction/node_or_node_update/?node1_uid='+node1+
            '&node2_uid='+node2+'&old_rel='+oldrel+'&new_rel='+newrel;
        amend.call_request(url,amends);
    };
    function detrel() {
        function omit() {
            //this.ajax_method='GET'; // body...
        }
        omit.prototype= {
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
        function dlts(data) {
            var data=eval(data);
            //console.log(data);
            if (data==0){
                $('#fail2').modal("show");
            }else {
                $('#succ2').modal("show");
            };
        }
        var omit=new omit();
        var url = '/construction/node_or_node_delete/?node1_uid='+node1+
            '&node2_uid='+node2+'&old_rel='+oldrel;
        omit.call_request(url,dlts);
    };
};
guanxibianji();