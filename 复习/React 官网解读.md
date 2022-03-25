# React 官网解读

## 1. 基础核心

## 2. 高级指引

### 2.1 无障碍

### 2.2 代码分割

```js
1. 打包
    💎 大部分 React 应用都会使用 webpack等构建工具来打包文件. 打包 => 将一个文件引入并合并到一个单独文件 "bundle"的过程. =>页面引入 "bundle.js"即可.
    🌰 案例:
        // app.js
            import { add } from './math.js';	
            console.log(add(16, 26)); // 42
        // math.js
            export function add(a, b) {
              return a + b;
            }
        // !!打包的结果
            function add(a, b) {
              return a + b;
            }
            console.log(add(16, 26)); // 42
2. 代码分割
	代码分割的目的: 尽管没有减少应用的整体代码体积, 但是可以避免加载用户"不需要的代码", 并在初始加载的时候减少所需的"代码量". => 提高应用的性能.
😃 3. import()    
	🎈 在应用中引入代码分割的最佳方式是通过动态 "import()" 语法;
	🌰 案例:
		// 通常情况下
			import { add } from './math'
			console.log(add(16,26));
		// 使用 import()
			import('./math').then((math)=>{
              	console.log(math.add(16,26))  
              })
😃 4. React.lazy() + Suspense
	🎈 React.lazy 函数能让你像渲染常规组件一样"处理动态引入"
	🌰 案例:
		// 常规组件方式
			import {Component} from './components'
		// React.lazy
			const Component = React.lazy(() => import('./components'));
		// 实际使用
			function MyComponent(){
              	return (
                	<div>
                    	// 应该在 Suspense 组件中 渲染 "lazy" 组件
                    	// fallback 属性接受任何 react 元素
                    	<Suspense fallback={<div> loading </div>} 
                    		<Component/>
                    	</Suspense>
                    </div>
                )  
              }
😃 5. 异常捕获边界(后续板块讲解)
	 🎈 如果模块加载失败(例如 "网络问题"), 它会触发"错误". 可以通过 "异常捕获技术" 来处理这些情况. => 用户良好体验
😃 6. 基于路由的代码分割
	 🎈 为确保代码分割"均匀", 且不影响 "用户体验" => 基于路由分割是"不错的选择".
     🌰 案例:
			const App = () => (
                  <Router>
                    <Suspense fallback={<div>Loading...</div>}>
                      <Routes>
                		// 基于路由分割代码
                        <Route path="/" element={<Home />} /> 
                        <Route path="/about" element={<About />} />
                      </Routes>
                    </Suspense>
                  </Router>
              );
😃 7. 命名导出
	  🎈 React.lazy 目前只支持默认导出.如果想要 "命名导出" 可以创建一个中间模块, 来"重新导出为默认模块".
      🌰 案例:
                // ManyComponents.js
                    export const MyComponent = /* ... */;
                    export const MyUnusedComponent = /* ... */;
                // MyComponent.js
                	export { MyComponent as default } from "./ManyComponents.js";
                // MyApp.js
                    import React, { lazy } from 'react';
                    const MyComponent = lazy(() => import("./MyComponent.js"));
```

### 2.3 Context

```js
🎈 Context 提供了一个无需为每层组件手动添加 props, 就能在组件树之间进行"数据传递"的方法.
1. 何时使用 Context
	Context 的设计目的就是为了"共享"对于一个组件而言是"全局"的数据. => 使用 Context 可以避免通过中间元素传递 "props"
2. 使用 Context 之前的"考虑"
	Context 的使用场景主要在于很多不同层级的组件需要访问同样的一些数据. "谨慎使用", 这会使组件的"复用性"变差.
    🎈 如果仅仅只想避免避免层层传递一些属性, 可以使用 .😃"组合组件" 的方案, 有时候会更好.
    🎈 另一种方案, 可以直接将"组件"传递下去. => 可以减少传递的 "props"的数量. !!!! 😂这将使得组件变得更复杂
    🎈 相对于这些方案, Context要简单得多.
3. API
	React.createContext
		🌰 const MyContext = React.createContext( defaultValue );
		功能: 创建一个 Context 对象, 当 React 组件"订阅"了这个 Context 对象, 这个组件会从最近的那个匹配 "Provider"中读取当前的 Context 的值.
	Context.Provider
		🌰 <MyContext.Provider value={/* 某个值 */}>
         功能: 每个 Context 对象都会返回一个 "Provider"组件, 它允许"消费组件"订阅 context 的变化.	Provider 会有一个 "value" 属性,
        	  当 value值发生变化, 内部的所有的 "消费组件"都会重新渲染. (新旧值检测变化, 使用 "object.is")
	Class.contextType 
		🌰 class MyClass extends React.Component {} => MyClass.contextType = MyContext; 
		功能: 挂载在 class 上的 contextType 属性会被重赋值为一个由"React.createContext"创建的 Context 对象. 
              能让你使用 "this.context" 消费最近 Context 上的那个值.
	Context.consumer
		🌰 <MyContext.Consumer> {value => /* 基于 context 值进行渲染*/} </MyContext.Consumer>
         功能: Consumer 能让 React组件"订阅"到 context 变更. 这个函数接收当前的 context 值, 返回一个 React节点.
	Context.displayName
		🌰 const MyContext = React.createContext(/* some value */); MyContext.displayName = 'MyDisplayName';
		功能: context对象接受一个名为 "displayName" 的属性, 类型为字符串, !!! React DevTools "使用该字符串"来确定 context 要显示的内容。
```

### 2.4 错误边界

```js
🎈 错误边界 是一种组件, 这种组件 "可以捕获并打印发生在其子组件树任何位置的 js 错误, 并且它会渲染出备用的 UI".
   如果 "class组件"中定义了 "static getDerivedStatedStateFromError"(用于渲染备用UI) 或 "componentDidCatch"(用于打印错误信息) 
   这两个声明周期函数的任意一个,那么就变成了一个错误边界.
🌰 <ErrorBoundary> <MyWidget /></ErrorBoundary>  
	// !! 错误边界仅可以捕获其子组件的错误
```

### 2.5 Refs转发

```js

```

## 3.  API

## 4. Hook