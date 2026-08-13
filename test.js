/**
 * Simple Test Script for TimeCal
 * Run this with: node test.js
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

// Use an isolated config file so tests never touch the user's real config
process.env.TIMECAL_CONFIG = path.join(os.tmpdir(), 'timecal-test-config.json');

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
  { args: ['-f', '2w'], description: '2 weeks in the future' },
  { args: ['12:10:00AM', '1:25:25PM'], description: 'Difference: 12:10:00AM to 1:25:25PM', expected: '13h 15m 25s' },
  { args: ['12:00AM', '1:00PM'], description: 'Difference: 12:00AM to 1:00PM', expected: '13h 0m 0s' },
  { args: ['12AM', '1PM'], description: 'Difference: 12AM to 1PM', expected: '13h 0m 0s' },
  { args: ['00:10:00', '13:35:10'], description: 'Difference: 24-hour format', expected: '13h 25m 10s' },
  { args: ['00', '13'], description: 'Difference: hours only', expected: '13h 0m 0s' },
  { args: ['12:10:00AM', '13:25:25'], description: 'Difference: mixed 12/24-hour formats', expected: '13h 15m 25s' },
  { args: ['00.10.00', '13.35.10'], description: 'Difference: dot separators', expected: '13h 25m 10s' },
  { args: ['12.10.00AM', '1.25.25PM'], description: 'Difference: dot separators with AM/PM', expected: '13h 15m 25s' },
  { args: ['00.10', '13:35:10'], description: 'Difference: mixed dot and colon separators', expected: '13h 25m 10s' },
  { args: ['11PM', '7AM'], description: 'Difference: wraps past midnight', expected: '8h 0m 0s' },
  { args: ['21:00'], description: 'Invert: 24-hour to AM/PM', expected: '9:00 PM' },
  { args: ['9:00PM'], description: 'Invert: AM/PM to 24-hour', expected: '21:00' },
  { args: ['9:00', 'PM'], description: 'Invert: AM/PM as a separate argument', expected: '21:00' },
  { args: ['9PM'], description: 'Invert: hour-only AM/PM input', expected: '21:00' },
  { args: ['21'], description: 'Invert: hour-only 24-hour input', expected: '9:00 PM' },
  { args: ['12:05AM'], description: 'Invert: midnight hour pads to 00', expected: '00:05' },
  { args: ['00'], description: 'Invert: 24-hour midnight to AM/PM', expected: '12:00 AM' },
  { args: ['21:00:30'], description: 'Invert: seconds preserved', expected: '9:00:30 PM' },
  { args: ['13.10.15'], description: 'Invert: dot separators', expected: '1:10:15 PM' },
  { args: ['12AM', '1PM', '30m'], description: 'Difference plus a time expression', expected: '13h 30m 0s' },
  { args: ['12AM', '1PM', '-30m'], description: 'Difference minus a time expression', expected: '12h 30m 0s' },
  { args: ['12AM', '1PM', '1h', '+5m'], description: 'Difference with multiple adjustments', expected: '14h 5m 0s' },
  { args: ['12AM', '1PM', '-14h'], description: 'Negative adjusted difference wraps', expected: '23h 0m 0s' },
  { args: ['12AM', '1PM', '1d'], description: 'Difference plus a day', expected: '37h 0m 0s' },
  { args: ['3:15PM', '15m'], description: 'Offset: 15m before 3:15PM (past default)', expected: '3:00 PM' },
  { args: ['3:15pm', '+15m'], description: 'Offset: +15m after 3:15pm (implicit math)', expected: '3:30 PM' },
  { args: ['-f', '3:15PM', '15m'], description: 'Offset: 15m after 3:15PM (future mode)', expected: '3:30 PM' },
  { args: ['3:15PM', '1h', '30m'], description: 'Offset: multiple expressions', expected: '1:45 PM' },
  { args: ['12:10AM', '15m'], description: 'Offset: wraps backward past midnight', expected: '11:55 PM' },
  { args: ['3:15:30PM', '+45s'], description: 'Offset: seconds shown when non-zero', expected: '3:16:15 PM' },
  { args: ['3:15', 'PM', '15m'], description: 'Offset: AM/PM as a separate argument', expected: '3:00 PM' },
  { args: ['-s', '13.10.15'], description: 'Set the override with dot separators', expected: 'Current time set to 1:10:15 PM' },
  { args: ['-s', '1:10:15PM'], description: 'Set the current time override', expected: 'Current time set to 1:10:15 PM' },
  { args: ['-c'], description: 'Show current time (AM/PM clock)', expected: '1:10:15 PM' },
  { args: ['-c', '12'], description: 'Show current time (explicit 12)', expected: '1:10:15 PM' },
  { args: ['-c', '24'], description: 'Show current time (24-hour clock)', expected: '13:10:15' },
  { args: ['-s', 'clear'], description: 'Clear the current time override', expected: 'Current time override cleared. Using system time.' }
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

    if (test.expected && output !== test.expected) {
      console.log(`Expected: ${test.expected}`);
      console.log('Status: ✗ FAILED\n');
      failed++;
    } else {
      console.log('Status: ✓ PASSED\n');
      passed++;
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log('Status: ✗ FAILED\n');
    failed++;
  }
});

// Remove the isolated test config file
try {
  fs.unlinkSync(process.env.TIMECAL_CONFIG);
} catch (error) {
  // Nothing to clean up
}

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
