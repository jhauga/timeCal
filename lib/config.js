/**
 * Configuration for TimeCal
 * Reads and writes the tool's JSON config file, which stores the
 * current time override used by clock-time features.
 *
 * The config file lives at .timecal.json in the user's home directory
 * by default. Set the TIMECAL_CONFIG environment variable to use a
 * different file path.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

/**
 * Get the path of the config file
 * @returns {string} Absolute path to the JSON config file
 */
function getConfigPath() {
  return process.env.TIMECAL_CONFIG || path.join(os.homedir(), '.timecal.json');
}

/**
 * Load the config file
 * @returns {Object} Parsed config object, or an empty object if the file
 *   does not exist or cannot be parsed
 */
function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(getConfigPath(), 'utf8'));
  } catch (error) {
    return {};
  }
}

/**
 * Save the config file
 * @param {Object} config - Config object to write
 * @throws {Error} When the file cannot be written
 */
function saveConfig(config) {
  try {
    fs.writeFileSync(getConfigPath(), JSON.stringify(config, null, 2) + '\n');
  } catch (error) {
    throw new Error(`Unable to write config file "${getConfigPath()}": ${error.message}`);
  }
}

/**
 * Get the current time used by clock-time features
 * Returns the stored override when one is set, otherwise the system time.
 * @returns {Object} Object with hours, minutes, seconds (24-hour)
 */
function getCurrentTime() {
  const override = loadConfig().currentTime;

  if (isValidTime(override)) {
    return { hours: override.hours, minutes: override.minutes, seconds: override.seconds };
  }

  const now = new Date();
  return { hours: now.getHours(), minutes: now.getMinutes(), seconds: now.getSeconds() };
}

/**
 * Store a current time override in the config file
 * @param {Object} time - Object with hours, minutes, seconds (24-hour)
 */
function setCurrentTime(time) {
  const config = loadConfig();
  config.currentTime = { hours: time.hours, minutes: time.minutes, seconds: time.seconds };
  saveConfig(config);
}

/**
 * Remove the current time override so the system time is used again
 */
function clearCurrentTime() {
  const config = loadConfig();
  delete config.currentTime;
  saveConfig(config);
}

/**
 * Check that a stored time object is well formed
 * @param {*} time - Candidate time object
 * @returns {boolean} True if the object holds a valid 24-hour time
 */
function isValidTime(time) {
  return Boolean(time) &&
    Number.isInteger(time.hours) && time.hours >= 0 && time.hours <= 23 &&
    Number.isInteger(time.minutes) && time.minutes >= 0 && time.minutes <= 59 &&
    Number.isInteger(time.seconds) && time.seconds >= 0 && time.seconds <= 59;
}

module.exports = {
  getConfigPath,
  getCurrentTime,
  setCurrentTime,
  clearCurrentTime
};
