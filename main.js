
		var content_type = "waitorder";
	
			var menu = null,
				main = null;
			var showMenu = false;
				var isInTransition = false;
	
mui('.mui-scroll-wrapper').scroll();
	
	//添加newId自定义事件监听
window.addEventListener('updateHeader',function(event){
	//获得事件参数
	var title = event.detail.title;
	document.getElementById("mui-title").innerHTML = title;
});
	
		//启用双击监听
		mui.init({
			gestureConfig:{
				doubletap:true
			}
		});
	
		var contentWebview = null;
		document.querySelector('header').addEventListener('doubletap',function () {
			if(contentWebview==null){
				contentWebview = plus.webview.currentWebview().children()[0];
			}
			if(mui.os.ios){
				contentWebview.evalJS("mui('#pullrefresh').pullRefresh().scrollTo(0,0,100)");
			}else{
				contentWebview.evalJS('mui.scrollTo(0, 100)');
			}
		});
		
		mui.plusReady(function(){
				main = plus.webview.currentWebview();
				main.addEventListener('maskClick', closeMenu);
				//处理侧滑导航，为了避免和子页面初始化等竞争资源，延迟加载侧滑页面；
				setTimeout(function() {
					menu = mui.preload({
						id: 'index-menu',
						url: 'index-menu.html',
						styles: {
							left: 0,
							width: '70%',
							zindex: -1
						},
						show: {
							aniShow: 'none'
						}
					});
				}, 200);
				
				
				window.pullRefresh = mui('#pullrefresh').pullToRefresh({
					down: {
						callback: function() {
							var table = document.body.querySelector('.mui-table-view');
							table.innerHTML = ""//清除内容
							mui('.mui-scroll-wrapper').scroll();
							pulldownRefresh();
						}
					}
				});

	});
	
	
	
	
	
	
			/**
			 * 显示侧滑菜单
			 */
			function openMenu() {
				if (isInTransition) {
					return;
				}
				if (!showMenu) {
					//侧滑菜单处于隐藏状态，则立即显示出来；
					isInTransition = true;
					menu.setStyle({
						mask: 'rgba(0,0,0,0)'
					}); //menu设置透明遮罩防止点击
					menu.show('none', 0, function() {
						//主窗体开始侧滑并显示遮罩
						main.setStyle({
							mask: 'rgba(0,0,0,0.4)',
							left: '70%',
							transition: {
								duration: 150
							}
						});
						mui.later(function() {
							isInTransition = false;
							menu.setStyle({
								mask: "none"
							}); //移除menu的mask
						}, 160);
						showMenu = true;
					});
					
					menu.evalJS("init();");
				}
			};
			/**
			 * 关闭菜单
			 */
			function closeMenu() {
				if (isInTransition) {
					return;
				}
				if (showMenu) {
					//关闭遮罩；
					//主窗体开始侧滑；
					isInTransition = true;
					main.setStyle({
						mask: 'none',
						left: '0',
						transition: {
							duration: 200
						}
					});
					showMenu = false;
					//等动画结束后，隐藏菜单webview，节省资源；
					mui.later(function() {
						isInTransition = false;
						menu.hide();
					}, 300);
				}
			};
			//点击左上角侧滑图标，打开侧滑菜单；
			document.querySelector('.mui-icon-bars').addEventListener('tap', function(e) {
				if (showMenu) {
					closeMenu();
				} else {
					openMenu();
				}
			});
			//敲击顶部导航，内容区回到顶部
			document.querySelector('header').addEventListener('tap', function() {
				main.children()[0].evalJS('mui.scrollTo(0, 100)');
			});
			//主界面向右滑动，若菜单未显示，则显示菜单；否则不做任何操作
			window.addEventListener("swiperight", openMenu);
			//主界面向左滑动，若菜单已显示，则关闭菜单；否则，不做任何操作；
			window.addEventListener("swipeleft", closeMenu);
			//侧滑菜单触发关闭菜单命令
			window.addEventListener("menu:close", closeMenu);
			window.addEventListener("menu:open", openMenu);
			//重写mui.menu方法，Android版本menu按键按下可自动打开、关闭侧滑菜单；
			mui.menu = function() {
					if (showMenu) {
						closeMenu();
					} else {
						openMenu();
					}
				}
	
	
	
	
			//首页返回键处理
			//处理逻辑：1秒内，连续两次按返回键，则退出应用；
			var first = null;
			mui.back = function() {
				if (showMenu) {
					closeMenu();
				} else {
					//首次按键，提示‘再按一次退出应用’
					if (!first) {
						first = new Date().getTime();
						mui.toast('再按一次退出应用');
						setTimeout(function() {
							first = null;
						}, 1000);
					} else {
						if (new Date().getTime() - first < 1000) {
							plus.runtime.quit();
						}
					}
				}
			};
			

			mui(".mui-table-view").on("tap", ".mui-table-view-cell", function(event){
				  mui.openWindow({
				    url: 'details.html?id='+this.attributes.oid, 
				    id:'details'
				  });
			})
			


			
			/**
			 * 下拉刷新具体业务实现
			 */
			function pulldownRefresh() {
				
				app.order({type: content_type}, function(data){
						var table = document.body.querySelector('.mui-table-view');
						table.innerHTML = ""//清除内容
						
						window.pullRefresh.endPullDownToRefresh();
						if( data.error == true ){
							plus.nativeUI.toast(data.msg);
						}else{
							var list = data.msg
							for( var i = 0 ; i < list.length ; i++ ){
								var rowData = list[i];
								var li = document.createElement('li');
								li.className = 'mui-table-view-cell';
								li.attributes.oid = rowData.orderid;
								var html = ""
								html+='<a href="javascript:;">';
								html+='<div style="clear:both;"><div style="width:50%; text-align: center;float:left;"><span>¥'+rowData.psycost+'</span><p>本单收入</p></div>';
								html+='<div style="width:50%; text-align: center;;float:left;"><span>'+rowData.postdate+'</span><p>配送时间</p></div></div>';
								html+='<div style="clear:both; padding-top: 10px;">	<h4>'+rowData.shopname+'   <span style="color: red;">('+rowData.orderstatus+')</span></h4>'
								html+='	<h5 style="margin-top:10px; color: yellowgreen;">商家地址：'+rowData.shopaddress+'</h5>'
								html+='	<h5 style="margin-top:10px; color: yellowgreen;">送达地址：'+rowData.buyeraddress+'</h5>'
								html+='	</div>'
								html+='</a>'
								
								li.innerHTML = html
								//下拉刷新，新纪录插到最前面；
								table.appendChild(li);
								
							}
						}
				})
			}
			
	//添加newId自定义事件监听
window.addEventListener('updateType',function(event){
	//获得事件参数
	var type = event.detail.type;
	
	content_type = type;
	window.pullRefresh.pullDownLoading();
});

window.addEventListener('show',function(event){
	window.pullRefresh.pullDownLoading();
	if(!window.locationInterVal){
				window.locationInterVal = setInterval(function(){
					getLocation();
				}, 5000);
	}
	
});