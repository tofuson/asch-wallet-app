mui.init();
var balance;
//数据加载
function addData() {
	if(localStorage.address){
		//查看个人基本信息
		$.get(
	        localStorage.overall_url + '/api/accounts?address=' + localStorage.address, 
		    function (data) {
//			      console.log(JSON.stringify(data));
		      if(data['success'] == true){
		      		balance = data['account']['balance']/100000000;
			      	$('#balance_id').html(data['account']['balance']/100000000);
			      	$('#addr_id').val(data['account']['address']);
			      	$('#secondPassword').html(data['account']['secondSignature']?lg('已设置','Have Set'):lg('未设置','Not Set'));
  			      	$('#publicKey').html(data['account']['publicKey']);			  			  
  			      	localStorage.secondSignature = data['account']['secondSignature'];
  			      	if(data['account']['secondSignature']){
  			      		$('#already_id').show();
  			      	}else{
  			      		$('#setting_id').show();
  			      	}
				}
		    }
		);
	}
}
addData();
public_addData();//公共下拉加载
if(localStorage.language == 1){
	$('#password_id').attr('placeholder','输入8到16位数字和字母组合');
	$('#second_id').attr('placeholder','请再次输入');
}else{
	$('#password_id').attr('placeholder','Enter 8 to 16 digits and letter combinations');
	$('#second_id').attr('placeholder','Please enter again');
}
//数据提交
function submit_data(){
	if(localStorage.address){
		var passwordData = $('#password_id').val();  
		var secondPassword  = $('#second_id').val();
		var strExp =  /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
		if(!passwordData || !secondPassword){
			mui.toast(lg('密码不能为空!','password can not be blank!'));
			return;
		}
		if(passwordData != secondPassword){
			mui.toast(lg('两次密码不一致!','Two passwords are inconsistent!'));
			return;
		}
		if(strExp.test(secondPassword)){
			var transaction = window.AschJS.signature.createSignature(localStorage.password,secondPassword);
//						console.log(JSON.stringify(transaction));
//						return;
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
//				          		console.log(data);
	          		if(data['success'] == true){
	          			$('#setting_id').hide();
	          			$('#already_id').show();
	          			$('#secondPassword').html(lg('已设置','Have Set'));
	  			      	localStorage.secondSignature = true;
	  			      	$('#balance_id').html(parseFloat(balance)-5);
	          			mui.toast(lg('设置成功','Successfully Set'));
	          		}else{
	          			mui.toast(data['error']);
	          		}
	              
			    }
		    });
	    
		}else{
			mui.toast(lg('密码格式不正确!','Password format is incorrect!'));
		}
	}
}