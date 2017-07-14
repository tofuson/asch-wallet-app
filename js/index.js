//localStorage.overall_url = 'http://testnet.asch.so:4096';//测试网络
//localStorage.overall_url = 'http://mainnet.asch.so';//官方
localStorage.overall_url = 'http://122.139.66.196:9999';//节点问题处理
localStorage.yearOne = 1467057600;//创世块时间戳
localStorage.version = '1.1.1';//版本号
window.l10n = {
    'en-us': {
        title: 'Asch Mobile Wallet',
        login: 'Login',
        new:'Sign In',
        create_password:'Create Master Secret',
        new_password:'New Master Secret',
        system_create:'System has already generated a new secure secret,Please backup is good, if lost, will not be able to find',
        copy_password:'Copy password',
        close:'Close',
        },
    'zh-cn': {
    	title: 'Asch移动钱包',
    	login: '登陆',
        new:'注册',
        create_password:'创建主密码',
        new_password:'新的主密码',
        system_create:'系统为您生成了足够安全的新密码<br>请备份好，如若丢失，将无法找回',
        copy_password:'复制主密码',
        close:'关闭',
    }
}

//开始默认加载
L10N.updateLang('zh-cn');
document.getElementById("mySwitch").addEventListener("click",function(event){
  if(localStorage.language == 1){
    L10N.updateLang('en-us');
    $('#password').attr('placeholder','Type the master secret');
    localStorage.language = 0;
  }else{
    L10N.updateLang('zh-cn');
    $('#password').attr('placeholder','请输入主密码');
    localStorage.language = 1;
  }
})

//注销
var num=location.href.indexOf("?")
if(num != -1){
	localStorage.removeItem('address');
	localStorage.removeItem('password');
	localStorage.removeItem('secondSignature');
	localStorage.removeItem('publicKey');
	localStorage.removeItem('language');
	window.location.href = 'index.html';
}else{
		$(document).ready(
		    function()
		    {
		        $('#form_id').delay(500).show(0);
		        if(!(localStorage.language==0||localStorage.language==1)){
		        	localStorage.language = 1;//1中文/0英文
		        }
		    }
		);
}
//检测密码是否为空
if(localStorage.password){
	localStorage.publicKey = window.AschJS.crypto.getKeys(localStorage.password).publicKey;  //根据密码生成公钥
    $.ajax({
          	url:localStorage.overall_url + '/api/accounts/open2',
            type:'post',
            dataType:'json',
            contentType: 'application/json',
            data:JSON.stringify({publicKey:localStorage.publicKey}),
            success:function (data) {
                if(data['success'] == true){
                	window.location.href = 'asch-handlock.html';
                	localStorage.address = data['account']['address'];
                	localStorage.secondSignature = data['account']['secondSignature'];
                }
		    }
    });
}
		
//登陆
function login(){
	localStorage.password = document.getElementById('password').value;
	if(!localStorage.password){
		alert(localStorage.language==1?'密码不能为空!':'Password can not be blank!');
		localStorage.removeItem('password');
		return;
	}
	var space_count = 0;
	localStorage.password.replace(/\s/g,function(){ space_count++; });
	if(localStorage.password.length<40 || space_count!=11){
		alert(localStorage.language==1?'密码格式不符合BIP39安全规范!':'Password format does not meet BIP39 security specifications!');
		localStorage.removeItem('password');
		return;
	}
	localStorage.publicKey = window.AschJS.crypto.getKeys(localStorage.password).publicKey;  //根据密码生成公钥
    $.ajax({
          	url:localStorage.overall_url + '/api/accounts/open2',
            type:'post',
            dataType:'json',
            contentType: 'application/json',
            data:JSON.stringify({publicKey:localStorage.publicKey}),
            success:function (data) {
//		            	console.log(JSON.stringify(data));
                if(data['success'] == true){
                	window.location.href = 'asch-handlock.html';
                	localStorage.address = data['account']['address'];
                }
		    }
    });
}
//注册
function register(){
	var mnemonics = { "english": new Mnemonic("english") };
    var mnemonic = mnemonics["english"];
    var numWords = parseInt(12);
    var strength = numWords / 3 * 32;
    var words = mnemonic.generate(strength);
//	        console.log(words);
    $('#new_password').html(words);
    $(".copy_id").attr("data-clipboard-text",words);
}