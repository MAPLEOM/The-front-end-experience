# Vue3学习

# 1. 基础

## I. 声明式渲染

```
1. 模板语法 {{ message }}(文本插值)    =>  使得数据与Dom之间建立联系
2. 绑定属性 v-bind 或 :+属性名  => <span v-bind:title="message"></span> || <span :title="message"></span>
3. 创建Vue实例  =>  Vue.createApp(AttributeBinding).mount('#bind-attribute')  !!AttributeBinding为data name等属性的对象
```

## II.处理用户输入

```js
1. 使用 v-on 指令添加事件监听器 => <button v-on:click="reverseMessage">反转 Message</button> 
							   <button @click="reverseMessage">反转 Message</button>
2. 使用 v-modal 指令实现表单输入与应用状态之间的 -双向绑定-
```

## III.条件与循环

```js
1. v-if 控制元素的插入和移除(Dom)
2. v-show 控制元素的显示和隐藏(display:none)
3. v-for 指令可以绑定数组的数据来渲染一个列表
4. 父组件通过 v-bind 绑定属性和值传递给子组件   
   子组件通过 prop:[属性值] 或 prop:{属性值:{type:类型,default:()=>默认值}} 形式接收父组件传过来的数据
```

## IV.创建第一个应用

```js
1. 注册全局的组件
   方式1.
       const app = Vue.createApp({ 选项 })  => (可以直接通过根组件创建 => const app = Vue.createApp(App))
       app.component('SearchCount',SearchInputComponent) // 注册一个全局的组件
       app.directive('focus',FocusDirective) // 注册一个全局自定义指令
       app.use(LocalePlugin) // 全局使用插件
   方式2(链式). 大多数方法会返回实例对象
   	   Vue.createApp({})
          .component('SearchInput', SearchInputComponent)
          .directive('focus', FocusDirective)
          .use(LocalePlugin)
2. 组件实例 property
   data methods props computed inject setup等 => 无论如何定义 都可以在组件的模板中访问;
   Vue还暴露了一些内置 property => $attrs $emit (含有$前缀 避免与用户自定义property冲突);
3. 声明周期钩子函数
   声明周期钩子给用户在不同阶段添加自己代码的机会!!
   created 钩子可以用来在一个实例创建之后执行代码; mounted updated unmounted;
   !!tips: 不要在选项 property 和 回调函数中使用箭头函数 => 会造成 this 错误. 
```

## V. 模板语法

```js
1. 插值
	文本(Mustache 双大括号语法) => <span>{{ msg }}</span>
	使用 v-once 可以一次性插值 当数据改变 插值处也不会改变 => <span v-once>{{ msg }}</span>
2. 原始 HTML
	双大括号会将数据解释为!!普通文本!!,而非 HTML 代码,为了输出 HTML 代码,需要使用 v-html 指令:
	<span v-html="rawHtml"></span>  => v-html 容易导致XSS攻击 要尽可能只对可信内容使用
3. attribute
	可以使用 v-bind 指令绑定属性 如果绑定的值是 !!null!! 或者 undefined => 那么该 attribute 将不会包含在渲染的元素上!!
    对于 布尔attribute(只要存在就意味着为 true) => 如果v-bind绑定的值为 truthy 或者 空字符串("") 属性则会包含在内,否则不会.
4. 使用 js 表达式(只限单个表达式)
	{{ number + 1 }} {{ ok?'yes':'no' }} 
	{{ message.split('').reverse().join('') }} <div v-bind:id="'list-' + id"></div>
5. 指令(directives)
	指令 => 带有 v- 前缀的特殊属性. => 指令的职责是 当表达式的值改变时 将会产生连带的影响 响应式地作用于DOM
    例如 => <p v-if="seen">现在你可以看到我</p> => 当seen的值为falsy时 元素将被移除掉 这就是连带的影响.
6. 参数
	v-bind:href="url" => href属性与表达式url的值进行绑定(href是参数)
	v-on:click="dosomething" => 参数是监听的事件名
7. 动态参数
	<a v-bind:[attributeName]="url"> ... </a> => attributeName会作为js表达式进行动态求值 
	例如: attributeName值为"href"时候 => 则为:v-bind:href="url"
	<a v-on:[eventName]="doSomething"> ... </a>
	例如: eventName值为"focus" => v-on:focus
8. 修饰符(modifier /ˈmɒdɪfaɪə(r)/)   
	以半角句号.指明的特殊后缀 用于指出一个指令应该以特殊方式绑定
    例如: .prevent修饰符告诉指令 v-on 对触发事件调用 
         event.preventDefault(); => <form v-on:submit.prevent="onSubmit">...<form>
9. 缩写
	v-bind:'href' => :href
    	<!-- 完整语法 -->
        <a v-bind:href="url"> ... </a>
        <!-- 缩写 -->
        <a :href="url"> ... </a>
        <!-- 动态参数的缩写 -->
        <a :[key]="url"> ... </a>

    v-on:click="dosomething" => @click="dosomething"

		<!-- 完整语法 -->
        <a v-on:click="doSomething"> ... </a>
        <!-- 缩写 -->
        <a @click="doSomething"> ... </a>
        <!-- 动态参数的缩写 -->
        <a @[event]="doSomething"> ... </a>
10. 注意事项
	对动态参数数值的约定 => 动态参数预期会求出一个 !!字符串 null例外. null可以显示移除绑定 任何非法字符会触发警告.
    对动态表达式的约定 => 语法约束 因为某些字符 如空格和引号 放在 HTML attribute里面是无效的 => 可以使用没有空格和引号的表达式或计算属性.
```

