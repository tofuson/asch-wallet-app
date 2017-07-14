mui('body').on('tap','a',function(){document.location.href=this.href;}); 
// //侧滑容器父节点
//var offCanvasWrapper = mui('#offCanvasWrapper');
// //主界面容器
//var offCanvasInner = offCanvasWrapper[0].querySelector('.mui-inner-wrap');
// //菜单容器
//var offCanvasSide = document.getElementById("offCanvasSide");
// //移动效果是否为整体移动
//var moveTogether = false;
// //侧滑容器的class列表，增加.mui-slide-in即可实现菜单移动、主界面不动的效果；
//var classList = offCanvasWrapper[0].classList;
// //变换侧滑动画移动效果；
// if (moveTogether) 
// {
//	//仅主内容滑动时，侧滑菜单在off-canvas-wrap内，和主界面并列
//	offCanvasWrapper[0].insertBefore(offCanvasSide, offCanvasWrapper[0].firstElementChild);
//}
//classList.add('mui-scalable');
//offCanvasWrapper.offCanvas().refresh();
   //主界面和侧滑菜单界面均支持区域滚动；
mui('#offCanvasSideScroll').scroll();
mui('#offCanvasContentScroll').scroll();
   //实现ios平台原生侧滑关闭页面；
if (mui.os.plus && mui.os.ios) {
	mui.plusReady(function() { //5+ iOS暂时无法屏蔽popGesture时传递touch事件，故该demo直接屏蔽popGesture功能
		plus.webview.currentWebview().setStyle({
			'popGesture': 'none'
		});
	});
}

//切换左右滑动
//$('#offCanvasSide').removeClass('mui-off-canvas-right');
//$('#offCanvasSide').addClass('mui-off-canvas-left');
//监听顶部点击返回顶部事件
mui('.mui-inner-wrap').on('tap','.mui-title',function(){
	 mui('#offCanvasContentScroll').scroll().scrollTo(0,0,500);
}) 
//时间戳转换普通日期
function formatDate(now) {
	 now = parseInt(now)+parseInt(localStorage.yearOne);
	 now = new Date(now*1000);
	 var year=1900+now.getYear(); 
	 var month=now.getMonth()+1; 
	 var date=now.getDate(); 
	 var hour=now.getHours(); 
	 var minute=now.getMinutes(); 
	 var second=now.getSeconds(); 
	 return year+"/"+month+"/"+date+" "+hour+":"+minute+":"+second; 
}
 
 //公共下拉加载
function public_addData(){
	return;
	var _self;
	if(window.plus) {
		plusReady();
	} else {
		document.addEventListener("plusready", function() {
			plusReady();
		}, false);
	}

	function plusReady() {
		_self = plus.webview.currentWebview();
		_self.setPullToRefresh({
			support: true,
			height: '50px',
			range: '100px',
			style: 'circle',
			offset: '1px'
		}, pulldownRefresh);
		
		plus.key.addEventListener("backbutton",function () {
			_self.close("auto");
		},false);
	}

	/**
	 * 下拉刷新具体业务实现
	 */
	function pulldownRefresh() {
		setTimeout(function() {
			addData();
			_self.endPullToRefresh();
		}, 1000);
	}
}
//语言转换
function lg(cn,en){
	if(localStorage.language == 1){
		return cn;
	}else{
		return en;
	}
}