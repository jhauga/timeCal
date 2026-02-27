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

## Output Formats

| Condition | Format | Example |
|-----------|--------|---------|
| < 24 hours | Time only | `1:10 AM` |
| >= 24 hours + time units | Date + Day + Time | `02-27-2026 Thursday 1:10 AM` |
| >= 24 hours, no time units | Date + Day | `02-27-2026 Thursday` |

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

**TimeCal v1.0.0** | MIT License | Made with ❤️ by jhauga