## Ⅵ. Data Property 和方法

```js
1. Data property
	组件data选项是一个函数. Vue在创建组件实例过程中调用此函数 并以$data的形式储存在组件实例中. vm.count === vm.$data.count
2. methods
	我们用 methods 为组件实例添加方法,它应该是一个包含!!所有方法的对象. 
    Vue自动为 methods 绑定 this. 在定义methods时候 => 避免使用箭头函数
3. 防抖和节流
	Vue没有内置的防抖和节流 可以使用 Lodash等库来实现(_.debounce _.throttle)
```

## VII. 计算属性和侦听器

```js
1. 计算属性	
	模板内的表达式很方便 但是设计的初衷只是为了简单的运算 => 放太多逻辑会让模板过重难以维护
	故 任何复杂的逻辑均应该使用 计算属性 => 当计算属性所依赖的数据改变时 计算属性的结果也会响应的改变.
2. 计算属性缓存 vs 方法
	计算属性将基于它们的!!响应依赖关系缓存 => 
    computed: {
      now() {
        return Date.now() // 这个不是响应依赖
      }
    }
	方法没有缓存 每次都要重新执行一遍.
3. 计算属性的 setter    
	计算属性默认只有getter 但是在需要的时候可以设置 setter
    computed: {
      fullName: {
        // getter
        get() {
          return this.firstName + ' ' + this.lastName
        },
        // setter 当执行 vm.fullName = 'John Doe'时候 firstName 和 lastName也会响应的改变
        set(newValue) {
          const names = newValue.split(' ')
          this.firstName = names[0]
          this.lastName = names[names.length - 1]
        }
      }
    }
4. 侦听器
	当需要在数据变化时执行异步或开销较大的操作时,watch是最有用的.
    使用 watch 选项允许我们执行异步操作 (访问一个 API)，并设置一个执行该操作的条件. 这些都是计算属性无法做到的。
	除了使用 watch 选项外 还可以使用编程式 this.$watch API
5. 计算属性 vs 侦听器
	
```

## VIII. Class与Style绑定

