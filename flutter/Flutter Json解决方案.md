# Flutter Json解决方案

Flutter实际开发中，通常都需要和 Web服务器进行通信，而服务器传递过来的数据通常为🎈JSON格式（一种用于表示结构化对象和集合的简单文本格式）🎈的数据类型，所以Flutter端需要处理这些JSON格式的数据，以储存结构化的数据。

# 处理JSON的策略

### 1. 手动序列化数据

### 2. 利用代码生成自动序列化数据( json_serializable 库 )

## 具体实现

## 1.手动序列化

### 1.1 内联序列化 JSON 数据 （利用  dart:convert）

```dart
Map<String,dynamic> data = jsonDecode(jsonString);

print('Howdy, ${user['name']}!');
print('We sent the verification link to ${user['email']}.');

/// jsonDecode() 返回的是 Map<String, dynamic>类型，这意味着你并不知道🎈值的类型，使用这个方法的时候缺少了🧨类型安全、🧨自动补全、以及🧨编译时异常.
/// 导致错误难以捕获。
```

### 1.2 在模型类(为定义接口数据定义类型信息)中序列化 JSON 数据

```dart
class Model {
    String? name;
    int? age;
    
    Model(this.name,this.age); // 构造函数
    
    Model.fromJson(Map<String,dynamic> json){ 
        // 🎈（将接口数据转化为Model格式 => 增加了类型校验、空安全等） 命名构造函数 从json数据中提取数据并初始化Model数据结构.
        this.name = json['name'];
        this.age = json['age'];
    }
    
    Map<String,dynamic> toJson(){ //（间接将接口数据重新JSON化） 将Model初始化后的数据转化为 json格式 并返回.
        return {
            'name':name,
            'age':age
        };
    }
}

main(){
    Model _model = Model('小明', 10);
  	print(jsonEncode(_model)); /// _model 不需要调用 toJson方法 因为 jsonEncode() 已经帮你做了这件事。
}
```

## 2. 使用代码生成库序列化 JSON 数据

### 2.1 使用 json_serializable 库

```dart
///步骤
/// 1. 安装依赖
1.1 在 pubspec.yaml 文件中添加：（🎈 其中对应的版本信息 可以在 pub.dev上查看）
    dev_dependencies:
      # Your other dev_dependencies here
      build_runner: <latest_version>
      json_serializable: <latest_version>
1.2 执行终端指令 flutter pub get
          
/// 2.通过注解创建 模型类
@JsonSerializable();
class Model {
    String? name;
    int? age;

    Model(); /// 必须存在

    factory Model.fromJson(Map<String,dynamic> json) => _$ModelFromJson(json); /// 从json中读取相应的数据 并初始化 model（固定格式）

    Map<String,dynamic> toJson() => _$ModelToJson(this); /// 将model中的数据转化为 json 格式（固定格式）
}

/// 3. 终端输入指令 flutter pub run build_runner build 或 flutter pub run build_runner watch.
/// 4. 执行指令后，会在当前文件夹中生成一个与 Model模型类文件同目录的文件叫做 xxx.g.dart, 即表示成功.

/// ps:
1. 
    /// 默认情况下 🎈属性名和数据源json格式的数据字段名保持一致，即 接口返回的数据或者其他数据源中的json数据中 应当含有 name和age字段名。
    /// 若存在不一致的情况，则使用 @JsonKey(name:实际的名称) 进行修改：
    /// ex：
    @JsonSerializable();
    class Model {
        @JsonKey(name:myName)
        String? name;
        .....
    }
2. 
   /// 默认情况下 🎈 build_runner 生成的文件与原始文件在同一目录，但 xxx.g.dart文件本质上不会做任何修改，所以应当集中放在同一文件夹下。
   /// 所以需要以下额外配置：
   /// 2.1 根目录下创建 build.yaml文件
   /// 2.2 写入一下内容：（其中build_extensions下选项，左侧代表源文件路径，右侧代表要生成的目标路径，还需要搭配 part和part of来生成文件）
        targets:
          $default:
            builders:
              source_gen:combining_builder:
                options:
                  build_extensions:
                    '^lib/page/home/{{}}.dart': 'lib/generated/{{}}.g.dart'
                    '^lib/page/kyc/{{}}.dart': 'lib/generated/{{}}.g.dart'
                    '^lib/bloc/{{}}.dart': 'lib/generated/{{}}.g.dart'	
   /// 2.3 终端输入指令 flutter pub run build_runner build 或 flutter pub run build_runner watch.                        
```

