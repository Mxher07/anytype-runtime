// Main library exports
export { AnyType, any, declareAny } from './anytype.js';

// Default export is removed to prevent Rollup CJS bundle error (ReferenceError: AnyType is not defined)
// export default {
//   AnyType,
//   any,
//   declareAny
// };