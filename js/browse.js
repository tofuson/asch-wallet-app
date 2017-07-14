mui.init();
var search_offset = 0;
var total_count = 0;
//数据加载
function addData() {
    //查看所有生产的区块
    $.ajax({
        url: localStorage.overall_url + '/api/blocks',
        type: 'get',
        dataType: 'json',
        data: {
            orderBy: 'height:desc',
            limit: 10,
            offset: search_offset
        },
        timeout: 30000,
        //超时时间设置为30秒
        success: function(data) {
            if (data['success'] == true) {
                if (data['count']) {
                    var interposition = '';
                    total_count = data['count'];
                    $('#total_page_id').html(lg('总页数:','Total pages:') + (parseInt(data['count'] / 10) + 1));
                    for (var i = 0; i < data['blocks'].length; i++) {
                        interposition += '<div class="mui-card"><div class="mui-card-header"><div class="mui-text-left">'+lg('高度','Height')+'</div><div class="mui-text-right"><div class="mui-text-right text-cl">' + data['blocks'][i]['height'] + '</div></div></div>';
                        interposition += '<div class="mui-card-header"><div class="mui-text-left">'+lg('日期','Date')+'</div><div class="mui-text-right text-cl">' + formatDate(data['blocks'][i]['timestamp']) + '</div></div>';
                        interposition += '<div class="mui-card-header"><div class="mui-text-left">ID</div><div class="mui-text-right"><div class="textarea-class">' + data['blocks'][i]['id'] + '</div></div></div>';
                        interposition += '<div class="mui-card-header"><div class="mui-text-left">'+lg('交易(金额)','Amount(Transaction)')+'</div><div class="mui-text-right text-cl">' + data['blocks'][i]['numberOfTransactions'] + '(' + data['blocks'][i]['totalAmount'] / 100000000 + ')</div></div>';
                        interposition += '<div class="mui-card-header"><div class="mui-text-left">'+lg('费用(奖励)','Cost(Reward)')+'</div><div class="mui-text-right text-cl">' + data['blocks'][i]['totalFee'] / 100000000 + '(' + data['blocks'][i]['reward'] / 100000000 + ')</div></div></div>';
                    }
				    interposition += '<div class="mui-text-center"><button onclick="up_page()">'+lg('上一页','Previous page')+'</button><button onclick="down_page()">'+lg('下一页','Next page')+'</button></div>';
                    $('#all_blocks').html(interposition);
                }
            }
        }
    });
}
addData();
public_addData(); //公共下拉加载
if(localStorage.language == 1){
	$('#search_id').attr('placeholder','请输入要搜索的高度');
}else{
	$('#search_id').attr('placeholder','Please enter the height to search');
}
$('#search_id').bind("propertychange input focus",
function(event) {
    $this = $(this);
    if (event.type != 'focus') {
        //如果有改变，则状态定为必须重新选择，因为纯人手输入会导致value无法插入 
        $this.data('ok', false);
        search_block();
	}
});

function search_block() {
    var search_height = $('#search_id').val();
    if (!search_height) {
        search_offset = 0;
        addData();
        return;
    }
    if (!/^[0-9]*$/.test(search_height)) {
        mui.toast("请输入数字!");
        return;
    }
    //查看所有生产的区块
    $.ajax({
        url: localStorage.overall_url + '/api/blocks/get',
        type: 'get',
        dataType: 'json',
        data: {
            height: search_height
        },
        timeout: 30000,
        //超时时间设置为30秒
        success: function(data) {
            if (data['success'] == true) {
                if (data) {
                    var interposition = '';
                    interposition += '<div class="mui-card"><div class="mui-card-header"><div class="mui-text-left">'+lg('高度','Height')+'</div><div class="mui-text-right"><div class="mui-text-right text-cl">' + data['block']['height'] + '</div></div></div>';
                    interposition += '<div class="mui-card-header"><div class="mui-text-left">'+lg('日期','Date')+'</div><div class="mui-text-right text-cl">' + formatDate(data['block']['timestamp']) + '</div></div>';
                    interposition += '<div class="mui-card-header"><div class="mui-text-left">ID</div><div class="mui-text-right"><div class="textarea-class">' + data['block']['id'] + '</div></div></div>';
                    interposition += '<div class="mui-card-header"><div class="mui-text-left">'+lg('交易(金额)','Amount(Transaction)')+'</div><div class="mui-text-right text-cl">' + data['block']['numberOfTransactions'] + '(' + data['block']['totalAmount'] / 100000000 + ')</div></div>';
                    interposition += '<div class="mui-card-header"><div class="mui-text-left">'+lg('费用(奖励)','Cost(Reward)')+'</div><div class="mui-text-right text-cl">' + data['block']['totalFee'] / 100000000 + '(' + data['block']['reward'] / 100000000 + ')</div></div></div>';
                    $('#all_blocks').html(interposition);
                }
            }
        }
    });
}
//向上翻页
function up_page() {
    if (search_offset == 0) {
		mui.toast(lg('已经是第一页了！','Is already the first page!'));
        return;
    }
    search_offset -= 10;
    addData();
}
//向下翻页
function down_page() {
    if (search_offset > (total_count - 10)) {
		mui.toast(lg('已经是最后一页了！','Is the last page!'));
        return;
    }
    search_offset += 10;
    addData();
}