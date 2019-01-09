var web_url = "http://www.goucaichina.com/index.php?datatype=json&";
var channelid = "";

var $_GET = (function(){
    var url = window.document.location.href.toString();
    var u = url.split("?");
    if(typeof(u[1]) == "string"){
        u = u[1].split("&");
        var get = {};
        for(var i in u){
            var j = u[i].split("=");
            get[j[0]] = j[1];
        }
        return get;
    } else {
        return {};
    }
})();

function showWaiting(){
	plus.nativeUI.showWaiting("  加载中  ");
}

function hideWaiting(){
	plus.nativeUI.closeWaiting();
}

function getLocation(){
	plus.geolocation.getCurrentPosition( function ( p ) {

		var lng = p.coords.longitude;
		var lat = p.coords.latitude;
		localStorage.setItem("latitude", lat);
		localStorage.setItem("longitude", lng);
		
		app.location({lat: lat, lng: lng}, function(data){
		});
		return;
		
		
	}, function ( e ) {
		alert(JSON.stringify(e));
		alert( "Geolocation error: " + e.message );
	},{provider:'baidu', timeout: 60000, enableHighAccuracy: false});
}
