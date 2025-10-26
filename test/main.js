import pkg from '../dist/anytype.cjs.js';
const { AnyType, any, declareAny } = pkg;

console.log('\n🔥 === 压力测试：10,0000个数据点 ===');
const stressStart = Date.now();
const stressData = [];
for (let i = 0; i < 100000; i++) {
  const data = any(`stress_${i}`, Math.random().toString());
  stressData.push(data);
}
const stressEnd = Date.now();
console.log(`处理 10,0000 个数据点耗时: ${stressEnd - stressStart}ms`);
