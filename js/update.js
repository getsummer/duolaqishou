function updateApp(){
	if (!mui.os.android) {
		return;
	}
	mui.getJSON(web_url+"ctrl=app&action=checkupdate&apptype=psuer",function (data) {
		if(data.error){
			plus.nativeUI.toast(data.msg);
			return;
		}
		
		var appvison = data.msg.appvison;
		var appdownload = data.msg.appdownload;
		
		if( appvison != plus.runtime.version ){
			plus.nativeUI.confirm("发现新版本，确认更新？",function(event){
				if ( 0==event.index ) {
					plus.runtime.openURL( appdownload );
				}
			},"更新提示",["立即更新","取　　消"]);
		}
	});
}
