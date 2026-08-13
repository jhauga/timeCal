# TimeCal Examples

This file contains examples of how to use the TimeCal command-line tool.

## Installation Test

After installing TimeCal globally with `npm install -g @jhauga/timecal`, you can test with these commands:

## Basic Examples

### Past Calculations (Default)

```bash
# Get the time 5 hours ago
timecal 5h

# Get the date 7 days ago
timecal 7d

# Get the date from last month
timecal lm

# Get the time 30 minutes ago
timecal 30m

# Combined: 2 days and 5 hours ago
timecal 2d 5h
```

### Future Calculations

```bash
# Get the time 3 hours from now
timecal -f 3h

# Get the date 10 days from now
timecal -f 10d

# Get the date for next month
timecal --future nm

# Combined: 1 week and 12 hours from now
timecal -f 1w 12h
```

### Math Mode

```bash
# Add 5 hours and 30 minutes from now
timecal -m +5h + 30m

# Subtract 3 days and 2 hours from now
timecal -m -3d - 2h

# Complex calculation
timecal -m +2w + 3d - 5h

# Implicit math mode (starts with + or -)
timecal +12h
timecal -3d
```

## Advanced Examples

### Decimal Values

```bash
# Half a day ago (12 hours)
timecal 0.5d

# One and a half hours ago
timecal 1.5h

# Quarter of a year in the future
timecal -f 0.25y
```

### Multiple Units

```bash
# Exactly 2 weeks, 3 days, and 4 hours ago
timecal 2w 3d 4h

# 1 month, 2 weeks, and 30 minutes ago
timecal 1M 2w 30m

# Future: 6 months and 15 days from now
timecal -f 6M 15d
```

### Quarters and Constant Flags

```bash
# Last quarter (3 months ago)
timecal lq

# Next quarter (3 months from now)
timecal -f nq

# 2 quarters ago (6 months)
timecal 2q

# Last week
timecal lw

# Next year
timecal -f ny
```

## Time Difference Examples

### Two Clock Times

```bash
# Difference between two 12-hour clock times
timecal 12:10:00AM 1:25:25PM
# Output: 13h 15m 25s

# Hours and minutes only
timecal 12:00AM 1:00PM
# Output: 13h 0m 0s

# Hours only
timecal 12AM 1PM
# Output: 13h 0m 0s

# 24-hour format (no AM/PM)
timecal 00:10:00 13:35:10
# Output: 13h 25m 10s

timecal 00:00 13:10
# Output: 13h 10m 0s

timecal 00 13
# Output: 13h 0m 0s

# Mix 12-hour and 24-hour formats
timecal 12:10:00AM 13:25:25
# Output: 13h 15m 25s

timecal 00:10:00 1:25PM
# Output: 13h 15m 0s

# Second time earlier than the first wraps past midnight
timecal 11PM 7AM
# Output: 8h 0m 0s
```

### One Clock Time (Format Inversion)

A single clock time on its own converts to the opposite clock format.

```bash
# 24-hour input renders as an AM/PM clock
timecal 21:00
# Output: 9:00 PM

# AM/PM input renders as a 24-hour clock
timecal 9:00PM
# Output: 21:00

# AM/PM may be a separate word
timecal 9:00 PM
# Output: 21:00

# Seconds are preserved when given
timecal 21:00:30
# Output: 9:00:30 PM

# Midnight hour pads to 00
timecal 12:05AM
# Output: 00:05
```

### One Clock Time with Expressions (Time Shifting)

Time expressions mixed with a single clock time shift it, as if the clock
time were the current time.

```bash
# Unsigned expressions follow past mode by default
timecal 3:15PM 15m
# Output: 3:00 PM

# Signed expressions apply their own operators
timecal 3:15PM +15m
# Output: 3:30 PM

# Future mode shifts forward
timecal -f 3:15PM 15m
# Output: 3:30 PM

# The result wraps within a 24-hour clock
timecal 12:10AM 15m
# Output: 11:55 PM
```

### Adjusting a Difference with Time Expressions

Time expressions mixed with two clock times adjust the resulting duration.
An unsigned or `+` expression adds; a `-` expression subtracts.

```bash
# Add 30 minutes to the difference
timecal 12AM 1PM 30m
# Output: 13h 30m 0s

# Subtract 30 minutes from the difference
timecal 12AM 1PM -30m
# Output: 12h 30m 0s

# Multiple adjustments
timecal 12AM 1PM 1h +5m
# Output: 14h 5m 0s

# Day units work too
timecal 12AM 1PM 1d
# Output: 37h 0m 0s

# A negative adjusted duration wraps back within a 24-hour clock
timecal 12AM 1PM -14h
# Output: 23h 0m 0s
```

### Current Time Display and Override

```bash
# Show the current time (AM/PM clock, default)
timecal -c
# Output: 1:10:15 PM

# Show the current time as a 24-hour clock
timecal -c 24
# Output: 13:10:15

# Override the current time shown by -c
timecal -s 1:10:15PM
# Output: Current time set to 1:10:15 PM

# Return to the system time
timecal -s clear
# Output: Current time override cleared. Using system time.
```

