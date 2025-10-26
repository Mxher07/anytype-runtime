// AnyType Core Js
class AnyType {
  constructor(value, name = 'unknown') {
    this._value = value;
    this._name = name;
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
    switch (this._inferredType) {
      case 'string':
        return this._convertString(value);
      case 'number':
        return Number.isInteger(value) ? value : parseFloat(value.toPrecision(15));
      case 'boolean':
        return Boolean(value);
      default:
        return value;
    }
  }

  _convertString(str) {
    const trimmed = str.trim();
    if (trimmed === '') return str;
    
    // Boolean conversion
    if (trimmed.toLowerCase() === 'true') return true;
    if (trimmed.toLowerCase() === 'false') return false;
    
    // Number conversion
    const num = Number(trimmed);
    if (!isNaN(num) && trimmed !== '') return num;
    
    // JSON conversion
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || 
        (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        return JSON.parse(trimmed);
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
export function any(name, value) {
  if (typeof name !== 'string') {
    throw new Error('Variable name must be a string');
  }
  return new AnyType(value, name);
}

export function declareAny(variables) {
  const result = {};
  for (const [name, value] of Object.entries(variables)) {
    result[name] = any(name, value);
  }
  return result;
}

export { AnyType };

// Default Export
export default {
  AnyType$1,
  any$1,
  declareAny$1
};