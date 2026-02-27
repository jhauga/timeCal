#!/usr/bin/env node

/**
 * TimeCal - Command-line time calculator
 * Calculates dates and times relative to the current moment
 */

const { parseArguments } = require('../lib/parser');
const { calculate } = require('../lib/calculator');
const { formatOutput } = require('../lib/formatter');

// Main execution
function main() {
  try {
    const args = process.argv.slice(2);
    
    // Parse command-line arguments
    const parsed = parseArguments(args);
    
    // Perform calculation
    const result = calculate(parsed);
    
    // Format and display output
    const output = formatOutput(result);
    console.log(output);
    
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

main();
