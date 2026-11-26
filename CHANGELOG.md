# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2026-11-26

### Fixed

- The npm package holds only the program and its documentation: a `files` list in `package.json` keeps `.support/source-graphics.ai`, the source of the logo, out of it. The package's unpacked size falls from about 576 kB to about 75 kB

## [1.1.0] - 2026-08-13

### Added

- Time difference calculation between two clock times:
  - Calculates the duration from the first to the second (e.g., `timecal 12:10:00AM 1:25:25PM` returns `13h 15m 25s`)
  - Clock time syntax: `H`, `H:M`, or `H:M:S` with an optional `AM`/`PM` suffix
  - Clock time separators: `:` and `.` are both accepted (`13:10:15` and `13.10.15` are equivalent)
  - `AM`/`PM` may also follow the time as a separate argument (`timecal 9:00 PM`)
  - 12-hour (`1:25PM`) and 24-hour (`13:25`) formats, which can be mixed in one command
  - Wrap-around past midnight when the second time is earlier (e.g., `11PM 7AM` returns `8h 0m 0s`)
  - Duration output format: `Hh Mm Ss` (e.g., `13h 15m 25s`)
- Duration adjustments by mixing time expressions with two clock times:
  - Unsigned or `+` expressions add (e.g., `timecal 12AM 1PM 30m` returns `13h 30m 0s`)
  - `-` expressions subtract (e.g., `timecal 12AM 1PM -30m` returns `12h 30m 0s`)
  - A negative adjusted duration wraps back within a 24-hour clock
- Time shifting for a single clock time mixed with time expressions:
  - The clock time acts as a temporary current time, shifted into the past by default (e.g., `timecal 3:15PM 15m` returns `3:00 PM`)
  - `-f` or `+`/`-` expressions shift in other directions (e.g., `timecal 3:15PM +15m` returns `3:30 PM`)
  - The result wraps within a 24-hour clock
- Format inversion for a single clock time on its own:
  - 24-hour input renders as an AM/PM clock (e.g., `timecal 21:00` returns `9:00 PM`)
  - AM/PM input renders as a 24-hour clock (e.g., `timecal 9:00PM` returns `21:00`)
  - Seconds appear only when the input included them
- `-c`, `--current` option to show the current time as a clock with seconds:
  - Optional argument `12` (default) for an AM/PM clock (e.g., `1:10:15 PM`)
  - Optional argument `24` for a 24-hour clock (e.g., `13:10:15`)
- `-s`, `--set-current` option to change the current time used by clock-time features:
  - Accepted inputs: `H:M`, `H:M:S`, `H:M[AM|PM]`, `H:M:S[AM|PM]`
  - `timecal -s clear` returns to the system time
  - The override applies to the `-c` display; date calculations always use the system clock
- JSON config file (`lib/config.js`) storing the current time override:
  - Default location: `.timecal.json` in the user's home directory
  - Configurable via the `TIMECAL_CONFIG` environment variable
- Programmatic API entry point (`lib/index.js`):
  - `timecal(args)` - run the full parse, calculate, and format pipeline
  - `diff(start, [end])` - calculate a clock time difference, or invert the format of a single clock time
  - Re-exports `parseArguments`, `calculate`, and `formatOutput`
- Clear error messages when more than two clock times are given or an option receives invalid input

### Documentation

- README.md - Time Difference and Current Time sections, new options, and expanded API reference
- EXAMPLES.md - Time difference, duration adjustment, current time, and override examples; updated programmatic usage
- QUICKREF.md - Time difference and current time quick reference, new options, duration output format
- Updated CLI help text (`-h`, `--help`) with the new syntax, options, and examples

## [1.0.0] - 2026-02-27

### Added

- Initial release of TimeCal
- Calculate dates and times relative to the current moment
- Support for multiple modes:
  - Past mode (default) - calculate times in the past
  - Future mode (`-f`, `--future`) - calculate times in the future
  - Math mode (`-m`, `--math`) - perform calculations with `+` and `-` operators
- Time units support:
  - `s` - seconds
  - `m` - minutes
  - `h` - hours
  - `d` - days
  - `w` - weeks
  - `M` - months
  - `y` - years
  - `q` - quarters
- Constant flags shortcuts:
  - Past: `lm` (last month), `lw` (last week), `ly` (last year), `lq` (last quarter)
  - Future: `nm` (next month), `nw` (next week), `ny` (next year), `nq` (next quarter)
- Decimal value support (e.g., `0.5d` for half a day)
- Multiple time units in a single calculation (e.g., `2d 5h 30m`)
- Smart output formatting:
  - < 24 hours: Time only (e.g., "1:10 AM")
  - >= 24 hours with time units: Full date and time (e.g., "02-27-2026 Thursday 1:10 AM")
  - >= 24 hours without time units: Date only (e.g., "02-27-2026 Thursday")
- Implicit math mode (expressions starting with `+` or `-`)
- Helpful error messages with suggestions
- Comprehensive help documentation (`-h`, `--help`, `/?`)
- Full test suite
- Comprehensive README with examples
- MIT License

### Features

- **Simple CLI**: Easy-to-use command-line interface
- **Flexible Input**: Natural time expressions
- **Smart Formatting**: Automatically formats output based on context
- **Error Handling**: Helpful error messages and suggestions for incorrect flags
- **Cross-Platform**: Works on Windows, macOS, and Linux

### Documentation

- README.md - Complete user documentation
- EXAMPLES.md - Comprehensive usage examples
- CONTRIBUTING.md - Contribution guidelines
- CHANGELOG.md - Version history (this file)
- LICENSE - MIT License

### Technical Details

- Built with Node.js
- Minimum Node version: 12.0.0
- Zero dependencies (pure Node.js)
- Modular architecture:
  - `bin/timecal.js` - CLI entry point
  - `lib/parser.js` - Argument parsing
  - `lib/calculator.js` - Time calculations
  - `lib/formatter.js` - Output formatting

## [Unreleased]

### Planned Features

- Custom date format support
- Timezone support
- Additional constant flags (yesterday, tomorrow, etc.)
- Specific dates as reference points
- Color output option
- JSON output format
- Configuration file support
- Localization support

---

## Version History

- **1.1.1** (2026-11-26) - The graphics source is kept out of the npm package
- **1.1.0** (2026-08-13) - Time difference calculation, duration adjustments, time shifting, format inversion, current time display and override, programmatic API
- **1.0.0** (2026-02-27) - Initial release

---

## Links

- [GitHub Repository](https://github.com/jhauga/timeCal)
- [NPM Package](https://www.npmjs.com/package/@jhauga/timecal)
- [Issue Tracker](https://github.com/jhauga/timeCal/issues)
- [Releases](https://github.com/jhauga/timeCal/releases)

---

## Feedback

Have feedback or suggestions? [Open an issue](https://github.com/jhauga/timeCal/issues/new) on GitHub!
