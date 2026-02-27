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
