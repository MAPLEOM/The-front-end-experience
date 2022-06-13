## Flutter 布局

### 1. 线性布局（Row | Column）

```dart
描述：线性布局,即沿水平方向或垂直方向排列子组件.
Widgets: Row(水平方向)和Column(垂直方向) 都继承于 Flex.
1. 主轴和纵轴
   描述：对于线性布局，有主轴和纵轴之分，若布局沿水平方向，则主轴为水平方向，纵轴即垂直方向；若布局沿垂直方向，则主轴为垂直方向，纵轴为水平方向。
   Enums: MainAxisAlignment 和 CrossAxisAlignment 分别代表主轴对齐和纵轴对齐。
2. Row
   example：
           Row({
              ...  
              TextDirection textDirection,    
              MainAxisSize mainAxisSize = MainAxisSize.max,    
              MainAxisAlignment mainAxisAlignment = MainAxisAlignment.start,
              VerticalDirection verticalDirection = VerticalDirection.down,  
              CrossAxisAlignment crossAxisAlignment = CrossAxisAlignment.center,
              List<Widget> children = const <Widget>[],
           })
   properties:
		  textDirection（ltr、rtl）: 表示水平方向子组件的排列顺序（从左到右（TextDirection.ltr）或从右到左（TextDirection.rtl））.
              			 		   🎈默认情况下，为Locale环境的文本方向（中文、英文从左到右，阿拉伯语从右到左）
           mainAxisSize（min、max）:  表示主轴方向占用的空间，默认为 MainAxisSize.max，即尽可能占用水平方向的空间。
               					    MainAxisSize.min 表示尽可能少的占用空间，若子组件没有占满空间，则 Row实际宽度等于所有子组件的空间.
           mainAxisAlignment(start、end、center、spaceBetween、spaceAround、spaceEvenly):
								   表示子组件在 Row 所占用的空间内对齐方式，若mainAxisSize.min 则该属性🎀无意义.
                                      textDirection是mainAxisAlignment的参考系.
		  verticalDirection（down、up）: 
								   表示 Row 纵轴的对齐方向，默认为 VerticalDirection.down，表示从上到下.
           crossAxisAlignment（start、end、center、stretch、baseline）：
              						表示子组件在纵轴方向的对齐方式，参照系为 verticalDirection.
                                      其中stretch表示拉伸，当子组件高度或宽度不一致可以拉伸到与父组件一致.
                                      其中baseline表示基准线，当需要底部保持底部或其他位置处于统一水平线时使用。
                                      且需要增加 BaseLine 属性（alphabetic（字母字符的字形：英文等）、ideographic（表意文字：中文等））
           children：子组件数组
3. Column 类比 Row
4. 特殊情况
   如果 Row 里面嵌套 Row，或者 Column 里面嵌套 Column，则只有最外面的 Row或Column会占用尽可能大的空间. => 可以使用 Expanded组件占满空间（Flex).
```



### 2. 弹性布局（Flex和Expanded）

```dart
1. Flex
   描述：Flex 继承于 MultiChildRenderObjectWidget，对应的 RenderObject 为 RenderFlex，RenderFlex 中实现了其布局算法.
   example：
    	Flex({
            ...
            required this.direction, // 弹性布局的方向，Row默认是水平方向，Columns默认是垂直方向（vertical,horizontal）
            List<Widget> children = const <Widget>[],
        })
   
2. Expanded
   描述：Expanded只能作为Flex的子组件，可以按比例占据Flex空间。(也可以是 Row和Column 的子组件)
   example：
    	const Expanded({
            int flex = 1, // flex 参数为弹性系数，0或null，则没有弹性。
            required Widget child
        })
3. Spacer
   描述：占用指定比例空间，Expanded包装类.
   example：
    	Spacer(flex:1)
```



### 3.流式布局 （Wrap、Flow）

```dart
描述：在Row和Column中，默认只有一行且不会折行，如果子 widget 超出屏幕范围，则会报溢出的错误，🎈我们把超出屏幕显示范围自动折行的布局成为流式布局.
1. Wrap
   example：
    	Wrap({
          ...
          this.direction = Axis.horizontal,
          this.alignment = WrapAlignment.start,
          this.spacing = 0.0,
          this.runAlignment = WrapAlignment.start,
          this.runSpacing = 0.0,
          this.crossAxisAlignment = WrapCrossAlignment.start,
          this.textDirection,
          this.verticalDirection = VerticalDirection.down,
          List<Widget> children = const <Widget>[],
        })
   properties:
		spacing: 主轴方向子 widget 的间距（double）
         runSpacing：纵轴方向的间距（double）
         runAlignment: 纵轴方向的对齐方式
2. Flow          
```



### 4.层叠布局（Stack、Positioned）

```dart
描述：Flutter使用 Stack 和 Positioned 配合实现绝对定位。 Stack允许子组件堆叠，而 Positioned 根据 Stack的四个角来确定子组件的位置.
1. Stack
   example: 
		Stack({
          this.alignment = AlignmentDirectional.topStart,
          this.textDirection,
          this.fit = StackFit.loose,
          this.clipBehavior = Clip.hardEdge,
          List<Widget> children = const <Widget>[],
        })
   properties:
		alignment: 此参数决定如何对齐没有定位或部分定位的子组件。
         textDirection：....
         fit：此参数用于确定🎈没有定位🎈的子组件如何适应 Stack 的大小。 
              StackFit.loose 表示使用子组件的大小， StackFit.expand 表示延伸到Stack的大小.
         clipBehavior：
              此属性决定对超出 Stack 显示空间的部分如何裁剪，Clip枚举类中定义了裁剪的方式，Clip.hardEdge 表示直接裁剪,不应用抗锯齿.
2. Positioned
    描述： left、top 、right、 bottom分别代表离Stack左、上、右、底四边的距离。width和height用于指定需要定位元素的宽度和高度。
    example：
           const Positioned({
              Key? key,
              this.left, 
              this.top,
              this.right,
              this.bottom,
              this.width,
              this.height,
              required Widget child,
            }) 
```

### 5. Todo: 对齐与相对定位（Align）

```dart
描述: 如果只想简单的调整一个子元素在父元素中的位置的话，使用 Align 组件会更简单一些。
1. Align
   example：
    	Align({
          Key key,
          this.alignment = Alignment.center,
          this.widthFactor,
          this.heightFactor,
          Widget child,
        })
   properties：
    	alignment：表示子组件在父组件中的起始位置
    	widthFactor 和 heightFactor 是用于确定Align 组件本身宽高的属性； 如果值为null，则组件的宽高将会占用尽可能多的空间。
```

