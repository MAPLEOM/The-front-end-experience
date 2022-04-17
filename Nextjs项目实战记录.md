# Nextjs项目实战记录

## 一、技术选型：

### 🎈页面结构：HTML5

### 🎈页面样式：Css  Scss  Tailwindcss(框架)

### 🎈页面交互：Javascript  Typescript  Nextjs(框架)

## 二、项目搭建

这里使用 Tailwindcss 官方提供的 脚手架进行创建，具体步骤如下：

详情可参考：[在 Next.js 中安装 Tailwind CSS - Tailwind CSS 中文文档](https://www.tailwindcss.cn/docs/guides/nextjs)

### 1.  进入到您想要存储该项目的位置

### 2. 进入步骤 1 对应位置的目录终端，并输入下面的命令：(请确保全局安装 Node环境)

```
npx create-next-app -e with-tailwindcss my-project 
```

### 🍕 注意 my-project 是您的项目名称，可自定义哦。

### 3. 创建好项目后，进入到项目 根目录下，输入以下对应版本的命令 配置 Tailwindcss：

```js
// next 版本可在 package.json 文件中查看
// nextjs 版本在10及以上
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest 
// nextjs 版本低于10
npm install -D tailwindcss@npm:@tailwindcss/postcss7-compat postcss@^7 autoprefixer@^9
```

### 4. 创建配置文件

```js
// 该命令用于生成 tailwind.config.js 和 postcss.config.js
npx tailwindcss init -p 
```

### 5. 配置 Tailwind 来移除生产环境下没有使用到的样式声明

```js
// 进入 tailwind.config.js文件中 修改 purge 属性
purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
```

### 6. 这样项目的基本结构就搭建完成啦😑

## 三、目录结构

```js
-- .next 		// 开发环境(dev)和生产环境(build)打包后存储的位置
|
-- node_modules  // 项目安装的依赖包存储的位置
|
-- pages 		// 页面文件的存储位置
   -- api 		// api路由的存储位置 可配合mock.js模拟数据
|
-- public 		// 静态文件的存储位置(包括 页面icon、图片资源、字体等)    
|
-- styles		// 样式文件存储位置(next 默认支持 css module)    
|
-- next.config.js // nextjs 配置文件       
|
-- package.json   // 相关依赖信息的记录文件
|
-- tailwind.config.js // tailwindcss 配置文件
|
-- prettier.config.js // prettier配置文件(用于配置代码格式化规则)       
|
-- tsconfig.json 	// typescript 规则配置
|
-- postcss.config.js // postcss插件的配置文件(兼容低版本以及各厂商的浏览器)
|
-- .....       
```

## 四、进入编码环节

### 1. 新增目录结构

```js
-- ...
|
-- api 			// axios 请求库axios封装 配置总体请求接口
|
-- components 	// 公共组件存储
|
-- mock 		// 使用 mockjs 模拟数据
|
-- rules 		// typescript 接口、enums配置数据结构
	-- interface
	-- enums
|
-- store		// redux 状态管理配置
	-- reducrjs
-- ...    
```

### 2. 页面结构分解

```
此处根据实际页面结构分析，分解出公共组件以及每个页面的构成结构。
😑 例如：页面头部(Header)、页面底部(Footer)、公共弹窗等组件。可优先实现。
```

## 五、next框架使用

### 👍 nextjs 是一个用于生产环境的 React框架

```
优势：
	1. 文件结构即路由 nextjs通过pages目录下的结构解析路由结构。
	2. 混合模式：SSG(构建时预渲染)和SSR(服务端渲染)通过此种模式加快页面构建速度 提高页面性能同时有利于SEO爬取等等
	3. 支持TypeScript自动配置和编译TS
	4. 对于部分组件的封装优化。😑例如：Image、字体等的优化。
	....
```

### 1. Pages(页面)

```js
1.  页面
	🎈 Next.js中 页面就是从 ".js" ".jsx" ".ts" ".tsx"文件导出的 React组件。每个页面都是用 ❤️文件名❤️作为路由。(这就是所谓 文件即路由)
	🌰 "/pages/about.js"文件导出的React的组件 可以通过 "/about"路径进行访问
2. 动态路由
    🎈 Next.js 支持动态路由。
    🌰 "/pages/posts/[id].js"文件 可以通过 "posts/1"、"posts/2"等类似路径访问
    😑 tips：动态路径不携带"参数" 将匹配到 404页面
3. 预渲染
	默认情况下 Next.js 将"预渲染"每个页面。 => Next.js 会预先为每个页面生成HTML文件。
    🎈 预渲染可以带来更好的"性能"和"SEO效果"
4. 预渲染的两种方式
    4.1 静态生成
    	描述：HTML在"构建时"生成,并在每次页面请求时 👍"重用"
    4.2 服务器端渲染
    	描述: 在每次页面请求时"重新生成"HTML
	4.3 预渲染方式的选择        
		=> 出于性能考虑 相对服务器渲染 官方更推荐使用 "静态生成"
		=> 但某些情况下 "服务器渲染"可能是唯一的选择。
5. 静态生成(推荐)
	如果一个页面使用了 "静态生成" 在"构建时"将生成此页面的Html文件。
    🎈 "next build"时就生成了该页面的对应的 HTML 文件. => 每次请求时被宠用，还可以被CDN缓存。
	😑 Next中可以静态生成 "带有或不带有数据"的页面：
    5.1 生成不带数据的静态页面(默认不涉及获取数据)
    	function About() {
          return <div>About</div>
        }
        export default About
	5.2 获取数据的静态生成(两种)
        5.2.1 页面内容取决于外部数据(getStaticProps)
                需要在页面文件中 "export(导出)"一个名叫"getStaticProps"的"async(异步)"函数.
                🎈 该函数在"构建时"被调用 并允许你通过 "props参数"传递给页面。
        5.2.2 页面路径取决于外部数据(getStaticPaths)
                `pages/posts/[id].js`的id对应页面"内容"取决于外部数据。
                🎈 Next.js允许你从动态页面中 "export(导出)" 一个名为 "getStaticPaths"的 "async(函				  数)" 该函数在"构建时"被调用 并允许你指定预渲染的路径
6. 服务器段渲染(getServerSideProps)
    假设你的某个页面需要预渲染频繁更新的数据（从外部 API 获取）
    可以编写`getServerSideProps`获取数据并将其传递给页面。( return { props: { data } } )
        `getServerSideProps` => 每次页面请求的时候都会运行
        `getStaticProps` => 只在构建时运行
```

### 2. 获取数据

```js
1. getStaticProps(无外部数据 静态生成)
2. getStaticPaths(根据动态路由 引入外部数据 静态生成)
3. getServerSideProps(服务器端渲染 获取每个请求的数据)
```

### 3. 内置对 CSS 的支持

```js
1. 添加全局样式表
	创建 "styles.css" 文件 在`pages/_app.js`文件中导入 CSS 文件。 
2. 从 `node_modules` 目录导入样式(Next.js v9.5.4 开始支持)
	对于"全局"样式表 应该在 `pages/_app.js` 文件中进行导入。
3. 添加组件级的 CSS
    Next.js 通过 `[name].module.css` 文件命名约定来支持 "CSS模块"
    😑 原理: CSS模块通过"自动创建唯一"唯一的类名从而将CSS限定在局部范围内 
    这使得不同文件使用相同CSS类名，而不必担心冲突
4. 对 Sass 的支持
	Next.js 允许导入具有 `.scss`和 `.sass`扩展名的 Sass文件。
    可以通过 `.module.scss` 或 `.module.sass`扩展名来使用组件的 Sass。
5. 自定义 Sass 参数
	...
6. Sass 变量(主题配置)
	Next.js支持从 CSS模块文件导出的`Sass变量`。
    🌰 例如:
		   使用导出的 `primaryColor` Sass变量：
        	/* variables.module.scss */
            $primary-color:#64FF000
            :export{
            	primaryColor:$primary-color;
    		}
```

### 4. 布局

### 5. 图片优化

```js
Next.js图像组件`next/image`是 HTML 元素的扩展`<img>`, 它包括各种内置的"性能优化"。
🎈 图片资源使用 `Image`组件以提高性能等优势。
1. 本地图像
    必须是静态的 `import`, 动态 `await import()`或`require()`不支持。
    Next.js将更具导入的文件"自动"确定图像的"width"和"height"。=> 以防止在加载图像时布局位移。
	🌰：
        import Image from 'next/image'
        import proFilePic from '../public/me.png'
        <Image src={proFilePic} alt="Picture"/>
2. 远程图像
	要使用远程图像，该`src`属性应该是一个 URL 字符串。
    由于Next.js在构建时无法访问远程图片，因此需要手动提供 `width`、`height`和`blurDataURL`属性。
    😑 tips: placeholder + blurDataURL 属性同时使用 可以实现加载图像前的图像占位。
3. 远程图像域名
```





