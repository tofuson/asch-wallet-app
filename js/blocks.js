mui.init();
var search_offset = 0;
var total_count = 0;

$(document).ready(
    function()
    {
        $('#forged_x').delay(100).show(0);
	    $('#rate_x').delay(200).show(0);
	    $('#productivity_x').delay(300).show(0);
	    $('#approval_x').delay(400).show(0);
	    $('#blocks_x').delay(500).show(0);
    }
);
mui('.mui-scroll-wrapper').scroll();
mui('body').on('shown', '.mui-popover', function(e) {
//				console.log('shown', e.detail.id);//detail为当前popover元素
});
mui('body').on('hidden', '.mui-popover', function(e) {
//				console.log('hidden', e.detail.id);//detail为当前popover元素
});
//将地址切换成个人节点IP
function change_ip(change_type){
	$('#topPopover').hide();
	$("#topPopover").removeClass("mui-active");
	switch(change_type){
		case 1:
				if(localStorage.language == 1){
						mui.prompt('例 88.88.88.88:8192(默认端口8192)','请输入你的节点IP(域名)+端口号','切换节点IP',['取消','确认'],function (e) {
					    if(e.value){
	//							    	str = e.value;
	//									str = str.match(/(\d+)\.(\d+)\.(\d+)\.(\d+)/g);
	//									if (str == null){
	//										mui.toast("你输入的IP地址无效");
	//									}else if (RegExp.$1>255 || RegExp.$2>255 || RegExp.$3>255 || RegExp.$4>255){
	//										mui.toast("你输入的IP地址无效");
	//									}else{
								localStorage.overall_url = 'http://'+e.value;
								reset_url();
	//									}
					    }else{
					    	$('.mui-backdrop').hide();
							$(".mui-backdrop").removeClass("mui-active");
					    }
					},'div')
				}else{
						mui.prompt('Example 88.88.88.88:8192(Default port 8192)','Please enter your node IP (domain) + port number','Switch nodes IP',['Cancel','Confirm'],function (e) {
					    if(e.value){
							localStorage.overall_url = 'http://'+e.value;
							reset_url();
					    }else{
					    	$('.mui-backdrop').hide();
							$(".mui-backdrop").removeClass("mui-active");
					    }
					},'div')
				}
				break;
		case 2:
				localStorage.overall_url = 'http://122.139.66.196:9999';//节点问题处理
				reset_url();
				break;
		case 3:
				localStorage.overall_url = 'http://mainnet.asch.so';//官方
				reset_url();
				break;
		case 4:
				localStorage.overall_url = 'http://123.207.29.68:8192';//tofuson
				reset_url();
				break;
	}
}
//重置网络
function reset_url(){
	search_offset = 0;
	total_count = 0;
	addData();
	$('.mui-backdrop').hide();
	$(".mui-backdrop").removeClass("mui-active");
}
//注册受托人
function register(){
	if(localStorage.publicKey){
		var str = $('#btn_register').html();
		if(localStorage.language == 1){
			if(str == '注册受托人'){
				mui.prompt('','请输入受托人名称','注册为受托人',['返回',(localStorage.secondSignature == 'true')?'输入二级密码':'注册(需支付100)'],function (e) {
				    if(e.index == 1){
				    	var userName = e.value;
				    	if(localStorage.secondSignature  == 'true'){
				    		mui.prompt('','请输入二级密码','注册为受托人',['返回','注册(需支付100)'],function (e) {
							    if(e.index == 1){
							    	var strExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
									if(!e.value){
										mui.toast('密码不能为空!');
										return;
									}
									if(strExp.test(e.value)){
										affirm_register(e.value,userName);
								    }else{
								    	mui.toast('密码格式不正确!');
							    	}
							    }
							},'div')
				    	}else{
				    		affirm_register('',e.value);
				    	}
				    }
				},'div');
			}else{
				return;
			}
		}else{
			if(str == 'Registered trustee'){
				mui.prompt('','Please enter the name of the trustee','Registered as a trustee',['Return',(localStorage.secondSignature == 'true')?'Enter a secondary password':'Registration (100 required)'],function (e) {
				    if(e.index == 1){
				    	var userName = e.value;
				    	if(localStorage.secondSignature  == 'true'){
				    		mui.prompt('','Please enter a two-level password','Registered as a trustee',['Return','Registration (100 required)'],function (e) {
							    if(e.index == 1){
							    	var strExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
									if(!e.value){
										mui.toast('Password can not be blank!');
										return;
									}
									if(strExp.test(e.value)){
										affirm_register(e.value,userName);
								    }else{
								    	mui.toast('The password is not formatted correctly!');
							    	}
							    }
							},'div')
				    	}else{
				    		affirm_register('',e.value);
				    	}
				    }
				},'div');
			}else{
				return;
			}
		}
	}
}
//确认注册
function affirm_register(secondPassword,userName){
	var password = localStorage.password;
	var transaction = window.AschJS.delegate.createDelegate(userName, password, secondPassword || undefined);   
	$.ajax({
      url:localStorage.overall_url + '/peer/transactions',
      type:'post',
      dataType:'json',
      contentType: 'application/json',
	    beforeSend: function(xhr){
    	    xhr.setRequestHeader('version', '');
    	    xhr.setRequestHeader('magic', '5f5b3cf5');//主网//5f5b3cf5//测试网//594fe0f3
    	}, //这里设置header
      data:JSON.stringify({transaction:transaction}),
      timeout:30000,//超时时间设置为30秒
      success:function (data) {
      		if(data['success'] == true){
      			$('#btn_register').html(userName);
				mui.toast(lg('注册成功','Registration success'));
      		}else{
      			mui.toast(data['error']);
      		}
	    }
    });
}
//查看个人生产的区块
function blocks(){
	$.ajax({
      	url:localStorage.overall_url + '/api/blocks',
        type:'get',
        dataType:'json',
        data:{
        	generatorPublicKey:localStorage.publicKey,
        	orderBy:'height:desc',
			limit:10,
			offset:search_offset
        },
        timeout:30000,//超时时间设置为30秒
        success:function (data) {
            if(data['success'] == true){
				if(data['count']){
				  var interposition = '';
				  total_count = data['count'];
//	    				      return;
				  for (var i=0;i<data['blocks'].length;i++) {
					interposition += '<div class="mui-card"><div class="mui-card-header"><div class="mui-text-left">'+lg('高度','Height')+'</div><div class="mui-text-right"><div class="mui-text-right text-cl">'+data['blocks'][i]['height']+'</div></div></div>';
					interposition += '<div class="mui-card-header"><div class="mui-text-left">'+lg('日期','Date')+'</div><div class="mui-text-right text-cl">'+formatDate(data['blocks'][i]['timestamp'])+'</div></div>';
					interposition += '<div class="mui-card-header"><div class="mui-text-left">ID</div><div class="mui-text-right"><div class="textarea-class">'+data['blocks'][i]['id']+'</div></div></div>';
					interposition += '<div class="mui-card-header"><div class="mui-text-left">'+lg('交易(金额)','Amount(Transaction)')+'</div><div class="mui-text-right text-cl">'+data['blocks'][i]['numberOfTransactions']+'('+data['blocks'][i]['totalAmount']/100000000+')</div></div>';
					interposition += '<div class="mui-card-header"><div class="mui-text-left">'+lg('费用(奖励)','Cost(Reward)')+'</div><div class="mui-text-right text-cl">'+data['blocks'][i]['totalFee']/100000000+'('+data['blocks'][i]['reward']/100000000+')</div></div></div>';
				  }
				  interposition += '<div class="mui-text-center"><button onclick="up_page()">'+lg('上一页','Previous page')+'</button><button onclick="down_page()">'+lg('下一页','Next page')+'</button></div>';
				  $('#my_blocks').html(interposition);
	            }
			}
	    }
    });	
}
//查看受托人基本信息
function look_accounts(){
	  $.get(
	        localStorage.overall_url + '/api/delegates/get?publicKey=' + localStorage.publicKey, 
	    function (data) {
//			      console.log(JSON.stringify(data));
	      if(data['success'] == true){
		      	$('#forged_id').html(data['delegate']['forged']/100000000);
		      	$('#rate_id').html(data['delegate']['rate']);
		      	$('#btn_register').html(data['delegate']['username']);
		      	$('#productivity_id').html(data['delegate']['productivity']+'%');
		      	$('#approval_id').html(data['delegate']['approval']+'%');
			}else{
				$('#btn_register').html(lg('注册受托人','Registered trustee'));
//							mui.toast('您还不是受托人，请先注册！')
			}
	    }
	);
}

//数据加载
function addData(){
	if(localStorage.publicKey){
		//查看受托人是否开启锻造
		  $.get(
		        localStorage.overall_url + '/api/delegates/forging/status?publicKey=' + localStorage.publicKey, 
			    function (data) {
			      if(data['success'] == true){
				      	$('#btn_forging').html(data['enabled']?lg('已开启','Turned on'):lg('未开启','Unopened'));
					}
			    }
			);
		look_accounts();//查看个人受托人基本信息
		blocks();//查看个人生产的区块
	}
}
addData();
//向上翻页
function up_page(){
	if(search_offset == 0){
		mui.toast(lg('已经是第一页了！','Is already the first page!'));
		return;
	}
	search_offset -= 10;
	blocks();
}
//向下翻页
function down_page(){
	if(search_offset > (total_count-10)){
		mui.toast(lg('已经是最后一页了！','Is the last page!'));
		return;
	}
	search_offset += 10;
	blocks();
}