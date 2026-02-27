/**
 * Time Calculator for TimeCal
 * Performs date and time calculations relative to the current moment
 */

/**
 * Calculate time based on parsed arguments
 * @param {Object} parsed - Parsed arguments from parser
 * @returns {Object} Result object with calculated date and metadata
 */
function calculate(parsed) {
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
