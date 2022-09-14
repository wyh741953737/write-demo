
2）配置：
新建.prettierrc文件，并添加配置项：
{
tabWidth: 指定每个缩进级别的空格数。
useTabs: <bool>: 使用制表符而不是空格缩进行。
semi: <bool>: 在语句末尾打印分号。
singleQuote: <bool>:使用单引号而不是双引号。
quoteProps: "<as-needed|consistent|preserve>"
    "as-needed" -仅在需要时在对象属性周围添加引号。
    "consistent" -如果对象中至少有一个属性需要用引号引起来，请用所有属性引起来。
    "preserve" -尊重对象属性中引号的输入使用。
jsxSingleQuote: <bool>:在JSX中使用单引号而不是双引号。
trailingComma: "<none|es5|all>":尾随逗号
    "none" -没有尾随逗号。
    "es5" -在ES5中有效的结尾逗号（对象，数组等）
    "all"-尽可能在结尾加上逗号（包括函数参数）。这需要节点8或转换。
bracketSpacing: <bool>：在对象文字中的括号之间打印空格。
jsxBracketSameLine: <bool>：将>多行JSX元素的放在最后一行的末尾，而不是一个人放在下一行（不适用于自闭元素）。
arrowParens: "<avoid|always>"：在单独的箭头函数参数周围包括括号。
     "avoid"-如果可能的话，省去parens。例：x => x
     "always"-始终包含括号。例：(x) => x
rangeStart: <int> 0
rangeEnd: <int> Infinity
这些选项不能与cursorOffset一起使用。这两个选项可用于格式化以给定字符偏移量开始和结束的代码（分别包含和排除）。范围将扩大：
向后到包含所选语句的第一行的开头。
转发到所选语句的末尾。
filepath: "<string>"  指定用于推断要使用的解析器的文件名。
requirePragma: <bool> 只能将Prettier限制为仅格式化在文件顶部包含特殊注释（称为编译指示）的文件。在逐步将大型，未格式化的代码库过渡到prettier时，这非常有用。
insertPragma: <bool> prettier可以在文件顶部插入一个特殊的@format标记，以指定文件已使用prettier进行了格式化。与该--require-pragma选项一起使用时，此方法效果很好。如果文件顶部已经有一个文档块，则此选项将使用@format标记向其中添加换行符
proseWrap: "<always|never|preserve>"：默认情况下，Prettier将按原样包装markdown文本，因为某些服务使用对换行敏感的渲染器，例如GitHub注释和BitBucket。在某些情况下，您可能希望改用编辑器/查看器软包装，因此此选项使您可以选择退出"never"。
htmlWhitespaceSensitivity: "<css|strict|ignore>"：指定HTML文件的全局空格敏感度。
"css"-遵守CSS display属性的默认值。
"strict" -空白被认为是敏感的。
"ignore" -空白被认为是不敏感的。

Overrides解析器：默认情况下，Prettier根据输入文件扩展名自动推断要使用的解析器。与overrides您一起可以教Prettier如何解析它无法识别的文件。





7. 除了从命令行prettier --write运行prettier，检查CI中的格式以及编辑器运行prettier之外，很多人还喜欢将Prettier作为预提交的钩子来运行。这样可以确保格式化所有提交而不必等CI构建完。



8. 你可以将Prettier与预提交工具一起使用，git add在提交之前，可以重新格式化标记为“暂存”文件。


多行对象
const user = {
  name: 'Eileen',
  age: 24,
}
若你想写在一行，删掉{后面换行符写成
const user = { name: 'Eileen',
  age: 24
} ===> const user = { name: 'Eileen', age: 24 }
若想多行
const user = {
  name: 'Eileen', age: 25}; ====> 得到最上面的user的格式


空行：
生成空行是比较难的，prettier采用保留空行，就像保留源代码一样，但是prettier关于空行还有2个规则：
  1： 多喝空行折叠为一个空行
  2： 块和整个文件开头结尾的空行被删除，不过文件始终以单个换行符结尾。

printWidth：你希望的行长，极端情况下例如很长的字符串文字，正则，注释和变量名不能跨行打断，prettier在某些情况下会故意超出打印宽度。

prettier可以import跨越多行打破长语句（也就是是import导入的始终在一行，不管内容多长），同样适用于require


### pre-commit-hook 预提交挂钩

### plugin
- plugin是想prettier添加新语言的方法，核心prettier软件包含js和其他内置的针对web的语言，对于其他语言需要安装插件。

###### 使用插件
- 如果将插件安装在相同的node_modules目录中，会自动加载插件prettier，插件包名必须以@prettier/plugin-或prettier-plugin-或者@<scop>/prettier-plugin-才能注册。 scop应该是名称代替。

- 如果无法自动找到插件，可以使用以下命令加载他们：
prettier --write main.foo --plugin-search-dir=./dir-with-plugin=./foo-plugin
你可以多次设置--plugin或--plugin-search-dir选择。
- 或api，通过plugins和pluginSearchDirs选项
prettier.format("code", {
  parser: "foo",
  pluginSearchDirs: ["./dir-with-plugins"],
  plugin: ["./foo-plugin"],
})

prettier预计每个pluginSearchDirs包含node_modules子目录，在那里@prettier/plugin-*, @*/prettier-plugin-*并且以prettier-plugin-*将进行搜索。

##### 官方插件
1. @prettier/plugin-php
2. @prettier/plugin-pug
3. @prettier/plugin-ruby
4. @prettier/plugin-swift

##### 社区插件
prettier-plugin-package
prettier-plugin-packagejson
prettier-plugin-pg
prettier-plugin-toml
...

##### 开发插件
prettier插件是具有5个导出功能的常规js模块
languages， parsers， printers， options， defaultOptions


### 命令行界面
使用命令行运行prettier
prettier [options] [file/dir/glob ....]
要就地格式化文件， 使用 --write（这会覆盖你的文件）

prettier --single-quote --trailing-comma all --write docs package.json "{app,__{tests, mocks}__}/**/*.js"

--check 
运行: prettier --check "src/**/*.js"

* 退出码： 0： 一切格式正确， 1： 某些格式不正确， 2：prettier的东西出了问题

* --debug-check 如果你担心prettier会更改代码正确性，添加--debug-check到命令中。如果可能已经改变了代码的正确性，会打印一条错误信息。--write和--debug-check不能一起用。

* --find-config-path和--config 如果你想反复使用格式化单个文件，则prettier尝试查找配置文件时，会降低性能成本，为了跳过此操作，你可以要求prettier一次查找配置文件，然后在以后重新使用它。
prettier --find-config-path ./my/file.js

prettier --config './my/.prettierrc --write ./my/file.js

* --ignore-path包含描述要忽略文件的模式的文件路径，默认情况下，Prettier查找./.orettierignore

* --require-pragma 要求在文件第一个文档快注释中出现一个特殊注释，以便prettier对齐进行格式设置
/**
*@prettier
*/

* --insert-pragram 当pragma不存在时，在格式化文件的顶部插入@format pragma

* --list-different 另一个有用的标志是--list different（或-l），它打印不同于prettier的文件的文件名。如果存在差异，则脚本会出错，这在CI场景中非常有用。
prettier --single-quote --list-different "src/**/*.js"
您还可以使用--check标志，其工作方式与--list-different相同，但也可以将人性化的摘要消息打印到stdout。


* --stdin-filepath prettier CLI将其视为标准输入的文件路径，例如：
abc.css ：
.name{
  display: none;
}

* --no-config不要寻找配置文件，将使用默认设置

* --config-precedence 定义如何结合cli选项评估配置文件，
cli-override默认
cli选项优先于配置文件
文件覆盖
配置文件优先于cli选项
首选文件
如果找到配置文件，将其进行评估，并忽略其他cli选项，如果未找到配置文件，cli选项将评估为正常。


* --no-editorconfig解析配置时不要考虑.editorconfig.
* --with-node-modules prettier的cli会忽略目录中的node_modules文件，要退出此行为，使用--with-node-modules

* --loglevel 更改cli的日志记录级别，有效项包括：error， warn， log默认， debug， silnt

$ cat abc.css | prettier --stdin-filepath abc.css
.name {
  display: none;
}

* --ignore-unknown 会忽略匹配的未知文件
prettier '**/*' --write --ignore-unknown


### API
以编程的方式运行prettier
const prettier = require('prettier');

* prettier.format(source, [, options])
format用于使用Prettier格式化文本，可以提供选项来覆盖默认值，options.parser根据您要格式化的语言进行设置。
prettier.format("foo();", { semi: false, parser: "babel" });

* prettier.check(source, [, options])
 check检查给定这些选项的文件是否已使用Prettier格式化，并返回Boolean，类似CLI中的--check 或者--list-different参数。

* prettier.formatWithCursor(source, [, options])
formatWithCursor既格式化代码，又将光标位置从未格式化的代码转化为格式化的代码，对于集成编辑器很有用，可防止格式化代码时光标移动。
cursorOffset应该提供选项，以指定光标位置，此选项不能和rangeStart和rangeEnd一起使用。
prettier.formatWithCursor("1", { cursorOffset: 2, parser: "babel" })

* prettier.resolveConfig(filePath, [, option])
 resolveConfig可用于解析给定源文件的配置，并将其路径作为第一个参数传递，配置搜索将从文件路径开始，并继续搜索目录，你可用process.cwd()从当前目录开始搜索，或者，你可以直接传递配置文件的路径。

const test = fs.readFileSync(filePath, 'utf8')；
prettier.resolveConfig(filePath).then((options) => {
  const formatted = prettier.format(text, options);
})

如果options.useCache为false，则跳过所有缓存，如果options.editorconfig为true，并且项目中有.editorconfig文件，则prettier将对其进行解析，并将其属性转换为相应的Prettier配置，次配置将被.prettierrc等覆盖。
如果你想使用同步版本：pretier.resolveConfig.sync(filePath, [, option])

* prettier.resolveConfigFile([filePath])用于查找解析配置时，使用prettier配置文件的路径。
  prettier.resolveConfigFile(filePath).then((configFile) => {})

* prettier.clearConfigCache() 当prettier加载配置文件和插件时，文件系统结构将被缓存以提高性能，此功能将清除缓存。

* prettier.getFileInfo(filePath, [, option])可以用来决定是否需要格式化特定文件，此方法返回一个promise，改promise解析为具有ignore，inferredParser属性的对象

* prettier.getSupportInfo()返回一个对象，该对象包含支持的选项，解析器，语言和文件类型。
 {
   language: Array<{
     name: string,
     since: string,
     parsers: string[],
     group?: string,
     ...
   }>
 }

* 自定义解析器API

### 浏览器
在浏览器中运行standalone.js NPM软件包随附的UMD捆绑包中prettier，UMD捆绑软件紧格式化代码，不支持配置文件，忽略文件，cli使用或者自动加载插件

prettier中的package.json的browser字段指向standalone.js，这就是为什么你只能用inport或者模块来访问prettier中的api，并且只要支持了该字段的webpack或者其他捆绑器，你的代码就可以和=与node和浏览器保持兼容。

* prettier.format(code, options) 和主api中的format函数不同，此函数不会自动加载插件，隐藏如果要加载一个插件需要一个属性，此外，prettier软件包中包含的解析器不会自动加载，因此在使用他们的时候要先加载他们。
 * 全局使用： 
  <script src="https://unpkg.com/prettier@2.1.2/standalone.js"></script>
  <script src="https://unpkg.com/prettier@2.1.2/parser-graphql.js"></script>
  <script>
    prettier.format("query{}", {
      parser: "graphql",
      plugins: prettierPlugins,
    })
  </script>
  prettier的package.json中的unpkg字段指向standalone.js，这也是为什么https:/unpkg.com/prettier也可以替代https://unpkg.com/prettier/standalone.js

* es模块
 import prettier from 'prettier/standalone';
 import parserGraphql from 'prettier/parser-graphql';
 prettier.format('query{}', {
   parser: 'graphql',
   plugins: [parserGraphql],
 })

### 配置prettier
#### options

- print width 为便于阅读，建议不超过80个字符，不要像使用eslint那样尝试使用printWidth，他们是不同的，max-len只是说最大长度，而不是通常首选的行长。
  默认： 80  cli覆盖： --print-width <int>  api替代： printWidth: <int>
  如果在设置MarkDown格式时不希望换行：prose Wrap选项设为禁用。

- tab width 指定每个缩进的空格数
  默认： 2  cli覆盖： --tab-width <int>  api替代：tabWidth：<int>

- tabs 使用制表符而不是空格缩进
  默认： false  cli： --use-tabs   api： useTabs: <bool>

- semicolons 分号，在语句末尾打印分号
  默认： true   cli： --no-semi    api： semi: <bool>

- quotes 使用单引号还是双引号
  如果引号的数量超过另一个引号，则使用较少的引号将格式化字符串，比如：
  "I'm double quoted"  ---> "I'm double quoted"
  "this \"example\" is single quoted" ----> 'this "example" is single quoted'
  默认： false  cli：--single-quote  api： singleQuote：<bool>

- quotes props 
 有效选项： "as-needed" 仅在需要时在对象属性周围加引号
          "consistent" 如果对象中至少有一个属性需要用引号引起来，所有的都用引号引起来
          "preserve" 不违背对象属性中引号的输入使用
  默认：“as-needed”  cli： --quoted-props <as-needed|consistent|preserve> 
                    api: quoteProps: "<as-needed|consistent|preserve>
                  
- jsx quotes 在jsx中使用单引号
  默认： false cli： --jsx-single-quoted   api: jsxSingleQuoted: <bool>

- trailing commas 结尾逗号：多行时末尾尽量尾随逗号。
  有效选项：  "es5": 在es5中有效的结尾逗号，对象，数组等
            "none": 没有尾随逗号
            "all": 尽可能在结尾加逗号，包括函数参数
  默认： ”es5“  cli： --trailing-comma <es5|none|all>   api: trailingComma: <es5|none|all>

- bracket spacing 在对象的文字之间加空格
  例如 true： 示例:  { foo: bar }
      false: 示例:  {foo: bar}
  默认： true   cli: --no-bracket-spacing   api: bracketSpacing: <bool>

- jsx brackets 将>多行jsx元素放在最后一行的末尾，而不是放下一行
  例如： true
  <button
   classNAme=""
   id=""
   onClick={}>
   Click Me
  </button>

  false: 
  <button
   classNAme=""
   id=""
   onClick={}
  >
   Click Me
  </button>

  默认： false   cli： --jsx-bracket-same-line   api: jsxBracketSameLine: <bool>

- arrow function parentheses : 在单独的箭头函数参数周围包括号
  有效选项： 
  "always" 实在包含括号， 例： (x) => x
  "avoid" 例： x => x
  默认： "always"   cli: --arrow-parents    api: arrowParents

- range 仅格式化文件的一部分，
  有效选项： 0           cli: --range-start   api: rangeStart
           Infinity    cli: --range-end     api: rangeEnd

- parser 指定要使用的解析器，prettier会自动从输入文件推断出解析器，因此你不需要更此配置
  有效选项： "babel" 通过@babel/parser
           "babel-flow"
           "babel-ts" 类似typescript，但使用babel及其Typescript插件
           "flow" 通过流分析器
           "typescript"
           ...
  默认值： 无， cli: --parser <string>  api: parser: "<string>" 比如：parser： require("./my") 

- file path 指定用于腿短要使用的解析器的文件名
   例如：以下将使用css解析器： cat foo | prettier --stdin-filepath foo.css
   默认： 无   cli: --stdin-filepath    api: filepath

- require pragma prettier可以将自己限制为仅格式化在文件顶部包含特殊注释的文件。
  /**
  * @prettier
  */
  要么
  /**
  * @format
  */
  默认： false   cli: --require-pragma   retuirePragma


- HTML 空格敏感性
指定html文件的全局空格敏感度
有效选项： 
"css" 遵循css的display属性的默认值
"strict" 空白被认为是敏感的
"ignore" 空白被认为是不敏感的·
默认： “css"  cli: --html-whitespace-sensitivity    api: htmlWhitespaceSensitivity

- vue文件脚本和样式标签缩进
  是否缩进vue文件中的代码
  有效选项： false 不要缩进vue文件的脚本和样式标签
           true 在vue文件中缩进脚本和样式标签
  默认： false   cli: --vue-indent-script-and-style    api: vueIndentScriptAndStyle

- End of Line
  文件存在2种行尾样式： \n（linux和macOS中常见）和\r\n（或回车+CRLF换行）windows普遍
  当开发人员使用不同操作系统在同一个项目上进行写作时，在共享的git仓库中容易以混合的行结尾来结束。
  为了确保整个git存储在Prettier覆盖的文件中仅包含linux样式的行尾，执行以下操作：
  1） 确保prettier的endOffLine选项市值为lf
  2） 配置prettier的pre-commit-hook
  3） 使用 --check flag将Prettier配置为在CI管道中运行，
  4） 添加 * test=auto eol=lf到仓库的.gitattributes文件，进行此更改后，你可能要要求windows用户重新克隆仓库，以确保git在克隆后、LF没有转化为CRLF

  使用\n（LF）时，所有操作系统中的所有现代文本编辑器均能够正确显示行尾。但是，Windows的旧版本的Notepad只能将这些行可视化为一行，因为它们只能处理\r\n（CRLF）。

  有效选项： 
  "lf" : 仅\n换行，在linux和macOS以及git repos内部通用
  "crlf": 回车符+换行符(\r\n),windows
  "cr": 仅回车符\r, 很少用
  "auto" 维持现有的行位
  默认： auto  cli: --end-of-line    api: endOfLine


- Embedded Language Formatting 控制prettier格式是否引用文件中嵌入的代码
  有效选项： 
  "auto" 如果Prettier可以自动识别嵌入式代码，则可以对其进行格式化
  "off" 切勿自动格式化嵌入式代码
  默认： ”auto"   cli: --embedded-language-formatting=off    api: embeddedLanguageFormatting: "off"



  ### 配置文件
  prettier使用cosimiconfig来支持配置文件，你可以按照优先顺序配置prettier
  文件中的prettier，package.json
  .prettierrc用json或者yaml编写的文件
  .prettierrc.json, .prettier.yml, .prettier.yaml, 或prettier.json5文件
  .prettier.js, .prettier.cjs, prettier.config.js,或者prettier.config.cjs
  .prettierrc.toml文件
 从要格式化的文件位置开始解析配置文件，然后搜索文件树，直到找到。prettier不支持任何类型的全局配置，这是为了确保项目复制到另一台计算机时，prettier的行为保持不变，否则prettier无法确保团队的每个人都获得一致的结果

 ### 基本配置
 * json
  {
    "trailingComma": "es5",
    "tabWidth": 4,
    "semi": false,
    "singleQuote": true
  }

 * js
 module.exports = {
   "trailingComma": "es5",
   "tabWidth": 4,
   "semi": false,
   "singleQuote": true
 }

 * yaml
  # .prettierrc or .prettierrc.yaml
  trailingComma: "es5",
  tabWidth: 4,
  semi: false,
  singleQuote: true

* toml
# .prettier.toml
  trailingComma: "es5",
  tabWidth: 4,
  semi: false,
  singleQuote: true 

### 配置覆盖
通过配置覆盖，你可以对某些文件扩展名，文件夹，和特定文件进行不同的配置
json 
{
  "semi": false,
  "overrides": [
    {
      "files": "*.test.js",
      "options": {
        "semi": true
      }
    },
    {
      "files": ["*.html", "legacy/**/*.js"],
      "options": {
        "tabWidth": 4
      }
    }
  ]
}
yaml
semi: false
overrides:
  - files: "*.test.js"
    options:
      semi: true
  - files:
      - "*.html"
      - "legacy/**/*.js"
    options:
      tabWidth: 4

### 共享配置
共享prettier的配置很简单：只需发布一个导出配置对象的模块，例如@company/prettier-config，然后在您的package.json中引用它

{
  "name": "my-cool-library",
  "version": "9000.0.1",
  "prettier": "@company/prettier-config"
}
如果您不想使用package.json，则可以使用任何受支持的扩展名来导出字符串，例如.prettierrc.json："@company/prettier-config"

注意：此方法并没有提供一种方法来扩展配置，以覆盖从所述共享的配置的一些属性。如果需要这样做，请将文件导入.prettierrc.js文件并导出修改，例如：

module.exports = {
  ...require("@company/prettier-config"),
  semi: false,
};

### 设置解析器选项
默认情况下，Prettier根据输入文件扩展名自动推断要使用的解析器。overrides与你一起可以教Prettier如何解析它无法识别的文件。

例如，要使Prettier格式化自己的.prettierrc文件，可以执行以下操作：

{
  "overrides": [
    {
      "files": ".prettierrc",
      "options": { "parser": "json" }
    }
  ]
}
您还可以切换到flow解析器，而不是babel.js文件的默认解析器：

{
  "overrides": [
    {
      "files": "*.js",
      "options": {
        "parser": "flow"
      }
    }
  ]
}
注意： 切勿将parser选项放在配置的顶层。仅在内部使用overrides。否则，您将有效地禁用Prettier的基于文件扩展名的自动解析器推断。这迫使Prettier对所有类型的文件使用您指定的解析器-即使没有意义，例如尝试将CS​​S文件解析为JavaScript。





配置
HTML/CSS/JS/LESS 文件的 prettier 格式化规则
{
    // 使能每一种语言默认格式化规则
    "[html]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[css]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[less]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },

    /*  prettier的配置 */
    "prettier.printWidth": 100, // 超过最大值换行
    "prettier.tabWidth": 4, // 缩进字节数
    "prettier.useTabs": false, // 缩进不使用tab，使用空格
    "prettier.semi": true, // 句尾添加分号
    "prettier.singleQuote": true, // 使用单引号代替双引号
    "prettier.proseWrap": "preserve", // 默认值。因为使用了一些折行敏感型的渲染器（如GitHub comment）而按照markdown文本样式进行折行
    "prettier.arrowParens": "avoid", //  (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
    "prettier.bracketSpacing": true, // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
    "prettier.disableLanguages": ["vue"], // 不格式化vue文件，vue文件的格式化单独设置
    "prettier.endOfLine": "auto", // 结尾是 \n \r \n\r auto
    "prettier.eslintIntegration": false, //不让prettier使用eslint的代码格式进行校验
    "prettier.htmlWhitespaceSensitivity": "ignore",
    "prettier.ignorePath": ".prettierignore", // 不使用prettier格式化的文件填写在项目的.prettierignore文件中
    "prettier.jsxBracketSameLine": false, // 在jsx中把'>' 是否单独放一行
    "prettier.jsxSingleQuote": false, // 在jsx中使用单引号代替双引号
    "prettier.parser": "babylon", // 格式化的解析器，默认是babylon
    "prettier.requireConfig": false, // Require a 'prettierconfig' to format prettier
    "prettier.stylelintIntegration": false, //不让prettier使用stylelint的代码格式进行校验
    "prettier.trailingComma": "es5", // 在对象或数组最后一个元素后面是否加逗号（在ES5中加尾逗号）
    "prettier.tslintIntegration": false // 不让prettier使用tslint的代码格式进行校验
}
