/**
 * Argument Parser for TimeCal
 * Parses command-line arguments and validates input
 */

const HELP_TEXT = `
timecal - Calculate dates and times relative to the current moment

USAGE:
  timecal [options] <time_expression>

OPTIONS:
  -h, --help         Display this help message
  -f, --future       Calculate time in the future (default: past)
  -p, --past         Calculate time in the past (default)
  -m, --math         Use mathematical expressions with + and - operators
  -c, --current      Show the current time. Optional argument: 12 (default,
                     AM/PM clock) or 24 (24-hour clock)
  -s, --set-current  Change the current time used by clock-time features.
                     Accepts H:M, H:M:S, H:M[AM|PM], or H:M:S[AM|PM];
                     pass "clear" to return to the system time.
                     Stored in the tool's JSON config file (.timecal.json
                     in your home directory, or the path in the
                     TIMECAL_CONFIG environment variable)

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

CLOCK TIMES:
  Pass clock times (H:M:S with optional AM/PM) to work with clock values.
  Two clock times: the duration from the first to the second (wrapping
  past midnight if needed); mixed-in time expressions adjust the duration
  (unsigned or + adds, - subtracts).
  One clock time with time expressions: the clock time is shifted as if
  it were the current time (past by default, -f or +/- for other
  directions).
  One clock time alone: converted to the opposite clock format
  (24-hour to AM/PM, or AM/PM to 24-hour).

  Clock time syntax:  H | H:M | H:M:S  with optional AM/PM suffix
                      (24-hour format when AM/PM is omitted)
                      Separators: ":" or "." (13:10:15 and 13.10.15
                      are equivalent)
                      AM/PM may follow as a separate word (9:00 PM)

EXAMPLES:
  timecal 17h                    # Time 17 hours ago
  timecal -f 5d                  # Date 5 days in the future
  timecal 0.5d 83m               # 12 hours and 83 minutes ago
  timecal -m +17h + 9m           # 17 hours and 9 minutes in the future
  timecal -m -20h - 2d           # 20 hours and 2 days in the past
  timecal lm                     # Last month's date
  timecal --future nm            # Next month's date
  timecal 12:10:00AM 1:25:25PM   # Difference: 13h 15m 25s
  timecal 00:10:00 13:35:10      # Difference: 13h 25m 10s
  timecal 12AM 1PM               # Difference: 13h 0m 0s
  timecal 12AM 1PM 30m           # Difference plus 30 minutes: 13h 30m 0s
  timecal 12AM 1PM -30m          # Difference minus 30 minutes: 12h 30m 0s
  timecal 3:15PM 15m             # Shift: 3:00 PM (3:30 PM with +15m)
  timecal 21:00                  # Invert format: 9:00 PM
  timecal 9:00PM                 # Invert format: 21:00
  timecal -c                     # Current time as AM/PM clock
  timecal -c 24                  # Current time as 24-hour clock
  timecal -s 1:10:15PM           # Set the current time used
  timecal -s clear               # Return to the system time

OUTPUT FORMATS:
  < 24 hours:     1:10 AM, 11:34 PM
  >= 24 hours:    02-27-2026 Thursday 1:10 AM (if time units included)
  No time units:  02-27-2026 Thursday
  Difference:     13h 15m 25s

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
    clockTimes: [],
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

    // Current time display, with optional clock format argument (12 or 24)
    if (arg === '-c' || arg === '--current') {
      result.mode = 'current';
      result.clockFormat = '12';
      const nextArg = args[i + 1];
      if (nextArg === '12' || nextArg === '24') {
        result.clockFormat = nextArg;
        i += 2;
      } else {
        i++;
      }
      continue;
    }

    // Set (or clear) the current time override stored in the config file
    if (arg === '-s' || arg === '--set-current') {
      const nextArg = args[i + 1];
      if (nextArg === undefined) {
        throw new Error('The -s option requires a clock time (H:M, H:M:S, with optional AM/PM) or "clear".');
      }
      if (nextArg === 'clear' || nextArg === 'now') {
        result.mode = 'clear-current';
        i += 2;
        continue;
      }
      const setTime = parseClockTime(nextArg);
      if (!setTime || !/[:.]/.test(nextArg)) {
        throw new Error(`Invalid clock time "${nextArg}" for -s. Accepted formats: H:M, H:M:S, H:M[AM|PM], H:M:S[AM|PM].`);
      }
      result.mode = 'set-current';
      result.setTime = setTime;
      i += 2;
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

    // Standalone AM/PM attaches to the preceding clock time (e.g., "9:00 PM")
    if (/^(am|pm)$/i.test(arg)) {
      const lastClockTime = result.clockTimes[result.clockTimes.length - 1];
      if (!lastClockTime || lastClockTime.hasMeridiem) {
        throw new Error(`Standalone "${arg}" must follow a clock time without AM/PM. Use -h or --help for usage information.`);
      }
      if (lastClockTime.hours === 0 || lastClockTime.hours > 12) {
        throw new Error(`Cannot apply "${arg}" to an hour outside 1-12. Use -h or --help for usage information.`);
      }
      const isPM = arg.toLowerCase() === 'pm';
      if (lastClockTime.hours === 12) {
        lastClockTime.hours = isPM ? 12 : 0;
      } else if (isPM) {
        lastClockTime.hours += 12;
      }
      lastClockTime.hasMeridiem = true;
      i++;
      continue;
    }

    // Parse clock time (e.g., 12:10:00AM, 13:35:10, 1PM, 00) for difference mode
    const clockTime = parseClockTime(arg);
    if (clockTime) {
      result.clockTimes.push(clockTime);
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

  // Config-backed modes take no other time input
  if (result.mode === 'current' || result.mode === 'set-current' || result.mode === 'clear-current') {
    if (result.expressions.length > 0 || result.clockTimes.length > 0) {
      throw new Error('The -c and -s options cannot be combined with other time input. Use -h or --help for usage information.');
    }
    return result;
  }

  // Clock times switch the parser into difference, offset, or invert mode.
  // Two clock times: time expressions adjust the resulting duration.
  // One clock time with time expressions: the clock time acts as a
  // temporary current time and the expressions shift it.
  // One clock time alone: convert to the opposite clock format.
  if (result.clockTimes.length > 0) {
    if (result.clockTimes.length > 2) {
      throw new Error('Time difference accepts at most two clock times. Use -h or --help for usage information.');
    }
    if (result.clockTimes.length === 1 && result.expressions.length > 0) {
      result.direction = result.mode; // past (default) or future
      result.mode = 'offset';
    } else if (result.clockTimes.length === 1) {
      result.mode = 'invert';
    } else {
      result.mode = 'diff';
    }
    return result;
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
 * Parse a clock time (e.g., "12:10:00AM", "13:35:10", "13.35.10", "1PM", "00")
 * Accepts H, H:M, or H:M:S with an optional AM/PM suffix.
 * Both ":" and "." work as separators between the parts.
 * Hours are 1-12 with AM/PM, 0-23 without (24-hour format).
 * @param {string} expr - Clock time string
 * @returns {Object|null} Object with hours, minutes, seconds (24-hour) or null if invalid
 */
function parseClockTime(expr) {
  const match = expr.match(/^(\d{1,2})(?:[:.](\d{1,2})(?:[:.](\d{1,2}))?)?(am|pm)?$/i);

  if (!match) {
    return null;
  }

  const [, hourStr, minuteStr, secondStr, meridiem] = match;
  let hours = parseInt(hourStr, 10);
  const minutes = minuteStr === undefined ? 0 : parseInt(minuteStr, 10);
  const seconds = secondStr === undefined ? 0 : parseInt(secondStr, 10);

  if (minutes > 59 || seconds > 59) {
    return null;
  }

  if (meridiem) {
    // 12-hour format: hour must be 1-12; 12AM is midnight, 12PM is noon
    if (hours < 1 || hours > 12) {
      return null;
    }
    const isPM = meridiem.toLowerCase() === 'pm';
    if (hours === 12) {
      hours = isPM ? 12 : 0;
    } else if (isPM) {
      hours += 12;
    }
  } else {
    // 24-hour format
    if (hours > 23) {
      return null;
    }
  }

  return {
    hours,
    minutes,
    seconds,
    hasMeridiem: meridiem !== undefined,
    hasSeconds: secondStr !== undefined
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
