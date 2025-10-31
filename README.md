# FlexType

[English](./README_EN.md) | 中文文档
**The English document has not been completed yet.**
一个 JavaScript 类型推断和自动转换库，让你能够使用 `flex [变量名]` 风格的动态类型声明。

## 特性

**我懒得写**

## 快速开始

### 安装

** 从 npm 安装 （Node环境用）**
```bash
npm install FlexType
```
**从 GitHub 安装（开发用）：**
```bash
npm install github:Mxher07/flextype
```

**使用 CDN（浏览器环境）：**
```html
<!-- 使用 jsDelivr CDN -->
<script src="https://cdn.jsdelivr.net/gh/Mxher07/flextype@main/dist/flextype.umd.js"></script>

<!-- 或者使用 unpkg CDN -->
<script src="https://unpkg.com/github:Mxher07/flextype/dist/flextype.umd.js"></script>
```

**手动安装：**
1. 下载仓库到本地：
```bash
git clone https://github.com/Mxher07/flextype.git
cd flextype
npm install
npm run build
```

### 基本用法

**在 Node.js / ES Modules 中：**
```javascript
import pkg from 'FlexType';
const { FlexType, flex, declareFlex } = pkg;
// 或者如果你手动安装了仓库
import pkg from 'path/to/dist/flextype.esm.js';
const { FlexType, flex, declareFlex } = pkg;
```

**在 CommonJS 中：**
```javascript
import pkg from 'flextype';
const { FlexType, flex, declareFlex } = pkg;
// 或者如果你手动安装了仓库
import pkg from 'path/to/dist/flextype.cjs.js';
const { FlexType, flex, declareFlex } = pkg;
```