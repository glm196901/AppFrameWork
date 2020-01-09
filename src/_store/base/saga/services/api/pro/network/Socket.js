export class Socket {
    constructor(url) {
        if (!url)
            return console.error('请传入服务器地址来创建socket连接');

        this._client = new WebSocket(url);
        this._queue = [];
        this._callback = {};
        this._delayQueue = [];
        this._currentURL = url;
        this._client.onopen = this._onOpen;
        this._client.onerror = this._onError;
        this._client.onclose = this._onClose;
        this._client.onmessage = this._onMessage;
        this._count = 0;
        this._tryCount = 0;
        this._maxTryCount = 10;
        this._tryInterval = 5;
        this._trying = false;
        this._trigger = {};
    }

    _onOpen = () => {
        console.log('The server connect success');
        console.log('服务器连接成功...');
        this._trying = false;
        this._tryCount = 0;
        let len = this._delayQueue.length;
        //发送延迟的请求
        if (len > 0) {
            while (len > 0) {
                let buffer = this._delayQueue.shift();
                this.load(buffer);
                len = this._delayQueue.length;
            }
        }
    };

    _onError = (event) => {
        console.log("The server connection has an error: ", event);
        console.log('服务器连接发生错误', event);
    };

    _onClose = () => {
        this._trying = false;
        console.log("The server connection has been closed.");
        console.log("服务器连接已关闭");

        if (this._tryCount > this._maxTryCount)
            return;
        setTimeout(() => {
            this._retry();
        }, this._tryInterval * 1000); //wait n second to retry.
    };

    _onMessage = (msg) => {
        let data = JSON.parse(msg.data);
        if (!data || data.length === 0)
            return;
        console.log(data);
        debugger;
    };

    _retry() {
        if (this._trying)
            return;

        if (this._client && this._client.readyState === WebSocket.OPEN)
            return;

        try {
            this._trying = true;
            this._tryCount++;
            this._client = new WebSocket(this._currentURL);
            this._client.onopen = this._onOpen;
            this._client.onerror = this._onError;
            this._client.onclose = this._onClose;
            this._client.onmessage = this._onMessage;
        } catch (e) {
            console.log('The server is down for maintenance,please try again later');
            console.log('服务器正在维护,请稍后重试');
        }
    }

    emit(buffer) {
        if (this._client.readyState === WebSocket.CLOSED || this._client.readyState === WebSocket.CLOSING) {
            this.delayQueue(buffer);
            console.log('The server is closed...\nmessage will be send,when the server is reconnect.');
            console.log('webSocket已经关闭...\n消息将会再重连后发送');
            return;
        }
        if (this._client.readyState === WebSocket.CONNECTING) {
            this.delayQueue(buffer);
            console.log('The server is connecting...\nmessage will be send delay');
            console.log('webSocket正在连接中...\n消息将会延迟发送');
            return;
        }
        if (this._client.readyState === WebSocket.OPEN) {
            if (buffer) {
                this._count++;
                console.log('发送消息', buffer);
                this._client.send(JSON.stringify(buffer));
            }
        }
    }

    delayQueue(buffer){
        if (!this._delayQueue.contains(buffer))
            this._delayQueue.push(buffer);
    }

    on(cmd,callback){
        this._trigger[cmd] = callback;
    }
}

