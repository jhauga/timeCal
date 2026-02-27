# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
