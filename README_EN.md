# AnyType

[中文文档](./README.md) | English

A JavaScript runtime type inference and automatic conversion library that enables `any [variable]` style dynamic type declarations.

## Features

- **Smart Type Inference** 
Automatically detects true value types
- **Auto Type Conversion** 
Intelligently converts strings to numbers, booleans, etc.
- **Method Chaining** 
Use API design
- **Zero Dependencies** 
Pure JavaScript implementation

## 🚀 Quick Start

### Installation

**Install from npm （Node environment recommended）**
```bash
npm install anytype-runtime
```

**Install from GitHub (recommended for development):**
```bash
npm install github:Mxher07/anytype-runtime
```

**Use CDN (browser environment):**
```html
<!-- Using jsDelivr CDN -->
<script src="https://cdn.jsdelivr.net/gh/Mxher07/anytype-runtime@main/dist/anytype.umd.js"></script>

<!-- Or using unpkg CDN -->
<script src="https://unpkg.com/github:Mxher07/anytype-runtime/dist/anytype.umd.js"></script>
```

**Manual installation:**
1. Download the repository locally:
```bash
git clone https://github.com/Mxher07/anytype-runtime.git
cd anytype-runtime
npm install
npm run build
```

### Basic Usage

**In Node.js / ES Modules:**
```javascript
import { any, declareAny } from 'anytype-runtime';

// Or if you installed the repository manually:
import { any, declareAny } from './path/to/anytype-runtime/dist/anytype.esm.js';
```

**In CommonJS:**
```javascript
const { any, declareAny } = require('anytype-runtime');

// Or if you installed the repository manually:
const { any, declareAny } = require('./path/to/anytype-runtime/dist/anytype.cjs.js');
```

**In Browser (via CDN):**
```html
<script>
// Access through global variable AnyTypeRuntime
const { any, declareAny } = AnyTypeRuntime;

// Usage example
const age = any('age', '25');
console.log(age.value); // 25
console.log(age.type);  // 'number'
</script>
```

### Usage Examples

```javascript
// Automatic type inference and conversion
const age = any('age', '25');           // string "25" → number 25
const isActive = any('isActive', 'true'); // string "true" → boolean true
const scores = any('scores', '[1,2,3]');  // JSON string → array [1,2,3]
const price = any('price', '99.99');     // string → float 99.99

console.log(age.value);      // 25
console.log(age.type);       // 'number'
console.log(isActive.value); // true
console.log(scores.value);   // [1, 2, 3]

// Batch variable declaration
const config = declareAny({
  port: '3000',
  debug: 'true',
  features: '["auth", "upload"]'
});

console.log(config.port.value);     // 3000 (number)
console.log(config.debug.value);    // true (boolean)
console.log(config.features.value); // ['auth', 'upload'] (array)
```