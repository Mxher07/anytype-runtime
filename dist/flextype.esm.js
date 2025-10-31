// FlexType - Core Js
class FlexType {
  constructor(value, name = 'unknown', options = {}) {
    this._value = value;
    this._name = name;
    this._options = {
      stringLock: false,
      boolLock: false,
      typeLock: false,
      ...options
    };
    
    this._typeHistory = [];
    this._inferredType = this._inferType(value);
    this._convertedValue = this._autoConvert(value);
    this._recordTypeChange(this._inferredType);
  }

  // inferType
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

  // autoConvert
  _autoConvert(value) {
    if (this._options.typeLock) return value;
    
    switch (this._inferredType) {
      case 'string':
        return this._convertString(value);
      case 'boolean':
        return this._convertBoolean(value);
      default:
        return value;
    }
  }

  _convertString(str) {
    if (this._options.stringLock) return str;
    
    const trimmed = str.trim();
    if (trimmed === '') return str;

    // boolConvert
    if (trimmed.toLowerCase() === 'true') {
      this._recordTypeChange('boolean');
      return true;
    }
    if (trimmed.toLowerCase() === 'false') {
      this._recordTypeChange('boolean');
      return false;
    }

    // BigNumber Convert
    if (!isNaN(trimmed) && trimmed !== '') {
      const num = Number(trimmed);
      if (Math.abs(num) <= Number.MAX_SAFE_INTEGER) {
        this._recordTypeChange('number');
        return Number.isInteger(num) ? num : parseFloat(num.toPrecision(15));
      }
    }

    // JSON Convert
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || 
        (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        const json = JSON.parse(trimmed);
        this._recordTypeChange(Array.isArray(json) ? 'array' : 'object');
        return json;
      } catch {
        return str;
      }
    }

