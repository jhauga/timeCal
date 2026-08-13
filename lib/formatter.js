/**
 * Output Formatter for TimeCal
 * Formats calculated dates and times for display
 */

/**
 * Format the calculated result for output
 * @param {Object} result - Result object from calculator
 * @returns {string} Formatted output string
 */
function formatOutput(result) {
  // Difference mode outputs a duration instead of a date or time
  if (result.isDuration) {
    return formatDuration(result.durationSeconds);
  }

  // Current time display (-c option)
  if (result.isClockTime) {
    return formatClockTime(result.time, result.clockFormat);
  }

  // Offset mode outputs the shifted clock time
  if (result.isOffsetTime) {
    return formatOffsetTime(result.time);
  }

  // Invert mode outputs the clock time in the opposite format
  if (result.isInvertedTime) {
    return formatInvertedTime(result);
  }

  // Confirmation messages for the current time override (-s option)
  if (result.isConfirmation) {
    if (result.action === 'set') {
      return `Current time set to ${formatClockTime(result.time, '12')}`;
    }
    return 'Current time override cleared. Using system time.';
  }

  const { date, hasTimeUnits, isUnder24Hours } = result;

  if (isUnder24Hours) {
    // Output time only for differences under 24 hours
    return formatTime(date);
  } else {
    // Output date and optionally time for differences 24 hours or more
    if (hasTimeUnits) {
      return `${formatDate(date)} ${formatDayOfWeek(date)} ${formatTime(date)}`;
    } else {
      return `${formatDate(date)} ${formatDayOfWeek(date)}`;
    }
  }
}

/**
 * Format a duration as hours, minutes, and seconds
 * @param {number} totalSeconds - Duration in seconds
 * @returns {string} Formatted duration (e.g., "13h 15m 25s")
 */
function formatDuration(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
}

/**
 * Format an inverted clock time in the opposite format from its input
 * A 24-hour input renders as an AM/PM clock; an AM/PM input renders as a
 * 24-hour clock. Seconds appear only when the input included them.
 * @param {Object} result - Result with time, targetFormat, and includeSeconds
 * @returns {string} Formatted clock time (e.g., "9:00 PM" or "21:00")
 */
function formatInvertedTime(result) {
  const { time, targetFormat, includeSeconds } = result;
  const pad = (n) => n.toString().padStart(2, '0');
  const secondsPart = includeSeconds ? `:${pad(time.seconds)}` : '';

  if (targetFormat === '24') {
    return `${pad(time.hours)}:${pad(time.minutes)}${secondsPart}`;
  }

  const ampm = time.hours >= 12 ? 'PM' : 'AM';
  let hours = time.hours % 12;
  hours = hours ? hours : 12; // 0 should be 12

  return `${hours}:${pad(time.minutes)}${secondsPart} ${ampm}`;
}

/**
 * Format a shifted clock time in 12-hour format
 * Seconds are omitted when zero to match the tool's time output style.
 * @param {Object} time - Object with hours, minutes, seconds (24-hour)
 * @returns {string} Formatted clock time (e.g., "3:00 PM" or "3:16:15 PM")
 */
function formatOffsetTime(time) {
  if (time.seconds !== 0) {
    return formatClockTime(time, '12');
  }

  const ampm = time.hours >= 12 ? 'PM' : 'AM';
  let hours = time.hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  const minutesStr = time.minutes.toString().padStart(2, '0');

  return `${hours}:${minutesStr} ${ampm}`;
}

/**
 * Format a clock time with seconds in 12-hour or 24-hour format
 * @param {Object} time - Object with hours, minutes, seconds (24-hour)
 * @param {string} clockFormat - "12" for AM/PM clock, "24" for 24-hour clock
 * @returns {string} Formatted clock time (e.g., "1:10:15 PM" or "13:10:15")
 */
function formatClockTime(time, clockFormat) {
  const pad = (n) => n.toString().padStart(2, '0');

  if (clockFormat === '24') {
    return `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`;
  }

  const ampm = time.hours >= 12 ? 'PM' : 'AM';
  let hours = time.hours % 12;
  hours = hours ? hours : 12; // 0 should be 12

  return `${hours}:${pad(time.minutes)}:${pad(time.seconds)} ${ampm}`;
}

/**
 * Format time in 12-hour format with AM/PM
 * @param {Date} date - Date object
 * @returns {string} Formatted time (e.g., "1:10 AM", "11:34 PM")
 */
function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  
  // Format minutes with leading zero if needed
  const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();
  
  return `${hours}:${minutesStr} ${ampm}`;
}

/**
 * Format date as MM-DD-YYYY
 * @param {Date} date - Date object
 * @returns {string} Formatted date (e.g., "02-27-2026")
 */
function formatDate(date) {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${month}-${day}-${year}`;
}

/**
 * Get day of week name
 * @param {Date} date - Date object
 * @returns {string} Day name (e.g., "Monday", "Friday")
 */
function formatDayOfWeek(date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

module.exports = {
  formatOutput
};