```js
1. 绑定 HTML class
    1.1对象语法:
    	<div :class="{ active: isActive }"></div> => active 存在与否取决于 isActive是否为Truthy
		:class 指令也可以与普通的 class attribute 共存 => 
        <div
          class="static" // 普通 class
          :class="{ active: isActive, 'text-danger': hasError }" // 绑定的 class
        ></div>
		绑定的数据不必内联在模板中:
			<div :class="classObject"></div>
            data() {
              return {
                classObject: { // 定义响应式变量
                  active: true,
                  'text-danger': false
                }
              }
            }
		绑定的数据可以是计算属性 功能将更为强大:
		<div :class="classObject"></div>
        data() {
          return {
            isActive: true,
            error: null
          }
        },
        computed: {
          classObject() {
            return {
              active: this.isActive && !this.error,
              'text-danger': this.error && this.error.type === 'fatal'
            }
          }
        }
	1.2 数组语法
    	我们可以把一个数组传给:class => 
        	<div :class="[activeClass, errorClass]"></div>
			data() {
              return {
                activeClass: 'active',
                errorClass: 'text-danger'
              }
            } // 结果为 => <div class="active text-danger"></div>
		如果想根据条件切换列表中的class 可以使用三元表达式 => <div :class="[isActive ? activeClass : '', errorClass]"></div>
		数组语法中也可以使用 对象语法  => <div :class="[{ active: isActive }, errorClass]"></div>
	1.3 在组件上使用
    	组件声明时定义的class 在使用的时候将不会被覆盖. => 
        	const app = Vue.createApp({})
            app.component('my-component', {
              template: `<p class="foo bar">Hi!</p>`
            })
			<div id="app">
              <my-component class="baz boo"></my-component>
            </div> // 结果为 => <p class="foo bar baz boo">Hi</p>
		如果组件有多个根元素的时候 需要定义哪个部分接收这个class. 可以使用 $attrs 组件property执行此操作:
			<div id="app">
              <my-component class="baz"></my-component>
            </div>
            const app = Vue.createApp({})

            app.component('my-component', {
              template: `
                <p :class="$attrs.class">Hi!</p>
                <span>This is a child component</span>
              `
            })
	1.4 绑定内联样式
    	对象语法:
			:style 的对象语法十分直观——看着非常像 CSS，但其实是一个 JavaScript 对象 (其中 css属性名可以是 驼峰命名  也可以是短横线命名)
			<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
            data() {
              return {
                activeColor: 'red',
                fontSize: 30
              }
            }
			也可以直接绑定data中的对象 看着会更清晰(也可以使用计算属性):
            <div :style="styleObject"></div>
            data() {
              return {
                styleObject: {
                  color: 'red',
                  fontSize: '13px'
                }
              }
            }
		数组对象:
			:style 的数组语法可以将多个样式对象应用到同一个元素上：
            	<div :style="[baseStyles, overridingStyles]"></div>
		自动添加前缀:
			在 :style 中使用需要一个 vendor prefix (浏览器引擎前缀) 的 CSS property 时，Vue 将!!自动侦测并添加相应的前缀。
            Vue 是通过运行时检测来确定哪些样式的 property 是被当前浏览器支持的。
            如果浏览器不支持某个 property，Vue 会进行多次测试以找到支持它的前缀。
		多重值:
			可以为 style 绑定中的 property 提供一个包含多个值的数组，常用于提供多个带前缀的值，例如：
            <div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
			这样写只会渲染数组中最后一个被浏览器支持的值。在本例中，如果浏览器支持不带浏览器前缀的 flexbox，那么就只会渲染 display: flex。
            
```

## IX. 条件渲染

```js
1. v-if
	v-if 指令只会在指令表达式返回 truthy 值的时候被渲染. 也可以使用 v-else 
    	<h1 v-if="awesome">Vue is awesome!</h1>
		<h1 v-else>Oh no 😢</h1>	
	当想要切换多个元素时 可以包裹一层 template 使用 v-if 结果不包含 v-if
    	<template v-if="ok">
          <h1>Title</h1>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </template>
2. v-show
	不同的是带有 v-show 的元素始终会被渲染并保留在 DOM 中。v-show 只是简单地切换元素的 display CSS property。
    tip: v-show 不支持 v-else and 也不支持 template
3. v-if vs v-show
	v-if 是真正的条件渲染 因为它会确保在切换过程中，条件块内的事件监听器和子组件适当地被销毁和重建。
    v-if 也是惰性的：如果在初始渲染时条件为假，则什么也不做——直到条件第一次变为真时，才会开始渲染条件块。
    v-show 就简单得多——不管初始条件是什么，元素总是会被渲染，并且只是简单地基于 CSS 进行切换。
    v-if 有更高的切换开销，而 v-show 有更高的初始渲染开销。因此，如果需要非常频繁地切换，则使用 v-show 较好；
    													如果在运行时条件很少改变，则使用 v-if 较好。
4. v-if 和 v-for一起使用
	当 v-if 与 v-for 一起使用时，v-if 具有比 v-for 更高的优先级。不推荐两者一起使用.
```

## X. 列表渲染

