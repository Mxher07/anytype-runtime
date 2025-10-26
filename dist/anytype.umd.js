(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.AnyTypeRuntime = {}));
})(this, (function (exports) { 'use strict';

  // AnyType Core Js
  class AnyType {
    constructor(value, name = 'unknown') {
      this._originalValue = value;
      this._name = name;
      
      this._cache = new Map();
      
      this._inferredType = this._inferType(value);
      this._convertedValue = this._autoConvert(value);
    }

    _inferType(value) {
      const cacheKey = `infer_${typeof value}_${value}`;
      if (this._cache.has(cacheKey)) {
        return this._cache.get(cacheKey);
      }

      const type = typeof value;
      let result;
      
      if (value === null) result = 'null';
      else if (value === undefined) result = 'undefined';
      else if (type === 'number' && isNaN(value)) result = 'nan';
      else if (type === 'object') {
        if (Array.isArray(value)) result = 'array';
        else if (value instanceof Date) result = 'date';
        else if (value instanceof RegExp) result = 'regexp';
        else if (value instanceof Map) result = 'map';
        else if (value instanceof Set) result = 'set';
        else result = 'object';
      } else {
        result = type;
      }
      
      this._cache.set(cacheKey, result);
      return result;
    }

    _autoConvert(value) {
      const cacheKey = `convert_${this._inferredType}_${value}`;
      if (this._cache.has(cacheKey)) {
        return this._cache.get(cacheKey);
      }

      let result;
      switch (this._inferredType) {
        case 'string':
          result = this._convertString(value);
          break;
        case 'number':
          result = Number.isInteger(value) ? value : parseFloat(value.toPrecision(15));
          break;
        case 'boolean':
          result = Boolean(value);
          break;
        default:
          result = value;
      }
      
      this._cache.set(cacheKey, result);
      return result;
    }

    _convertString(str) {
      const cacheKey = `convertString_${str}`;
      if (this._cache.has(cacheKey)) {
        return this._cache.get(cacheKey);
      }

      const trimmed = str.trim();
      let result;

      if (trimmed === '') {
        result = str;
      }
      // Boolean conversion
      else if (trimmed.toLowerCase() === 'true') {
        result = true;
      }
      else if (trimmed.toLowerCase() === 'false') {
        result = false;
      }
      // Number conversion
      else if (!isNaN(Number(trimmed)) && trimmed !== '') {
        const num = Number(trimmed);
        if (!isNaN(num) && isFinite(num)) {
          result = num;
        } else {
          result = str;
        }
      }
      // JSON conversion
      else if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || 
               (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        try {
          result = JSON.parse(trimmed);
        } catch {
          result = str;
        }
      }
      else {
        result = str;
      }
      
      this._cache.set(cacheKey, result);
      return result;
    }

    get originalValue() { return this._originalValue; }
    get value() { return this._convertedValue; }
    get type() { return this._inferredType; }
    get name() { return this._name; }


    clearCache() {
      this._cache.clear();
      this._cacheHits = 0;
      this._cacheMiss = 0;
    }

    // Type checking
    isString() { return this._inferredType === 'string'; }
    isNumber() { return this._inferredType === 'number'; }
    isBoolean() { return this._inferredType === 'boolean'; }
    isArray() { return this._inferredType === 'array'; }
    isObject() { return this._inferredType === 'object'; }
    isNull() { return this._inferredType === 'null'; }
    isUndefined() { return this._inferredType === 'undefined'; }
    isDate() { return this._inferredType === 'date'; }
    isRegExp() { return this._inferredType === 'regexp'; }
    isMap() { return this._inferredType === 'map'; }
    isSet() { return this._inferredType === 'set'; }
    isNaN() { return this._inferredType === 'nan'; }

    // Type conversion
    toString() { 
      const result = new AnyType(String(this._convertedValue), this._name);
      result._cache = new Map(this._cache);
      return result;
    }
    
    toNumber() { 
      const result = new AnyType(Number(this._convertedValue), this._name);
      result._cache = new Map(this._cache);
      return result;
    }
    
    toBoolean() { 
      const result = new AnyType(Boolean(this._convertedValue), this._name);
      result._cache = new Map(this._cache);
      return result;
    }

    toInteger() {
      const result = new AnyType(Math.trunc(Number(this._convertedValue)), this._name);
      result._cache = new Map(this._cache);
      return result;
    }

    toFloat() {
      const result = new AnyType(parseFloat(this._convertedValue), this._name);
      result._cache = new Map(this._cache);
      return result;
    }

    toJSON() {
      try {
        const result = new AnyType(JSON.stringify(this._convertedValue), this._name);
        result._cache = new Map(this._cache);
        return result;
      } catch {
        return this.toString();
      }
    }

    add(other) {
      const otherValue = AnyType._unwrap(other);
      const result = Number(this._convertedValue) + Number(otherValue);
      return new AnyType(result, `(${this._name} + ${AnyType._getName(other)})`);
    }

    multiply(other) {
      const otherValue = AnyType._unwrap(other);
      const result = Number(this._convertedValue) * Number(otherValue);
      return new AnyType(result, `(${this._name} * ${AnyType._getName(other)})`);
    }

    subtract(other) {
      const otherValue = AnyType._unwrap(other);
      const result = Number(this._convertedValue) - Number(otherValue);
      return new AnyType(result, `(${this._name} - ${AnyType._getName(other)})`);
    }

    divide(other) {
      const otherValue = AnyType._unwrap(other);
      if (Number(otherValue) === 0) {
        throw new Error('Division by zero');
      }
      const result = Number(this._convertedValue) / Number(otherValue);
      return new AnyType(result, `(${this._name} / ${AnyType._getName(other)})`);
    }

    modulus(other) {
      const otherValue = AnyType._unwrap(other);
      const result = Number(this._convertedValue) % Number(otherValue);
      return new AnyType(result, `(${this._name} % ${AnyType._getName(other)})`);
    }

    power(other) {
      const otherValue = AnyType._unwrap(other);
      const result = Math.pow(Number(this._convertedValue), Number(otherValue));
      return new AnyType(result, `(${this._name} ^ ${AnyType._getName(other)})`);
    }

    equals(other) {
      const otherValue = AnyType._unwrap(other);
      return this._convertedValue == otherValue;
    }

    strictEquals(other) {
      const otherValue = AnyType._unwrap(other);
      return this._convertedValue === otherValue;
    }

    greaterThan(other) {
      const otherValue = AnyType._unwrap(other);
      return Number(this._convertedValue) > Number(otherValue);
    }

    lessThan(other) {
      const otherValue = AnyType._unwrap(other);
      return Number(this._convertedValue) < Number(otherValue);
    }

    clone() {
      const cloned = new AnyType(this._originalValue, this._name);
      cloned._cache = new Map(this._cache);
      return cloned;
    }

    inspect() {
      return {
        name: this._name,
        originalValue: this._originalValue,
        convertedValue: this._convertedValue,
        type: this._inferredType,
        cacheStats: this.cacheStats
      };
    }

    pipe(fn) {
      if (typeof fn !== 'function') {
        throw new Error('Pipe argument must be a function');
      }
      const result = fn(this._convertedValue);
      return new AnyType(result, `pipe(${this._name})`);
    }

    static _unwrap(value) {
      return value instanceof AnyType ? value.value : value;
    }

    static _getName(value) {
      return value instanceof AnyType ? value.name : 'literal';
    }

    static isAnyType(value) {
      return value instanceof AnyType;
    }

    static createBatch(values, prefix = 'item') {
      return values.map((value, index) => new AnyType(value, `${prefix}_${index}`));
    }

    static merge(...anyTypes) {
      const mergedValues = anyTypes.map(at => at.value);
      return new AnyType(mergedValues, `merge(${anyTypes.map(at => at.name).join(',')})`);
    }
  }

  class AnyTypeCache {
    constructor(maxSize = 1000) {
      this._cache = new Map();
      this._maxSize = maxSize;
      this._hits = 0;
      this._miss = 0;
    }

    get(key) {
      if (this._cache.has(key)) {
        this._hits++;
        return this._cache.get(key);
      }
      this._miss++;
      return undefined;
    }

    set(key, value) {
      if (this._cache.size >= this._maxSize) {
        const firstKey = this._cache.keys().next().value;
        this._cache.delete(firstKey);
      }
      this._cache.set(key, value);
    }

    clear() {
      this._cache.clear();
      this._hits = 0;
      this._miss = 0;
    }

  }

  const globalCache = new AnyTypeCache();

  // Export Function
  function any(name, value) {
    if (typeof name !== 'string') {
      throw new Error('Variable name must be a string');
    }
    
    const cacheKey = `any_${name}_${value}`;
    const cached = globalCache.get(cacheKey);
    if (cached) {
      return cached.clone();
    }
    
    const result = new AnyType(value, name);
    globalCache.set(cacheKey, result.clone());
    return result;
  }

  function declareAny(variables) {
    const result = {};
    for (const [name, value] of Object.entries(variables)) {
      result[name] = any(name, value);
    }
    return result;
  }

  // default exports
  var index = {
    AnyType,
    any,
    declareAny
  };

  exports.AnyType = AnyType;
  exports.any = any;
  exports.declareAny = declareAny;
  exports.default = index;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
