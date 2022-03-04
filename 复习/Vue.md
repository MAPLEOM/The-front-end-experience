# Vue(https://juejin.cn/post/6961222829979697165#heading-42)

## 1. MVC  和 MVVM 区别

```js
1. MVC (Model View Controller => 即 模型 => 视图 => 控制器), 一种软件的设计典范.
	=> Model(模型): 是应用程序中用于处理应用程序数据逻辑的部分. 通常模型对象负责在数据库中 "存取数据".
	=> View(视图): 是应用程序处理数据"显示"的部分, 通常视图是依据模型数据创建的.
	=> Controller(控制器):是应用程序中"处理用户交互的部分". 通常控制器从模型中读取数据, 控制用户输入, 并向模型发送数据.
	🎈 => MVC的思想: 一句话描述就是 Controller 负责将 Model 的数据用 View 显示出来, Controller把 Model 中的数据赋值给 View.
    
2. MVVM (Model View ViewModel)
	💎 => MVVM 新增了 VM类
    	viewModel层: 做了两件事达到了数据的"双向绑定", 
            一 是将 "[模型]" 转化为 "[视图]" => 实现方式 "数据绑定"
            二 是将 "[视图]" 转化为 "[模型]" => 实现方式 "DOM 事件监听"
3. MVVM 和 MVC 最大区别在于: 
		它实现了 View 与 Model的自动同步, 也就是 Model的属性改变时, 我们不用自己动手"操作DOM", 来改变 View 的显示, 
         而是改变属性后该属性对应的View会 "自动改变".
4. (了解) Mvvm 比 Mvc 精简的多, 不用再操作 DOM 元素了.
5. Vue 并没有完全遵守 MVVM 的思想, 因为 "$refs" 这个属性可以让 Model 直接操作 View.
```

## 2. 为什么 data 是一个函数?

```js
💎 => 组件中的 data 写成一个函数, 数据以"函数返回值"的形式定义. => 每复用一次组件, 就会返回一份"新的" data, 类似于给每个组件实例创建了"私有数据空间".
	  如果写成 "对象形式", 那么所有的组件将共用一个 data, 就会造成一个变了 其他的也变了的结果.
```

## 3. Vue组件通信的几种方式?

```js
1. props 和 $emit 父组件向子组件传递数据是通过 props 传递的, 子组件传递数据给父组件是通过 $emit 触发事件来做到的.
2. $parent 和 $children 获取当前组件的父组件和当前组件的子组件.
3. $attr 和 $listeners A => B => C.  🎈 Vue 2.4 开始提供了$attrs 和$listeners(事件) 来解决这个问题(VUE3 中移除 因为事件变成了以 "on"开头的"属性")
4. 父组件中通过 provide 来提供变量, 子组件通过 inject 来注入变量.
5. $refs 获取组件实例.
6. eventBus 兄弟组件传递数据 这种情况下可以使用事件总线的方式.
7. Vuex状态管理.
```

## 4. Vue 生命周期方法有哪些? 

```js
1. beforeCreate 在实例初始化之后, 数据观测(data observer) 和 event/watcher 事件配置之前被调用. 
			   🎈 在当前阶段, data methods computed 以及watch上的数据和方法都不能访问. (没有this)
2. created 实例已经创建完成之后被调用, 在这一步, 实例已经完成配置: 数据观测(observer) 属性和方法的运算, watch/event 事件回调.
			   🎈 这里没有 $el, 如果非要想与 DOM 交互, 可以通过 VM.$nextTick 来访问 DOM. (有this)
3. beforeMount 在挂载之前被调用: 相关的 render 函数首次被调用.
4. mounted 在挂载完成之后, 在当前阶段, "真实DOM"挂载完毕, 数据完成双向绑定, 可以访问到 Dom 节点.
5. beforeUpdate 数据更新时调用, 发生在"虚拟Dom重新渲染"和打补丁(patch)之前, 可以在这个钩子中进一步更改状态, 这不会触发附加的重新渲染.
6. updated 发生更新完成之后, 🎈 当前阶段组件 DOM 已经完成更新. 要注意的是避免在此期间更改数据, 因为这可能导致"无限循环"的更新. 
		  该钩子在"服务器渲染期间不触发".
7. beforeDestory Vue实例销毁之前调用, 在这一步, 实例仍然完全可用, 我们可以在这时做一些 "善后收尾工作", 比如计时器的清除.
8. destoryed Vue实例销毁之后, 所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。
```

