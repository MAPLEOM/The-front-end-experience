# vscode 编辑器配置（setting.json配置编辑器整体配置以及插件配置）

```
{
    "workbench.colorTheme": "One Dark Pro Darker",
    "workbench.iconTheme": "vscode-icons",
    "[html]": {
        "editor.defaultFormatter": "vscode.html-language-features"
    },
    "vsicons.dontShowNewVersionMessage": true,
    "explorer.confirmDelete": false,
    "explorer.compactFolders": false,
    "explorer.confirmDragAndDrop": false,
    "[vue]": {
        "editor.defaultFormatter": "octref.vetur"
    },
    "terminal.integrated.defaultProfile.windows": "Command Prompt",
    "[javascript]": {
        "editor.defaultFormatter": "vscode.typescript-language-features"
    },
    "security.workspace.trust.untrustedFiles": "open",
    "[typescriptreact]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[javascriptreact]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[jsonc]": {
        "editor.defaultFormatter": "vscode.json-language-features"
    },
    "editor.snippetSuggestions": "top",
    "[typescript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode",
    },
    // 在没有prettier配置文件时候生效
    "prettier.jsxSingleQuote": true,
    "prettier.printWidth": 300,
    "prettier.singleQuote": true,
    "prettier.tabWidth": 4,
    "prettier.useTabs": true,
    "prettier.semi": false, // #去掉代码结尾的分号 
    "[json]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "typescript.updateImportsOnFileMove.enabled": "always",
    "editor.formatOnSave": true, // 保存格式化
    "editor.fontSize": 18, // 编辑器文件大小
    "editor.detectIndentation": false, // vscode默认启用了根据文件类型自动设置tabsize的选项
    "editor.wrappingIndent": "none", //折行的缩进 
    "editor.cursorStyle": "underline-thin", //光标的样式
    "editor.fontFamily": "Fira Code", //后边的引号中写上要设置的字体类型，个人比较喜欢Fira Code
    "editor.fontLigatures": true, //这个控制是否启用字体连字，true启用，false不启用，这里选择启用
    "editor.fontWeight": "normal", //这个设置字体粗细，可选normal,bold,"100"~"900"等，选择合适的就行
}
```

