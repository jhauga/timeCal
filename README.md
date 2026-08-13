# ![logo](https://raw.githubusercontent.com/jhauga/timeCal/refs/heads/main/logo.png)

<p align="center">
  <strong>A powerful command-line tool for calculating dates and times relative to the current moment</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@jhauga/timecal"><img src="https://img.shields.io/npm/v/@jhauga/timecal" alt="npm version"></a>
  <a href="https://github.com/jhauga/timeCal/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@jhauga/timecal" alt="license"></a>
  <a href="https://github.com/jhauga/timeCal"><img src="https://img.shields.io/github/stars/jhauga/timeCal" alt="stars"></a>
</p>

---

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Time Units](#-time-units)
- [Modes](#-modes)
- [Time Difference](#-time-difference)
- [Current Time](#-current-time)
- [Examples](#-examples)
- [Output Formats](#-output-formats)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- **Simple & Intuitive**: Natural time expressions like `5d`, `17h`, `0.5d`
- **Multiple Modes**: Calculate past times (default), future times, or use math expressions
- **Flexible Units**: Support for seconds, minutes, hours, days, weeks, months, years, and quarters
- **Constant Flags**: Quick shortcuts like `lm` (last month), `nw` (next week)
- **Time Difference**: Calculate the duration between two clock times
- **Duration Adjustments**: Mix time expressions with two clock times to add to or subtract from the duration
- **Time Shifting**: Shift a single clock time with time expressions, as if it were the current time
- **Format Inversion**: Convert a single clock time between AM/PM and 24-hour formats
- **Current Time Display**: Show the current time as an AM/PM or 24-hour clock with `-c`
- **Current Time Override**: Change the current time used by clock-time features with `-s`, stored in a configurable JSON config file
- **Smart Formatting**: Automatically formats output based on time range
- **Math Mode**: Perform complex calculations with `+` and `-` operators
- **Error Handling**: Helpful error messages and suggestions

---

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g @jhauga/timecal
```

### Local Installation

```bash
npm install @jhauga/timecal
```

### Quick Start (npx)

```bash
npx @jhauga/timecal 5d
```

---

## 🚀 Usage

### Basic Syntax

```bash
timecal [options] <time_expression>
```

### Options

| Option | Description |
|--------|-------------|
| `-h, --help` | Display help information |
| `-f, --future` | Calculate time in the future |
| `-p, --past` | Calculate time in the past (default) |
| `-m, --math` | Use mathematical expressions with `+` and `-` operators |
| `-c, --current` | Show the current time. Optional argument: `12` (default, AM/PM clock) or `24` (24-hour clock) |
| `-s, --set-current` | Change the current time used by clock-time features, or pass `clear` to return to the system time |

---

## ⏱️ Time Units

| Unit | Description | Example |
|------|-------------|---------|
| `s` | Seconds | `30s` = 30 seconds |
| `m` | Minutes | `45m` = 45 minutes |
| `h` | Hours | `5h` = 5 hours |
| `d` | Days | `7d` = 7 days |
| `w` | Weeks | `2w` = 2 weeks |
| `M` | Months | `3M` = 3 months |
| `y` | Years | `1y` = 1 year |
| `q` | Quarters | `2q` = 2 quarters (6 months) |

### Decimal Values

You can use decimal values for more precision:

```bash
timecal 0.5d   # Half a day (12 hours)
timecal 1.5h   # One and a half hours
timecal 2.25d  # 2 days and 6 hours
```

---

## 🎯 Modes

### Past Mode (Default)

Calculate times in the past. No flag required, or use `-p` / `--past`.

```bash
timecal 5d        # 5 days ago
timecal -p 17h    # 17 hours ago
```

### Future Mode

Calculate times in the future using `-f` or `--future`.

```bash
timecal -f 5d     # 5 days from now
timecal --future 2w   # 2 weeks from now
```

### Math Mode

Perform complex calculations with `+` and `-` operators using `-m` or `--math`.

```bash
timecal -m +17h + 9m      # 17 hours and 9 minutes in the future
timecal -m -20h - 2d      # 20 hours and 2 days in the past
timecal -m +3d + 5h - 2m  # Complex calculation
```

**Shortcut**: You can omit the `-m` flag if your expression starts with `+` or `-`:

```bash
timecal +17h     # Math mode implied (17 hours in the future)
timecal -5d      # Math mode implied (5 days in the past)
```

---

## 🏷️ Constant Flags

Quick shortcuts for common time references:

### Past Flags

| Flag | Description | Equivalent |
|------|-------------|------------|
| `lm` | Last month | `1M` in past mode |
| `lw` | Last week | `1w` in past mode |
| `ly` | Last year | `1y` in past mode |
| `lq` | Last quarter | `1q` in past mode |

### Future Flags

| Flag | Description | Equivalent |
|------|-------------|------------|
| `nm` | Next month | `1M` in future mode |
| `nw` | Next week | `1w` in future mode |
| `ny` | Next year | `1y` in future mode |
| `nq` | Next quarter | `1q` in future mode |

**Smart Error Checking**: If you use a future flag in past mode (or vice versa), TimeCal will suggest the correct flag:

```bash
timecal lm        # ✓ Correct
timecal nm        # ✗ Error: Invalid past flag "nm". Did you mean "lm"?
timecal -f lm     # ✗ Error: Invalid future flag "lm". Did you mean "nm"?
```

---

## 🕐 Time Difference

Pass clock times instead of time expressions to work with clock values:
two clock times produce a duration, a single clock time with time
expressions is shifted, and a single clock time alone is converted to the
opposite clock format.

### Clock Time Syntax

```text
H | H:M | H:M:S    with optional AM/PM suffix
```

- With `AM`/`PM`: 12-hour format (`12AM` is midnight, `12PM` is noon)
- Without `AM`/`PM`: 24-hour format (`00` through `23`)
- The two formats can be mixed freely in one command
- Separators: `:` and `.` are both accepted (`13:10:15` and `13.10.15` are equivalent)
- `AM`/`PM` may also follow the time as a separate word (`9:00 PM` equals `9:00PM`)

### Two Clock Times

The difference is measured from the first time to the second. If the second
time is earlier, the calculation wraps past midnight.

```bash
timecal 12:10:00AM 1:25:25PM   # Output: 13h 15m 25s
timecal 12AM 1PM               # Output: 13h 0m 0s
timecal 00:10:00 13:35:10      # Output: 13h 25m 10s
timecal 00 13                  # Output: 13h 0m 0s
timecal 12:10:00AM 13:25:25    # Output: 13h 15m 25s (mixed formats)
timecal 11PM 7AM               # Output: 8h 0m 0s (wraps past midnight)
```

### One Clock Time (Format Inversion)

A single clock time on its own is converted to the opposite clock format:
24-hour input renders as an AM/PM clock, and AM/PM input renders as a
24-hour clock. Seconds appear only when the input included them.

```bash
timecal 21:00                  # Output: 9:00 PM
timecal 9:00PM                 # Output: 21:00
timecal 9:00 PM                # Output: 21:00
timecal 12:05AM                # Output: 00:05
timecal 21:00:30               # Output: 9:00:30 PM
```

### One Clock Time with Expressions (Time Shifting)

Time expressions mixed with a single clock time shift it, as if the clock
time were the current time. Unsigned expressions follow past mode by
default (use `-f` for future); `+`/`-` expressions apply their own
operators. The result wraps within a 24-hour clock.

```bash
timecal 3:15PM 15m             # Output: 3:00 PM (15m into the past)
timecal 3:15PM +15m            # Output: 3:30 PM
timecal -f 3:15PM 15m          # Output: 3:30 PM
timecal 12:10AM 15m            # Output: 11:55 PM (wraps)
```

### Two Clock Times with Expressions (Duration Adjustments)

Time expressions mixed with two clock times adjust the resulting
duration. An unsigned or `+` expression adds to the duration; a `-`
expression subtracts from it. A negative adjusted duration wraps back
within a 24-hour clock.

```bash
timecal 12AM 1PM 30m           # Output: 13h 30m 0s
timecal 12AM 1PM -30m          # Output: 12h 30m 0s
timecal 12AM 1PM 1h +5m        # Output: 14h 5m 0s
timecal 12AM 1PM 1d            # Output: 37h 0m 0s
timecal 12AM 1PM -14h          # Output: 23h 0m 0s (wraps)
```

---

## 🕒 Current Time

### Show the Current Time (`-c`, `--current`)

Displays the current time as a clock with seconds. An optional argument
selects the clock format: `12` (default, AM/PM clock) or `24`
(24-hour clock).

```bash
timecal -c                     # Output: 1:10:15 PM
timecal -c 12                  # Output: 1:10:15 PM
timecal -c 24                  # Output: 13:10:15
```

### Override the Current Time (`-s`, `--set-current`)

Changes the current time shown by the `-c` display. Accepted inputs:
`H:M`, `H:M:S`, `H:M[AM|PM]`, or `H:M:S[AM|PM]`. Pass `clear` to return
to the system time.

```bash
timecal -s 1:10:15PM           # Output: Current time set to 1:10:15 PM
timecal -s 13:10               # Output: Current time set to 1:10:00 PM
timecal -c                     # Output: 1:10:15 PM (uses the override)
timecal -s clear               # Output: Current time override cleared. Using system time.
```

The override does not affect the past/future date calculations, which
always use the system clock.

### Config File

The override is stored in a JSON config file. By default it lives at
`.timecal.json` in your home directory (`~/.timecal.json` on macOS and
Linux, `C:\Users\<user>\.timecal.json` on Windows). Set the
`TIMECAL_CONFIG` environment variable to use a different file path.

```json
{
  "currentTime": {
    "hours": 13,
    "minutes": 10,
    "seconds": 15
  }
}
```

---

## 📝 Examples

### Simple Past Calculations

```bash
timecal 17h
# Output: 1:10 AM

timecal 5d
# Output: 02-22-2026 Saturday

timecal lm
# Output: 01-27-2026 Tuesday
```

### Simple Future Calculations

```bash
timecal -f 17h
# Output: 7:34 PM

timecal --future 5d
# Output: 03-04-2026 Wednesday

timecal --future nm
# Output: 03-27-2026 Friday
```

### Multiple Time Units

```bash
timecal 0.5d 83m
# Output: 10:04 PM

timecal 15M 200h
# Output: 11-11-2025 Tuesday 10:34 AM

timecal -f 2d 3h 15m
# Output: 03-01-2026 Sunday 9:49 PM
```

### Math Mode

```bash
timecal -m +17h + 9m + 1h
# Output: 3:43 PM

timecal -m -17h - 9m - 1h
# Output: 11:25 AM

timecal -m +20h + 2d
# Output: 03-01-2026 Sunday 2:34 PM

timecal -m -20h - 2M
# Output: 12-27-2025 Saturday 10:34 AM
```

### Implicit Math Mode

```bash
timecal +17h
# Output: 1:34 PM (17 hours from now)

timecal -5d
# Output: 02-22-2026 Saturday (5 days ago)

timecal +3d -2h
# Output: 03-02-2026 Monday 4:34 PM
```

---

## 📄 Output Formats

TimeCal automatically formats output based on the time range:

### Less than 24 Hours

Shows time only in 12-hour format:

```
1:10 AM
11:34 PM
6:45 PM
```

### 24 Hours or More (with time units)

Shows date, day of week, and time:

```
02-27-2026 Thursday 1:10 AM
12-26-2025 Friday 11:34 PM
01-05-2026 Monday 6:45 PM
```

### 24 Hours or More (without time units)

Shows date and day of week only:

```
02-27-2026 Thursday
12-26-2025 Friday
01-05-2026 Monday
```

### Time Difference (clock time inputs)

Shows the duration in hours, minutes, and seconds:

```text
13h 15m 25s
13h 0m 0s
8h 0m 0s
```

**Format Pattern**: `MM-DD-YYYY DayName HH:MM AM/PM` (dates) or `Hh Mm Ss` (durations)

---

## 🧪 Testing Your Installation

After installation, test with these commands:

```bash
# Should show time 5 hours ago
timecal 5h

# Should show date 1 week from now
timecal -f 1w

# Should show help
timecal --help
```

---

## 🛠️ Development

### Clone the Repository

```bash
git clone https://github.com/jhauga/timeCal.git
cd timeCal
```

### Install Dependencies

```bash
npm install
```

### Link for Local Testing

```bash
npm link
```

Now you can use `timecal` command globally for testing.

---

## 📚 API

While TimeCal is primarily a CLI tool, you can also use it programmatically:

```javascript
const { timecal, diff } = require('@jhauga/timecal');

// Run any CLI-style calculation
console.log(timecal(['5d', '3h']));               // e.g., "02-22-2026 Saturday 9:49 PM"

// Calculate the difference between two clock times
console.log(diff('12:10:00AM', '1:25:25PM'));     // "13h 15m 25s"

// Invert the clock format of a single clock time
console.log(diff('21:00'));                       // "9:00 PM"
console.log(diff('9:00PM'));                      // "21:00"
```

### `timecal(args)`

Runs the full parse, calculate, and format pipeline.

**Parameters:**

- `args` (string[]): Arguments as they would be passed on the command line

**Returns:**

- `string`: Formatted output (a time, a date, or a duration)

**Throws:**

- `Error`: When an argument is invalid

### `diff(start, [end])`

Calculates the duration between two clock times, or inverts the clock
format when only one clock time is given.

**Parameters:**

- `start` (string): Clock time (e.g., `"12:10:00AM"`, `"13:35:10"`, `"1PM"`)
- `end` (string, optional): Second clock time; when omitted, `start` is converted to the opposite clock format (24-hour to AM/PM or back)

**Returns:**

- `string`: Formatted duration (e.g., `"13h 15m 25s"`) or inverted clock time (e.g., `"9:00 PM"`)

**Throws:**

- `Error`: When a clock time is invalid

### Lower-Level Modules

The individual pipeline modules are also exported:

```javascript
const { parseArguments, calculate, formatOutput } = require('@jhauga/timecal');

const parsed = parseArguments(['5d', '3h']);
const result = calculate(parsed);
const output = formatOutput(result);

console.log(output);
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 🐛 Issues

Found a bug or have a feature request? Please [open an issue](https://github.com/jhauga/timeCal/issues).

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**jhauga**

- GitHub: [@jhauga](https://github.com/jhauga)
- Package: [@jhauga/timecal](https://www.npmjs.com/package/@jhauga/timecal)

---

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

## 📈 Roadmap

- [ ] Add support for custom date formats
- [ ] Add timezone support
- [ ] Add more constant flags (yesterday, tomorrow, etc.)
- [ ] Add support for specific dates as reference points
- [ ] Add color output option
- [ ] Add JSON output format option

---
