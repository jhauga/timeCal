/**
 * Simple Test Script for TimeCal
 * Run this with: node test.js
 */

const { parseArguments } = require('./lib/parser');
const { calculate } = require('./lib/calculator');
const { formatOutput } = require('./lib/formatter');

console.log('=== TimeCal Test Suite ===\n');

// Test cases
const tests = [
  { args: ['5h'], description: '5 hours ago' },
  { args: ['-f', '3d'], description: '3 days in the future' },
  { args: ['lm'], description: 'Last month' },
  { args: ['-m', '+2h', '+', '30m'], description: 'Math mode: +2h + 30m' },
  { args: ['0.5d', '83m'], description: 'Half a day and 83 minutes ago' },
  { args: ['-f', '2w'], description: '2 weeks in the future' }
];

let passed = 0;
let failed = 0;

tests.forEach((test, index) => {
  try {
    console.log(`Test ${index + 1}: ${test.description}`);
    console.log(`Command: timecal ${test.args.join(' ')}`);
    
    const parsed = parseArguments(test.args);
    const result = calculate(parsed);
    const output = formatOutput(result);
    
    console.log(`Result: ${output}`);
    console.log('Status: ✓ PASSED\n');
    passed++;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log('Status: ✗ FAILED\n');
    failed++;
  }
});

console.log('=== Test Summary ===');
console.log(`Total Tests: ${tests.length}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed === 0) {
  console.log('\n✓ All tests passed!');
  process.exit(0);
} else {
  console.log('\n✗ Some tests failed!');
  process.exit(1);
}
