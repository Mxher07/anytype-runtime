// Main library exports
export { AnyType, any, declareAny } from './anytype.js';

// Utility functions exports
export {
  deepInferType,
  smartConvert,
  validateType,
  createTypeGuard,
  withPerformance,
  memoize,
  converters,
  config,
  createTypedAny
} from './utils.js';

// Default export
export default {
  // Core functionality
  AnyType,
  any,
  declareAny,
  
  // Utilities
  utils: {
    deepInferType,
    smartConvert,
    validateType,
    createTypeGuard,
    withPerformance,
    memoize,
    converters,
    config,
    createTypedAny
  }
};