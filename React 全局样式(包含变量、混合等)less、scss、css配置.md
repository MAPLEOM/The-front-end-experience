# React 全局样式(包含变量、混合)less、scss、css配置

### 1. 安装依赖

```
yarn add craco-plugin-style-resources-loader @craco/craco -D
```

### 2. 根目录下新建craco.config.js配置文件

```
增加如下配置：
	const cracoPluginStyleResourcesLoader = require('craco-plugin-style-resources-loader');
	const path = require('path');
	module.exports = {
		 plugins: [
                {
                plugin: cracoPluginStyleResourcesLoader,
                options: {
                    patterns: path.join(__dirname, 'src/common/common.less'), // 第二个参数为全局的样式文件 名字和路径应与您所建的文件一致
                    styleType: 'less'
                }
        	}
		 ]
	}
```

### 3. 修改package.json文件

```
"scripts": {
        "start": "craco start",
        "build": "craco build",
        "test": "craco test",
        "eject": "react-scripts eject"
 }
```

### 4. 重启项目

