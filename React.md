# React

## 1. React 事件机制

```react
😊 => <div onClick={this.handleClick.bind(this)}>点我</div>
🎈 => 绑定的不是真实的Dom
	  React 并不是将事件绑定在 "真实的DOM元素上" , 而是在 "document 上监听所有的事件" , 
      当事件冒泡到 document 处的时候 , React将事件内容封装并交由真正的 事件函数运行. 这样不仅减少了内存的消耗,还能在组件"挂载销毁"时候统一订阅和删除.
🧨 => 冒泡到 document 上的事件"不是原生的浏览器的事件".而是由 React 自己实现的 合成事件(SyntheticEvent)

😜 => 实现合成事件的目的如下:
		1. 抹平了浏览器之间的兼容问题 另外这是一个跨浏览器的原生事件包装器 赋予了跨浏览器的能力.
		2. 对于浏览器的原生事件 浏览器会给监听器创建一个事件对象 如果有很多事件监听 那么就会分配很多"事件对象" "造成高额的内存分配问题".
		   但是对于合成事件来说 有一个事件池专门管理创建和销毁 事件使用时 就会从"池子"中复用 事件回调结束后 就会"销毁对象上的属性" 便于下次复用事件对象       
```

## 2. React 阻止事件冒泡三种情况

```react
1. 阻止 合成事件之间的冒泡
	子元素中调用 e.stopPropagation() 即可 (可阻止与合成事件的冒泡 同时子元素也阻止与原生事件的冒泡)
    ❤ => 
    	const appClick = (e) => {
            console.log('父事件');
        };
        const sonClick = (e) => {
            console.log('子事件');
            e.stopPropagation();
        };
2. 阻止 合成事件 与 原生事件之间的冒泡
	子元素调用 e.nativeEvent.stopImmediatePropagation(); => nativeEvent为原生事件的属性
    👌 => 
    	onst appClick = (e) => {
            console.log('父事件');
        };
        const sonClick = (e) => {
            console.log('子事件');
            e.nativeEvent.stopImmediatePropagation();
        };
3. 阻止 "合成事件 与 除最外层document上的原生事件" 上的冒泡，通过判断e.target来避免
	除了最外层 document (document为整个html文档) 可以通过 e.target 对象元素的比较 进行判断是否冒泡.
```

## 3. React 的事件和普通的HTML事件有什么不同?

```react
🙌 => 区别:
		1. 对于事件的名称的命名方式,原生"全小写",react 采用 "小驼峰式"命名;
		2. 对于事件函数处理语法,原生事件为 "字符串",react 事件为函数;
		3. react 不能采用 return false 的方式阻止默认事件 而必须明确调用 preventDefault() 来阻止默认行为.
🤷‍ => 合成事件是 react 模拟原生 Dom 事件所有能力的一个事件对象, 其优点如下:
		1. 兼容所有浏览器 更好的跨平台
		2. 将事件统一存放在一个数组，避免频繁的新增与删除（垃圾回收）        
		3. 方便 react 统一管理和事物机制
✔✔✔ => 事件的执行顺序是先执行"原生事件"后执行"合成事件" (本人已经验证!!) 合成事件要绑定到 document 上 
         => 如果在原生事件上阻止冒泡 则可能合成事件无法执行 所以尽量避免原生事件和合成事件混用.
```

## 4. React组件中怎么做事件代理?它的原理是什么?

```js
🎶 => React 基于 virtual Dom 实现了 SyntheticEvent(合成事件) 定义的事件处理器会接收到一个合成事件对象的"实例" 
      且与原生的浏览器事件拥有相同的接口 支持"冒泡机制" 所有事件自动绑定到最外层.
🤦‍♀️ => 在React底层中 主要对合成事件做了两件事:
		1. 事件委派:
			React 会把所有的事件绑定在最外层 使用统一的监听器 这个事件监听器上维持了"一个映射"来保存所有组件内部事件监听和处理函数。
		2. 自动绑定:
			React 组件中 每个方法的上下文都会指向该组件的实例 即自动绑定this为当前组件.
```

## 5. React 高阶组件   Render props   hooks 有什么区别 , 为什么要不断迭代?

