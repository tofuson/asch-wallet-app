//更新
function update(){
	mui.ajax('http://asch.mobi/update.php',{
		dataType:'text',
		type:'get',
		success:function(data){
			data = data.split(':')
		    if(data[0] != localStorage.version){
		    	plus.nativeUI.confirm(data[1], function(event) {
					if (0 == event.index) {
						plus.runtime.openURL('http://asch.mobi/Asch.apk');
					}
				}, data.title, [localStorage.language==1?"更新":'Update', localStorage.language==1?"取消":'Cancel']);
		    }
		},
	});
}
mui.os.plus && !mui.os.stream && mui.plusReady(update);