```js
1. v-for指令基于一个数组来渲染一个列表;v-for需要使用 item in items 形式的特殊语法
	<ul id="array-rendering">
      <li v-for="item in items">
        {{ item.message }}
      </li>
    </ul>
	你也可以使用 of 替代 in 作为分隔符 , 因为它更接近 JavaScript 迭代器的语法
2. 在 v-for 里使用对象
	<ul id="v-for-object" class="demo">
      <li v-for="value in myObject">
        {{ value }}
      </li>
    </ul>
	Vue.createApp({
      data() {
        return {
          myObject: {
            title: 'How to do lists in Vue',
            author: 'Jane Doe',
            publishedAt: '2016-04-10'
          }
        }
      }
    }).mount('#v-for-object')  => 输出每个属性的value
	
    => 也可以提供第二个参数为 property 名称(也就是 键名key)
	<li v-for="(value, name) in myObject">
      {{ name }}: {{ value }}
    </li>

	=> 也可以提供第三个参数作为索引:
    <li v-for="(value, name, index) in myObject">
      {{ index }}. {{ name }}: {{ value }}
    </li>
	
	!!tip: 在遍历对象时，会按 Object.keys() 的结果遍历，但是不能保证它在不同 JavaScript 引擎下的结果都一致。
    
3. 维护状态
	当Vue正在更新使用 v-for 渲染元素列表时 它默认使用 "就地更新" 的策略 
    如果数据项的顺序被改变，Vue 将不会移动 DOM 元素来匹配数据项的顺序，而是就地更新每个元素，并且确保它们在每个索引位置正确渲染。 
    为了给Vue一个提示 以便它跟踪每个节点的身份 从而重用或重新排序现有的元素 需要为每项提供一个唯一的 "key attribute"
    tip: 不要使用对象或数组之类的非基本类型值作为 v-for 的 key。请用字符串或数值类型的值。
4. "数组更新检测"
		4.1 变更方法
			Vue将被侦听的数组的变更方法进行了包裹 所以他们能触发"视图更新".
    		方法: push pop shift unshift splice sort reverse
		4.2 替换数组
        	变更方法 顾名思义 会变更调用了这些方法的原始数组.相比之下,也有非变更方法. 例如: filter() concat() slice()
			"他们不会变更原始数组 而总是返回一个新数组" 当使用非变更方法的时候 可以使用新数组替换旧数组.
            例如: example1.items = example1.items.filter(item => item.message.match(/Foo/));
			tips: 你可能认为这将导致 Vue 丢弃现有 DOM 并重新渲染整个列表。幸运的是，事实并非如此。
                  Vue 为了使得 DOM 元素得到最大范围的重用而实现了一些智能的启发式方法，所以用一个含有相同元素的数组去替换原来的数组是非常高效的操作。
		4.3 显示过滤/排序后的结果
			我们想要显示一个数组经过过滤或排序后的版本，而不实际变更或重置原始数据。在这种情况下，可以创建一个计算属性，来返回过滤或排序后的数组
            <li v-for="n in evenNumbers" :key="n">{{ n }}</li>
            data() {
                return {
                    numbers: [ 1, 2, 3, 4, 5 ]
                }
            },
            computed: {
                evenNumbers() {
                    return this.numbers.filter(number => number % 2 === 0)
                }
            }
			同理 若计算属性不适用 也可以使用方法来代替.
5. 在v-for里使用值的范围
        5.1 v-for 也可以接受整数。在这种情况下，它会把模板重复对应次数。
            <div id="range" class="demo">
                <span v-for="n in 10" :key="n">{{ n }} </span>
        	</div>
		5.2 在 <template> 中使用 v-for
        	<ul>
              <template v-for="item in items" :key="item.msg">
                <li>{{ item.msg }}</li>
                <li class="divider" role="presentation"></li>
              </template>
            </ul>
		5.3 v-for 与 v-if 一同使用
        	v-if 的优先级比 v-for 更高，这意味着 v-if 将没有权限访问 v-for 里的变量：
            	<li v-for="todo in todos" v-if="!todo.isComplete">
                  {{ todo.name }}
                </li>
            可以把 v-for 移动到 <template> 标签中来修正：
				<template v-for="todo in todos" :key="todo.name">
                  <li v-if="!todo.isComplete">
                    {{ todo.name }}
                  </li>
                </template>
		5.4 在组件上使用 v-for
        	在自定义组件上，你可以像在任何普通元素上一样使用 v-for：
			=> <my-component v-for="item in items" :key="item.id"></my-component>
			
			然而，任何数据都不会被自动传递到组件里，因为组件有自己独立的作用域。为了把迭代数据传递到组件里，我们要使用 props：
            => <my-component
                  v-for="(item, index) in items"
                  :item="item"
                  :index="index"
                  :key="item.id"
                ></my-component>
```

## Ⅺ. 事件处理

