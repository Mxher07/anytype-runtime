/**
 * AnyType Runtime Utility Functions
 * Provides type checking, validation, conversion and other helper functions
 */

/**
 * Deep type inference - more detailed than basic type inference
 */
export function deepInferType(value) {
  const basicType = inferBasicType(value);
  
  if (basicType === 'array' && Array.isArray(value)) {
    return {
      type: 'array',
      length: value.length,
      itemTypes: value.length > 0 ? [...new Set(value.map(inferBasicType))] : [],
      empty: value.length === 0
    };
  }
  
  if (basicType === 'object' && value !== null) {
    const keys = Object.keys(value);
    return {
      type: 'object',
      keys,
      keyCount: keys.length,
      valueTypes: [...new Set(Object.values(value).map(inferBasicType))],
      empty: keys.length === 0
    };
  }
  
  return { type: basicType };
}

/**
 * Basic type inference
 */
function inferBasicType(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  
  const type = typeof value;
  if (type === 'number') {
    if (isNaN(value)) return 'nan';
    if (Number.isInteger(value)) return 'integer';
    return 'float';
  }
  if (type === 'object') {
    if (Array.isArray(value)) return 'array';
    if (value instanceof Date) return 'date';
    if (value instanceof RegExp) return 'regexp';
    if (value instanceof Map) return 'map';
    if (value instanceof Set) return 'set';
    if (value instanceof Promise) return 'promise';
  }
  
  return type;
}

/**
 * Smart value conversion with custom rules
 */
export function smartConvert(value, options = {}) {
  const {
    strict = false,
    parseJSON = true,
    detectDates = true,
    customConverters = {}
  } = options;

  // Check custom converters first
  for (const [converterName, converter] of Object.entries(customConverters)) {
    if (typeof converter === 'function') {
      try {
        const result = converter(value);
        if (result !== undefined) return result;
      } catch {
        // Continue to next converter if this one fails
      }
    }
  }

  // Handle null and undefined
  if (value === null || value === undefined) {
    return value;
  }

  // Handle strings with intelligent parsing
  if (typeof value === 'string') {
    const trimmed = value.trim();
    
    // Empty string
    if (trimmed === '') return strict ? value : '';
    
    // Boolean detection
    if (trimmed.toLowerCase() === 'true') return true;
    if (trimmed.toLowerCase() === 'false') return false;
    
    // Number detection (including scientific notation)
    if (/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(trimmed)) {
      const num = Number(trimmed);
      if (!isNaN(num)) return num;
    }
    
    // Date detection
    if (detectDates) {
      const date = tryParseDate(trimmed);
      if (date) return date;
    }
    
    // JSON detection
    if (parseJSON && (trimmed.startsWith('{') || trimmed.startsWith('['))) {
      try {
        const parsed = JSON.parse(trimmed);
        return parsed;
      } catch {
        // Return original string if JSON parsing fails
      }
    }
    
    return value;
  }

  return value;
}

/**
 * Try to parse various date formats
 */
function tryParseDate(value) {
  // ISO format
  const isoDate = Date.parse(value);
  if (!isNaN(isoDate)) return new Date(isoDate);
  
  // Common date formats
  const formats = [
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/
  ];
  
  for (const format of formats) {
    const match = value.match(format);
    if (match) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) return date;
    }
  }
  
  return null;
}

/**
 * Type validation with schema support
 */
export function validateType(value, schema) {
  if (typeof schema === 'string') {
    // Basic type validation
    return inferBasicType(value) === schema;
  }
  
  if (typeof schema === 'function') {
    // Custom validator function
    return schema(value);
  }
  
  if (Array.isArray(schema)) {
    // Union type validation (one of multiple types)
    return schema.some(type => validateType(value, type));
  }
  
  if (schema && typeof schema === 'object') {
    // Object schema validation
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return false;
    }
    
    for (const [key, keySchema] of Object.entries(schema)) {
      if (!validateType(value[key], keySchema)) {
        return false;
      }
    }
    
    return true;
  }
  
  return false;
}

