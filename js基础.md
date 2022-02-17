# 1. js 原型及原型链(https://juejin.cn/post/6844904069887164423)

```js
1. 函数式构造函数
	// 创建构造函数
	function Puppy (age) {
        this.age = age;
        Puppy.prototype.say = function(){ console.log("汪汪汪") }; // => 创造实例对象时会将函数放在 实例的 Prototype 中
    };
	// 创造实例对象
	const puppy = new Puppy(32); 
	puppy.say();  
	// 当寻找实例对象的属性时 先在实例对象下寻找属性 若未找到 则去实例对象的 __proto__下寻找(__proto__指向构造函数 的 prototype),若仍未找到则继续寻找		   __proto__(依然指向构造函数的 prototype)
2. 实例方法查找用 __proto__
	puppy寻找say方法的过程依次是:
		puppy.say => puppy.__proto__.say(等同于Puppy.prototype) => puppy.__proto__.__proto__.say(等同于Puppy.prototype.__proto__)
	tips: 原型是 object 类型 故原型没有 prototype && 只有 __proto__(指向构造函数的 prototype)
3. constructor
	prototype.constructor是prototype上的一个保留属性，这个属性就指向类函数本身，用于指示当前类的构造函数。
```

![QQ截图20220217102543](C:\Users\m1198\Desktop\QQ截图20220217102543.png)

```js
4. 静态方法
	Puppy.staticFun(); // 直接通过类名调用
	例如 jquery中 
    	$(selector).append() //实例方法 
		$.ajax // 静态方法
5. 继承
	最简单的 => 子类原型的 __proto__ 指向父类的 prototype
    function Parent(){}
    function Son(){}
	Son.prototype.__proto__ = Parent.prototype
	合理的 => 
	function Parent() {
      this.parentAge = 50;
    }
    function Child() {}

    Child.prototype = new Parent();
    Child.prototype.constructor = Child;      // 注意重置constructor

    const obj = new Child();
    console.log(obj.parentAge);    // 50
6. !!自己实现一个 new
	func => 构造函数
	function myNew(func , ...args){
    	const obj = {};
    	const result = func.call(obj , ...args);
    	obj.__proto__ = func.prototype;
        // 注意如果原构造函数有Object类型的返回值，包括Functoin, Array, Date, RegExg, Error
        // 那么应该返回这个返回值
        const isObject = typeof result === 'object' && result !== null;
        const isFunction = typeof result === 'function';
        if(isObject || isFunction) {
          return result;
        }
        // 原构造函数没有Object类型的返回值，返回我们的新对象
        return obj;
	}
7. 自己实现一个 instanceof
```

# 2. Event loop

```js
// 先执行同步代码 => 微任务(一个Event loop 只有一个微任务队列) => 宏任务
常见的宏任务:(每个宏任务执行完都会重新渲染一次)
    script (可以理解为外层同步代码)
    setTimeout/setInterval
    setImmediate(Node.js)
    I/O
    UI事件
    postMessage
常见的微任务:(微任务队列全部执行完会重新渲染一次) // 优先级高于宏任务
    Promise
    process.nextTick(Node.js)
    Object.observe
    MutaionObserver
例子:
	console.log('1');
    setTimeout(() => {
      console.log('2');
    },0);
    Promise.resolve().then(() => {
      console.log('5');
    })
    new Promise((resolve) => {
      console.log('3');
      resolve();
    }).then(() => {
      console.log('4');
    })

```

