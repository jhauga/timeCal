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
const { parseArguments } = require('@jhauga/timecal/lib/parser');
const { calculate } = require('@jhauga/timecal/lib/calculator');
const { formatOutput } = require('@jhauga/timecal/lib/formatter');

// Calculate 5 days ago
const args = ['5d'];
const parsed = parseArguments(args);
const result = calculate(parsed);
const output = formatOutput(result);

console.log(`5 days ago was: ${output}`);

// Calculate with multiple units
const args2 = ['-f', '2w', '3d', '12h'];
const parsed2 = parseArguments(args2);
const result2 = calculate(parsed2);
const output2 = formatOutput(result2);

console.log(`2 weeks, 3 days, and 12 hours from now: ${output2}`);
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
