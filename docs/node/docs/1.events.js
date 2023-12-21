const EventEmitter = require("events"); //事件触发器 on emit off once

function Girl() {}
// 如何继承类的原型方法 extends

// class Girl extends EventEmitter{}; 会继承实例属性，也会继承原型属性
Object.setPrototypeOf(Girl.prototype, EventEmitter.prototype);

const girl = new Girl();

const sleep = function () {
  console.log("睡觉");
};

const drink = function () {
  console.log("喝");
};

girl.once("失恋", sleep);
girl.once("失恋", drink); 

girl.emit("失恋")