```js
1. 监听事件
	使用 v-on:事件类型="事件名或表达式" 或 @事件类型="事件名或表达式" 的形式监听事件.
2. 事件处理方法
	很多逻辑处理比较复杂 所以把表达式写在v-on指令中是不行的 所以尽可能使用事件名接收.
3. 内联处理器中的方法
	除了绑定一个方法 也可以内联 js方法 的调用.
    有时 需要在内联语句处理器中使用原始Dom事件 可以用特殊变量$event把它传入到方法中.
4. 多事件处理器
	事件处理程序可以有多个方法 这些方法用逗号隔开
    	<!-- 这两个 one() 和 two() 将执行按钮点击事件 -->
        <button @click="one($event), two($event)">
          Submit
        </button>
5. 事件修饰符
	修饰符可以串联 =>  <a @click.stop.prevent="doThat"></a>
	.stop // 阻止冒泡
    .prevent // 阻止默认事件
    .capture // 即内部元素触发的事件先在此处理，然后才交由内部元素进行处理
    .self // 只当在 event.target 是当前元素自身时触发处理函数
    .once // 事件只执行一次
    .passive // 会立即触发
6. 按键修饰符
	.enter // 只有在 `key` 是 `Enter` 时调用
	可以直接将 KeyboardEvent.key 暴露的任意有效按键名转换为 kebab-case 来作为修饰符
    例如: <input @keyup.page-down="onPageDown" /> // 处理函数只会在 $event.key 等于 'PageDown' 时被调用。
7. 按键别名
	.enter
    .tab
    .delete (捕获“删除”和“退格”键)
    .esc
    .space
    .up
    .down
    .left
    .right
8. 系统修饰键
	可以用如下修饰符来实现仅在按下相应按键时才触发鼠标或键盘事件的监听器。
    .ctrl
    .alt
    .shift
    .meta
	.exact // 修饰符允许你控制由精确的系统修饰符组合触发的事件。
9. 鼠标按钮修饰符
	.left
    .right
    .middle
```

## XII. 表单输入绑定

```js
1. 基础用法
	可以用 v-model(本质上为语法糖) 指令在表单 <input> <textarea>及<select>元素上创建双向数据绑定.
2. 文本以及多行文本
	<input v-model="message" placeholder="edit me" />
    <textarea v-model="message" placeholder="add multiple lines"></textarea> // textarea使用{{ text }}是不起作用的 要使用 v-model
3. 复选框
	单个复选框 => <input type="checkbox" id="checkbox" v-model="checked" /> // 绑定布尔值
    多个复选框 => 绑定同一个数组 => checkedNames: [];
        <div id="v-model-multiple-checkboxes">
          <input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
          <label for="jack">Jack</label>
          <input type="checkbox" id="john" value="John" v-model="checkedNames" />
          <label for="john">John</label>
          <input type="checkbox" id="mike" value="Mike" v-model="checkedNames" />
          <label for="mike">Mike</label>
          <br />
          <span>Checked names: {{ checkedNames }}</span>
        </div>
4. 单选框
	绑定同一个数据 => picked: ''
        <div id="v-model-radiobutton">
          <input type="radio" id="one" value="One" v-model="picked" />
          <label for="one">One</label>
          <br />
          <input type="radio" id="two" value="Two" v-model="picked" />
          <label for="two">Two</label>
          <br />
          <span>Picked: {{ picked }}</span>
        </div>
5. 选择框
	绑定同一个数据 => selected: ''
		<div id="v-model-select" class="demo">
          <select v-model="selected">
            <option disabled value="">Please select one</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>
          <span>Selected: {{ selected }}</span>
        </div>
	多选时候 => 可以绑定一个数组.
    	<select v-model="selected" multiple>
          <option>A</option>
          <option>B</option>
          <option>C</option>
        </select>
        <br />
        <span>Selected: {{ selected }}</span>
6. 修饰符
	.lazy // v-model 在每次 input 事件触发后将输入框的值与数据进行同步 => 你可以添加 lazy 修饰符，从而转为在 change 事件之后进行同步
	.number // 自动将用户的输入值转为数值类型
	.trim // 自动过滤用户输入的首尾空白字符
7. 在组件中使用 v-model
```

## XIII. 组件基础

```js
1. 组件复用
	<div id="components-demo">
      <button-counter></button-counter>
      <button-counter></button-counter>
      <button-counter></button-counter>
    </div>
	每个组件都会各自独立维护它的 count。因为你每用一次组件，就会有一个它的新实例被创建。
2. 组件注册类型: 全局注册 和 局部注册
	全局注册 => 全局注册的组件可以在应用中的任何组件的模板中使用。
    	const app = Vue.createApp({})
        app.component('my-component-name', {
          // ... 选项 ...
        })
3. 通过 Prop 向子组件传递数据
	Prop 是你可以在组件上注册的一些自定义 attribute
    一个组件可以拥有任意数量的 prop，并且在默认情况下，"无论任何值"都可以传递给 prop。
4. 监听子组件事件
	父组件 通过@绑定自定义事件 => 子组件 使用 $emit 方法调用父组件中的事件.
    我们可以在组件的 emits 选项中列出已抛出的事件：
    	app.component('blog-post', {
          props: ['title'],
          emits: ['enlargeText']
        })
	emits与props类似 可以增加函数调用前的验证 返回 true 验证通过 反之未通过.
    $emit可以传递第二个参数 携带事件数据, 行内可以通过$event访问到, 方法可以通过参数访问到.
    => <blog-post ... @enlarge-text="postFontSize += $event"></blog-post>
5. 通过插槽分发内容
	可以通过 <slot> 元素实现.
6. 动态组件
	可以通过 <component :is="currentTabComponent"></component> 来实现
	currentTabComponent 可以为 已注册组件的名字或者一个组件选项对象.
7. 元素位置受限
	<li>、<tr> 和 <option>，只能出现在其它某些特定的元素内部。
	这个自定义组件 <blog-post-row> 会被作为无效的内容提升到外部，并导致最终渲染结果出错。我们可以使用特殊的 is attribute 作为一个变通的办法：
    <table>
      <tr is="vue:blog-post-row"></tr>
    </table>
```

