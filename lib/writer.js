"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("./core");
function createWriter(client, destinationName, subscriptionName, logError, logInfo, contentType, prefix) {
  return new Writer(client, destinationName, subscriptionName, logError, logInfo, contentType, prefix);
}
exports.createWriter = createWriter;
exports.createProducer = createWriter;
exports.createSender = createWriter;
exports.createPublisher = createWriter;
var Writer = /** @class */ (function () {
  function Writer(client, destinationName, subscriptionName, logError, logInfo, contentType, prefix) {
    this.client = client;
    this.destinationName = destinationName;
    this.subscriptionName = subscriptionName;
    this.logError = logError;
    this.logInfo = logInfo;
    this.contentType = contentType;
    this.prefix = prefix;
    this.write = this.write.bind(this);
    this.send = this.send.bind(this);
    this.publish = this.publish.bind(this);
    this.put = this.put.bind(this);
    this.produce = this.produce.bind(this);
  }
  Writer.prototype.put = function (data, attributes) {
    return this.write(data, attributes);
  };
  Writer.prototype.send = function (data, attributes) {
    return this.write(data, attributes);
  };
  Writer.prototype.produce = function (data, attributes) {
    return this.write(data, attributes);
  };
  Writer.prototype.publish = function (data, attributes) {
    return this.write(data, attributes);
  };
  Writer.prototype.write = function (data, attributes) {
    var _this = this;
    var prefix = this.prefix && this.prefix.length > 0 ? this.prefix : '/';
    var sendHeaders = {
      'destination': "" + this.destinationName + prefix + this.subscriptionName,
      'content-type': this.contentType && this.contentType.length > 0 ? this.contentType : 'text/plain',
    };
    var message = {
      data: data,
      attributes: attributes
    };
    return new Promise(function (resolve, reject) {
      var frame = _this.client.send(sendHeaders);
      if (_this.logInfo) {
        _this.logInfo('produce message: ' + JSON.stringify(message.data));
      }
      var result = frame.write(JSON.stringify(message.data));
      frame.end(function (err) {
        if (err) {
          if (_this.logError) {
            _this.logError('ActiveMQ error when sending message: ' + core_1.toString(err));
          }
          reject(err);
        }
      });
      resolve(result);
    });
  };
  return Writer;
}());
exports.Writer = Writer;
