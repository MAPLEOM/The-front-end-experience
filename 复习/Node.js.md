# Node.js

## 1. fs模块

```js
1. fs.readFile(fillPath,[options = 'utf8',], callback)
    🌰 => 
        fs.readFile(filePath, 'utf-8', (err, dataStr) => {})
2. fs.writeFile(fillPath, data, [options ,],callback)
	🌰 =>
    	fs.writeFile(filePath, {}, (error) => {} )
```

## 2. path模块

```js
1. path.resolve(__dirname,path) // 拼接路径
2. path.basename(path [,ext]) // 获取文件名[,扩展名]
3. path.extname(path) // 获取文件扩展名
```

