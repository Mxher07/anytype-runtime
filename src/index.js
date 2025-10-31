// Main library exports
export { FlexType, flex, declareFlex } from './flextype.js';

// Default export is removed to prevent Rollup CJS bundle error (ReferenceError: FlexType is not defined)
//export default {
//  FlexType,
//  flex,
//  declareFlex
//};