```react
🐱‍🏍 => 这三者是目前 React 解决代码复用的主要方式:
	1. 高阶组件(HOC) 是 React中用于复用组件逻辑的一种高级技巧. HOC自身不是React API的一部分 
	   他是一种基于 React 的组合特性而形成的 "设计模式". 具体而言, 高阶组件是 参数为"组件",返回值为 "新组件"的函数.
       😎 => 
       		// hoc的定义
            function withSubscription(WrappedComponent, selectData) {
              return class extends React.Component {
                constructor(props) {
                  super(props);
                  this.state = {
                    data: selectData(DataSource, props)
                  };
                }
                // 一些通用的逻辑处理
                render() {
                  // ... 并使用新数据渲染被包装的组件!
                  return <WrappedComponent data={this.state.data} {...this.props} />;
                }
              };

            // 使用
            const BlogPostWithSubscription = withSubscription(BlogPost,
              (DataSource, props) => DataSource.getBlogPost(props.id));
		HOC优缺点:
           	优点: 逻辑复用 不影响被包裹组件 内部的逻辑.
            缺点: props可能命名冲突导致被覆盖 
            	 不清楚属性的来源
	2. Render props => "render prop" 是一种在 React 组件之间使用 一个值为函数的 prop 共享代码的简单技术.
    		  具有render prop的组件接收一个返回React元素的函数 将 render 的渲染逻辑注入到组件内部.
               "render"的命名可以是任何其他的有效的标识符
               ✌ => 个人理解 render prop 将渲染任务交给了 "调用方". "定义方"为调用方通过传参的方式提供数据
               		调用方以函数的参数形式接收参数并完成渲染任务 => 进而通过定义方内部展示
               -----------------------------------------------------------------------------------
               // DataProvider组件内部的渲染逻辑如下
                class DataProvider extends React.Components {
                     state = {
                    	name: 'Tom'
                  	}

                    render() {
                    return (
                        <div>
                          <p>共享数据组件自己内部的渲染逻辑</p>
                          { this.props.render(this.state) }
                      </div>
                    );
                  }
                }

                // 调用方式
                <DataProvider render={data => (
                  <h1>Hello {data.name}</h1>
                )}/>
			   -----------------------------------------------------------------------------------
               🤞 => 优缺点:
               			优点: 数据共享 代码复用 将组件内的state作为props传递给调用者 将渲染逻辑交给调用者.
                         缺点: 无法在 return 语句外访问数据 嵌套写法不够优雅.
	3. Hooks => hook只能在组件顶层使用，不可在分支语句中使用    	
    		    它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。通过自定义hook，可以复用代码逻辑。
                😍 => 
                		// 自定义一个获取订阅数据的hook
                        function useSubscription() {
                          const data = DataSource.getComments();
                          return [data];
                        }
                        // 
                        function CommentList(props) {
                          const {data} = props;
                          const [subData] = useSubscription();
                            ...
                        }
                        // 使用
                        <CommentList data='hello' />
				🎂 =>  优缺点:
                            1. 使用直观；
                            2. 解决hoc的prop 重名问题；
                            3. 解决render props 因共享数据 而出现嵌套地狱的问题；
                            4. 能在return之外使用数据的问题。
```

## 6. 对 React-fiber 的理解, 它解决的什么问题?

> ​		React V15 在渲染时，会递归比对 VirtualDOM 树，找出需要变动的节点，然后同步更新它们， 一气呵成。这个过程期间， React 会占据浏览器资源，这会导致用户触发的事件得不到响应，并且会导致掉帧，导致用户感觉到卡顿。
> ​		为了给用户制造一种应用很快的“假象”，不能让一个任务长期霸占着资源。 可以将浏览器的渲染、布局、绘制、资源加载(例如 HTML 解析)、事件响应、脚本执行视作操作系统的“进程”，需要通过某些调度策略合理地分配 CPU 资源，从而提高浏览器的用户响应速率, 同时兼顾任务执行效率。
> 所以 React 通过Fiber 架构，让这个执行过程变成可被中断。“适时”地让出 CPU 执行权，除了可以让浏览器及时地响应用户的交互，还有其他好处:
>
> ​		分批延时对DOM进行操作，避免一次性操作大量 DOM 节点，可以得到更好的用户体验；
> ​		给浏览器一点喘息的机会，它会对代码进行编译优化（JIT）及进行热代码优化，或者对 reflow 进行修正。
>
> 核心思想: Fiber 也称协程或者纤程。它和线程并不一样，协程本身是没有并发或者并行能力的（需要配合线程），它只是一种控制流程的让出机制。让出 CPU 的执行权，让 CPU 能在这段时间执行其他的操作。渲染的过程可以被中断，可以将控制权交回浏览器，让位给高优先级的任务，浏览器空闲后再恢复渲染。

## 7. 哪些方法会触发 React 重新渲染? 重新渲染 Render 会做些什么 ?

```react
(1) 哪些方法触发 React 重新渲染?
	1. setState() 方法的调用
    	通常情况下 执行 setState 会触发 render. 🎈 但是当 setState 传入 null 时 并不会触发 render.(本人亲自验证过)
	2. 父组件重新渲染.
    	只要父组件重新渲染 即使传入子组件的 props 未发生变化 那么子组件也会重新渲染 进而触发 render.
(2) 重新渲染 render 会做些什么?
	1. 会对新旧 VNode 进行对比 , 也就是 diff 算法.
	2. 对新旧两棵树进行深度优先遍历 这样每一个节点都有一个标记 在到深度遍历的时候 每遍历到一个节点就会把该节点和新的节点树进行对比 
	   => 如果有差异就放到一个对象里面
	3. 遍历差异对象 根据差异的类型 根据对应规则更新 VNode.        
```

