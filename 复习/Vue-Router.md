# Vue-Router 3.0

## 1. 动态路由匹配

```js
1. 💎 把某种模式匹配到的"所有路由",全部映射到"同个组件".(所有路由 => 同个组件)
🌰 => 
	const router = new VueRouter({
      routes: [
        // 动态路径参数 以冒号开头
        { path: '/user/:id', component: User } // 使用 this.$route.params 接收参数 id
      ]
    })
2. 响应路由参数 "变化"
	因为两个路由使用"同一个"组件, 则组件得以复用. => 组件声明周期钩子不会被调用.
    🎈 => 
        1. 此时可以使用 "watch" 监听 "$route"的变化
        2. 或者使用 "beforeRouteUpdate(to, from, next)" 守卫
3. 捕获所有路由或 404 Not Found 路由.
	🎈 任意路径(*)  => 通常用于客户端 404 错误 => 使用 "通配符"时, "$route.params" 内会自动添加一个名为 "pathMatch" 参数.
4. (了解)高级匹配模式 ( 基于 path-to-regexp实现, 提供 "可选的动态路径参数"、"匹配零个或多个"、"一个或多个"，"甚至是自定义正则匹配" )
5. 匹配优先级 ( 路由定义得"越早"，优先级就"越高"。 )	            	
```

## 2. 嵌套路由

```js
🎈 应用界面通常由"多层嵌套"的组件组合而成, URL中"各段动态路径"也按照某种结构对应嵌套的"各层组件". 
   通过 "children" 字段定义嵌套路由.
🌰 => 
   const router = new VueRouter({
      routes: [
        {
          path: '/user/:id',
          component: User,
          children: [
            {
              // 当 /user/:id/profile 匹配成功，
              // UserProfile 会被渲染在 User 的 <router-view> 中
              path: 'profile',
              component: UserProfile
            },
            {
              // 当 /user/:id/posts 匹配成功
              // UserPosts 会被渲染在 User 的 <router-view> 中
              path: 'posts',
              component: UserPosts
            }
          ]
        }
      ]
    })
```

## 3. 编程式导航

```js
1. router.push(location, onComplete?, onAbort?)
   🌰 => 
		// 字符串
        router.push('home')

        // 对象
        router.push({ path: 'home' })

        // 命名的路由
        router.push({ name: 'user', params: { userId: '123' }})

        // 带查询参数，变成 /register?plan=private
        router.push({ path: 'register', query: { plan: 'private' }})    
  💎 => 如果提供了 "path" => "params" 则不起作用. 
  		需要使用 "name" 搭配 "params"
   !!! 如果路由未变化, 只有参数发生了变化, 需要使用 "beforeRouteUpdate" 来响应变化.
   
2. router.replace(location , onComplete?, onAbort?)   
   和 "router.push" 参数一致, 但它不会向 history 添加新纪录, 而是替换掉当前的 history 记录.
                  
3. router.go(n)
   这个方法参数是一个"整数", 意思是在 history 记录中向前或向后多少步, 类似于 window.history.go(n);
   🌰 =>
   		// 在浏览器记录中前进一步，等同于 history.forward()
        router.go(1)

        // 后退一步记录，等同于 history.back()
        router.go(-1)

        // 前进 3 步记录
        router.go(3)

        // 如果 history 记录不够用，那就默默地失败呗
        router.go(-100)
        router.go(100)
```

## 4. 命名路由

```js
🎈 名称来表示路由更加方便
🌰 => 
	const router = new VueRouter({
      routes: [
        {
          path: '/user/:userId',
          name: 'user',
          component: User
        }
      ]
    })
😎 使用 => 
        <router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link> 
        router.push({ name: 'user', params: { userId: 123 } }) // name 搭配 params
```

## 5. 命名视图

```js
1. 
	🎈 有时想同时展示多个"同级"视图, 而不是嵌套展示.
	🌰:
        <router-view class="view one"></router-view> // 没有名字默认就是 default
        <router-view class="view two" name="a"></router-view>
        <router-view class="view three" name="b"></router-view>
		// 配置路由
		const router = new VueRouter({
          routes: [
            {
              path: '/',
              components: {
                default: Foo, //分别对应不同视图
                a: Bar,
                b: Baz
              }
            }
          ]
        })
2. 嵌套命名视图
```

## 6. 重定向

```js
1. 重定向
	1. 从 '/a' 到 '/b':
        const router = new VueRouter({
          routes: [
            { path: '/a', redirect: '/b' }
          ]
        })
	2. 重定向到命名路由: 
		const router = new VueRouter({
            routes: [
                { path: '/a', redirect: { name: 'foo' }}
            ]
        })
    3. 传递一个方法
    	const router = new VueRouter({
          routes: [
            { path: '/a', redirect: to => {
              // 方法接收 目标路由 作为参数
              // return 重定向的 字符串路径/路径对象
            }}
          ]
        })
2. 别名
	const router = new VueRouter({
      routes: [
        { path: '/a', component: A, alias: '/b' } // 当用户访问 /b 时，URL 会保持为 /b，但是路由匹配则为 /a，就像用户访问 /a 一样。
      ]
    })
```

## 7. 路由导航

```js
1. 全局前置守卫 => router.beforeEach((to, from, next) => {})
2. 全局解析守卫 => router.beforeResolve((to,from) => {})
3. 全局后置守卫 => router.afterEach((to, from) => {} )
4. 路由独享守卫 => 
        const router = new VueRouter({
            routes: [
                {
                    path: '/foo',
                    component: Foo,
                    beforeEnter: (to, from, next) => {
                        // ...
                    }
                }
            ]
        })
5. 组件内的守卫 => 
		const Foo = {
              template: `...`,
              beforeRouteEnter(to, from, next) {
                // 在渲染该组件的对应路由被 confirm 前调用
                // 不！能！获取组件实例 `this`
                // 因为当守卫执行前，组件实例还没被创建
              },
              beforeRouteUpdate(to, from, next) {
                // 在当前路由改变，但是该组件被复用时调用
                // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
                // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
                // 可以访问组件实例 `this`
              },
              beforeRouteLeave(to, from, next) {
                // 导航离开该组件的对应路由时调用
                // 可以访问组件实例 `this`
              }
          }				
```



