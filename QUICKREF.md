# TimeCal Quick Reference

A one-page reference for TimeCal command-line tool.

---

## Installation

```bash
npm install -g @jhauga/timecal
```

---

## Basic Syntax

```bash
timecal [options] <time_expression>
```

---

## Options

| Option | Long | Description |
|--------|------|-------------|
| `-h` | `--help` | Show help |
| `-f` | `--future` | Calculate future time |
| `-p` | `--past` | Calculate past time (default) |
| `-m` | `--math` | Math mode with +/- |
| `-c` | `--current` | Show current time (`12` default, or `24`) |
| `-s` | `--set-current` | Set current time override (`clear` to reset) |

---

## Time Units

| Unit | Meaning | Example |
|------|---------|---------|
| `s` | seconds | `30s` |
| `m` | minutes | `45m` |
| `h` | hours | `5h` |
| `d` | days | `7d` |
| `w` | weeks | `2w` |
| `M` | months | `3M` ⚠️ uppercase |
| `y` | years | `1y` |
| `q` | quarters | `2q` |

---

## Constant Flags

### Past

| Flag | Meaning |
|------|---------|
| `lm` | last month |
| `lw` | last week |
| `ly` | last year |
| `lq` | last quarter |

### Future

| Flag | Meaning |
|------|---------|
| `nm` | next month |
| `nw` | next week |
| `ny` | next year |
| `nq` | next quarter |

---

## Quick Examples

### Past (Default)

```bash
timecal 5h          # 5 hours ago
timecal 7d          # 7 days ago
timecal lm          # last month
timecal 0.5d        # 12 hours ago
timecal 2d 5h       # 2 days and 5 hours ago
```

### Future

```bash
timecal -f 3h       # 3 hours from now
timecal -f 10d      # 10 days from now
timecal -f nm       # next month
timecal -f 1w 2d    # 1 week and 2 days from now
```

### Math Mode

```bash
timecal -m +5h + 30m      # 5 hours and 30 minutes from now
timecal -m -3d - 2h       # 3 days and 2 hours ago
timecal +12h              # Shortcut: 12 hours from now
timecal -5d               # Shortcut: 5 days ago
```

---

## Time Difference

Pass one or two clock times (`H`, `H:M`, or `H:M:S`, with optional AM/PM) to
get a duration. Without AM/PM, times are read as 24-hour format.

```bash
timecal 12:10:00AM 1:25:25PM   # 13h 15m 25s
timecal 00:10:00 13:35:10      # 13h 25m 10s
timecal 12AM 1PM               # 13h 0m 0s
timecal 00 13                  # 13h 0m 0s
timecal 11PM 7AM               # 8h 0m 0s (wraps past midnight)
timecal 12AM 1PM 30m           # adjust: add 30 minutes (13h 30m 0s)
timecal 12AM 1PM -30m          # adjust: subtract 30 minutes (12h 30m 0s)
timecal 21:00                  # invert format: 9:00 PM
timecal 9:00PM                 # invert format: 21:00
timecal 3:15PM 15m             # shift: 3:00 PM (3:30 PM with +15m or -f)
```

---

## Current Time

```bash
timecal -c                     # current time: 1:10:15 PM
timecal -c 24                  # current time: 13:10:15
timecal -s 1:10:15PM           # override the current time used
timecal -s clear               # back to the system time
```

Override is stored in the JSON config file: `.timecal.json` in your home
directory, or the path set in the `TIMECAL_CONFIG` environment variable.

---

## Output Formats

| Condition | Format | Example |
|-----------|--------|---------|
| < 24 hours | Time only | `1:10 AM` |
| >= 24 hours + time units | Date + Day + Time | `02-27-2026 Thursday 1:10 AM` |
| >= 24 hours, no time units | Date + Day | `02-27-2026 Thursday` |
| Clock time inputs | Duration | `13h 15m 25s` |

---

## Tips

💡 **Use decimals**: `0.5d` = 12 hours, `1.5h` = 90 minutes

💡 **Uppercase M**: `M` = months, `m` = minutes

💡 **Quick math**: Start with `+` or `-` for implied math mode

💡 **Combine units**: Mix any units: `1y 2M 3w 4d 5h 6m 7s`

💡 **Auto-detect**: Using `nm`, `nw`, etc. automatically switches to future mode

---

## Common Patterns

### Time Tracking

```bash
timecal 8.5h        # Started work 8.5 hours ago
timecal -f 45m      # Meeting in 45 minutes
```

### Project Deadlines

```bash
timecal -f 3w       # Deadline in 3 weeks
timecal 2M          # Project started 2 months ago
```

### Historical Dates

```bash
timecal lq          # Last quarter start
timecal 6M          # 6 months ago
```

---

## Error Messages

TimeCal provides helpful suggestions:

```bash
timecal nm
# Error: Invalid past flag "nm". Did you mean "lm"?

timecal -f lm
# Error: Invalid future flag "lm". Did you mean "nm"?
```

---

## Links

- **Docs**: [README.md](README.md)
- **Examples**: [EXAMPLES.md](EXAMPLES.md)
- **Install**: [INSTALL.md](INSTALL.md)
- **GitHub**: https://github.com/jhauga/timeCal
- **NPM**: https://www.npmjs.com/package/@jhauga/timecal

---

## Help

```bash
timecal --help
```

---

**TimeCal v1.1.1** | MIT License | Made with ❤️ by jhauga
