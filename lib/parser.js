/**
 * Argument Parser for TimeCal
 * Parses command-line arguments and validates input
 */

const HELP_TEXT = `
timecal - Calculate dates and times relative to the current moment

USAGE:
  timecal [options] <time_expression>

OPTIONS:
  -h, --help      Display this help message
  -f, --future    Calculate time in the future (default: past)
  -p, --past      Calculate time in the past (default)
  -m, --math      Use mathematical expressions with + and - operators

TIME UNITS:
  s  - seconds
  m  - minutes
  h  - hours
  d  - days
  w  - weeks
  M  - months
  y  - years
  q  - quarters (3 months)

CONSTANT FLAGS:
  lm - last month       nm - next month
  lw - last week        nw - next week
  ly - last year        ny - next year
  lq - last quarter     nq - next quarter

EXAMPLES:
  timecal 17h                    # Time 17 hours ago
  timecal -f 5d                  # Date 5 days in the future
  timecal 0.5d 83m               # 12 hours and 83 minutes ago
  timecal -m +17h + 9m           # 17 hours and 9 minutes in the future
  timecal -m -20h - 2d           # 20 hours and 2 days in the past
  timecal lm                     # Last month's date
  timecal --future nm            # Next month's date

OUTPUT FORMATS:
  < 24 hours:     1:10 AM, 11:34 PM
  >= 24 hours:    02-27-2026 Thursday 1:10 AM (if time units included)
  No time units:  02-27-2026 Thursday

For more information, visit: https://github.com/jhauga/timeCal
`;

const TIME_UNITS = ['s', 'm', 'h', 'd', 'w', 'M', 'y', 'q'];
const CONSTANT_FLAGS = ['lm', 'lw', 'ly', 'lq', 'nm', 'nw', 'ny', 'nq'];
const PAST_FLAGS = ['lm', 'lw', 'ly', 'lq'];
const FUTURE_FLAGS = ['nm', 'nw', 'ny', 'nq'];

/**
 * Parse command-line arguments
 * @param {string[]} args - Command-line arguments
 * @returns {Object} Parsed arguments object
 */
function parseArguments(args) {
  // Handle help flag
  if (args.length === 0 || args.includes('-h') || args.includes('--help') || args.includes('/?')) {
    console.log(HELP_TEXT);
    process.exit(0);
  }

  const result = {
    mode: 'past', // default mode
    mathMode: false,
    expressions: [],
    hasTimeUnits: false
  };

  let i = 0;
  while (i < args.length) {
    const arg = args[i];

    // Check for mode flags
    if (arg === '-f' || arg === '--future') {
      result.mode = 'future';
      i++;
      continue;
    }

    if (arg === '-p' || arg === '--past') {
      result.mode = 'past';
      i++;
      continue;
    }

    if (arg === '-m' || arg === '--math') {
      result.mathMode = true;
      i++;
      continue;
    }

    // Check for operators in math mode
    if (arg === '+' || arg === '-') {
      const nextArg = args[i + 1];
      if (nextArg) {
        const parsed = parseTimeExpression(nextArg);
        if (parsed) {
          parsed.operator = arg;
          result.expressions.push(parsed);
          if (['s', 'm', 'h'].includes(parsed.unit)) {
            result.hasTimeUnits = true;
          }
          i += 2;
          continue;
        }
      }
    }

    // Check for constant flags
    if (CONSTANT_FLAGS.includes(arg)) {
      const parsed = parseConstantFlag(arg);
      result.expressions.push(parsed);
      
      // Auto-detect mode from constant flag if not explicitly set via flag
      if (!args.includes('-f') && !args.includes('--future') && 
          !args.includes('-p') && !args.includes('--past')) {
        if (FUTURE_FLAGS.includes(arg)) {
          result.mode = 'future';
        } else if (PAST_FLAGS.includes(arg)) {
          result.mode = 'past';
        }
      }
      
      // Suggest correct flag if user used wrong one
      if (result.mode === 'past' && FUTURE_FLAGS.includes(arg)) {
        const suggestion = getFlagSuggestion(arg, 'past');
        throw new Error(`Invalid past flag "${arg}". Did you mean "${suggestion}"?`);
      }
      if (result.mode === 'future' && PAST_FLAGS.includes(arg)) {
        const suggestion = getFlagSuggestion(arg, 'future');
        throw new Error(`Invalid future flag "${arg}". Did you mean "${suggestion}"?`);
      }
      
      i++;
      continue;
    }

    // Parse time expression (e.g., 17h, 0.5d, -17h, +5m)
    const parsed = parseTimeExpression(arg);
    if (parsed) {
      // Check if expression starts with + or - (implicit math mode)
      if (arg.startsWith('+') || arg.startsWith('-')) {
        result.mathMode = true;
        parsed.operator = arg[0];
      }
      
      result.expressions.push(parsed);
      
      // Track if we have time units (hours, minutes, seconds)
      if (['s', 'm', 'h'].includes(parsed.unit)) {
        result.hasTimeUnits = true;
      }
      
      i++;
      continue;
    }

    // Unknown argument
    throw new Error(`Unknown argument: "${arg}". Use -h or --help for usage information.`);
  }

  // Validate that we have at least one expression
  if (result.expressions.length === 0) {
    throw new Error('No time expression provided. Use -h or --help for usage information.');
  }

  return result;
}

/**
 * Parse a time expression (e.g., "17h", "0.5d", "+5m", "-10d")
 * @param {string} expr - Time expression string
 * @returns {Object|null} Parsed expression object or null if invalid
 */
function parseTimeExpression(expr) {
  // Match pattern: optional +/-, number (int or decimal), unit letter
  const match = expr.match(/^([+-])?(\d+(?:\.\d+)?)(s|m|h|d|w|M|y|q)$/);
  
  if (!match) {
    return null;
  }

  const [, sign, value, unit] = match;
  
  return {
    value: parseFloat(value),
    unit: unit,
    operator: sign || null
  };
}

/**
 * Parse a constant flag (e.g., "lm", "nw")
 * @param {string} flag - Constant flag string
 * @returns {Object} Parsed constant flag object
 */
function parseConstantFlag(flag) {
  const flagMap = {
    'lm': { value: 1, unit: 'M', constant: true },
    'lw': { value: 1, unit: 'w', constant: true },
    'ly': { value: 1, unit: 'y', constant: true },
    'lq': { value: 1, unit: 'q', constant: true },
    'nm': { value: 1, unit: 'M', constant: true },
    'nw': { value: 1, unit: 'w', constant: true },
    'ny': { value: 1, unit: 'y', constant: true },
    'nq': { value: 1, unit: 'q', constant: true }
  };

  return flagMap[flag];
}

/**
 * Get suggestion for wrong flag based on mode
 * @param {string} flag - The incorrect flag used
 * @param {string} mode - The current mode ('past' or 'future')
 * @returns {string} Suggested flag
 */
function getFlagSuggestion(flag, mode) {
  if (mode === 'past') {
    const map = { 'nm': 'lm', 'nw': 'lw', 'ny': 'ly', 'nq': 'lq' };
    return map[flag] || flag;
  } else {
    const map = { 'lm': 'nm', 'lw': 'nw', 'ly': 'ny', 'lq': 'nq' };
    return map[flag] || flag;
  }
}

module.exports = {
  parseArguments
};
