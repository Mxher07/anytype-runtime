(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.AnyTypeRuntime = {}));
})(this, (function (exports) { 'use strict';

  // AnyType Core Js
  class AnyType {
    constructor(value, name = 'unknown') {
      this._value = value;
      this._name = name;
      // 修复核心功能失效问题：必须先推断类型，然后使用推断的类型进行转换
      this._inferredType = this._inferType(value);
      this._convertedValue = this._autoConvert(value);
    }

    _inferType(value) {
      const type = typeof value;
      
      if (value === null) return 'null';
      if (value === undefined) return 'undefined';
      if (type === 'number' && isNaN(value)) return 'nan';
      if (type === 'object') {
        if (Array.isArray(value)) return 'array';
        if (value instanceof Date) return 'date';
        if (value instanceof RegExp) return 'regexp';
        if (value instanceof Map) return 'map';
        if (value instanceof Set) return 'set';
      }
      
      return type;
    }

    _autoConvert(value) {
      // 只有在推断类型是 string 时，才进行自动转换
      if (this._inferredType === 'string') {
        return this._convertString(value);
      }
      
      // 对于非字符串类型，直接返回原值
      return value;
    }

    _convertString(str) {
      const trimmed = str.trim();
      if (trimmed === '') return str;
      
      // Boolean conversion
      // Boolean conversion
      // 修复大小写布尔值问题：只对 'true' 和 'false' 进行转换
      if (trimmed === 'true' || trimmed === 'True') {
        this._inferredType = 'boolean';
        return true;
      }
      if (trimmed === 'false' || trimmed === 'False') {
        this._inferredType = 'boolean';
        return false;
      }
      
      // Number conversion
      const num = Number(trimmed);
      // Number conversion
      // 修复大数字精度丢失问题：如果数字过大，则保留为字符串
      if (!isNaN(num) && trimmed !== '') {
        if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
          return str;
        }
        this._inferredType = 'number';
        return Number.isInteger(num) ? num : parseFloat(num.toPrecision(15));
      }
      
      // JSON conversion
      if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || 
          (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try {
          const json = JSON.parse(trimmed);
          if (Array.isArray(json)) {
            this._inferredType = 'array';
          } else if (typeof json === 'object' && json !== null) {
            this._inferredType = 'object';
          }
          return json;
        } catch {
          return str;
        }
      }
      
      return str;
    }

    get value() { return this._convertedValue; }
    get type() { return this._inferredType; }
    get name() { return this._name; }

    // Type checking
    isString() { return this._inferredType === 'string'; }
    isNumber() { return this._inferredType === 'number'; }
    isBoolean() { return this._inferredType === 'boolean'; }
    isArray() { return this._inferredType === 'array'; }
    isObject() { return this._inferredType === 'object'; }
    isNull() { return this._inferredType === 'null'; }
    isUndefined() { return this._inferredType === 'undefined'; }

    // Type conversion
    toString() { return new AnyType(String(this._convertedValue), this._name); }
    toNumber() { return new AnyType(Number(this._convertedValue), this._name); }
    toBoolean() { return new AnyType(Boolean(this._convertedValue), this._name); }

    // Mathematical operations
    add(other) {
      const result = this._convertedValue + AnyType._unwrap(other);
      return new AnyType(result, `(${this._name} + ${AnyType._getName(other)})`);
    }

    multiply(other) {
      const result = this._convertedValue * AnyType._unwrap(other);
      return new AnyType(result, `(${this._name} * ${AnyType._getName(other)})`);
    }

    subtract(other) {
      const result = this._convertedValue - AnyType._unwrap(other);
      return new AnyType(result, `(${this._name} - ${AnyType._getName(other)})`);
    }

    divide(other) {
      const result = this._convertedValue / AnyType._unwrap(other);
      return new AnyType(result, `(${this._name} / ${AnyType._getName(other)})`);
    }

    static _unwrap(value) {
      return value instanceof AnyType ? value.value : value;
    }

    static _getName(value) {
      return value instanceof AnyType ? value.name : 'literal';
    }
  }

  // Export Function
  function any(name, value) {
    if (typeof name !== 'string') {
      throw new Error('Variable name must be a string');
    }
    return new AnyType(value, name);
  }

  function declareAny(variables) {
    const result = {};
    for (const [name, value] of Object.entries(variables)) {
      result[name] = any(name, value);
    }
    return result;
  }

  exports.AnyType = AnyType;
  exports.any = any;
  exports.declareAny = declareAny;

}));
