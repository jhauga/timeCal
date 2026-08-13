/**
 * TimeCal Programmatic API
 * Exposes the parser, calculator, and formatter modules along with
 * convenience helpers for use in Node.js scripts.
 */

const { parseArguments } = require('./parser');
const { calculate } = require('./calculator');
const { formatOutput } = require('./formatter');

/**
 * Run the full TimeCal pipeline on an array of CLI-style arguments
 * @param {string[]} args - Arguments as they would be passed on the command line
 * @returns {string} Formatted output string
 * @throws {Error} When arguments are invalid
 *
 * @example
 * timecal(['5d']);                       // "02-22-2026 Saturday"
 * timecal(['12:10:00AM', '1:25:25PM']);  // "13h 15m 25s"
 */
function timecal(args) {
  const parsed = parseArguments(args);
  const result = calculate(parsed);
  return formatOutput(result);
}

/**
 * Calculate the difference between two clock times, or invert the clock
 * format of a single clock time
 * @param {string} start - Clock time (e.g., "12:10:00AM", "13:35:10", "1PM")
 * @param {string} [end] - Optional second clock time; when omitted, `start`
 *   is converted to the opposite clock format (24-hour to AM/PM or back)
 * @returns {string} Formatted duration or inverted clock time
 * @throws {Error} When a clock time is invalid
 *
 * @example
 * diff('12:10:00AM', '1:25:25PM');  // "13h 15m 25s"
 * diff('21:00');                    // "9:00 PM"
 * diff('9:00PM');                   // "21:00"
 */
function diff(start, end) {
  const args = end === undefined ? [start] : [start, end];
  return timecal(args);
}

module.exports = {
  parseArguments,
  calculate,
  formatOutput,
  timecal,
  diff
};