/**
 * Create a type guard function
 */
export function createTypeGuard(schema) {
  return (value) => validateType(value, schema);
}

/**
 * Performance monitoring utility
 */
export function withPerformance(name, fn) {
  return (...args) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    
    console.log(`[Performance] ${name}: ${(end - start).toFixed(3)}ms`);
    return result;
  };
}

/**
 * Memoization utility for expensive operations
 */
export function memoize(fn, options = {}) {
  const {
    maxSize = 100,
    ttl = 0 // Time to live in milliseconds (0 = infinite)
  } = options;
  
  const cache = new Map();
  const timestamps = new Map();
  
  return function(...args) {
    const key = JSON.stringify(args);
    
    // Check cache validity
    if (cache.has(key)) {
      if (ttl > 0) {
        const timestamp = timestamps.get(key);
        if (Date.now() - timestamp > ttl) {
          cache.delete(key);
          timestamps.delete(key);
        } else {
          return cache.get(key);
        }
      } else {
        return cache.get(key);
      }
    }
    
    // Execute function and cache result
    const result = fn.apply(this, args);
    cache.set(key, result);
    timestamps.set(key, Date.now());
    
    // Enforce cache size limit
    if (cache.size > maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
      timestamps.delete(firstKey);
    }
    
    return result;
  };
}

/**
 * Type conversion utilities
 */
export const converters = {
  toNumber(value) {
    const num = Number(value);
    return isNaN(num) ? value : num;
  },
  
  toBoolean(value) {
    if (typeof value === 'string') {
      const lower = value.toLowerCase().trim();
      if (lower === 'true' || lower === '1' || lower === 'yes') return true;
      if (lower === 'false' || lower === '0' || lower === 'no') return false;
    }
    return Boolean(value);
  },
  
  toString(value) {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  },
  
  toArray(value) {
    if (Array.isArray(value)) return value;
    if (value === null || value === undefined) return [];
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return value.split(',').map(item => item.trim());
      }
    }
    return [value];
  },
  
  toDate(value) {
    if (value instanceof Date) return value;
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date;
  }
};

/**
 * Configuration manager for AnyType behavior
 */
export class AnyTypeConfig {
  constructor() {
    this.config = {
      autoParseJSON: true,
      detectDates: true,
      strictMode: false,
      performanceMonitoring: false,
      customConverters: {},
      validation: {
        throwOnError: false,
        logWarnings: true
      }
    };
  }
  
  set(key, value) {
    const keys = key.split('.');
    let current = this.config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    return this;
  }
  
  get(key) {
    const keys = key.split('.');
    let current = this.config;
    
    for (const k of keys) {
      if (current[k] === undefined) return undefined;
      current = current[k];
    }
    
    return current;
  }
  
  merge(newConfig) {
    this.config = this.deepMerge(this.config, newConfig);
    return this;
  }
  
  deepMerge(target, source) {
    const output = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        output[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        output[key] = source[key];
      }
    }
    
    return output;
  }
  
  reset() {
    this.config = new AnyTypeConfig().config;
    return this;
  }
}

// Global configuration instance
export const config = new AnyTypeConfig();

/**
 * Utility to create type-safe AnyType instances
 */
export function createTypedAny(typeSchema) {
  return function(name, value) {
    const isValid = validateType(value, typeSchema);
    
    if (!isValid && config.get('validation.throwOnError')) {
      throw new Error(`Type validation failed for ${name}: expected ${typeSchema}, got ${inferBasicType(value)}`);
    }
    
    if (!isValid && config.get('validation.logWarnings')) {
      console.warn(`Type warning: ${name} expected ${typeSchema}, got ${inferBasicType(value)}`);
    }
    
    return value;
  };
}

/**
 * Export all utilities as default object
 */
export default {
  deepInferType,
  smartConvert,
  validateType,
  createTypeGuard,
  withPerformance,
  memoize,
  converters,
  config,
  createTypedAny
};