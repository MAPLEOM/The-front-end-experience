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

# 6. new的实现原理

```js
/**
 * @description 封装new关键字
 */
function _new() {
	const target = {};
	const [constructor, ...args] = [...arguments];
	target.__proto__ = constructor.prototype;
	let result = constructor.apply(target, args);
	if (result && (typeof result == 'object' || typeof result == 'function')) {
		return result;
	}
	return target;
}
```

# 7. var && const && let 区别

| 声明方式 | 变量提升 | 暂时性死区 | 重复声明 | 块作用域有效 | 初始值 | 重新赋值 |
| :------: | :------: | :--------: | :------: | :----------: | :----: | :------: |
|   var    |    会    |   不存在   |   允许   |     不是     | 非必须 |   允许   |
|   let    |   不会   |    存在    |  不允许  |      是      | 非必须 |   允许   |
|  const   |   不会   |    存在    |  不允许  |      是      |  必须  |  不允许  |

# 8. 隐藏页面元素的方法(https://juejin.cn/post/6844903874705227789)

```js
隐藏类型:
	1.完全隐藏：元素从渲染树中消失，不占据空间。
    	=> display:none 属性
    	=> HTML5 新增属性 hidden(等同于 display:none) 
	2.视觉上的隐藏：屏幕中不可见，占据空间。
    	=> 利用 position 移除可视区域
    	=> 利用 transform scale(0) 缩放 || translateX(-99999px) || rotateY(90deg)
	3.语义上的隐藏：读屏软件不可读，但正常占据空。
```

# 9. TypeScript 中 type 和 interface 的区别?

```tsx
相同点：
    1. 都可以描述 '对象' 或者 '函数' 
    2. 都允许拓展(extends)
不同点：
    1. type 可以声明基本类型，联合类型，元组
    2. type 可以使用 typeof 获取实例的类型进行赋值
    3. 多个相同的 interface 声明可以自动合并
使用 interface 描述‘数据结构’，使用 type 描述‘类型关系’
```

# 10. Typescript - 泛型

```tsx
泛型函数定义: => function identity<T> (arg:T): T { return arg }   // 说明参数和返回值类型相同
泛型函数使用: => 
		1. let output = identity<string>("myString");	// 填入所有参数 包括类型参数
         2. let output = identity("myString");           // 类型推断 --  即编译器会根据传入的参数自动地帮助我们确定T的类型
```

# 11. js基础数据类型(7 种)

```js
number => typeof instance === "number"
boolean => typeof instance === "boolean"
string => typeof instance === "string
undefined => typeof instance === "undefined"
null => typeof instance === "object"
bigint => typeof instance === "bigint"
symbol => typeof instance === "symbol"
```

# 12. js类型检查

```js
typeof 操作符的唯一目的就是检查数据类型 => 
	1. 基本数据类型检查使用 typeof => (tip: typeof 可以检测函数 'function')
	2. 判断是否继承于某个构造函数可以使用 instanceof 关键字 (instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。)
	3. Object.prototype.toString.call() => 比较完美的类型检查了
```

# 13.this指向

```js
=> this 永远指向最后调用它的那个对象
    var name = "windowsName";
    function fn() {
        var name = 'Cherry';
        innerFunction();
        function innerFunction() {
            console.log(this.name);      // windowsName
        }
    }
    fn()
```

# 14. 改变this指向

```js
1. 箭头函数 (箭头函数的 this 始终指向函数定义时的 this，而非执行时。)
    var name = "windowsName";
    var a = {
        name : "Cherry",
        func1: function () {
            console.log(this.name)     
        },
        func2: function () {
            setTimeout(	() => {  // this 指向 a(定义时)
                this.func1()
            },100);
        }

    };
    a.func2()     // Cherry

2. 在函数内部使用 _this = this
3. 使用 apply、call、bind
	setTimeout(  function () { this.func1() }.bind(a)(),100);
4. apply call 和 bind 的区别
	call 方法接受的是若干个参数列表       =>  b.call(a,1,2) 
    apply 接收的是一个包含多个参数的数组。 =>  b.apply(a,[1,2]) 
	bind 接受的是若干个参数列表 是创建一个新的函数，我们必须要手动去调用 =>  b.bind(a,1,2)() 
```

