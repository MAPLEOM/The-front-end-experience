# React全局less、css、scss  scoped配置

## 1. 安装依赖

```
yarn add @craco/craco 
yarn add craco-plugin-scoped-css craco-scoped-less -D
```

## 2. 修改package.json部分内容

```
"scripts": {
        "start": "craco start",
        "build": "craco build",
        "test": "craco test",
        "eject": "react-scripts eject"
}
```



## 3. 创建craco.config.js文件于根路径

```
module.exports = {
    plugins: [
        {
            plugin: require('craco-plugin-scoped-css')
        },
        {
            plugin: require('craco-scoped-less') // 若使用css/scss可不安装和引入该依赖
        }
    ]
};
```

## 4. 创建样式文件 并引用即可(需重启项目)

```
tip: 文件名的格式需要满足 [name].scoped.less / [name].scoped.css / [name].scoped.scss
```

