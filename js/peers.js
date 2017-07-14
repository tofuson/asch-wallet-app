mui.init();		
var search_offset = 0;
var total_count = 0;
//			return;
//数据加载
function addData() {
	  //查看有效节点
	  $.ajax({
          	url:localStorage.overall_url + '/api/peers',
            type:'get',
            dataType:'json',
            data:{
				limit:10,
				offset:search_offset
            },
            timeout:30000,//超时时间设置为30秒
            success:function (data) {
                if(data['success'] == true){
					if(data['totalCount'][0]){
					  var interposition = '';
					  total_count = data['totalCount'][0];
					  for (var i=0;i<data['peers'].length;i++) {
					  	var ip = data['peers'][i]['ip'];
					  	var ip_array =  ip.split('.');
						interposition += '<div class="mui-card"><div class="mui-card-header"><div class="mui-text-left">IP</div><div class="mui-text-right"><div class="mui-text-right text-cl">*.*.'+ip_array[2]+'.'+ip_array[3]+'</div></div></div>';
						interposition += '<div class="mui-card-header"><div class="mui-text-left">'+lg('版本','Version')+'</div><div class="mui-text-right text-cl">'+data['peers'][i]['version']+'</div></div>';
						interposition += '<div class="mui-card-header"><div class="mui-text-left">'+lg('操作系统','OS')+'</div><div class="mui-text-right text-cl">'+data['peers'][i]['os']+'</div></div></div>';
					  }
				    interposition += '<div class="mui-text-center"><button onclick="up_page()">'+lg('上一页','Previous page')+'</button><button onclick="down_page()">'+lg('下一页','Next page')+'</button></div>';
					  $('#all_peers').html(interposition);
		            }
				}
		    }
   });	
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
	addData();
}
//向下翻页
function down_page(){
	if(search_offset > (total_count-10)){
		mui.toast(lg('已经是最后一页了！','Is the last page!'));
		return;
	}
	search_offset += 10;
	addData();
}