# 15. 深浅拷贝(https://juejin.cn/post/6844904197595332622)

## 1. 浅拷贝

```js
1. Object.assign()  => 对象
	let obj1 = { person: {name: "kobe", age: 41},sports:'basketball' };
    let obj2 = Object.assign({}, obj1);
    obj2.person.name = "wade";
    obj2.sports = 'football'
    console.log(obj1); // { person: { name: 'wade', age: 41 }, sports: 'basketball' }
2. 函数库lodash的_.clone方法
	var _ = require('lodash');
    var obj1 = {
        a: 1,
        b: { f: { g: 1 } },
        c: [1, 2, 3]
    };
    var obj2 = _.clone(obj1);
    console.log(obj1.b.f === obj2.b.f); // true
3. 展开运算符...
	let obj1 = { name: 'Kobe', address:{x:100,y:100}}
    let obj2= {... obj1}
    obj1.address.x = 200;
    obj1.name = 'wade'
    console.log('obj2',obj2) // obj2 { name: 'Kobe', address: { x: 200, y: 100 } }
4. Array.prototype.concat()
	let arr = [1, 3, {
    	username: 'kobe'
    }];
    let arr2 = arr.concat();    
    arr2[2].username = 'wade';
    console.log(arr); //[ 1, 3, { username: 'wade' } ]
5. Array.prototype.slice()
    let arr = [1, 3, {
        username: ' kobe'
        }];
    let arr3 = arr.slice();
    arr3[2].username = 'wade'
    console.log(arr); // [ 1, 3, { username: 'wade' } ]

```

## 2. 深拷贝

```js
1. JSON.parse(JSON.stringify())  // 这种方法虽然可以实现数组或对象深拷贝,但不能处理函数和正则
2. 函数库lodash的_.cloneDeep方法  //  var obj2 = _.cloneDeep(obj1);
3. 手写递归方法
```

# 16. 浏览器缓存(https://juejin.cn/post/6844903764566999054)

# 17. js 继承

# 18.HTTP 与 HTTPS

