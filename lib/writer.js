"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ActiveMQWriter = (function () {
  function ActiveMQWriter(client, destinationName, subscriptionName, contentType, prefix, log) {
    this.client = client;
    this.destinationName = destinationName;
    this.subscriptionName = subscriptionName;
    this.contentType = contentType;
    this.prefix = prefix;
    this.log = log;
    this.write = this.write.bind(this);
  }
  ActiveMQWriter.prototype.write = function (data, attributes) {
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
      if (_this.log) {
        _this.log('produce send data : ' + JSON.stringify(message));
      }
      var result = frame.write(JSON.stringify(message));
      frame.end(function (err) {
        if (err) {
          console.log('Error activemq: ', err);
          reject(err);
        }
      });
      resolve(result);
    });
  };
  return ActiveMQWriter;
}());
exports.ActiveMQWriter = ActiveMQWriter;
