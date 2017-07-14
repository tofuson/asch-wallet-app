mui.init();
$(document).ready(
    function()
    {
        $('#height_x').delay(100).show(0);
        $('#version_x').delay(200).show(0);
        if(mui.os.plus){
	        $('#price_x').delay(300).show(0);
	        $('#my_x').delay(400).show(0);
        }else{
        	$('#my_x').delay(300).show(0);				        	
        }
    }
);
	  
var search_offset = 0;
var total_count = 0;
var type_str = ['转账','设置二级密码','注册受托人','投票','多重签名','DAPP','IN_TRANSFER','OUT_TRANSFER'];
var type_str_en = ['Transfer','Second Secret','Delegate','Vote','Multiple signatures','DAPP','IN_TRANSFER','OUT_TRANSFER'];

//将地址切换成个人节点IP
function change_lg(change_type){
	$('#topPopover').hide();
	$("#topPopover").removeClass("mui-active");
	switch(change_type){
		case 1:
				localStorage.language = 1;
    			L10N.updateLang('zh-cn');
				break;
		case 2:
				localStorage.language = 0;
				L10N.updateLang('en-us');
				break;
	}
	addData();
	$('.mui-backdrop').hide();
	$(".mui-backdrop").removeClass("mui-active");
}
//查看个人交易记录
function transactions(){
  $.ajax({
      	url:localStorage.overall_url + '/api/transactions',
        type:'get',
        dataType:'json',
        data:{
        	recipientId:localStorage.address,
        	senderPublicKey:localStorage.publicKey,
        	orderBy:'t_timestamp:desc',
			limit:10, 
			offset:search_offset
        },
        timeout:30000,//超时时间设置为30秒
        success:function (data) {
            if(data['success'] == true){
//  				      console.log(JSON.stringify(data));
				if(data['count']){
				  var interposition = '';
				  total_count = data['count'];
				  for (var i=0;i<data['transactions'].length;i++) {
					interposition += '<div class="mui-card"><form class="mui-input-group"><div class="mui-card-header"><div class="mui-text-left">ID</div><div class="mui-text-right"';
					interposition += '<div style="font-weight: bold;font-size: 12px;width: 224px;word-break: break-all;-webkit-line-clamp: 2">'+data['transactions'][i]['id']+'</div></div>';
					interposition += '<div class="mui-card-header"><div class="mui-text-left">'+lg('类型','Type')+'</div><div class="mui-text-right text-cl">'+lg(type_str[data['transactions'][i]['type']],type_str_en[data['transactions'][i]['type']])+'</div></div>';
					interposition += '<div class="mui-card-header"><div class="mui-text-left mui-col-xs-3">'+lg('发送者','Sender')+'</div><input type="text" disabled="disabled" class="mui-text-right text-min" value="'+data['transactions'][i]['senderId']+'"></div>';
					interposition += '<div class="mui-card-header"><div class="mui-text-left mui-col-xs-3">'+lg('接受者','Recipient')+'</div><input type="text" disabled="disabled" class="mui-text-right text-min" value="'+(data['transactions'][i]['recipientId']?data['transactions'][i]['recipientId']:"SYSTEM")+'"></div>';
					interposition += '<div class="mui-card-header"><div class="mui-text-left">'+lg('日期','Date')+'</div><div class="mui-text-right text-cl">'+formatDate(data['transactions'][i]['timestamp'])+'</div></div>';
					interposition += '<div class="mui-card-header"><div class="mui-text-left">'+lg('金额(费用)','Amount(Fee)')+'</div><div class="mui-text-right text-cl">'+(data['transactions'][i]['amount']/100000000) +'('+ (data['transactions'][i]['fee']/100000000)+')</div></div></form></div>';
				  }
				  interposition += '<div class="mui-text-center"><button onclick="up_page()">'+lg('上一页','Previous page')+'</button><button onclick="down_page()">'+lg('下一页','Next page')+'</button></div>';
				  $('#my_deal').html(interposition);	
				}    				      
            }
	    }
	});
}
//数据加载
function addData() {
	//当前为APP环境
	if(mui.os.plus){
		//查询聚币阿希价格
		mui.ajax('https://www.jubi.com/coin/allcoin',{
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:30000,//超时时间设置为30秒
		success:function(data){
		    //服务器返回响应，根据响应结果，分析是否登录成功；
		    if(data){
				      	$('#jubi_price').html(data['xas'][1]);
				    }
				},
			});
		//查询元宝阿希价格
//		mui.ajax('https://www.yuanbao.com/api_market/getinfo_cny/coin/xas',{
//		dataType:'json',//服务器返回json格式数据
//		type:'get',//HTTP请求类型
//		timeout:30000,//超时时间设置为30秒
//		success:function(data){
//		    //服务器返回响应，根据响应结果，分析是否登录成功；
//		    alert(1);
//		    if(data){
//				      	$('#yuanbao_price').html(data['price']);
//				    }
//				},
//			});
		//查询币多宝阿希价格
		mui.ajax('http://api.biduobao.com/api/v1/ticker?coin=xas',{
		dataType:'json',//服务器返回json格式数据
		type:'get',//HTTP请求类型
		timeout:30000,//超时时间设置为30秒
		success:function(data){
		    //服务器返回响应，根据响应结果，分析是否登录成功；
		    if(data){
				      	$('#biduobao_price').html(data['last']);
				    }
				},
			});
		}
 
		if(localStorage.address){
			//查看个人基本信息
			$.get(
		        localStorage.overall_url + '/api/accounts?address=' + localStorage.address, 
			    function (data) {
	//			      console.log(JSON.stringify(data));
			      if(data['success'] == true){
				      	$('#balance_id').html(data['account']['balance']/100000000);
				      	$('#height_id').html(data['latestBlock']['height']);
				      	$('#height_time_id').html(formatDate(data['latestBlock']['timestamp']));
	  			      	$('#version_id').html(data['version']['version']);
	  			      	$('#version_time_id').html(data['version']['build']+' - '+data['version']['net']);
	  			      	localStorage.secondSignature = data['account']['secondSignature'];
					}
			    }
			);
		transactions();//查看个人交易记录
	}
}

addData();
public_addData();//公共下拉加载
//向上翻页
function up_page(){
	if(search_offset == 0){
		mui.toast(lg('已经是第一页了！','Is already the first page!'));
		return;
	}
	search_offset -= 10;
	transactions();
}
//向下翻页
function down_page(){
	if(search_offset > (total_count-10)){
		mui.toast(lg('已经是最后一页了！','Is the last page!'));
		return;
	}
	search_offset += 10;
	transactions();
}