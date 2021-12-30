/**
 * 消息通知订阅
 */ 
 const xujian= function(callback,callback1,callback2) {

    var _sub = {
        init: function() {
            initCometd();
        }
    }
	
	_sub.init();

    /**
     * 初始化cometd
     */
    function initCometd() {
        var _cometd = new org.cometd.CometD("xjInfoReport");
        _cometd.websocketEnabled = true;
        var cometdUrl = "http://106.37.227.21:23980/scooper-msg-queue/cometd";

        _cometd.init({
            url: cometdUrl,
            logLevel: "info"
        });

        _cometd.addListener("/meta/handshake", function(message) {
            if (message.successful) {
                console.log("handshake success.");
            }
        });

        var _connected = false;
        _cometd.addListener('/meta/connect', function(message) {
            if (message.successful) {
                if (!_connected) {
                    doSubscribe(_cometd,callback,callback1,callback2);
                }
                _connected = true;
            } else {
                _connected = false;
                console.log("连接cometd后台失败");
            }
        });
    }

    /** 
     * 对订阅的通知进行处理
     */
    function doSubscribe(_cometd,callback,callback1,callback2) {

        /**
         * 会场模块消息通知
         */

        //  传真接收
        _cometd.subscribe('/scooper-fax/notify/fax/recvFax', null, function(message) {
            callback(message.data)
            
        });

        // 短信接收
        _cometd.subscribe('/scooper-sms/notify/msg/recvMsg', null, function(message) {
            callback1(message.data)
            
        });

        // // 电话状态
        _cometd.subscribe('/dispatch-web/notify/call/telStatus', null, function(message) {
            callback2(message.data)
        });
	}

}
export default xujian