### Time Difference Errors

```bash
# At most two clock times are allowed
timecal 12AM 1PM 3PM
# Error: Time difference accepts at most two clock times. Use -h or --help for usage information.

# The -s option validates its input
timecal -s 13
# Error: Invalid clock time "13" for -s. Accepted formats: H:M, H:M:S, H:M[AM|PM], H:M:S[AM|PM].

# The -c and -s options take no other time input
timecal -c 5h
# Error: The -c and -s options cannot be combined with other time input. Use -h or --help for usage information.
```

## Output Format Examples

### Less than 24 Hours (Time Only)

```bash
timecal 5h
# Output: 1:34 PM

timecal 23h
# Output: 11:34 PM

timecal -f 12h
# Output: 12:34 AM
```

### 24 Hours or More with Time Units

```bash
timecal 25h
# Output: 02-26-2026 Wednesday 5:34 PM

timecal 3d 5h
# Output: 02-24-2026 Tuesday 1:34 PM

timecal -f 2d 12h
# Output: 03-02-2026 Monday 12:34 AM
```

### 24 Hours or More without Time Units

```bash
timecal 7d
# Output: 02-20-2026 Friday

timecal 1M
# Output: 01-27-2026 Tuesday

timecal -f 2w
# Output: 03-13-2026 Friday
```

## Error Handling Examples

### Wrong Flag Suggestions

```bash
# Using a future flag in past mode (default)
timecal nm
# Error: Invalid past flag "nm". Did you mean "lm"?

# Using a past flag with future mode
timecal -f lm
# Error: Invalid future flag "lm". Did you mean "nm"?
```

### Invalid Input

```bash
# Invalid time unit
timecal 5x
# Error: Unknown argument: "5x". Use -h or --help for usage information.

# No time expression
timecal -f
# Error: No time expression provided. Use -h or --help for usage information.
```

## Practical Use Cases

### Project Deadlines

```bash
# What date is 3 weeks from now?
timecal -f 3w

# What was the date 2 months ago?
timecal 2M
```

### Time Tracking

```bash
# Started work 8.5 hours ago
timecal 8.5h

# Meeting in 45 minutes
timecal -f 45m
```

### Historical Dates

```bash
# What day was last quarter?
timecal lq

# What day was 6 months ago?
timecal 6M
```

### Complex Scheduling

```bash
# Event is 2 weeks, 3 days, and 6 hours away
timecal -f 2w 3d 6h

# Deadline was 1 month, 2 weeks, and 3 days ago
timecal 1M 2w 3d
```

## Help and Documentation

```bash
# Display help
timecal -h
timecal --help
timecal /?
```

## Programmatic Usage (Node.js)

If you want to use TimeCal in your Node.js scripts:

```javascript
const { timecal, diff } = require('@jhauga/timecal');

// Calculate 5 days ago
console.log(`5 days ago was: ${timecal(['5d'])}`);

// Calculate with multiple units
console.log(`2 weeks, 3 days, and 12 hours from now: ${timecal(['-f', '2w', '3d', '12h'])}`);

// Difference between two clock times
console.log(diff('12:10:00AM', '1:25:25PM')); // "13h 15m 25s"

// Invert the clock format of a single clock time
console.log(diff('21:00'));                   // "9:00 PM"
```

The lower-level pipeline modules are also available:

```javascript
const { parseArguments, calculate, formatOutput } = require('@jhauga/timecal');

const parsed = parseArguments(['5d']);
const result = calculate(parsed);
const output = formatOutput(result);

console.log(`5 days ago was: ${output}`);
```

## Tips and Tricks

1. **Decimal precision**: Use decimals for precise calculations
   ```bash
   timecal 2.5h  # 2 hours and 30 minutes
   ```

2. **Quick past/future**: Use +/- prefix for quick math mode
   ```bash
   timecal +5h   # 5 hours in the future
   timecal -3d   # 3 days in the past
   ```

3. **Constant flags**: Remember the pattern
   - `l` prefix = last (past)
   - `n` prefix = next (future)
   - `m, w, y, q` = month, week, year, quarter

4. **Combine units**: Mix and match any combination
   ```bash
   timecal 1y 2M 3w 4d 5h 6m 7s
   ```

## Common Gotchas

1. **Capital M for months**: Use `M` (uppercase) for months, `m` (lowercase) for minutes
   ```bash
   timecal 5M  # 5 months ✓
   timecal 5m  # 5 minutes ✓
   ```

2. **Mode matters**: Past is default, use `-f` for future
   ```bash
   timecal 5d     # 5 days ago ✓
   timecal -f 5d  # 5 days from now ✓
   ```

3. **Math operators**: Need spaces in math mode with explicit flag
   ```bash
   timecal -m +5h + 3m  # Correct ✓
   timecal +5h          # Also correct (implicit) ✓
   ```
