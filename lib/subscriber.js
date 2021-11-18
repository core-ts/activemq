"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mq_one_1 = require("mq-one");
var ActiveMQSubscriber = (function () {
  function ActiveMQSubscriber(client, destinationName, subscriptionName, ackMode, ackOnConsume, prefix, retryCountName, logError, logInfo) {
    this.client = client;
    this.ackMode = ackMode;
    this.ackOnConsume = ackOnConsume;
    this.prefix = prefix;
    this.logError = logError;
    this.logInfo = logInfo;
    this.destinationName = destinationName;
    this.subscriptionName = subscriptionName;
    if (!retryCountName || retryCountName.length === 0) {
      this.retryCountName = 'retryCount';
    }
    else {
      this.retryCountName = retryCountName;
    }
    this.subscribe = this.subscribe.bind(this);
  }
  ActiveMQSubscriber.prototype.subscribe = function (handle) {
    var _this = this;
    var prefix = this.prefix && this.prefix.length > 0 ? this.prefix : '/';
    var subscribeHeaders = {
      'destination': "" + this.destinationName + prefix + this.subscriptionName,
      'ack': this.ackMode,
      'subscription-type': 'ANYCAST'
    };
    this.client.subscribe(subscribeHeaders, function (error, message) {
      if (error && _this.logError) {
        _this.logError('Subscribe error ' + error.message);
        return;
      }
      if (_this.logInfo) {
        _this.logInfo('received : ' + message);
      }
      message.readString('utf-8', function (errorRead, body) {
        if (errorRead && _this.logInfo) {
          _this.logInfo('read message error ' + errorRead.message);
          return;
        }
        if (_this.logInfo) {
          _this.logInfo('received message: ' + body);
        }
        var messageContent = {};
        try {
          if (body) {
            if (JSON.parse(body)[_this.retryCountName]) {
              messageContent.data = JSON.parse(body).data;
              messageContent.attributes = JSON.parse(body)[_this.retryCountName];
            }
            else {
              var a = {};
              a[_this.retryCountName] = '0';
              messageContent.data = JSON.parse(body);
              messageContent.attributes = a;
            }
            if (!messageContent.data) {
              throw new Error('message content is empty!');
            }
            handle(messageContent.data, messageContent.attributes);
          }
        }
        catch (e) {
          if (_this.logError) {
            _this.logError('Fail to consume message: ' + mq_one_1.toString(e));
          }
        }
        if (_this.ackOnConsume && _this.ackMode !== 'auto') {
          _this.client.ack(message);
        }
      });
    });
  };
  return ActiveMQSubscriber;
}());
exports.ActiveMQSubscriber = ActiveMQSubscriber;
