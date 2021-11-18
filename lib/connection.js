"use strict";
var __assign = (this && this.__assign) || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
        t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var stompit = require("stompit");
var ActiveMQConnection = (function () {
  function ActiveMQConnection(config) {
    this.config = config;
    this.connect = this.connect.bind(this);
  }
  ActiveMQConnection.prototype.connect = function () {
    var connectOptions = {
      'host': this.config.host,
      'port': this.config.port,
      'connectHeaders': {
        'host': '/',
        'login': this.config.username,
        'passcode': this.config.password,
        'heart-beat': this.config.heartBeat ? this.config.heartBeat : '5000,0'
      }
    };
    var reconnectOptionsDefault = {
      initialReconnectDelay: 10,
      maxReconnectDelay: 60000,
      reconnectDelayExponent: 2
    };
    var reconnectOptionsMerged = __assign(__assign({}, reconnectOptionsDefault), reconnectOptionsDefault);
    return new Promise(function (resolve, reject) {
      var clientConnect = new stompit.ConnectFailover([connectOptions], reconnectOptionsMerged);
      clientConnect.on('connect', function () {
        console.log('[AMQ] Client connected to ' + connectOptions.host);
      });
      clientConnect.on('error', function (err) {
        console.log('[AMQ] Error connect init ' + err + new Date().toISOString());
      });
      clientConnect.connect(function (error, client, reconnect) {
        if (error) {
          console.log('[Error] AMQ cannot connect ', error);
          reject(error);
        }
        client.on('error', function (err) {
          reconnect();
        });
        resolve(client);
      });
    });
  };
  return ActiveMQConnection;
}());
exports.ActiveMQConnection = ActiveMQConnection;
function check(config) {
  var connectOptions = {
    'host': config.host,
    'port': config.port,
    'connectHeaders': {
      'host': '/',
      'login': config.username,
      'passcode': config.password,
      'heart-beat': config.heartBeat ? config.heartBeat : '5000,0'
    }
  };
  var reconnectOptionsDefault = {
    initialReconnectDelay: 10,
    maxReconnectDelay: 60000,
    reconnectDelayExponent: 2
  };
  var reconnectOptionsMerged = __assign(__assign({}, reconnectOptionsDefault), reconnectOptionsDefault);
  return new Promise(function (resolve, reject) {
    var clientConnect = new stompit.ConnectFailover([connectOptions], reconnectOptionsMerged);
    clientConnect.connect(function (error, client) {
      if (error) {
        reject(error);
      }
      client.on('error', function (err) {
        reject(error);
      });
      resolve();
    });
  });
}
exports.check = check;