## 5. 💕Vue 一般在生命周期哪一步发起请求?

```js
💎 => 可以再 created beforeMounte Mounted进行异步请求. 因为三个钩子函数, data已经创建, 可以将服务端的数据"赋值"给data.
🎈 => 如果异步请求中不需要DOM, 推荐在 "created" 钩子函数中调用异步请求, 因为在created 钩子函数中调用异步请求有以下优点:
	  1. 能更快的获取到服务端数据, 减少页面 loading 事件;
	  2. ssr 不支持 beforeMount Mounted函数, 所以 Created 有助于一致性.
```

## 6. v-if 和 v-show 的区别?

```js
🎈 v-if 在编译阶段会变成"三元表达式", 条件不满足的时不渲染节点.
🎈 v-show 会被编译成"指令" 条件不满足时控制样式将对应节点隐藏(display: none).

💎 使用场景:
	v-if 适用于在运行时很少改变条件, 不需要频繁切换条件的场景.
    v-show 适用于需要非常频繁切换的场景.
```

## 7. display:none  visibility:hidden 和 opacity: 0的区别?

```js
1. 共同点 => 都是隐藏DOM元素.
2. 不同点 => 
		🧨 是否占据空间?
                display:none: 不占据
                visibility:hidden: 占据
                opacity:0 : 占据
         🧨 子元素是否继承?
             	display:none: 父子都不显示
                visibility:hidden: 会被继承 可以通过设置 子元素的 visbility:visible 显示子元素.
                opacity:0 子元素继承, 但不能使得子元素显示
		🧨 事件绑定
        		display:none: 不在页面中 无法触发
                 visibility:hidden: 不会触发
                 opacity:0 : 可以触发
		🧨 过渡动画
        		transition对于display无效. "无法过渡"
			    visibility:hidden. "无法过渡"
    			opacity:0. "可以过渡!!!"
```

##  8. Vue内置指令.

```js
1. v-once 定义它的元素或组件只渲染一次
2. v-cloak 这个指令保持在元素上直到关联组件实例结束编译.
3. v-bind 绑定属性 动态更新 HTML 元素上的属性, 例如 v-bind: css
4. v-on 用于监听 DOM 事件, 例如 v-on: click @keyup
5. v-html 赋值就是变量 innerHtml -- 注意防止 XSS 攻击.
6. v-text 更新元素的 textConent
7. v-if/v-else-if/v-else 可以配合"template使用" 并且 在render函数里面就是 "三元表达式"
8. v-show 使用指令来显示 -- display:none
9. v-for 循环指令 vue2 => 💎 v-for 优先级比 v-if 高; vue3 => v-for比v-if低; 💎 注意添加key的唯一值
10. v-model 数据双向绑定
11. v-pre 跳过这个元素和子元素的编译过程 以此加快项目编译速度.(可以用来显示原始 Mustache 标签) 
   🌰 => <span v-pre>{{ this will not be compiled }}</span>
12. v-slot 提供具名插槽名字 或者 接收prop的插槽
13. v-memo 用于优化
```

## 9. 怎么理解 Vue的单向数据流?

```js
💎 => 数据总是从父组件传到子组件, 子组件"没有权利修改"父组件传过来的数据, 只有请求父组件对原始数据进行修改.
	  防止子组件意外修改父组件数据, 导致数据流难以维护.
```

## 10. computed 和 watch 的区别和运用的场景.