    return str;
  }

  _convertBoolean(bool) {
    if (this._options.boolLock) {
      return bool ? 1 : 0;
    }
    return bool;
  }

  _recordTypeChange(newType) {
    if (this._typeHistory[this._typeHistory.length - 1] !== newType) {
      this._typeHistory.push(newType);
    }
    this._inferredType = newType;
  }

  // strLock
  strLock() {
    return new FlexType(this._convertedValue, this._name, {
      ...this._options,
      stringLock: true
    });
  }

  boolLock() {
    return new FlexType(this._convertedValue, this._name, {
      ...this._options,
      boolLock: true
    });
  }

  typeLock() {
    return new FlexType(this._convertedValue, this._name, {
      ...this._options,
      typeLock: true
    });
  }

  unlock() {
    return new FlexType(this._convertedValue, this._name, {
      stringLock: false,
      boolLock: false,
      typeLock: false
    });
  }

  // Getter
  get value() { return this._convertedValue; }
  get type() { return this._inferredType; }
  get name() { return this._name; }
  get typeHistory() { return [...this._typeHistory]; }
  get isLocked() { 
    return this._options.stringLock || this._options.boolLock || this._options.typeLock; 
  }

  // Type Checker
  isString() { return this._inferredType === 'string'; }
  isNumber() { return this._inferredType === 'number'; }
  isBoolean() { return this._inferredType === 'boolean'; }
  isArray() { return this._inferredType === 'array'; }
  isObject() { return this._inferredType === 'object'; }
  isNull() { return this._inferredType === 'null'; }
  isUndefined() { return this._inferredType === 'undefined'; }

  // math
  add(other) {
    const otherValue = FlexType._unwrap(other);
    
    // lock checker
    if (this._options.stringLock && this.isString()) {
      throw new Error(`String locked variable '${this._name}' cannot be used in mathematical operations`);
    }

    // special
    if (this._options.boolLock && this.isBoolean()) {
      const result = (this.value ? 1 : 0) + Number(otherValue);
      return new FlexType(Math.max(0, Math.min(1, result)), `(${this._name} + ${FlexType._getName(other)})`);
    }

    const result = this._convertedValue + otherValue;
    return new FlexType(result, `(${this._name} + ${FlexType._getName(other)})`);
  }

  subtract(other) {
    const otherValue = FlexType._unwrap(other);
    
    if (this._options.stringLock && this.isString()) {
      throw new Error(`String locked variable '${this._name}' cannot be used in mathematical operations`);
    }

    if (this._options.boolLock && this.isBoolean()) {
      const result = (this.value ? 1 : 0) - Number(otherValue);
      return new FlexType(Math.max(0, Math.min(1, result)), `(${this._name} - ${FlexType._getName(other)})`);
    }

    const result = this._convertedValue - otherValue;
    return new FlexType(result, `(${this._name} - ${FlexType._getName(other)})`);
  }

  multiply(other) {
    const otherValue = FlexType._unwrap(other);
    
    if (this._options.stringLock && this.isString()) {
      throw new Error(`String locked variable '${this._name}' cannot be used in mathematical operations`);
    }

    if (this._options.boolLock && this.isBoolean()) {
      const result = (this.value ? 1 : 0) * Number(otherValue);
      return new FlexType(Math.max(0, Math.min(1, result)), `(${this._name} * ${FlexType._getName(other)})`);
    }

    const result = this._convertedValue * otherValue;
    return new FlexType(result, `(${this._name} * ${FlexType._getName(other)})`);
  }

  divide(other) {
    const otherValue = FlexType._unwrap(other);
    
    if (this._options.stringLock && this.isString()) {
      throw new Error(`String locked variable '${this._name}' cannot be used in mathematical operations`);
    }

    if (this._options.boolLock && this.isBoolean()) {
      const result = (this.value ? 1 : 0) / Number(otherValue);
      return new FlexType(Math.max(0, Math.min(1, result)), `(${this._name} / ${FlexType._getName(other)})`);
    }

    const result = this._convertedValue / otherValue;
    return new FlexType(result, `(${this._name} / ${FlexType._getName(other)})`);
  }

  // offset
  charShift(offset) {
    if (!this.isString()) {
      throw new Error(`charShift can only be used on string types. Current type: ${this._inferredType}`);
    }

    if (this._options.stringLock) {
      throw new Error(`String locked variable '${this._name}' cannot use charShift`);
    }

    let result = '';
    for (let i = 0; i < this._convertedValue.length; i++) {
      const charCode = this._convertedValue.charCodeAt(i);
      result += String.fromCharCode(charCode + offset);
    }
    
    return new FlexType(result, `charShift(${this._name}, ${offset})`);
  }

  // array execute
  get(property) {
    if (!this.isArray() && !this.isObject()) {
      throw new Error(`get() can only be used on array or object types. Current type: ${this._inferredType}`);
    }

    const propValue = this._convertedValue[property];
    return new FlexType(propValue, `${this._name}.${property}`);
  }

  set(property, value) {
    if (!this.isArray() && !this.isObject()) {
      throw new Error(`set() can only be used on array or object types. Current type: ${this._inferredType}`);
    }

    const newValue = FlexType._unwrap(value);
    this._convertedValue[property] = newValue;
    return this;
  }

  push(...items) {
    if (!this.isArray()) {
      throw new Error(`push() can only be used on array types. Current type: ${this._inferredType}`);
    }

    const unwrappedItems = items.map(item => FlexType._unwrap(item));
    this._convertedValue.push(...unwrappedItems);
    return this;
  }

  static _unwrap(value) {
    return value instanceof FlexType ? value.value : value;
  }

  static _getName(value) {
    return value instanceof FlexType ? value.name : 'literal';
  }

  toString() { 
    return new FlexType(String(this._convertedValue), `String(${this._name})`); 
  }
  
  toNumber() { 
    return new FlexType(Number(this._convertedValue), `Number(${this._name})`); 
  }
  
  toBoolean() { 
    return new FlexType(Boolean(this._convertedValue), `Boolean(${this._name})`); 
  }

  // debug info
  debug() {
    return {
      name: this._name,
      value: this._convertedValue,
      type: this._inferredType,
      typeHistory: this._typeHistory,
      options: { ...this._options },
      isLocked: this.isLocked
    };
  }
}

// export func
function flex(name, value, options = {}) {
  if (typeof name !== 'string') {
    throw new Error('Variable name must be a string');
  }
  return new FlexType(value, name, options);
}

function declareFlex(variables, options = {}) {
  const result = {};
  for (const [name, value] of Object.entries(variables)) {
    result[name] = flex(name, value, options);
  }
  return result;
}

export { FlexType, declareFlex, flex };
