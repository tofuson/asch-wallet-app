mui.init();
var totalCount = 0;
var numb_offset = 0;
var e_type = true;
var switchover_type = 1;
var record_SelectIDSArray = new Array();
			//监听URL的hash变化
$(window).bind('hashchange', function() {
	switchover();
});
//设置标签无效
function set_a_fasle(){
	$('#but_id').attr('href','javascript:return false;');
	$('#but_id').css('opacity','0.2');
}
//设置标签有效
function set_a_true(){
	$('#but_id').attr('href','#topPopover');
	$('#but_id').css('opacity','1');
}
set_a_fasle();//设置标签无效
function switchover(){
	var now_url =location.href
	var url_data = now_url.split('#');
	switch(url_data[1]){
		case 'trustee_list':
				set_a_fasle();//设置标签无效
				$('#but_id').html(lg('投票','Vote'));
				$('#but_id').show();
				$('#trustee_list').html('');
				SelectIDSArray = [];
				record_SelectIDSArray = [];
				$('#select_li').html('');
				switchover_type = 1;
				e_type = true;
				totalCount = 0;
				numb_offset = 0;
				addData();
				break;
		case 'voting_record': 
				set_a_fasle();//设置标签无效
				$('#but_id').html(lg('删除','Delete'));
				$('#but_id').show();
				SelectIDSArray = [];
				record_SelectIDSArray = [];
				$('#select_li').html('');
				$('#voting_record').html('');
				switchover_type = 2;
				vote_record();//投票记录
				var record_list = document.getElementById('voting_record');
			     //监测所有inputcheckbox)的变化
			     mui('#voting_record').on('change','input',function(){
			         //选中的checkbox的数量
			         var checkedbox = record_list.querySelectorAll('input[type="checkbox"]:checked');
			         //该数组用来存储选中订单的订单号
			         record_SelectIDSArray = [];
			         for(var i = 0;i<checkedbox.length;i++){
			             var item = checkedbox[i];
			             //item是通过ajax从后台请求的订单数据，该数据为JSON数据。
			             var obj = item.getAttribute('value');
						 if(obj){
				             //将选中的订单ID存储起来
				             record_SelectIDSArray.push(obj);
						 }
			         }
			         if(record_SelectIDSArray.length){
			         	set_a_true();//设置标签有效
			         }else{
			         	set_a_fasle();//设置标签无效
			         }
//						         console.log(record_SelectIDSArray);
			      });
				break;
		case 'who_voted': 
				$('#but_id').hide();
				$('#who_voted').html('');
				who_vote();//谁投了我
				break;
	}
}
mui('.mui-scroll-wrapper').scroll();
mui('body').on('shown', '.mui-popover', function(e) {
//				console.log('shown', e.detail.id);//detail为当前popover元素
	var str_li = '';
	if(localStorage.secondSignature == 'true'){
		$('#select_password').show();
	}
	if(switchover_type == 1){
		$('#select_title').html(lg('投票给受托人','Vote for delegate'));
		$('#select_max').html(lg('每张票最多可以同时投33人','Please confirm your vote. You can choose up to 33 people in one vote'));
		
		$('#select_btn').html(lg('确认投票 (需要支付 0.1 XAS)','Confirm vote (Need to pay 0.1 XAS)'));
		if(SelectIDSArray.length == 0){
			mui.toast(lg('请选择一位受托人!','Please choose a trustee!'));
			return;
		}				
		for(var i=0;i<SelectIDSArray.length;i++){
			str_li += '<li class="mui-table-view-cell mui-badge-primary mui-badge-inverted">'+$('#username'+SelectIDSArray[i]).html()+'</li>'
		}
		$('#select_li').html(str_li);				
	}else if(switchover_type == 2){
		$('#select_title').html(lg('取消给受托人的投票','Cancel the vote to the trustee'));
		$('#select_max').html(lg('每次最多可以同时删除33人','Up to 33 people can be deleted at the same time'));
		$('#select_btn').html(lg('删除投票 (需要支付 0.1 XAS)','Delete vote (Need to pay 0.1 XAS)'));
		if(record_SelectIDSArray.length == 0){
			mui.toast(lg('请选择一位受托人!','Please choose a trustee!'));
			return;
		}				
		for(var i=0;i<record_SelectIDSArray.length;i++){
			str_li += '<li class="mui-table-view-cell mui-badge-primary mui-badge-inverted">'+$('#username_'+record_SelectIDSArray[i]).html()+'</li>'
		}
		$('#select_li').html(str_li);	
	}
	
});
mui('body').on('hidden', '.mui-popover', function(e) {
//				console.log('hidden', e.detail.id);//detail为当前popover元素
});
//数据加载
function addData() {
	if(localStorage.address){
//	 				return;
		//查看受托人列表
	  $.ajax({
          	url:localStorage.overall_url + '/api/delegates',
            type:'get',
            dataType:'json',
            data:{
            	address:localStorage.address,
            	orderBy:'rate:asc',
				limit:20,
				offset:numb_offset
            },
            timeout:30000,//超时时间设置为30秒
            success:function (data) {
                if(data['success'] == true){
					if(data['totalCount']){
						if(!totalCount){
							totalCount = data['totalCount'];
						}
						var interposition = '';
						if(e_type){
							interposition = '<div class="mui-card text-cl">'+lg('共：','Total：')+data['totalCount']+lg('人','People')+'</div>';
							$(interposition).appendTo('#trustee_list');
							e_type = false;
						}
						for (var i=0;i<data['delegates'].length;i++) {
							interposition = '';
							interposition += '<div class="mui-card"><li class="mui-table-view-cell mui-checkbox mui-left mui-table-view mui-text-right text-cl"><input id="checkbox'+(numb_offset+i)+'" type="checkbox"'+(data['delegates'][i]['voted']?('" disabled="disabled" checked="checked"'):('value="'+(numb_offset+i)))+'">'+data['delegates'][i]['rate']+'</li>';
							interposition += '<li class="mui-table-view-cell mui-collapse mui-table-view"><a class="mui-navigate-right" id="username'+(numb_offset+i)+'" href="#">'+data['delegates'][i]['username']+'</a>';
							interposition += '<div class="mui-collapse-content"><form class="mui-input-group"><div class="mui-card-header"><div class="mui-text-left mui-col-xs-2">'+lg('地址','Address')+'</div><input type="text" disabled="disabled" class="mui-text-right text-min" value="'+data['delegates'][i]['address']+'"></div>';
							interposition += '<div class="mui-card-header"><div class="mui-text-left">'+lg('余额','Balance')+'</div><div class="mui-text-right text-min">'+(data['delegates'][i]['balance']/100000000)+'</div></div>';
							interposition += '<div class="mui-card-header"><div class="mui-text-left">'+lg('公钥','Public Key')+'</div><div class="mui-text-right"><div class="textarea-class" id="publicKey'+(numb_offset+i)+'">'+data['delegates'][i]['publicKey']+'</div></div></div>';
							interposition += '<div class="mui-card-header"><div class="mui-text-left">'+lg('生产率','Productivity')+'</div><div class="mui-text-right text-min">'+data['delegates'][i]['productivity']+'%</div></div>';
							interposition += '<div class="mui-card-header"><div class="mui-text-left">'+lg('生产块数','Number of produced blocks')+'</div><div class="mui-text-right text-min">'+data['delegates'][i]['producedblocks']+'</div></div>';
							interposition += '<div class="mui-card-header"><div class="mui-text-left">'+lg('得票率','Approval Rate')+'</div><div class="mui-text-right text-min">'+data['delegates'][i]['approval']+'%</div></div></form></div></li></div>';
							$(interposition).appendTo('#trustee_list');
						}
						if(numb_offset < (totalCount-20)){
							numb_offset += 20;
							addData();
						}
		            }
				}
		    }
	    });	
	}
}
addData();
public_addData();//公共下拉加载
if(localStorage.language == 1){
	$('#password_id').attr('placeholder','请输入二级密码');
}else{
	$('#password_id').attr('placeholder','Please enter a two-level password');
}
var SelectIDSArray = new Array();
var list = document.getElementById('trustee_list');
 //监测所有inputcheckbox)的变化
 mui('#trustee_list').on('change','input',function(){
     //选中的checkbox的数量
     var checkedbox = list.querySelectorAll('input[type="checkbox"]:checked');
     //该数组用来存储选中订单的订单号
     SelectIDSArray = new Array();
     for(var i = 0;i<checkedbox.length;i++){
         var item = checkedbox[i];
         //item是通过ajax从后台请求的订单数据，该数据为JSON数据。
         var obj = item.getAttribute('value');
		 if(obj){
             //将选中的订单ID存储起来
             SelectIDSArray.push(obj);
		 }
     }
     if(SelectIDSArray.length){
     	set_a_true();//设置标签有效
     }else{
     	set_a_fasle();//设置标签无效
     }
//		        console.log(SelectIDSArray.length);
//		        console.log(SelectIDSArray);
 });

