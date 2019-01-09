mui.init();
		//初始化单页view
		var viewApi = mui('#app').view({
			defaultPage: '#checkPhonePage'
		});
		//初始化单页的区域滚动
		mui('.mui-scroll-wrapper').scroll();
		
	var oldBack = mui.back;
	mui.back = function() {
		if (viewApi.canBack()) { //如果view可以后退，则执行view的后退
			viewApi.back();
		} else { //执行webview后退
			oldBack();
		}
	};
	

	
mui.plusReady(function(){
	init();
});

document.getElementById("toSetPassBtn").onclick = function(){
	if(document.getElementById("phone").value == ""){
		mui.alert("请输入手机号");
		return false;
	}else if(document.getElementById("code").value == ""){
		mui.alert("请输入验证码");
		return false;
	}
	
	viewApi.go("#setPassPage");
}


document.getElementById("subBtn").onclick = function(){
	var info = {};
	info.phone = document.getElementById("phone").value;
	info.code = document.getElementById("code").value;
	info.newpwd = document.getElementById("pwd1").value;
	info.surepwd = document.getElementById("pwd2").value;
	
	plus.nativeUI.showWaiting();
	app.findpwd(info, function(data){
		plus.nativeUI.closeWaiting();
		if(data.error){
			plus.nativeUI.toast(data.msg);
			return;
		}
		mui.toast("密码修改成功");
		oldBack();
	});
}

window.addEventListener('reshow',function(event){
	var settings = app.getSettings();
	if (settings.uid) {
		oldBack();
	}
});