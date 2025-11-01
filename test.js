
import { flex, declareFlex, FlexType } from 'flextypeonjs' ;

// 将 true 转换为 1，进行运算，再转换回布尔值
const active = flex('active', true).boolLock(); // 锁定布尔行为
const result = active.subtract(1);              // 1 - 1 = 0
const final = flex('final', result.value > 0);  // 0 > 0 = false

console.log("初始:", active.value);    // true
console.log("运算后:", result.value);  // 0
console.log("最终:", final.value);     // false