//投票/删除
function vote(){
	var strExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
	secondPassword = $('#password_id').val();
	if(SelectIDSArray.length == 0 && record_SelectIDSArray.length == 0){
			mui.toast(lg('请选择一位受托人!','Please choose a trustee!'));
		return;
	}	
	if(localStorage.secondSignature == 'true'){
		if(!secondPassword){
			mui.toast(lg('密码不能为空!','Password can not be blank!'));
			return;
		}
		if(!strExp.test(secondPassword)){
			mui.toast(lg('密码格式输入有误!','Password format input is incorrect!'));
			return;
		}
	}
	var password = localStorage.password;
	// 投票内容是一个列表，列表中的每一个元素是一个符号加上所选择的受托人的公钥，符号为+表示投票，符号为-表示取消投票					
	var voteContent = new Array()
	if(switchover_type == 1){
		for(var i=0;i<SelectIDSArray.length;i++){
			voteContent.push('+'+$('#publicKey'+SelectIDSArray[i]).html());
		}
	}else if(switchover_type == 2){
		for(var i=0;i<record_SelectIDSArray.length;i++){
			voteContent.push('-'+$('#publicKey_'+record_SelectIDSArray[i]).html());
		}
	}
	
	var transaction = window.AschJS.vote.createVote(voteContent, password, secondPassword || undefined);
//					console.log(JSON.stringify(transaction));
//					return;
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
//		          timeout:30000,//超时时间设置为30秒
      success:function (data) {
      		if(data['success'] == true){
      			if(switchover_type == 1){
					for(var i=0;i<SelectIDSArray.length;i++){
						document.getElementById("checkbox"+SelectIDSArray[i]).disabled="disabled";
					}
					SelectIDSArray = [];
          			mui.toast(lg('投票成功','Vote for success'));
				}else if(switchover_type == 2){
					for(var i=0;i<record_SelectIDSArray.length;i++){
						$('#card_'+record_SelectIDSArray[i]).hide();
					}
					record_SelectIDSArray = [];
					mui.toast(lg('删除成功','Successfully deleted'));
				}
				$('#select_li').html('');
      			$('#password_id').val('');
      			$('#topPopover').hide();
				$('#topPopover').removeClass("mui-active");
				$('.mui-backdrop').hide();
				$('.mui-backdrop').removeClass("mui-active");
      		}else{
      			mui.toast(data['error']);
      		}
          
	    }
    });
}
//投票记录
function vote_record(){
	if(localStorage.address){
//	 				return;
	  $.ajax({
          	url:localStorage.overall_url + '/api/accounts/delegates',
            type:'get',
            dataType:'json',
            data:{
            	address:localStorage.address,
            	orderBy:'rate:asc',
				limit:20,
				offset:0
            },
            timeout:30000,//超时时间设置为30秒
            success:function (data) {
                if(data['success'] == true){
					if(data['delegates'].length){
						var str = '<div class="mui-card text-cl">'+lg('共：','Total：')+data['delegates'].length+lg('人','People')+'</div>';
						$(str).appendTo('#voting_record');
						for (var i=0;i<data['delegates'].length;i++) {
							str = '';
							str += '<div class="mui-card" id="card_'+i+'"><li class="mui-table-view-cell mui-checkbox mui-left mui-table-view mui-text-right text-cl"><input id="checkbox_'+i+'" type="checkbox" '+'value="'+i+'">'+data['delegates'][i]['rate']+'</li>';
							str += '<li class="mui-table-view-cell mui-collapse mui-table-view"><a class="mui-navigate-right" id="username_'+i+'" href="#">'+data['delegates'][i]['username']+'</a>';
							str += '<div class="mui-collapse-content"><form class="mui-input-group"><div class="mui-card-header"><div class="mui-text-left mui-col-xs-2">'+lg('地址','Address')+'</div><input type="text" disabled="disabled" class="mui-text-right text-min" value="'+data['delegates'][i]['address']+'"></div>';
							str += '<div class="mui-card-header"><div class="mui-text-left">'+lg('公钥','Public Key')+'</div><div class="mui-text-right"><div class="textarea-class" id="publicKey_'+i+'">'+data['delegates'][i]['publicKey']+'</div></div></div>';
							str += '<div class="mui-card-header"><div class="mui-text-left">'+lg('生产率','Productivity')+'</div><div class="mui-text-right text-min">'+data['delegates'][i]['productivity']+'%</div></div>';
							str += '<div class="mui-card-header"><div class="mui-text-left">'+lg('生产块数','Number of produced blocks')+'</div><div class="mui-text-right text-min">'+data['delegates'][i]['producedblocks']+'</div></div>';
							str += '<div class="mui-card-header"><div class="mui-text-left">'+lg('得票率','Approval Rate')+'</div><div class="mui-text-right text-min">'+data['delegates'][i]['approval']+'%</div></div></form></div></li></div>';
							$(str).appendTo('#voting_record');
						}
		            }
				}
		    }
	    });	
	}
}

