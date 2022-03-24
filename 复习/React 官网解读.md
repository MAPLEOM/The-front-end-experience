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
	Context 的设计目的
```

## 3.  API

## 4. Hook