```js
💎 computed 是"计算属性", 依赖其他属性的计算值, 并且 computed 有缓存, 只有当计算值变化才会返回新的内容, 它可以设置 "getter 和 setter".
💎 watch 监听到值的变化就会执行回调, 在回调中可以执行一些逻辑.
🧨 区别 => 
        1. 计算属性一般用在模板渲染中, 某个值是依赖了其他的响应式对象甚至是计算属性而来. 
        2. 侦听属性适用于观测某个值的变化去完成一个"复杂的逻辑".
```

## 11. v-if 和 v-for 为什么不建议一起使用?

```js
🎈 v-for 和 v-if 不要再同一个标签上使用, 因为解析时先解析 v-for 再解析 v-if. 如果遇到需要同时使用时可以考虑写成"计算属性"的方式.
```

## 12. Vue 2.0 响应式数据的原理

```js
💎 整体思路是 数据劫持 + 观察者模式.
🧨 对象通过 defineReactive方法, 使用 "Object.defineProperty"将属性进行劫持(只会劫持已经存在的属性), 数组则是通过"重写数组方法"来实现.

🌰 => 
	class Observer{
        constructor(value) {
            this.wark(value);
        }
        walk(data) {
            let keys = Object.keys(data);
            for( let i = 0;i < keys.length; i++){
                let key = keys[i];
                let value = data[key];
                defineReactive(data,key,value);
            }
        }
    }

	function defineReactive( data,key,value ){
        observe(value); // 递归关键
        Object.defineProperty(data,key,{
            get(){
                console.log("获取值"); 
                return value;
            }
            set(newValue){
            	if (newValue === value) return;
            	console.log("设置值");
            	value = newValue;
        	}
        })
    }
    
    export function observe(value){
        if (
            Object.prototype.toString.call(value) === "[object Object]" ||
            Array.isArray(value)
          ) {
            return new Observer(value);
          }
    }
```

## 13. Vue如何监测数组的变化

```js
💎 数组考虑性能原因 没有用 defineProperty 对数组每一项进行拦截, 而是选择对 "7种数组"(push shift pop unshift sort reserve splice)方法进行了"重写".
🎈 所以在 Vue中修改数组的"索引"和"长度"是无法监控到的. 需要 7种变异方法修改数组才能触发数组对应的 watcher
```

##  14. Vue3 用过吗? 了解多少

```js
1. 响应式原理的改变 Vue3.x 使用 Proxy 取代 Vue2.x 版本的 Object.defineProperty.
2. 组件选项声明方式 Vue3.x 使用 Component API setup 是新增的一个选项, 他是组件内使用 Component API 的入口.
3. 模板语法变化 slot 具名插槽语法 自定义指令 v-model 升级
4. 其他方面的更改, Suspense支持 Fragment 和 Protal组件.
```

## 15. Vue3.0 和 2.0的响应式原理的区别

```js
Vue3.0 改用 "Proxy" 代替 "Object.defineProperty". 因为 Proxy 可以直接监听数组和对象的变化. 并且多达 13 种拦截方法.
```

## 16. Vue的父子组件生命周期钩子函数的执行顺序.

```js
1. 加载渲染过程
	父beforeCreate => 父created => 父beforeMount => 子beforeCreate => 子created => 子beforeMounted => 子Mounted => 父mounted
2. 子组件更新过程
	父beforeUpdate => 子beforeUpdate => 子updated => 父updated
3. 父组件更新过程
	父beforeUpdate => 父updated
4. 销毁过程
	父beforeDestory => 子beforeDestory => 子destoryed => 父destoryed
```

## 17.💕 虚拟DOM是什么 有什么优点

```js
🎈 由于在浏览器中操作DOM是很昂贵的. "频繁的操作DOM", 会产生一定的"性能问题", 这就是产生虚拟DOM的原因.
   虚拟DOM本质上就是用一个"原生 JS 对象去描述一个Dom 节点", 是对真实DOM的一种"抽象".
💎 优点:
        1. 保证了性能的下线.
        2. 无需动手操作DOM
        3. 跨平台
😎 缺点:
        1. 无法进行"极致"的优化
        2. "首次渲染"大量的DOM时,由于多一层虚拟DOM的计算,会比 innerHtml插入的"慢"
```

