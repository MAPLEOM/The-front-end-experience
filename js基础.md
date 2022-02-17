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

# 3. 防抖和节流

```js
1. 防抖
	function dobounce(fn, wait, immediate) {
	let timer = null;
        return function () {
            const context = this;
            const argu = arguments;
            timer && clearTimeout(timer);
            if (immediate) {
                !timer && fn.apply(context, argu);
                timer = setTimeout(() => {
                    timer = null;
                }, wait);
            } else {
                timer = setTimeout(() => {
                    fn.apply(context, argu);
                }, wait);
            }
        };
    }
2. 节流
	/**
     * @param {*} fn   处理函数
     * @param {*} wait 等待时间
     * @param {*} type 1表示时间戳 2表示定时器版本
     */
    function throttle(fn, wait, type = 2) {
        if (type === 1) {
            var prev = 0;
        } else {
            var timer = null;
        }
        return function () {
            const context = this;
            const argu = arguments;
            if (type === 1) {
                // 时间戳
                const now = new Date();
                if (now - prev > wait) {
                    fn.apply(context, argu);
                    prev = now;
                }
            } else if (!timer) {
                fn.apply(context, argu);
                timer = setTimeout(() => {
                    timer = null;
                }, wait);
            }
        };
    }
```

# 4. Promise(https://juejin.cn/post/6844903607574200334#comment)

```js
1. 基础使用
	let promise = new Promise((resolve,reject)=>{
      resolve('success'); //这里如果是reject('fail')
    });
    promise.then((res)=>{
      console.log(res); // resolve('success'); => 输出：success
    },(err)=>{
      console.log(err); // 上面如果执行reject('fail') 这里就输出:fail
    });
2. 手写 Promise
	/**
     * @description 手写promise
     * 缺少链式结构以及穿透值
     */
    class Promise {
        constructor(executor) {
            this.status = 'pending';
            this.value = undefined;
            this.reson = undefined;
            this.successStore = []; //定义一个存放成功函数的数组 => 用于处理 setTimeout
            this.failStore = []; //定义一个存放失败函数的数组 => 用于处理 setTimeout
            let resolve = (value) => {
                if (this.status === 'pending') {
                    this.value = value;
                    this.status = 'resolved';
                    this.successStore.forEach((func) => func());
                }
            };
            let reject = (reson) => {
                if (this.status === 'pending') {
                    this.reson = reson;
                    this.status = 'rejected';
                    this.failStore.forEach((func) => func());
                }
            };
            try {
                executor(resolve, reject); // 立即执行(新建Promise的对象 立即执行 then中的为微任务)
            } catch (e) {
                reject(e); //如果发生错误，将错误放入reject中
            }
        }
        then(onFulfilled, onRejected) {
            if (this.status === 'pending') {
                this.successStore.push(() => {
                    //当状态为pending时将成功的函数存放到数组里
                    onFulfilled(this.value);
                });
                this.failStore.push(() => {
                    //当状态为pending时将失败的函数存放到数组中
                    onRejected(this.reason);
                });
            } else if (this.status === 'resolved') {
                //如果状态是resolved
                onFulfilled(this.value); //执行成功的resolve，并将成功后的值传递过去
            } else if (this.status === 'rejected') {
                //如果状态是rejected
                onRejected(this.reason); //执行失败的reject,并将失败原因传递过去
            }
        }
    }

    module.exports = Promise; //将Promise导出

```

# 5. 去重(https://segmentfault.com/a/1190000016418021)

```js
1. 利用ES6 Set去重
	function union (arr) { return Array.from(new Set(arr))};
2. 利用双重for循环
	function unique(arr){            
            for(var i=0; i<arr.length; i++){
                for(var j=i+1; j<arr.length; j++){
                    if(arr[i]==arr[j]){         //第一个等同于第二个，splice方法删除第二个
                        arr.splice(j,1);
                        j--;
                    }
                }
            }
    	return arr;
    }
3. indexOf 去重
4. includes 去重
```

