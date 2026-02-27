# Contributing to TimeCal

Thank you for your interest in contributing to TimeCal! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please be respectful and constructive in all interactions. We're all here to make TimeCal better!

## Getting Started

### Prerequisites

- Node.js 12.0.0 or higher
- npm or yarn
- Git

### Setting Up Development Environment

1. **Fork the repository**

   Click the "Fork" button on the [GitHub repository](https://github.com/jhauga/timeCal) page.

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR-USERNAME/timeCal.git
   cd timeCal
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Link for local testing**

   ```bash
   npm link
   ```

   Now you can use the `timecal` command globally to test your changes.

5. **Make your changes**

   Create a new branch for your feature or bugfix:

   ```bash
   git checkout -b feature/my-new-feature
   ```

6. **Test your changes**

   Run the test suite:

   ```bash
   npm test
   ```

   Test the CLI manually:

   ```bash
   timecal 5h
   timecal -f 3d
   timecal --help
   ```

## Project Structure

```
timeCal/
├── bin/
│   └── timecal.js       # CLI entry point (executable)
├── lib/
│   ├── parser.js        # Argument parsing logic
│   ├── calculator.js    # Time calculation logic
│   └── formatter.js     # Output formatting logic
├── .github/
│   ├── instructions/    # Project instructions
│   └── skills/          # Quasi-coder skill docs
├── test.js              # Test suite
├── package.json         # Package configuration
├── README.md            # Main documentation
├── EXAMPLES.md          # Usage examples
└── LICENSE              # MIT License
```

## Making Changes

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add comments for complex logic
- Follow existing code patterns
- Keep functions focused and small

### Adding New Features

When adding a new feature:

1. Update the relevant module(s) in `lib/`
2. Add tests in `test.js`
3. Update the help text in `lib/parser.js` if needed
4. Update `README.md` with new examples
5. Add examples to `EXAMPLES.md`

### Fixing Bugs

When fixing a bug:

1. Add a test case that reproduces the bug
2. Fix the bug
3. Verify the test now passes
4. Update documentation if the bug was in documented behavior

## Testing

### Running Tests

```bash
npm test
```

### Manual Testing

Test common scenarios:

```bash
# Past calculations
timecal 5h
timecal 2d
timecal lm

# Future calculations
timecal -f 3h
timecal -f 1w
timecal -f nm

# Math mode
timecal -m +2h + 30m
timecal +5h
timecal -3d

# Error cases
timecal -p nm  # Should suggest "lm"
timecal       # Should show error
```

### Adding Tests

Add test cases to `test.js`:

```javascript
const tests = [
  { args: ['your', 'args', 'here'], description: 'Test description' },
  // ... more tests
];
```

## Pull Request Process

1. **Update documentation**

   Ensure README.md, EXAMPLES.md, and inline code comments are updated.

2. **Run tests**

   Make sure all tests pass:

   ```bash
   npm test
   ```

3. **Commit your changes**

   Use clear, descriptive commit messages:

   ```bash
   git commit -m "Add support for custom time formats"
   ```

4. **Push to your fork**

   ```bash
   git push origin feature/my-new-feature
   ```

5. **Create a Pull Request**

   Go to the original repository and click "New Pull Request".

   - Provide a clear title and description
   - Reference any related issues
   - List what you changed and why
   - Include test results if applicable

6. **Respond to feedback**

   Be responsive to code review comments and make requested changes.

## Pull Request Guidelines

### Good PR Titles

- ✓ "Add timezone support for time calculations"
- ✓ "Fix incorrect output for quarters calculation"
- ✓ "Update documentation with new examples"
- ✗ "Update"
- ✗ "Fix bug"
- ✗ "Changes"

### Good PR Descriptions

Include:

- **What** - What does this PR do?
- **Why** - Why is this change needed?
- **How** - How does it work?
- **Testing** - How was it tested?
- **Screenshots** - If UI/output changes, show before/after

Example:

```markdown
## What
Adds timezone support to TimeCal

## Why
Users in different timezones need to calculate times in their local timezone or other timezones.

## How
- Added `--timezone` option to parser
- Modified calculator to use specified timezone
- Updated formatter to display timezone info

## Testing
- Added test cases for multiple timezones
- Manually tested with various timezone inputs
- All existing tests still pass

## Example Usage
`timecal -f 5h --timezone EST`
```

## Feature Requests

Have an idea for a new feature? 

1. Check if it's already in the [Roadmap](README.md#-roadmap)
2. Search [existing issues](https://github.com/jhauga/timeCal/issues)
3. If not found, [open a new issue](https://github.com/jhauga/timeCal/issues/new)
4. Describe:
   - The feature you'd like
   - Why it would be useful
   - How it might work
   - Example use cases

## Bug Reports

Found a bug?

1. Check if it's already reported in [issues](https://github.com/jhauga/timeCal/issues)
2. If not, [open a new issue](https://github.com/jhauga/timeCal/issues/new)
3. Include:
   - TimeCal version (`npm list @jhauga/timecal`)
   - Node version (`node --version`)
   - Operating system
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Any error messages

### Bug Report Template

```markdown
## Description
A clear description of the bug

## Steps to Reproduce
1. Run `timecal ...`
2. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- TimeCal version: 1.0.0
- Node version: v16.13.0
- OS: Windows 11

## Error Output
```bash
paste error output here
```
```

## Questions?

If you have questions:

1. Check the [README.md](README.md)
2. Check [EXAMPLES.md](EXAMPLES.md)
3. Search [existing issues](https://github.com/jhauga/timeCal/issues)
4. Open a [new issue](https://github.com/jhauga/timeCal/issues/new) with the "question" label

## Recognition

Contributors will be recognized in:
- Git commit history
- Release notes
- Future CONTRIBUTORS.md file

Thank you for contributing to TimeCal! 🎉