## 18. v-model 的原理

```js
💎 v-model 只是一个"语法糖"而已. v-model在不同的输入元素中使用不同的 property并抛出不同的事件.
🎈 在组件上绑定时 是 value(可以通过 props接收) 和 input事件的组合.
```

## 19. v-for为什么要加key?

```js
🎈 key 是为 Vue中 vnode的"唯一标记", 通过这个key, 我们的diff操作更加准确 更快速.
	1. 更准确 => 因为带有 key 就不是就地复用了, 在 sameNode 函数 a.key === b.key 对比中可以避免地复用情况, 所以更加准确.
	2. 更快速 => 利用 key 的唯一生成的 map 对象来获取对应的节点, 比遍历方式快.    

🌰 => 
    // 判断两个vnode的标签和key是否相同 如果相同 就可以认为是同一节点就地复用
    function isSanmeNode(oldVnode, newVnode){
        return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
    }
	// 根据key来创建老的儿子的index映射表  类似 {'a':0,'b':1} 代表key为'a'的节点在第一个位置 key为'b'的节点在第二个位置
	function makeIndexByKey(children){
        let map = {};
        children.forEach((item,index)=>{
            map[item.key] = index;
        })
        return map;
    }
	let map = makIndexByKey(oldCh)
```

## 20. Vue 事件绑定原理

```js
💎 $on $emit 是基于发布订阅模式的, 维护一个事件中心, on的时候将事件按照名称存在事件中心, 称之为"订阅者"
    然后 emit 将对应的事件进行发布, 去执行事件中心的对应事件.
		 
```

## 21. Vue-router的路由钩子函数是什么? 执行顺序

```js
💎 路由钩子函数分别是 全局守卫 路由守卫 组件守卫
🎈 完整导航解析流程:(了解)
        1. 导航被触发。
        2. 在失活的组件里调用 beforeRouteLeave 守卫。
        3. 调用全局的 beforeEach 守卫。
        4. 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
        5. 在路由配置里调用 beforeEnter。
        6. 解析异步路由组件。
        7. 在被激活的组件里调用 beforeRouteEnter。
        8. 调用全局的 beforeResolve 守卫 (2.5+)。
        9. 导航被确认。
        10. 调用全局的 afterEach 钩子。
        11. 触发 DOM 更新。
        12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。
```

## 22. Vue-router 动态路由是什么 

```js
🎈 我们通常把某种模式匹配到的所有路由匹配到"一个组件"上. 通过设置 "动态路由参数"来达到这个效果. 🌰: /user/:id
💎 => vue-router 组件复用导致路由参数失效怎么办?????
        1. watch 监听路由
        2. key 绑定路由参数阻止 "复用"
```

## 23.谈一下对 Vuex 的理解

```js
🎈 vuex 是专门为vue提供的全局状态管理的系统, 用于多个组件"共享状态" "数据缓存"等.
   主要包括一下几个模块:
        1. State: 定义了应用状态的数据结构, 可以再这里设置默认的初始状态.
        2. Getter: 允许组件从 Store 中"获取数据", mapGetters辅助函数仅仅是将 store中的 getters映射到局部的"计算属性".
        3. Mutation: 是唯一更改 store 状态的方法, 且必须是同步函数.
        4. Action: 用于提交 Mutation, 而不是直接变更状态, 可以包含任意异步操作.
        5. module: 允许将单一的 Store 拆分为多个 store 且同时保存在"单一的状态树"中.
```

## 24. Vuex 页面刷新数据丢失怎么解决?