> ​	React 的处理 render 的基本思维模式是每次一有变动就会去重新渲染整个应用。在 Virtual DOM 没有出现之前，最简单的方法就是直接调用 	innerHTML。
>
> ​	Virtual DOM厉害的地方并不是说它比直接操作 DOM 快，而是说不管数据怎么变，都会尽量以最小的代价去更新 DOM。React 将 render 函数返回的虚拟 DOM 树与老的进行比较，从而确定 DOM 要不要更新、怎么更新。当 DOM 树很大时，遍历两棵树进行各种比对还是相当耗性能的，特别是在顶层 setState 一个微小的修改，默认会去遍历整棵树。尽管 React 使用高度优化的 Diff 算法，但是这个过程仍然会损耗性能.

## 8. React 声明组件有哪几种的方法, 有什么不同?

```react
🎃 => React 声明组件有三种方式:
		1. 函数式定义 无状态组件
		2. ES5 原生方式 React.createClass 定义组件
		3. ES6 形式的 extends React.Component 定义组件       
🎀 => 区别
		1. 无状态组件相对于后两者的区别:
			与无状态组件相比，React.createClass和React.Component都是"创建有状态的组件"，这些组件是要"被实例化的"，并且可以访问组件的"生命周期方法"。
		2. React.createClass 和 React.Component 的区别
        	2.1 函数 this 自绑定
            	    => React.createClass 创建的组件 其每个成员函数的 this 都有 React实例绑定 => 函数中的 this 会被正确配置.(已被废弃)
				   => React.Component 创建的组件 其成员函数不会自动绑定 this ，需要开发者手动绑定，否则 this 不能获取当前组件实例对象。 
		    2.2 👓 组件属性类型 propTypes 及其默认props属性 defaultProps 配置不同
            		=> React.createClass在创建组件时，有关组件props的属性类型及组件默认的属性会作为组件实例的属性来配置，其中defaultProps是使用					  getDefaultProps的方法来获取默认组件属性的
				   => React.Component在创建组件时配置这两个对应信息时，他们是作为组件类的属性，不是组件实例的属性，也就是所谓的类的静态属性来配置的。
		    2.3 组件初始状态state的配置不同
            		=> React.createClass创建的组件，其状态state是通过 "getInitialState" 方法来配置组件相关的状态；
                     => React.Component创建的组件，其状态 state 是在 "constructor" 中像初始化组件属性一样声明的。

```

## 9. 对 React 中 Fragment 的理解, 它的应用场景是什么?

```react
🎄 => 在 React 中 , 组件返回的元素只能 "有一个根元素" , 为了不添加多余的 DOM 节点, 可以使用 Fragment 标签来包裹多个元素, Fragment不会渲染任何元素.
import React, { Component, Fragment } from 'react'
案例🎈 =>
    // 一般形式
    render() {
      return (
        <React.Fragment>
          <ChildA />
          <ChildB />
          <ChildC />
        </React.Fragment>
      );
    }
    // 也可以写成以下形式
    render() {
      return (
        <>
          <ChildA />
          <ChildB />
          <ChildC />
        </>
      );
    }
```

## 10. React 如何获取组件 对应的 DOM 元素?

```react
🎨 => 可以用ref来获取某个子节点的实例
		1. 字符串格式(存在一些问题 可能会在未来的版本被移除)
        	<p ref="info">span</p>
			=> 问题:
				它要求 React 跟踪当前呈现的组件（因为它无法猜测this）。这使得 React 有点慢。
		2. 函数格式
        	<p ref={ele => this.info = ele}></p>
		3. createRef方法：React 16 提供的一个API，使用React.createRef()来实现 　　
```

## 11. React中可以在 render 中访问 refs 吗? 为什么?

```react
🎈 => 不可以，render 阶段 DOM 还没有生成，无法获取 DOM. "Render之后才可以访问".
<>
  <span id="name" ref={this.spanRef}>{this.state.title}</span>
  <span>{
     this.spanRef.current ? '有值' : '无值'
  }</span>
</>
```

## 12. React 生命周期函数(https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

## 13. 对 React 的插槽(Portals) 的理解, 如何使用, 有哪些使用场景.

```react
🎁 => 定义: Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案.
🎫 => 使用: ReactDOM.createPortal(child, container);
        1. 第一个参数 child 是可渲染的 React 子项，比如元素，字符串或者片段等;
        2. 第二个参数 container 是一个 DOM 元素。
```

