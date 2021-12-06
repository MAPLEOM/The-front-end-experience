# 1. React 别名配置

## 创建tsconfig.path.json文件(最外层与package.json文件同级)；

```
{
	"compilerOptions": {
		"baseUrl": ".",
		"paths": {
			"@/*": ["src/*"]
		}
	}
}
```

## 在tsconfig.json中添加以下内容(识别@符号)

```
{
	"compilerOptions": {
		"target": "es5",
		"lib": ["dom", "dom.iterable", "esnext"],
		"allowJs": true,
		"skipLibCheck": true,
		"esModuleInterop": true,
		"allowSyntheticDefaultImports": true,
		"strict": false,
		"forceConsistentCasingInFileNames": true,
		"noFallthroughCasesInSwitch": true,
		"module": "esnext",
		"moduleResolution": "node",
		"resolveJsonModule": true,
		"isolatedModules": true,
		"noEmit": true,
		"jsx": "react-jsx",
		"experimentalDecorators": true,
		"emitDecoratorMetadata": true
	},
	"extends": "./tsconfig.path.json", // 重点在此处
	"exclude": ["node_modules", "build"],
	"include": ["src"]
}

```

## 利用craco.config.js(打包识别@符号)(若未使用craco 请安装依赖 @craco/craco 并将package.json中的部分配置改为以下内容)

```
"scripts": {
		"start": "craco start", // 将react-scripts改为craco
		"build": "craco build", // 将react-scripts改为craco
		"test": "craco test",   // 将react-scripts改为craco
		"eject": "react-scripts eject"
	},
```



### 安装craco-alias依赖并配置如下(根据实际项目添加plugins下的对象内容)

```
module.exports = {
	plugins: [
		// 在plugins配置中添加以下内容
		{
			plugin: CracoAlias,
			options: {
				source: "tsconfig",
				baseUrl: ".",
				tsConfigPath: "./tsconfig.path.json",
			}
		}
	],
};
```



# 2. TS中可使用 // @ts-ignore 强制忽略ts验证

# 3. TS中可使用 组件:React.FC形式定义函数组件

# 4. TS中枚举enum具有为常量定义 易懂的特殊意思 的功能

# 5. React中类组件可在组件名后面添加<any,any>对props和state进行类型定义 防止不必要的错误(如下形式)

```
class App extends React.Component<any,any>{}
```

# 6. useState、useEffect、useMemo、useRef

# 7. eCharts图表案例网址(https://www.makeapie.com/explore.html)