```js
概述:	
	1. HTTP + SSL(TLS) = HTTPS。 => 传输层安全性(TLS)或安全套接字层(SSL)对通信协议进行加密
	2. HTTP 默认端口号为 80 || Https默认端口号为 443
分析:
	1. 什么是协议?
        网络协议是计算机之间实现网络通信而达成的"约定或者规则",有了这种约定不同厂商的生产设备以及不同的操作系统组成的计算机之间就可以通信.
    2. 什么是HTTP协议?
        HTTP协议是超文本传输协议的缩写,它是从 "WEB服务器" 传输超文本标记语言("HTML")到本地服务器的协议.
        设计 HTTP 最初目的就是为了 提供一种发布和接收 HTML页面的方法.
	3. HTTP 原理?
        HTTP 是一种基于 TCP/IP 通信协议来传递数据的协议 传输的数据类型为 HTML 图片等
        HTTP 协议一般用 "B/S架构" . "浏览器作为HTTP客户端"通过"URL"向HTTP服务器即WEB服务器发送所有请求
     4. HTTP 特点?
        1. http支持 "客户端/服务端" 模式 也是一种 请求/响应 的协议
        2. 简单快速: 客户向服务器请求服务时 只需传送请求方法和路径. 请求方法常用的有 GET POST
        3. 灵活: HTTP 允许传输任意类型的数据 传输类型由 content-type 加以标记.
        4. 无连接: 限制每次连接只处理"一个请求"。为了弥补不能保持回话的连接 产生http状态的技术 (Cookie Session)
        5. 无状态: 协议对事物处理没有记忆 后续处理需要前面的信息 则必须重传.
    5. URI和URL的区别
        1. URI => 统一资源标识符  URL => 统一资源定位符
        2. URI 是用来"标示"一个具体的资源 我们可以通过 URI 知道一个资源是什么
           URL 是用来"定位"具体的资源的 标示了一个具体资源的位置. 互联网上的每个文件都有唯一的 URL
    6. HTTP 报文组成
    	1. 请求报文
            1. 请求行
           	2. 请求头
            3. 请求正文
		2. 响应报文
        	1. 状态行
            2. 响应头
            3. 响应正文
	7. 常见请求方法
    	GET POST DELETE PUT等.
	8. 为什么要用 HTTPS
    	HTTP 协议( "明文传输" )不适合传输一些敏感信息 能够被抓包工具获取. 
        `请求信息明文传输，容易被窃听截取`
        `数据的完整性未校验，容易被篡改`
        `没有验证对方身份，存在冒充危险`
	9. 什么是 HTTPS
    	HTTPS 协议一般理解为 HTTP + SSL/TLS 通过SSL(安全套接字层)证书来验证服务器的身份 并为浏览器和服务器之间的通信进行加密.
        加密流程:(了解) 
         		1. 首先客户端通过 URL 访问服务器建立 "SSL 连接".
		        2. 服务端收到 客户端 请求后,会将网站支持的证书信息(证书中包含公钥)传一份给客户端.
                 3. 客户端的服务器开始协商SSL连接的安全等级 也就是信息加密等级.
                 4. 客户端的浏览器根据双方同意的安全等级 建立会话密钥 然后利用网站的公钥将会话密钥加密，并传送给网站。
                 5. 服务器利用自己的私钥解密出会话密钥。
                 6. 服务器利用会话密钥加密与客户端之间的通信。
                 (安全等级: )
					Class 1（一级，只验证Email）、
                      Class 2（二级，验证Email和验证个人身份证明文件）
                      Class 3（三级，验证Email、验证单位身份验证文件、第三方数据库核实）
                      Class 4（四级，全球统一标准的扩展验证标准，验证Email、验证单位身份证明文件、验证申请人身份证明文件、第三方数据库核实）
	10. HTTPS 的缺点
         HTTPS 多次握手 导致页面的加载时间延长近50%
         HTTPS连接缓存不如HTTP高效，会增加数据开销和功耗；
		申请SSL证书需要钱，功能越强大的证书费用越高。
		SSL涉及到的安全算法会消耗 CPU 资源，对服务器资源消耗较大。
	11. 总结
    	HTTPS是HTTP协议的安全版本，HTTP协议的数据传输是"明文的"，是不安全的，HTTPS使用了SSL/TLS协议进行了"加密处理"。
		http和https使用连接方式不同，默认端口也不一样，http是 80，https是 443。
```

# 19. get 和 post的区别

```
GET 和 POST本质上就是"TCP链接"，并无差别。但是由于HTTP的规定和浏览器/服务器的限制，导致他们在应用过程中体现出一些不同。 
GET 产生一个TCP数据包；POST 产生两个TCP数据包。
	1. 对于GET方式的请求，浏览器会把"http header和data一并发送出去"，服务器响应200（返回数据);
	2. 而对于POST，浏览器先"发送header"，服务器响应"100 continue"，浏览器"再发送data"，服务器响应 200 ok 返回数据(Firefox就只发送一次)
1. GET
	GET请求的数据会附加在URL之后，用问号分割，多个参数用&进行连接。
	GET请求的数据会暴露在地址栏中。
	GET请求URL的编码格式采用的是ASCII编码，而不是Unicode编码。
	GET请求传输大小有限制，大小在2KB。
	GET相对安全性较差，会被浏览器主动缓存。
	GET产生一个TCP数据包，head和data一起发送。
	GET浏览器回退无害。
2. POST
	POST请求会把数据放置在HTTP请求包的包体中，不会直接暴露给用户。
	POST请求，理论上大小是不会限制的，但是实际上各个服务器会规定POST提交数据大小。
	POST相对Get更安全，因为参数不会保存浏览器立式或者是web服务器日志中。
	POST产生两个TCP数据包，header先发送，服务器响应100状态码然后继续，发送data，服务器200然后返回数据.
	POST浏览器回退重新请求。
```

