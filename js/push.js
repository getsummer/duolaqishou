function initPush(){
    // 监听在线消息事件
    plus.push.addEventListener( "receive", function( msg ) {
        if ( msg.aps ) {  // Apple APNS message
        } else {
        }
        var content = eval("("+msg.payload+")");
        switch(content.type){
        		case "notice":
        		createLocalPushMsg(content.title, content.content);
        		break;
        		case "neworder":
        		newOrder(content.content);
        		break;
        }
    }, false );
}

function createLocalPushMsg(title,content){
    var options = {cover:false,title:title};
    plus.push.createMessage( content, "LocalMSG", options );
}


function newOrder(info){
	createLocalPushMsg("您有一个新的订单", "您有一个新的订单，请点击查看");
}
