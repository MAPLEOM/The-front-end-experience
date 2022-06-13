# Nuxt中全局scss配置(https://www.bootschool.net/article/5dc423d0f60a31379ef35ff0/how-to-use-SASS-variables-mixins&functions-globally-in-Nuxt.js-project)

### 1. 安装依赖

```
yarn add sass-loader scss-loader node-sass @nuxtjs/style-resources -D

库说明：
	sass-loader：webpack的一个loader
	node-sass：用于把scss文件编译成css文件
	@nuxtjs/style-resources ：Nuxt提供的负责加载样式资源的模块，要想实现全局引用SASS变量、mixin就得靠它。
```

### 2. 在`assets/scss`目录下新建一个`main.scss`文件

```
主要用于引入其他的*.scss文件，如SASS变量文件、布局文件、函数文件等，主要作为样式的入口文件，文件结构如下:
	$ tree assets
        assets
        ├── css
        │   ├── feather.css
        │   └── reset.css
        ├── fonts
        │   ├── Feather
        │   │   ├── Feather.ttf
        │   │   └── Feather.woff
        └── scss
            ├── _app.fonts.scss
            ├── _app.layout.scss
            ├── _app.mixins.scss
            ├── _app.variables.scss
            ├── main.scss
```

### 3. `assets/scss/main.scss`文件内容如下：

```
@import 'app.fonts';
@import 'app.variables';
@import 'app.mixins';
@import 'app.layout';
```

### 4.然后我们将SASS入口文件、全局变量、全局函数文件的路径配置到`nuxt.config.js`文件中，框架会自动编译并将样式文件加入到`<style>`标签中，示例：

```

css: [
	//配置入口文件
    '@/assets/scss/main.scss'
]

modules: ['@nuxtjs/style-resources'],  // 配置style-resources模块儿

styleResources: {
//如下配置全局使用的变量、mixins和函数文件路径
    scss: [
          '@/assets/scss/_app.variables.scss',
          '@/assets/scss/_app.mixins.scss'
    ]
}
```

