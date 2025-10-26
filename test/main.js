import pkg from 'anytype-runtime';
const { AnyType, any, declareAny } = pkg;

console.log('=== AnyType 全面性能测试 ===');


console.log('\n=== 测试1: 基础压力测试 100,000个数据点 ===');
const stressStart = Date.now();
const stressData = [];
for (let i = 0; i < 100000; i++) {
  const data = any(`stress_${i}`, Math.random().toString());
  stressData.push(data);
}
const stressEnd = Date.now();
console.log(`处理 100,000 个数据点耗时: ${stressEnd - stressStart}ms`);

console.log('\n=== 测试2: 易错场景测试 ===');

const edgeCases = [
  any('empty_string', ''),
  any('whitespace', '   '),
  any('null_string', 'null'),
  any('undefined_string', 'undefined'),
  any('nan_string', 'NaN'),
  any('infinity', 'Infinity'),
  any('negative_infinity', '-Infinity'),
  any('hex_number', '0xFF'),
  any('scientific', '1.23e-4'),
  any('leading_zeros', '00123'),
  any('trailing_dots', '123.'),
];

console.log('边界值测试结果:');
edgeCases.forEach(item => {
  console.log(`${item.name}: ${item.value} (${item.type})`);
});

console.log('\n数学运算易错测试:');
try {
  const num1 = any('num1', '10');
  const num2 = any('num2', '0');
  const division = num1.divide(num2);
  console.log(`除零错误未捕获: ${division.value}`);
} catch (error) {
  console.log(`除零错误正确捕获: ${error.message}`);
}

console.log('\n类型转换边界测试:');
const conversionTests = [
  { input: 'true', desc: '布尔真值' },
  { input: 'false', desc: '布尔假值' },
  { input: 'TRUE', desc: '大写布尔' },
  { input: 'FALSE', desc: '大写布尔假' },
  { input: '123.45.67', desc: '无效数字' },
  { input: '[1,2,3]', desc: '有效数组JSON' },
  { input: '[1,2,3', desc: '无效数组JSON' },
  { input: '{"a":1}', desc: '有效对象JSON' },
  { input: '{"a":1', desc: '无效对象JSON' },
];

conversionTests.forEach(test => {
  const result = any(test.desc, test.input);
  console.log(`${test.desc}: "${test.input}" →`, result.value, `(${result.type})`);
});

console.log('\n=== 测试3: 复杂数据结构性能测试 ===');

const deepNestedStart = Date.now();
const complexObjects = [];
for (let i = 0; i < 10000; i++) {
  const complexData = any(`complex_${i}`, JSON.stringify({
    user: {
      profile: {
        personal: {
          name: `User${i}`,
          age: (i % 80 + 18).toString(),
          metadata: {
            created: Date.now().toString(),
            tags: `["tag${i}", "active", "test"]`,
            settings: `{"darkMode": ${i % 2 === 0}, "notifications": true}`
          }
        }
      },
      preferences: `{"theme": "dark", "language": "en", "fontSize": "${14 + i % 6}"}`
    },
    activities: `[{"type": "login", "timestamp": "${Date.now()}"}, {"type": "view", "timestamp": "${Date.now()}"}]`
  }));
  complexObjects.push(complexData);
}
const deepNestedEnd = Date.now();
console.log(`10,000个深度嵌套对象: ${deepNestedEnd - deepNestedStart}ms`);

console.log('\n大型数组处理测试:');
const largeArrayStart = Date.now();
const largeArrayData = any('large_array', JSON.stringify(Array.from({length: 10000}, (_, i) => ({
  id: i,
  value: (Math.random() * 1000).toFixed(2),
  active: (i % 3 === 0).toString(),
  timestamp: Date.now().toString()
}))));
const largeArrayEnd = Date.now();
console.log(`10,000元素数组解析: ${largeArrayEnd - largeArrayStart}ms`);
console.log(`数组长度: ${largeArrayData.value.length}, 类型: ${largeArrayData.type}`);

console.log('\n=== 测试4: 数学运算性能测试 ===');

const mathStart = Date.now();
let mathResult = any('base', '10');
for (let i = 0; i < 1000; i++) {
  mathResult = mathResult.add(any(`op_${i}`, (i % 10).toString()));
  if (i % 3 === 0) mathResult = mathResult.multiply(any(`mul_${i}`, '1.1'));
  if (i % 5 === 0) mathResult = mathResult.subtract(any(`sub_${i}`, '0.5'));
}
const mathEnd = Date.now();
console.log(`1,000次连续数学运算: ${mathEnd - mathStart}ms`);
console.log(`最终结果: ${mathResult.value}`);