//谁投了我
function who_vote(){
	if(localStorage.address){
	  $.ajax({
          	url:localStorage.overall_url + '/api/delegates/voters',
            type:'get',
            dataType:'json',
            data:{
            	publicKey:localStorage.publicKey,
            	orderBy:'rate:asc',
				limit:20,
				offset:0
            },
            timeout:30000,//超时时间设置为30秒
            success:function (data) {
                if(data['success'] == true){
					if(data['accounts'].length){
						var str = '<div class="mui-card text-cl">'+lg('共：','Total：')+data['accounts'].length+lg('人','People')+'</div>';
						$(str).appendTo('#who_voted');
						for (var i=0;i<data['accounts'].length;i++) {
							str = '';
							str += '<div class="mui-card"><div class="mui-card-header"><div class="mui-text-left">'+lg('用户名','User Name')+'</div><div class="mui-text-right text-min">'+data['accounts'][i]['username']+'</div></div>';
							str += '<div class="mui-card-header"><div class="mui-text-left">'+lg('地址','Address')+'</div><div class="mui-text-right text-min">'+data['accounts'][i]['address']+'</div></div>';
							str += '<div class="mui-card-header"><div class="mui-text-left">'+lg('权重','Weight')+'</div><div class="mui-text-right text-min">'+data['accounts'][i]['weight']+'%</div></div></div>';
							$(str).appendTo('#who_voted');
						}
		            }
				}
		    }
	    });	
	}
}