# 2. 深入组件

## I. 组件注册

```javascript
1. 组件名 => 在注册一个组件的时候，我们始终需要给它一个名字。 组件名就是 app.component 的第一个参数
2. 组件名大小写 => 
    使用 kebab-case => app.component('my-component-name', {}) 使用短横线命名 引用必须使用短横线 例如: <my-component-name>
    使用 PascalCase => app.component('MyComponentName', {}) 
		使用 PascalCase (首字母大写命名) 定义一个组件时，你在引用这个自定义元素时两种命名法都可以使用。
3. 全局注册
	Vue.createApp({...}).component('my-component-name', {
      	// ... 选项 ...
	})
4. 局部注册
	可以通过一个普通的 JavaScript 对象来定义组件 => tip: 局部注册的组件在其子组件中不可用
    const ComponentA = {
      /* ... */
    }
5. 模块系统
	创建 components 目录 然后你需要在局部注册之前导入每个你想使用的组件。
    import ComponentA from './ComponentA'
    import ComponentC from './ComponentC'
    export default {
      components: {
        ComponentA,
        ComponentC
      }
      // ...
    }
```

## II. Props

```js
1. 目前为止 我们只看到了以字符串数组形式列出的prop:
	props: ['title', 'likes', 'isPublished', 'commentIds', 'author']
   但是通常情况下希望每个prop都指定类型:
   	props: {
      title: String,
      likes: Number,
      isPublished: Boolean,
      commentIds: Array,
      author: Object,
      callback: Function,
      contactsPromise: Promise // 或任何其他 "构造函数"
    }
2. 传递静态或动态的Prop
    静态 => <blog-post title="My journey with Vue"></blog-post>
    动态 => <blog-post :title="post.title + ' by ' + post.author.name"></blog-post> 
3. 传入一个对象的所有property 可以使用不带参数的 v-bind => 
	post: {
      id: 1,
      title: 'My Journey with Vue'
    }
	<blog-post v-bind="post"></blog-post>
4. 单向数据流
	每次父级组件发生变更时，子组件中所有的 prop 都将会刷新为最新的值。这意味着你不应该在一个子组件内部改变 prop。
5. props验证
	为了定制 prop 的验证方式，你可以为 props 中的值提供一个带有验证要求的对象，而不是一个字符串数组。
    app.component('my-component', {
      props: {
        // 基础的类型检查 (`null` 和 `undefined` 值会通过任何类型验证)
        propA: Number,
        // 多个可能的类型
        propB: [String, Number],
        // 必填的字符串
        propC: {
          type: String,
          required: true
        },
        // 带有默认值的数字
        propD: {
          type: Number,
          default: 100
        },
        // 带有默认值的对象
        propE: {
          type: Object,
          // 对象或数组的默认值必须从一个工厂函数返回
          default() {
            return { message: 'hello' }
          }
        },
        // 自定义验证函数
        propF: {
          validator(value) {
            // 这个值必须与下列字符串中的其中一个相匹配
            return ['success', 'warning', 'danger'].includes(value)
          }
        },
        // 具有默认值的函数
        propG: {
          type: Function,
          // 与对象或数组的默认值不同，这不是一个工厂函数——这是一个用作默认值的函数
          default() {
            return 'Default function'
          }
        }
      }
    })
	当 prop 验证失败的时候，(开发环境构建版本的) Vue 将会产生一个控制台的警告。
6. 类型检查
	type 可以是下列原生"构造函数"中的一个：
    	String
        Number
        Boolean
        Array
        Object
        Date
        Function
        Symbol
	还可以是一个自定义的构造函数 并且通过 instanceof 来进行检查确认   
		function Person(firstName, lastName) {
          this.firstName = firstName
          this.lastName = lastName
        }
		app.component('blog-post', {
          props: {
            author: Person
          }
        }) // 来验证 author prop 的值是否是通过 new Person 创建的。
```

## III. 非Props的Attribute

