/**
 * Time Calculator for TimeCal
 * Performs date and time calculations relative to the current moment
 */

const config = require('./config');

/**
 * Calculate time based on parsed arguments
 * @param {Object} parsed - Parsed arguments from parser
 * @returns {Object} Result object with calculated date and metadata
 */
function calculate(parsed) {
  // Difference mode: compute duration between clock times
  if (parsed.mode === 'diff') {
    return calculateDifference(parsed);
  }

  // Offset mode: shift a single clock time by the time expressions
  if (parsed.mode === 'offset') {
    return calculateOffset(parsed);
  }

  // Invert mode: convert a single clock time to the opposite clock format
  if (parsed.mode === 'invert') {
    const clockTime = parsed.clockTimes[0];
    return {
      isInvertedTime: true,
      time: { hours: clockTime.hours, minutes: clockTime.minutes, seconds: clockTime.seconds },
      targetFormat: clockTime.hasMeridiem ? '24' : '12',
      includeSeconds: clockTime.hasSeconds,
      mode: 'invert'
    };
  }

  // Current time display, honoring any stored override
  if (parsed.mode === 'current') {
    return {
      isClockTime: true,
      time: config.getCurrentTime(),
      clockFormat: parsed.clockFormat
    };
  }

  // Store or clear the current time override in the config file
  if (parsed.mode === 'set-current') {
    config.setCurrentTime(parsed.setTime);
    return { isConfirmation: true, action: 'set', time: parsed.setTime };
  }

  if (parsed.mode === 'clear-current') {
    config.clearCurrentTime();
    return { isConfirmation: true, action: 'clear' };
  }

  const now = new Date();
  let resultDate = new Date(now);

  // Process expressions
  if (parsed.mathMode) {
    // Math mode: process each expression with its operator
    for (const expr of parsed.expressions) {
      const milliseconds = convertToMilliseconds(expr.value, expr.unit);
      const operator = expr.operator || '+';
      
      if (operator === '+') {
        resultDate = new Date(resultDate.getTime() + milliseconds);
      } else if (operator === '-') {
        resultDate = new Date(resultDate.getTime() - milliseconds);
      }
    }
  } else {
    // Normal mode: sum all expressions and apply based on mode
    let totalMilliseconds = 0;
    
    for (const expr of parsed.expressions) {
      totalMilliseconds += convertToMilliseconds(expr.value, expr.unit);
    }
    
    if (parsed.mode === 'future') {
      resultDate = new Date(now.getTime() + totalMilliseconds);
    } else {
      resultDate = new Date(now.getTime() - totalMilliseconds);
    }
  }

  // Calculate time difference for formatting decisions
  const timeDiff = Math.abs(resultDate.getTime() - now.getTime());
  const hoursDiff = timeDiff / (1000 * 60 * 60);

  return {
    date: resultDate,
    hasTimeUnits: parsed.hasTimeUnits,
    isUnder24Hours: hoursDiff < 24,
    mode: parsed.mode,
    mathMode: parsed.mathMode
  };
}

/**
 * Calculate the duration between two clock times
 * Measures from the first clock time to the second.
 * A negative span wraps past midnight (e.g., 11PM to 7AM is 8h 0m 0s).
 * Time expressions mixed in with the clock times adjust the duration:
 * an unsigned or + expression adds, a - expression subtracts.
 * @param {Object} parsed - Parsed arguments with clockTimes and expressions
 * @returns {Object} Result object with duration in seconds
 */
function calculateDifference(parsed) {
  const DAY_SECONDS = 24 * 60 * 60;
  const toSecondsOfDay = (t) => t.hours * 3600 + t.minutes * 60 + t.seconds;
  const clockTimes = parsed.clockTimes;

  const startSeconds = toSecondsOfDay(clockTimes[0]);
  const endSeconds = toSecondsOfDay(clockTimes[1]);

  let durationSeconds = endSeconds - startSeconds;
  if (durationSeconds < 0) {
    durationSeconds += DAY_SECONDS;
  }

  // Apply mixed-in time expression adjustments to the duration
  for (const expr of parsed.expressions) {
    const adjustSeconds = convertToMilliseconds(expr.value, expr.unit) / 1000;
    durationSeconds += expr.operator === '-' ? -adjustSeconds : adjustSeconds;
  }
  durationSeconds = Math.round(durationSeconds);

  // A negative adjusted duration wraps back within a 24-hour clock
  while (durationSeconds < 0) {
    durationSeconds += DAY_SECONDS;
  }

  return {
    isDuration: true,
    durationSeconds: durationSeconds,
    mode: 'diff'
  };
}

/**
 * Shift a single clock time by the mixed-in time expressions
 * The clock time acts as a temporary current time: expressions move it
 * into the past (default) or future, mirroring the tool's date modes.
 * In math mode (explicit -m or +/- prefixed expressions), each expression
 * applies its own operator instead. The result wraps within a 24-hour
 * clock and is displayed as a clock time.
 * @param {Object} parsed - Parsed arguments with one clock time and expressions
 * @returns {Object} Result object with the shifted clock time
 */
function calculateOffset(parsed) {
  const DAY_SECONDS = 24 * 60 * 60;
  const base = parsed.clockTimes[0];
  const baseSeconds = base.hours * 3600 + base.minutes * 60 + base.seconds;

  let offsetSeconds = 0;
  if (parsed.mathMode) {
    for (const expr of parsed.expressions) {
      const seconds = convertToMilliseconds(expr.value, expr.unit) / 1000;
      offsetSeconds += expr.operator === '-' ? -seconds : seconds;
    }
  } else {
    for (const expr of parsed.expressions) {
      offsetSeconds += convertToMilliseconds(expr.value, expr.unit) / 1000;
    }
    if (parsed.direction !== 'future') {
      offsetSeconds = -offsetSeconds;
    }
  }

  let resultSeconds = Math.round(baseSeconds + offsetSeconds) % DAY_SECONDS;
  if (resultSeconds < 0) {
    resultSeconds += DAY_SECONDS;
  }

  return {
    isOffsetTime: true,
    time: {
      hours: Math.floor(resultSeconds / 3600),
      minutes: Math.floor((resultSeconds % 3600) / 60),
      seconds: resultSeconds % 60
    },
    mode: 'offset'
  };
}

/**
 * Convert time value and unit to milliseconds
 * @param {number} value - Numeric value
 * @param {string} unit - Time unit (s, m, h, d, w, M, y, q)
 * @returns {number} Time in milliseconds
 */
function convertToMilliseconds(value, unit) {
  const SECOND = 1000;
  const MINUTE = SECOND * 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;
  const WEEK = DAY * 7;
  const MONTH = DAY * 30.44; // Average month length
  const YEAR = DAY * 365.25; // Account for leap years
  const QUARTER = MONTH * 3;

  const unitMap = {
    's': SECOND,
    'm': MINUTE,
    'h': HOUR,
    'd': DAY,
    'w': WEEK,
    'M': MONTH,
    'y': YEAR,
    'q': QUARTER
  };

  const multiplier = unitMap[unit];
  if (!multiplier) {
    throw new Error(`Unknown time unit: ${unit}`);
  }

  return value * multiplier;
}

module.exports = {
  calculate
};
