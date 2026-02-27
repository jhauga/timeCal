# TimeCal Installation & Quick Start Guide

## Installation Options

### Option 1: Global Installation (Recommended)

Install TimeCal globally to use it anywhere on your system:

```bash
npm install -g @jhauga/timecal
```

After installation, you can use `timecal` from any directory:

```bash
timecal 5h
timecal -f 3d
timecal --help
```

### Option 2: Local Installation

Install in your project:

```bash
npm install @jhauga/timecal
```

Use with npx:

```bash
npx timecal 5h
```

Or add to your `package.json` scripts.

### Option 3: No Installation (npx)

Use directly without installation:

```bash
npx @jhauga/timecal 5h
```

---

## Quick Start

### Basic Usage

```bash
# Time 5 hours ago
timecal 5h

# Date 7 days ago
timecal 7d

# Last month
timecal lm
```

### Future Calculations

```bash
# Time 3 hours from now
timecal -f 3h

# Date 10 days from now
timecal -f 10d

# Next month
timecal -f nm
```

### Math Mode

```bash
# Add time
timecal -m +2h + 30m

# Subtract time
timecal -m -3d - 5h

# Quick syntax
timecal +5h
timecal -2d
```

---

## Verifying Installation

After installation, verify it works:

```bash
# Check version
npm list -g @jhauga/timecal

# Test basic command
timecal 1h

# View help
timecal --help
```

Expected output for `timecal 1h`: A time that was 1 hour ago.

---

## Development Setup

If you want to contribute or develop locally:

### 1. Clone Repository

```bash
git clone https://github.com/jhauga/timeCal.git
cd timeCal
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Link for Local Testing

```bash
npm link
```

Now you can use `timecal` globally and changes will reflect immediately.

### 4. Run Tests

```bash
npm test
```

### 5. Test CLI Directly

```bash
node bin/timecal.js 5h
```

---

## Windows-Specific Instructions

### Using PowerShell

TimeCal works perfectly in PowerShell:

```powershell
# Install globally
npm install -g @jhauga/timecal

# Use it
timecal 5h
timecal -f 3d
```

### Using Command Prompt (cmd)

Works the same in CMD:

```cmd
npm install -g @jhauga/timecal
timecal 5h
```

### Using Git Bash

Also works in Git Bash:

```bash
npm install -g @jhauga/timecal
timecal 5h
```

### Path Issues

If you get "command not found" after global installation:

1. Check npm global bin directory:
   ```bash
   npm config get prefix
   ```

2. Add to your PATH:
   - Open System Properties → Environment Variables
   - Edit PATH variable
   - Add: `C:\Users\YourUsername\AppData\Roaming\npm` (or the path from step 1)
   - Restart your terminal

---

## Uninstallation

### Global Uninstallation

```bash
npm uninstall -g @jhauga/timecal
```

### Local Uninstallation

```bash
npm uninstall @jhauga/timecal
```

---

## Troubleshooting

### Issue: "timecal is not recognized"

**Solution:**
- Ensure global installation: `npm install -g @jhauga/timecal`
- Check PATH includes npm global bin directory
- Restart terminal after installation

### Issue: "Cannot find module"

**Solution:**
- Reinstall: `npm uninstall -g @jhauga/timecal && npm install -g @jhauga/timecal`
- Clear npm cache: `npm cache clean --force`

### Issue: Permission errors (Unix/Mac)

**Solution:**
```bash
sudo npm install -g @jhauga/timecal
```

### Issue: Incorrect output

**Solution:**
- Check your system time is correct
- Verify syntax: `timecal --help`
- Report bug: https://github.com/jhauga/timeCal/issues

---

## Getting Help

- **Documentation**: [README.md](README.md)
- **Examples**: [EXAMPLES.md](EXAMPLES.md)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Issues**: https://github.com/jhauga/timeCal/issues
- **Help Command**: `timecal --help`

---

## Next Steps

1. **Read the examples**: Check out [EXAMPLES.md](EXAMPLES.md) for comprehensive usage examples
2. **Try different modes**: Experiment with past, future, and math modes
3. **Combine units**: Try `timecal 2d 5h 30m`
4. **Use constant flags**: Quick shortcuts like `lm`, `nw`, `ly`
5. **Contribute**: See [CONTRIBUTING.md](CONTRIBUTING.md) to help improve TimeCal

---

## Update TimeCal

To update to the latest version:

```bash
npm update -g @jhauga/timecal
```

Check current version:

```bash
npm list -g @jhauga/timecal
```

---

## Package Information

- **Package Name**: @jhauga/timecal
- **NPM Page**: https://www.npmjs.com/package/@jhauga/timecal
- **GitHub**: https://github.com/jhauga/timeCal
- **License**: MIT
- **Minimum Node Version**: 12.0.0

---

**Happy Calculating! ⏰**
