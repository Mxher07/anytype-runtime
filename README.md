# AnyType

[English](./README_EN.md) | 中文文档

一个 JavaScript 运行时类型推断和自动转换库，让你能够使用 `any [变量名]` 风格的动态类型声明。

## 特性

- **智能类型推断** 
自动检测值的真实类型
- **自动类型转换** 
智能字符串到数字、布尔值等的转换
- **链式操作** 
使用 API 设计
- **零依赖** 
纯 JavaScript 实现

## 快速开始

### 安装

** 从 npm 安装 （Node环境推荐）**
```bash
npm install anytype-runtime
```
**从 GitHub 安装（推荐用于开发）：**
```bash
npm install github:Mxher07/anytype-runtime
```

**使用 CDN（浏览器环境）：**
```html
<!-- 使用 jsDelivr CDN -->
<script src="https://cdn.jsdelivr.net/gh/Mxher07/anytype-runtime@main/dist/anytype.umd.js"></script>

<!-- 或者使用 unpkg CDN -->
<script src="https://unpkg.com/github:Mxher07/anytype-runtime/dist/anytype.umd.js"></script>
```

**手动安装：**
1. 下载仓库到本地：
```bash
git clone https://github.com/Mxher07/anytype-runtime.git
cd anytype-runtime
npm install
npm run build
```

### 基本用法

**在 Node.js / ES Modules 中：**
```javascript
import { any, declareAny } from 'anytype-runtime';

// 或者如果你手动安装了仓库：
import { any, declareAny } from './path/to/anytype-runtime/dist/anytype.esm.js';
```

**在 CommonJS 中：**
```javascript
const { any, declareAny } = require('anytype-runtime');

// 或者如果你手动安装了仓库：
const { any, declareAny } = require('./path/to/anytype-runtime/dist/anytype.cjs.js');
```

**在浏览器中（通过 CDN）：**
```html
<script>
// 通过全局变量 AnyTypeRuntime 访问
const { any, declareAny } = AnyTypeRuntime;

// 使用示例
const age = any('age', '25');
console.log(age.value); // 25
console.log(age.type);  // 'number'
</script>
```

### 使用示例

```javascript
// 自动类型推断和转换
const age = any('age', '25');           // 字符串 "25" → 数字 25
const isActive = any('isActive', 'true'); // 字符串 "true" → 布尔值 true
const scores = any('scores', '[1,2,3]');  // JSON 字符串 → 数组 [1,2,3]
const price = any('price', '99.99');     // 字符串 → 浮点数 99.99

console.log(age.value);      // 25
console.log(age.type);       // 'number'
console.log(isActive.value); // true
console.log(scores.value);   // [1, 2, 3]

// 批量声明变量
const config = declareAny({
  port: '3000',
  debug: 'true',
  features: '["auth", "upload"]'
});

console.log(config.port.value);     // 3000 (number)
console.log(config.debug.value);    // true (boolean)
console.log(config.features.value); // ['auth', 'upload'] (array)
```