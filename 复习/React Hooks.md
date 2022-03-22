# React Hooks

## 参考链接: https://www.jianshu.com/p/d600f749bb19

## 1. useState => 状态钩子

```js
🎈 纯函数组件中没有状态, useState()用于"函数组件引入状态".
🌰 => const [count,setCount] = useState(0)
```

## 2. useContext => 共享状态钩子

```js
🎈 该钩子的作用为 => 在组件之间共享状态
🌰 => 使用 "react.createContext" 创建初始状态 => const AppContext = React.createContext({}) // 其中 {} 中的数据作为默认值, 不匹配时会使用.
	  "函数组件中" => 使用 "useContext"接收context对象, 可直接使用其中的数据. => const data = useContext(AppContext)
	  "class组件中" => 每个 Context 对象都附带一个 "Provider" 组件 => <AppContext.Provider value = {}> //提供数据
          		   => <AppContext.Consumer> // 使用数据		   
```

## 3. useReducer => Action钩子

```js
🎈 useReducer 为我们提供了"状态管理" => 与 redux 类似, 其原理为用户触发 "action", 通过"reducer"方法改变"state", 从而实现页面和状态的通信.
🌰 const [state, dispatch] = useRender(reducer,initialState); 
    // reducer格式为
		const reducer = (state, action) => {
            if (action.type === 'add') {
                return {
                    ...state,
                    count: state.count + 1,
                };
            } else {
                return state;
            }
        };
	// dispath 使用
		dispatch({
			type: 'add',
		});
```

## 4. useEffect => 副作用钩子

```js
🎈 用来处理副作用
🌰 useEffect(()=>{},[]) // 第一个参数是你要进行的异步操作，第二个参数是一个数组，用来给出Effect的依赖项。
// 等同于 componentDidMount + componentDidUpdate + componentWillUnmount    
```

## 5. 创建自己的hooks

```js
🎈 自定义hooks 的本质就是对已有"hooks"的封装
🌰 =>
    import React, { useState, useEffect } from 'react'
    const usePerson = (name) => {  // 自定义 hooks
        const [loading, setLoading] = useState(true)
        const [person, setPerson] = useState({})
        useEffect(() => {
            setLoading(true)
            setTimeout(()=> {
                setLoading(false)
                setPerson({name})
            },2000)
        },[name])
        return [loading,person]
    }

    const AsyncPage = ({name}) => {
      const [loading, person] = usePerson(name)
        return (
          <>
            {loading?<p>Loading...</p>:<p>{person.name}</p>}
          </>
        )
      }

    const PersonPage = () =>{
      const [state, setState]=useState('')
      const changeName = (name) => {
        setState(name)
      }
      return (
        <>
          <AsyncPage name={state}/>
          <button onClick={() => {changeName('名字1')}}>名字1</button>
          <button onClick={() => {changeName('名字2')}}>名字2</button>
        </>
      )
    }
    export default PersonPage 

```

## 6. useMemo(高阶组件)

```js
🎈 第一次渲染执行, 之后会根据其"依赖的变量"发生变化再次执行, useMemo返回"缓存的变量", 在遇到"复杂计算"时使用!!!
🌰 const value = useMemo(fnM, [a]); // 当返回的是原始数据类型如字符串、数字、布尔值，就不要使用useMemo了
    
    const menuItemRows = useMemo(
        () => thousandsOfMenuItems.map(menuItem => ( // map 复杂计算使用 memo 缓存
            <MenuItemRow key={menuItem.uuid} name={menuItem.name} />
        )),
        [thousandsOfMenuItems]
    );
```

## 7. useCallback

```js
🎈 第一次渲染执行, 之后会根据其"依赖的变量"发生变化再次执行, useCallback 返回"缓存的函数"
```

## 8. useRef

```js
🎈 useRef 返回一个可变的 ref 对象, 其 ".current" 属性被初始化为传入的参数（initialValue）
🌰 const inputEl = useRef(null); => <input ref={inputEl} type="text" />
```

