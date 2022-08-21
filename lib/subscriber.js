"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("./core");
function createSubscriber(client, destinationName, subscriptionName, ackMode, ackOnConsume, logError, logInfo, prefix, retryCountName, encoding) {
  return new Subscriber(client, destinationName, subscriptionName, ackMode, ackOnConsume, logError, logInfo, prefix, retryCountName, encoding);
}
exports.createSubscriber = createSubscriber;
exports.createConsumer = createSubscriber;
exports.createReader = createSubscriber;
exports.createReceiver = createSubscriber;
var Subscriber = /** @class */ (function () {
  function Subscriber(client, destinationName, subscriptionName, ackMode, ackOnConsume, logError, logInfo, prefix, retryCountName, encoding) {
    this.client = client;
    this.ackMode = ackMode;
    this.ackOnConsume = ackOnConsume;
    this.logError = logError;
    this.logInfo = logInfo;
    this.prefix = prefix;
    this.encoding = (encoding && encoding.length > 0 ? encoding : 'utf-8');
    this.destinationName = destinationName;
    this.subscriptionName = subscriptionName;
    if (!retryCountName || retryCountName.length === 0) {
      this.retryCountName = 'retryCount';
    }
    else {
      this.retryCountName = retryCountName;
    }
    this.subscribe = this.subscribe.bind(this);
    this.get = this.get.bind(this);
    this.receive = this.receive.bind(this);
    this.read = this.read.bind(this);
    this.consume = this.consume.bind(this);
  }
  Subscriber.prototype.get = function (handle) {
    return this.subscribe(handle);
  };
  Subscriber.prototype.receive = function (handle) {
    return this.subscribe(handle);
  };
  Subscriber.prototype.read = function (handle) {
    return this.subscribe(handle);
  };
  Subscriber.prototype.consume = function (handle) {
    return this.subscribe(handle);
  };
  Subscriber.prototype.subscribe = function (handle) {
    var _this = this;
    var prefix = this.prefix && this.prefix.length > 0 ? this.prefix : '/';
    var subscribeHeaders = {
      'destination': "" + this.destinationName + prefix + this.subscriptionName,
      'ack': this.ackMode,
      'subscription-type': 'ANYCAST'
    };
    this.client.subscribe(subscribeHeaders, function (error, message) {
      if (error && _this.logError) {
        _this.logError('subscribe error ' + error.message);
        return;
      }
      if (_this.logInfo) {
        _this.logInfo('received : ' + message);
      }
      message.readString(_this.encoding, function (errorRead, body) {
        if (errorRead && _this.logError) {
          _this.logError('read message error ' + errorRead.message);
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
              throw new Error('message is empty!');
            }
            handle(messageContent.data, messageContent.attributes, message);
          }
        }
        catch (e) {
          if (_this.logError) {
            _this.logError('Fail to consume message: ' + core_1.toString(e));
          }
        }
        if (_this.ackOnConsume && _this.ackMode !== 'auto') {
          _this.client.ack(message);
        }
      });
    });
  };
  return Subscriber;
}());
exports.Subscriber = Subscriber;