> ​	在我大万维网世界中，TCP就像汽车，我们用TCP来运输数据，它很可靠，从来不会发生丢件少件的现象。但是如果路上跑的全是看起来一模一样的汽车，那这个世界看起来是一团混乱，送急件的汽车可能被前面满载货物的汽车拦堵在路上，整个交通系统一定会瘫痪。为了避免这种情况发生，交通规则HTTP诞生了。HTTP给汽车运输设定了好几个服务类别，有GET, POST, PUT, DELETE等等，HTTP规定，当执行GET请求的时候，要给汽车贴上GET的标签（设置method为GET），而且要求把传送的数据放在车顶上（url中）以方便记录。如果是POST请求，就要在车上贴上POST的标签，并把货物放在车厢里。当然，你也可以在GET的时候往车厢内偷偷藏点货物，但是这是很不光彩；也可以在POST的时候在车顶上也放一些数据，让人觉得傻乎乎的。HTTP只是个行为准则，而TCP才是GET和POST怎么实现的基本。
>
> ​	但是，我们只看到HTTP对GET和POST参数的传送渠道（url还是requrest body）提出了要求。“标准答案”里关于参数大小的限制又是从哪来的呢？
>
> ​	在我大万维网世界中，还有另一个重要的角色：运输公司。不同的浏览器（发起http请求）和服务器（接受http请求）就是不同的运输公司。 虽然理论上，你可以在车顶上无限的堆货物（url中无限加参数）。但是运输公司可不傻，装货和卸货也是有很大成本的，他们会限制单次运输量来控制风险，数据量太大对浏览器和服务器都是很大负担。业界不成文的规定是，（大多数）浏览器通常都会限制url长度在2K个字节，而（大多数）服务器最多处理64K大小的url。超过的部分，恕不处理。如果你用GET服务，在request body偷偷藏了数据，不同服务器的处理方式也是不同的，有些服务器会帮你卸货，读出数据，有些服务器直接忽略，所以，虽然GET可以带request body，也不能保证一定能被接收到哦。

# 20. HTTP 常用状态码

```js
1. 分类
    1XX-  信息型，服务器收到请求，需要请求者继续操作。
    2XX-  成功型，请求成功收到，理解并处理。
    3XX - 重定向，需要进一步的操作以完成请求。
    4XX - 客户端错误，请求包含语法错误或无法完成请求。
    5XX - 服务器错误，服务器在处理请求的过程中发生了错误。
2. 常见状态码:
    2xx:
    	200 => OK是最常见的成功状态码 通常响应体中放有数据.
    	204 => No Content 含义与 200 相同 , 但响应头后没有 body 数据.
    	206 => Partial Content 表示部分内容 使用场景为 "HTTP 分块下载和断点续传" 会带上相应的响应头字段 => "Content-Range"
	3xx:
	    301 => Moved permanently 即永久重定向 对应 302 即临时重定向 
	    304 => Not Modified 当协商缓存命中时会返回这个状态码
	4xx:
		400 => Bad Request 笼统的提示错误 不知道错在哪
         401 => 请求要求身份认证
		403 => Forbidden 	服务器理解请求客户端的请求，但是拒绝执行此请求
         404 => Not Found
	5xx:
		500 => 服务器内部错误，无法完成请求
		501 => Not Implemented	服务器不支持请求的功能，无法完成请求
		503 => 由于超载或系统维护，服务器暂时的无法处理客户端的请求        
```

# 21. 设计模式

# 22. 计算机网络体系结构分层

```txt
1. 物理层 => 数据链路层 => 网络层 => 传输层 => 会话层 => 表示层 => 应用层  (7层)
```

# 23. React学习(https://juejin.cn/post/6941546135827775525)