```js
一个非 prop 的 attribute 是指传向一个组件，但是该组件并没有相应 props 或 emits 定义的 attribute。
常见的示例包括 "class、style 和 id attribute"。可以通过 $attrs property 访问那些 attribute。
1. Attribute 
	当组件返回单个根节点时，非 prop 的 attribute 将自动添加到根节点的 attribute 中。同样的规则也适用于事件监听器.
2. 禁用 Attribute 继承
	如果你不希望组件的根元素继承 attribute，可以在组件的选项中设置 inheritAttrs: false。
    禁用 attribute 继承的常见场景是需要将 attribute 应用于根节点之外的其他元素。
    app.component('date-picker', {
      inheritAttrs: false,
      template: `
        <div class="date-picker">
          <input type="datetime-local" v-bind="$attrs" />
        </div>
      `
    })
3. 多个根节点上的 Attribute 继承
	与单个根节点组件不同，具有多个根节点的组件"不具有自动 attribute fallthrough (隐式贯穿) 行为"。如果未显式绑定 $attrs，将发出运行时警告。
```

## IV. 自定义事件

```js
1. 定义自定义事件
	app.component('custom-form', {
      emits: ['inFocus', 'submit']
    })
	当在 emits 选项中定义了原生事件 (如 click) 时，将使用组件中的事件替代原生事件侦听器。
2. emits类似于props 可以添加验证.(上述已经介绍)    
3. v-model 参数
	默认情况下，组件上的 v-model 使用 modelValue 作为 prop 和 update:modelValue 作为事件。
    我们可以通过向 v-model 传递参数来修改这些名称： => <my-component v-model:title="bookTitle"></my-component>
	子组件将需要一个 title prop 并发出 update:title 事件来进行同步
    app.component('my-component', {
      props: {
        title: String
      },
      emits: ['update:title'],
      template: `
        <input
          type="text"
          :value="title"
          @input="$emit('update:title', $event.target.value)">
      `
    })
4. 处理 v-model 修饰符
	创建一个示例自定义修饰符 capitalize，它将 v-model 绑定提供的字符串的第一个字母大写。
    通过props的modelModifiers接收修饰符数据。
    <my-component v-model.capitalize="myText"></my-component>
	app.component('my-component', {
      props: {
        modelValue: String,
        modelModifiers: {
          default: () => ({})
        }
      },
      emits: ['update:modelValue'],
      template: `
        <input type="text"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)">
      `,
      created() {
        console.log(this.modelModifiers) // { capitalize: true }
      }
    })
	=> 对于带参数的 v-model 绑定，生成的 prop 名称将为 arg + "Modifiers"：
       <my-component v-model:description.capitalize="myText"></my-component>
	   app.component('my-component', {
          props: ['description', 'descriptionModifiers'],
          emits: ['update:description'],
          template: `
            <input type="text"
              :value="description"
              @input="$emit('update:description', $event.target.value)">
          `,
          created() {
            console.log(this.descriptionModifiers) // { capitalize: true }
          }
        })
```

## V. 插槽(难点)

```js
如果 <todo-button> 的 template 中没有包含一个 <slot> 元素，则该组件起始标签和结束标签之间的任何内容都会"被抛弃"。
1. 备用内容
	<button type="submit">
      <slot>Submit</slot>  // Submit即为默认内容
    </button>
2. 具名插槽
	slot 元素有一个特殊的attribute: name , 一个不带 name 的 <slot> 出口会带有隐含的名字“default”。
	在向具名插槽提供内容的时候，我们可以在一个 <template> 元素上使用 v-slot 指令，并以 v-slot 的参数的形式提供其名称：
    => 
    	<template v-slot:header>
            <h1>Here might be a page title</h1>
         </template>
    注意: v-slot 只能添加在 <template> 上 
3. 作用域插槽
	绑定在 <slot> 元素上的 attribute 被称为插槽 prop. 在父级作用域中，我们可以使用带值的 v-slot 来定义我们提供的插槽 prop 的名字
    <todo-list>
      <template v-slot:default="slotProps"> // slotProps 为子组件 props对象
        <i class="fas fa-check"></i>
        <span class="green">{{ slotProps.item }}</span>
      </template>
    </todo-list>
4. 独占默认插槽的缩写语法
	只要出现多个插槽，请始终为所有的插槽使用完整的基于 <template> 的语法：
	<todo-list>
      <template v-slot:default="slotProps">
        <i class="fas fa-check"></i>
        <span class="green">{{ slotProps.item }}</span>
      </template>

      <template v-slot:other="otherSlotProps">
        ...
      </template>
    </todo-list>
5. 解构插槽 Prop
	作用域插槽的内部工作原理是将你的插槽内容包括在一个传入单个参数的函数里：
    function (slotProps) {
      // ... 插槽内容 ...
    }
	v-slot 的值实际上可以是任何能够作为函数定义中的参数的 JavaScript 表达式。
    解构
    	<todo-list v-slot="{ item }">
          <i class="fas fa-check"></i>
          <span class="green">{{ item }}</span>
        </todo-list>
    设置默认值
    	<todo-list v-slot="{ item = 'Placeholder' }">
          <i class="fas fa-check"></i>
          <span class="green">{{ item }}</span>
        </todo-list>
    重命名
    	<todo-list v-slot="{ item: todo }">
          <i class="fas fa-check"></i>
          <span class="green">{{ todo }}</span>
        </todo-list>
6. 动态插槽名
	<base-layout>
      <template v-slot:[dynamicSlotName]>
        ...
      </template>
    </base-layout>
7. 具名插槽的缩写
	<template #header>
        <h1>Here might be a page title</h1>
     </template>
```