```js
🎈 需要做 vuex 数据持久化 一般使用"本地储存"的方案来保存数据, 可以自己设计方案, 也可以会用第三方插件(💎 vuex-persist).
   该插件 不需要你手动存取 storage ，而是"直接将状态保存至 cookie 或者 localStorage 中".
```

## 25. Vuex为什么要分模块并且加命名空间.

```js
1. 模块: 解决项目大导致单一store臃肿问题.
2. 命名空间: 默认多个 store都会注册在全局的命名空间, 这将导致一个action或mutation可能造成多个 store同时更改, 造成数据混乱.
		   为了避免此类情况, 可以使用 "namespaced: true" 定义为命名空间.
```

## 26. 使用过 Vue SSR吗? 说说SSR

```js
💎 SSR 也是服务端渲染, 也就是将 Vue 在客户端把标签渲染成 HTML 的工作放在"服务端完成", 然后再把 html 直接返回给客户端.
        🎈优点: SSR 有着更好的 SEO, 并且首屏加载速度更快.
        🎈缺点: 开发受限制, 服务端只支持 beforeCreate 和 created 两个生命周期函数. 服务器负载更大.
```

## 27. vue 中使用了哪些设计模式?

```js
1. 工厂模式 => 传入参数即可创建实例
	虚拟DOM根据"参数的不同" 返回不同基础标签的 Vnode 和 组件 Vnode.
2. 单例模式 => 整个程序有且"只有一个实例"
	vuex 和 vue-router 的插件注册方式 "install" 判断如果系统存在实例就直接返回掉.
3. 发布-订阅模式(vue 事件机制)
4. 观察者模式(响应式数据原理)
5. 装饰模式(@ 装饰器的用法)
6. 策略模式 策略模式指对象有"某个行为",但是在"不同的场景中",该行为有不同的实现方案-比如选项的合并策略
```

## 28. 你做过哪些 vue的性能优化?

```js
1. 不需要响应式地数据,不要放在 data 中(或者使用 object.freeze()冻结)
2. v-if 和 v-show 的使用场景
3. 图片懒加载
4. 路由懒加载
5. 第三方插件按需加载
6. 防抖 节流的应用
7. 服务端渲染 或 预渲染
8. v-for遍历必须带"key", key最好是唯一值,避免与 v-if同时用.
9. computed 和 watch 使用场景
```

## 29. Vue.mixin的使用场景.

```js
💎 在日常的开发中, 我们经常会遇到在不同的组件中经常会需要用一些"相同或相似的代码", 这些代码的功能相对"独立" 
   可以通过 Vue 的 "mixin"功能"抽离公共"的业务逻辑. 当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行 "合并"。
```

## 30. nextTick 使用场景和原理

```js
💎 nextTick 中的回调是在"下次 DOM 更新循环结束之后"执行的延迟回调。
    在修改数据之后立即使用这个方法，获取更新后的 DOM。主要思路就是采用"微任务优先"的方式调用异步方法去执行 nextTick 包装的方法.
```

## 31. keep-alive 使用场景和原理

```js
🎈 keep-alive 是 Vue内置的一个组件, 可以实现组件的"缓存", 当组件切换的时候不会对当前组件进行 "卸载"
属性: 
    1. 常用的两个属性 "include / exclude", 允许组件有条件的进行缓存.
    2. 两个生命周期 activated/deactivated，用来得知当前组件是否处于活跃状态。
```

## 32. 自定义指令

```js
💎 指令本质上是"装饰器", 是VUE对HTML元素的扩展, 给HTML元素增加自定义功能. VUE编译DOM时, 会找到"指令对象", 执行指令的相关的方法.
   自定义指令有五个声明周期:
       1. bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
       2. inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
       3. update：被绑定于元素所在的模板更新时调用，而无论绑定值是否变化。通过比较更新前后的绑定值，可以忽略不必要的模板更新。
       4. componentUpdated：被绑定元素所在模板完成一次更新周期时调用。
       5. unbind：只调用一次，指令与元素解绑时调用。
```

## 33. Vue修饰符