
	document.querySelector("#sendCodeSmsBtn").addEventListener('tap', function(e) {
		if(this.classList.contains("mui-disabled")){
			return false;
		}
		plus.nativeUI.showWaiting();
		
		var codetype = this.getAttribute("codetype");
		
		var info = {};
		info.type = codetype;
		info.phone = document.getElementById("phone").value;
		
		mui.getJSON(
			web_url+"ctrl=app&action=sendregphone",
			info,
			function(data){
				plus.nativeUI.closeWaiting();
				console.log( JSON.stringify(data) );
				if( data.error == true ){
					plus.nativeUI.toast(data.msg);
					return false;
				}
				//发送成功
				plus.nativeUI.toast("验证码发送成功");
				document.getElementById("sendCodeSmsBtn").classList.add("mui-disabled");
				window.codet = data.msg;
				document.getElementById("sendCodeSmsBtn").innerHTML = "重发("+window.codet+")";
				window.codeInterval = setInterval(function(){
					--window.codet;
					if(window.codet == 0){
						document.getElementById("sendCodeSmsBtn").innerHTML = "发送验证码";
						clearInterval(window.codeInterval);
					}else{
						document.getElementById("sendCodeSmsBtn").innerHTML = "重发("+window.codet+")";
					}
				}, 1000);
			}
		);
    });