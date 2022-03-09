# typeScript

## 参考链接: https://www.tslang.cn/docs/handbook/interfaces.html

## 1. 基础类型

```typescript
1. 布尔值
	let isDone:boolean = false;
2. 数字(ts 中所有数字都是 🎈浮点数)
	let num:number = 6;
	let num2:number = 0xf00d; // 十六进制
	let num3:number = 0b1010; // 二进制
	let num4:number = 0o744; // 八进制
3. 字符串(可用双引号或单引号表示字符串)
	let name:string = 'bob';
	name = "smm";
	let sentence:string = `Hello, my name is ${num}`; // 模板字符串
4. 数组(两种定义方式)
	let list: number[] = [1,2,3]; // 常规
	let list2: Array<number> = [4,5,6]; // 泛型
5. 元组( tuple )( 🎈表示已知数量和类型的数组 )
	let x:[string, number];
	x = ['aa',3];
	x[3] = 666; // 当访问一个越界元素, 会使用 💎"类型联合"代替  => 字符串可以赋值给 ( number | string )类型.
6. 枚举类型(enum)
	1>. 均不赋值
        enum Color{ Red,Green,Blue }; // 默认从 0 开始赋值
        let c: Color = Color.Green; // 此刻 c === 1
	2>. 自定义部分数值
        enum Color{ Red = 1,Green,Blue }; // 自定义 从 1 开始赋值
        let c: Color = Color.Green; // 此刻 c === 2
	3>. 自定义所有数值
        enum Color { Red=1, Green=9 ,Blue=7 } // 自定义每个数值
        let c: Color = Color.Green; // 此刻 c === 9
	4>. 可以获取枚举的名字
    	enum Color { Red=1,Green,Blue }
	    let name: string = Color[1]; // name === 'Red' 💎其中 [1] 表示Color中数值等于 1 的名字
7. any 类型
	主要应用于 🎈在编程阶段还不清楚类型的变量指定一个类型 的情况
    => 与 object类型相比, any可以🎈调用方法, object调用则会"报错".
8. Void(表示没有任何类型, 当函数没有"返回值"时, 通常会见到返回值的类型为 void)
	🌰 => 
    	function warnUser(): void {
            console.log("This is my warning message");
        }
	声明一个 void 类型的变量没什么用, 只能赋值 undefined 和 null;
        let unusable: void = undefined;
        let unusable: void = null;
9. null 和 undefined (默认情况下 null 和 undefined 都是所有类型的"子类型")
	let u: undefined = undefined;
	let n: null = null;
10. never(never 类型表示的是那些"永不存在"的值的类型 也是任何类型的"子类型" never没有子类型)
	// 返回never的函数必须存在无法达到的终点
	function error(message : string):never{ 
        throw new Error(message);
    }
	// 推断返回值类型为 never
	function fail(){ 
        return error('Something failed');
    }
	function infiniteLoop():never{
        while(true){}
    }
11. object 表示非原始类型( 除 number, string, boolean, symbol, null 和 undefined 以外 )
	🎈使用 object 类型, 就可以更好的表示像 Object.create 这样的 API.
    	declare function create( o:object | null ): void;
		create(null) // OK
		create({props:0}) // OK
12. 类型断言(我比 ts 更了解某个值的 "详细情况")
	1>. "尖括号"语法:
		let someValue:any = "this is a string";
		let strLength:number = (<string>someVlaue).length;
	2>. as 语法:
		let someValue:any = "this is a string";
		let strLength: number = (someValue as string).length;
```

## 2. 接口

```typescript
💎 TypeScript的核心原则之一是对	"值所具有的结构" 进行"类型检查".
💎 接口的作用: 为这些类型"命名"和为代码或第三方代码"定义契约".
1. 接口初探
	1>
        function printLable(labelledObj:{ label:string }){ // 当传入很多属性, 编译器只会检查 契约规定的 🎈"必要属性"
            console.log( labelledObj.label );
        }
        let myObj = { size:10, label:'Size 10 Object' };
        printLabel(myObj);
	2>.
        interface LabelledValue { // LabelledValue为类型的 "命名" 它约定对象一定要含有一个 string类型的属性叫做 🎈label
            label: string;
        }
        function printLabel(labelledObj:labelledValue){
            .....
        }
	tips: 类型检查"不会检查属性的顺序", 只要相应的属性存在且类型正确就可以.
2. 可选属性
	=> 接口中的属性不全是必需的
    interface SquareConfig {
        color?: string;
        width?: number;
    }
	function createSquare(config: SquareConfig):{color:string,area:number}{ // config受SquareConfig的约束, 函数返回值为对象类型且含有color和																		   area属性分别为 string类型和 number类型.
        let newSquare = { color:'white', area: 100 };
        if(config.color){ newSquare.color = config.color };
        if(config.area){ newSquare.area = config.area };
        return newSquare;
    }
3. 只读属性
	=> 一些对象属性只能在对象刚刚创建的时候修改其值. 使用 "readonly" 来指定只读属性
        interface Point {
            readonly x: number; // 只读
            readonly y: number; // 只读
        }
        let p1: Point = { x:1, y:2 };
        p1.x = 3 // error
	=> typescript 具有 "ReadonlyArray<T>"类型, 它与 "Array<T>" 相似, 只是"把所有可变的方法去掉", 以达到无法改变的效果
        let a:number[] = [1,2,3,4];
        let ro: ReadonlyArray<number> = a;
        ro[0] = 1; // error
4. readonly vs const
	💎 判定用 readonly 还是 const 的方法是要看把它当做 "变量" 还是 作为一个 "属性" 
        🎈作为变量 => const; 
        🎈作为属性使用 => readonly 
5. 函数类型
	=>  🎈除了能够描述"带有属性的普通对象", 也可以描述"函数类型"
        interface SearchFunc {
            (source: string, subString: string): boolean; // 规范一个函数
        }
        let mySearch: SearchFunc; // 定义一个满足 函数规范 的变量
        mySearch = function(source: string, subString: string){  // 变量按照规范 赋值为函数 source的命名可以是任意 🎈对应的类型对即可
            let result = source.search(subString);
            return result > -1; // 自动推断返回类型  boolean
        }
6. 可索引的类型 (复杂)
	=> 🎈可以描述能够 "通过索引得到"的类型, 比如 a[10] 或 ageMap["daniel"]
        interface StringArray{ // 规定索引为 数字类型, 值为 字符串类型 💎 表示当用 number类型索引时,会得到 string类型的返回值.
            [index: number]: string;
        }		
        let myArray:StringArray;
        myArray = ["Bob","Fred"];
        let myStr: string = myArray[0];
7. 类类型
	=> 🎈typeScript能够用它来明确的强制"一个类"去"符合某种契约"
    🌰:
        interface ClockInterface {
            currentTime: Date; // 描述变量
            setTime(d: Date); // 描述方法
        }
        class Clock implements ClockInterface{
            currentTime: Date;
            setTime(d: Date) {
                this.currentTime = d;
            }
            constructor(h: number, m: number) { }
        }
8. 继承接口
		interface Shape {
            color: string;
        }

        interface Square extends Shape {
            sideLength: number;
        }
       		
```

