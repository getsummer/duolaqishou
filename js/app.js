/**
 * 演示程序当前的 “注册/登录” 等操作，是基于 “本地存储” 完成的
 * 当您要参考这个演示程序进行相关 app 的开发时，
 * 请注意将相关方法调整成 “基于服务端Service” 的实现。
 **/
(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		mui.getJSON(
			web_url+"ctrl=psuser&action=applogin",
			{
			"uname":loginInfo.account,
			"pwd":loginInfo.password
			},function(data){
				console.log( JSON.stringify(data) );
				if( data.error == true ){
					callback(data.msg);
				}else{//登录成功
					msg = data.msg;
					owner.setSettings({
						"autoLogin": true,
						"uid": msg.uid,
						"account": loginInfo.account,
						"password": loginInfo.password,
					});
					localStorage.setItem("userInfo", JSON.stringify(msg));
					callback()
				}
		})
	};
	
	/**
	 * 订单列表
	 **/
	owner.order = function(info, callback) {
		callback = callback || $.noop;
		
		var settings = app.getSettings();
		if (!settings.uid) {
			return callback({"error": true, "msg":"请先登录"});
		}
		
		var url = "";
		
		switch(info.type){
			case "waitorder":
				url = web_url+"ctrl=psuser&action=waitorder";
				break;
			case "getmyorder":
				url = web_url+"ctrl=psuser&action=getmyorder";
				break;
			case "getoverorder":
				url = web_url+"ctrl=psuser&action=getoverorder";
				break;
		}
		
		
		mui.getJSON(
			url,
			{"uid": settings.uid,"pwd":settings.password},
			function(data){
				console.log( JSON.stringify(data) );
				
				callback(data);
		})
		
	};

	/**
	 * 订单详情 
	 */
	
	owner.details = function(info, callback){
		callback = callback || $.noop;
		
		var settings = app.getSettings();
		if (!settings.uid) {
			return callback({"error": true, "msg":"请先登录"});
		}
		
		if( !info.id ){
			return callback({"error": true, "msg":"订单ID不能为空"});
		}
		
		mui.getJSON(
			web_url+"ctrl=psuser&action=appbuyerone",
			{"uid": settings.uid,"pwd":settings.password, "orderid": info.id},
			function(data){
				console.log( JSON.stringify(data) );
				
				callback(data);
		});
	}
	
	/**
	 * 操作订单 
	 */
	
	owner.ordercontrol = function(info, callback){
		callback = callback || $.noop;
		
		var settings = app.getSettings();
		if (!settings.uid) {
			return callback({"error": true, "msg":"请先登录"});
		}
		
		if( !info.id ){
			return callback({"error": true, "msg":"订单ID不能为空"});
		}
		
		mui.getJSON(
			web_url+"ctrl=psuser&action=ordercontrol",
			{"uid": settings.uid,"pwd":settings.password, "dotype": info.dotype, "orderid": info.id},
			function(data){
				console.log( JSON.stringify(data) );
				
				callback(data);
		});
	}
	
	/**
	 * 更新位置信息
	 **/
	owner.location = function(info, callback) {
		callback = callback || $.noop;
		
		var settings = app.getSettings();
		if (!settings.uid) {
			return callback({"error": true, "msg":"请先登录"});
		}
		// 获取客户端标识信息
		var userInfo = plus.push.getClientInfo();
		mui.getJSON(
			web_url+"ctrl=psuser&action=location",
			{"uid": settings.uid,"pwd":settings.password, "lat": info.lat, "lng": info.lng, "channelid": channelid, "userid": userInfo.clientid },
			function(data){
				console.log( JSON.stringify(data) );
				
				callback(data);
		});
	};
	
	

	/*
	 * 找回密码
	 */
	owner.findpwd = function(info, callback){
		callback = callback || $.noop;
		
		mui.post(
			web_url + "ctrl=app&action=findpwd",
			info,
			function(data){
				console.log( JSON.stringify(data) );
				
				callback(data);
		}, "json");
	}
	
	/**
	 * 设置应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 获取应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}
}(mui, window.app = {}));