## VI. Provide / Inject( 可以看成长距离的prop )

```javascript
1. 我们可以使用一对 provide 和 inject。无论组件层次结构有多深，父组件都可以作为其所有子组件的依赖提供者。
// ------------ 传递静态数据--------------------------------
app.component('todo-list', {
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets']
    }
  },
  provide: {
    user: 'John Doe' // 父级组件提供静态数据
  },
  template: `
    <div>
      {{ todos.length }}
      <!-- 模板的其余部分 -->
    </div>
  `
})

app.component('todo-list-statistics', {
  inject: ['user'], // 儿子组件接收数据
  created() {
    console.log(`Injected property: ${this.user}`) // > 注入的 property: John Doe
  }
})
// ---------------------------------------------------------
// -------------------- 传递组件实例 property----------------
要访问组件实例 property，我们需要将 provide 转换为返回对象的函数：
app.component('todo-list', {
  data() {
    return {
      todos: ['Feed a cat', 'Buy tickets']
    }
  },
  provide() {
    return {
      todoLength: this.todos.length
    }
  },
  template: `
    ...
  `
})
// ---------------------------------------------------------
tips: !! provide/inject 绑定并不是响应式的

2. 处理响应式
	这是因为默认情况下，provide/inject 绑定并不是响应式的。我们可以通过传递一个 "ref property" 或 "reactive" 对象给 provide 来改变这种行为。
    app.component('todo-list', {
      // ...
      provide() {
        return {
          todoLength: Vue.computed(() => this.todos.length)
        }
      }
    })

    app.component('todo-list-statistics', {
      inject: ['todoLength'],
      created() {
        console.log(`Injected property: ${this.todoLength.value}`) // > 注入的 property: 5
      }
    })
```

## VII. 动态组件和异步组件

```js
1. 在动态组件上使用 keep-alive
	我们之前曾经在一个多标签的界面中使用 is attribute 来切换不同的组件：
    	=> <component :is="currentTabComponent"></component>
	在这些组件之间切换的时候，你有时会想保持这些组件的状态，以避免反复渲染导致的性能问题。
	    =>
    		<!-- 失活的组件将会被缓存！-->
            <keep-alive>
              <component :is="currentTabComponent"></component>
            </keep-alive>
2. 在大型应用中，我们可能需要将应用分割成小一些的代码块，并且只在需要的时候才从服务器加载一个模块。
   为了实现这个效果，Vue 有一个 "defineAsyncComponent" 方法：
   import { defineAsyncComponent } from 'vue'
    const AsyncComp = defineAsyncComponent(() =>
      import('./components/AsyncComponent.vue')
    )
    app.component('async-component', AsyncComp)

   局部组件注册时也可以使用 defineAsyncComponent:
	=> 
    	import { createApp, defineAsyncComponent } from 'vue'
        createApp({
          // ...
          components: {
            AsyncComponent: defineAsyncComponent(() =>
              import('./components/AsyncComponent.vue')
            )
          }
        })
3. 与 Suspense 一起使用
   加载状态将由 <Suspense> 控制
```

## VIII. 模板引用

```js
1. 尽管存在 prop 和事件，但有时你可能仍然需要在 JavaScript 中直接访问子组件。为此，可以使用 ref attribute 为子组件或 HTML 元素指定引用 ID。
   例如：<input ref="input"> && <base-input ref="usernameInput"></base-input>  =>  this.$refs.input.focus()
2. tip
   $refs 只会在组件"渲染完成之后"生效。这仅作为一个用于直接操作子元素的“逃生舱”——你应该避免在模板或计算属性中访问 $refs。
```

## VX. 处理边界

```js
1. 强制更新
	$forceUpdate
2. 低级静态组件与 v-once
	可以通过向根元素添加 v-once 指令来确保只对其求值一次，然后进行缓存(不要过度使用这种模式)
```