const expressionStart = Date.now();
const expressions = [];
for (let i = 0; i < 5000; i++) {
  const a = any(`a_${i}`, (Math.random() * 100).toFixed(2));
  const b = any(`b_${i}`, (Math.random() * 50).toFixed(2));
  const c = any(`c_${i}`, (Math.random() * 10).toFixed(2));
  
  const numerator = a.multiply(b).add(c);
  const denominator = a.subtract(b);
  
  try {
    const result = numerator.divide(denominator);
    expressions.push(result);
  } catch (error) {
    expressions.push(any(`fallback_${i}`, '0'));
  }
}
const expressionEnd = Date.now();
console.log(`5,000个复杂表达式: ${expressionEnd - expressionStart}ms`);

console.log('\n=== 测试5: 类型转换性能测试 ===');

const conversionStart = Date.now();
const conversionResults = [];
for (let i = 0; i < 20000; i++) {
  const base = any(`convert_${i}`, i.toString());
  const asString = base.toString();
  const asNumber = base.toNumber();
  const asBoolean = base.toBoolean();
  
  conversionResults.push({
    original: base.value,
    string: asString.value,
    number: asNumber.value,
    boolean: asBoolean.value
  });
}
const conversionEnd = Date.now();
console.log(`20,000次类型转换: ${conversionEnd - conversionStart}ms`);

console.log('\n=== 测试6: 内存和缓存效率测试 ===');

const duplicateStart = Date.now();
const duplicateData = [];
const testValues = ['123', 'true', 'false', '45.67', '[1,2,3]', '{"a":1}'];

for (let i = 0; i < 50000; i++) {
  const value = testValues[i % testValues.length];
  const data = any(`dup_${i}`, value);
  duplicateData.push(data);
}
const duplicateEnd = Date.now();
console.log(`50,000个重复数据（测试缓存）: ${duplicateEnd - duplicateStart}ms`);

try {
  const cacheStats = getCacheStats();
  console.log('缓存统计:', cacheStats);
} catch (e) {
  console.log('缓存统计不可用');
}

console.log('\n=== 测试7: 已修复Bug验证 ===');

console.log('游戏战斗计算验证:');
const warrior = any('warrior', '100');
const heal = any('heal', '25');
const healed = warrior.add(heal);
console.log(`生命值计算: ${warrior.value} + ${heal.value} = ${healed.value} (应为125)`);

const numberStrings = ['123', '45.67', '0.001', '-42'];
console.log('数字字符串类型识别:');
numberStrings.forEach(str => {
  const item = any('num_test', str);
  console.log(`"${str}" → ${item.value} (${item.type}) ${item.type === 'number' ? 'OK' : 'ERROR'}`);
});

const jsonTests = [
  '{"valid": true, "nested": {"array": [1,2,3]}}',
  '{"invalid": true, missing_quote: "value"}',
  '[1,2,3]',
  '[1,2,3'
];
console.log('\nJSON解析稳定性:');
jsonTests.forEach(json => {
  const item = any('json_test', json);
  console.log(`${json.substring(0, 30)}... → 类型: ${item.type}, 值类型: ${typeof item.value}`);
});

console.log('\n=== 性能测试汇总 ===');
const totalTests = [
  { name: '基础压力测试', time: stressEnd - stressStart, count: 100000 },
  { name: '深度嵌套对象', time: deepNestedEnd - deepNestedStart, count: 10000 },
  { name: '大型数组解析', time: largeArrayEnd - largeArrayStart, count: 1 },
  { name: '连续数学运算', time: mathEnd - mathStart, count: 1000 },
  { name: '复杂表达式', time: expressionEnd - expressionStart, count: 5000 },
  { name: '类型转换', time: conversionEnd - conversionStart, count: 20000 },
  { name: '重复数据缓存', time: duplicateEnd - duplicateStart, count: 50000 },
];

totalTests.forEach(test => {
  const opsPerSec = Math.round((test.count / test.time) * 1000);
  console.log(`${test.name}: ${test.time}ms (${opsPerSec} ops/sec)`);
});

console.log('\n=== 测试完成 ===');
console.log('提示: 检查所有OK标记确保功能正常，关注ERROR标记的问题点');