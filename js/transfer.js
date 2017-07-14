mui.init();			
if(localStorage.language == 1){
	$('#second_show').css('height','30px');
	$('#addr_id').attr('placeholder','请输入对方的Asch地址');
	$('#asch_id').attr('placeholder','请输入转账金额');
	$('#second_id').attr('placeholder','请输入二级密码');
}else{
	$('#second_show').css('height','60px');
	$('#addr_id').attr('placeholder','Asch address of the other party');
	$('#asch_id').attr('placeholder','Enter the amount transferred');
	$('#second_id').attr('placeholder','Enter a secondary password');
}
//确定转账
function transfer(){
	if(localStorage.password){
		var targetAddress = $('#addr_id').val();  
		var amount = parseFloat($('#asch_id').val())*100000000;   //100 XAS
		var password = localStorage.password;
		var secondPassword = $('#second_id').val();
		var strExp =  /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
		
		if(!targetAddress){
			mui.toast(lg('接受者地址不能为空!','The recipient address can not be empty!'));
			return;
		}
		if(!amount){
			mui.toast(lg('转账金额不能为空!','Transfer amount can not be empty!'));
			return;
		}
		if(amount > parseFloat($('#overall_balance').val())*100000000){
			$('#asch_id').val('');
			mui.toast(lg('余额不足!','Insufficient balance!'));
			return;
		}
		if(localStorage.secondSignature == 'true'){
			if(!strExp.test(secondPassword)){
				mui.toast(lg('密码格式输入有误!','Password format input is incorrect!'));
				return;
			}
		}
		// 其中password是在用户登录的时候记录下来的，secondPassword需要每次让用户输入
		// 可以通过user.secondPublicKey来判断用户是否有二级密码，如果没有，则不必输入，以下几个交易类型类似
		var transaction = window.AschJS.transaction.createTransaction(targetAddress, amount, password, secondPassword || undefined);       
		// 将上面生成的转账操作的交易数据通过post提交给asch server
	
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
	  		console.log(data);
	  		if(data['success'] == true){
	  			$('#asch_id').val('');
	  			mui.toast(lg('转账成功','Transfer successful'));
	  		}else{
	  			mui.toast(data['error']);
		          		}
		              
				    }
		    	});
			}
	   }
	$('#send_addr').attr('placeholder',localStorage.address)
if(localStorage.address){
	//查看个人基本信息
	$.get(
        localStorage.overall_url + '/api/accounts?address=' + localStorage.address, 
	    function (data) {
//			      console.log(JSON.stringify(data));
	      if(data['success'] == true){
		      	$('#overall_balance').val(data['account']['balance']/100000000);
		      	localStorage.secondSignature = data['account']['secondSignature'];
		      	console.log(localStorage.secondSignature);
		      	if(data['account']['secondSignature']){
					$('#second_show').show();
				}
			}
	    }
	);
}