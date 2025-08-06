# Development Setup Guide

## 🚀 **Quick Start**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Set Up Environment**
```bash
# Copy environment template
cp .env.example .env

# Edit with your configuration
nano .env
```

### **3. Start Development Server**
```bash
# Enhanced development mode (recommended)
npm run dev

# Simple nodemon mode
npm run dev:simple

# Debug mode
npm run dev:debug

# Verbose mode
npm run dev:verbose
```

## 📋 **Available Scripts**

### **Development Scripts**
```bash
npm run dev          # Enhanced development with database check
npm run dev:simple   # Simple nodemon restart
npm run dev:debug    # Nodemon with Node.js inspector
npm run dev:verbose  # Nodemon with verbose logging
```

### **Testing Scripts**
```bash
npm test             # Run tests once
npm run test:watch   # Run tests in watch mode
```

### **Database Scripts**
```bash
npm run migrate      # Run database migrations
npm run migrate:watch # Watch and run migrations
```

## 🔧 **Nodemon Configuration**

### **Features**
- **Auto-restart** on file changes
- **Smart watching** of `src/` directory
- **Ignore patterns** for test files and utilities
- **Development environment** variables
- **Verbose logging** with colors
- **Crash recovery** with restart messages

### **Watched Files**
- `src/**/*.js` - All JavaScript files
- `src/**/*.json` - All JSON files

### **Ignored Files**
- `node_modules/**/*`
- `tests/**/*`
- `*.test.js`, `*.spec.js`
- `test-*.js`, `demo-*.js`, `setup-*.js`
- `verify-*.js`, `diagnose-*.js`, `fix-*.js`
- `update-*.js`, `configure-*.js`

## 🛠️ **Development Workflow**

### **1. Start Development**
```bash
npm run dev
```

**What happens:**
- ✅ Checks for `.env` file
- ✅ Tests database connection
- ✅ Starts nodemon with enhanced logging
- ✅ Watches for file changes
- ✅ Auto-restarts on changes

### **2. Make Changes**
- Edit any file in `src/`
- Save the file
- Server automatically restarts
- See restart messages in console

### **3. Debug Mode**
```bash
npm run dev:debug
```
- Enables Node.js inspector
- Connect debugger on port 9229
- Use Chrome DevTools or VS Code

### **4. Testing**
```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## 📊 **Nodemon Features**

### **Auto-Restart Triggers**
- File changes in `src/`
- Configuration changes
- Environment variable changes

### **Restart Messages**
```
🔄 Server restarted due to changes
💥 Server crashed, restarting...
```

### **Manual Restart**
- Type `rs` and press Enter
- Server will restart immediately

### **Exit Commands**
- `Ctrl+C` - Graceful shutdown
- `Ctrl+C` twice - Force exit

## 🔍 **Troubleshooting**

### **Server Won't Start**
```bash
# Check database connection
node test-db-connection.js

# Check environment variables
echo $NODE_ENV

# Run with verbose logging
npm run dev:verbose
```

### **Nodemon Not Restarting**
```bash
# Check if file is being watched
npm run dev:verbose

# Manual restart
rs
```

### **Database Connection Issues**
```bash
# Test database connection
node test-db-connection.js

# Check .env file
cat .env
```

## 🎯 **Best Practices**

### **1. File Organization**
- Keep source files in `src/`
- Use descriptive file names
- Avoid test files in `src/`

### **2. Environment Variables**
- Use `.env` for local development
- Never commit `.env` to version control
- Use `.env.example` as template

### **3. Database**
- Ensure database is running
- Check connection before starting
- Use migrations for schema changes

### **4. Logging**
- Use console.log for development
- Use proper logging levels
- Check logs for errors

## 🚀 **Production vs Development**

### **Development**
```bash
npm run dev          # Enhanced development
NODE_ENV=development # Auto-set by nodemon
```

### **Production**
```bash
npm start            # Production server
NODE_ENV=production  # Set in environment
```

## 📝 **Useful Commands**

```bash
# Start development
npm run dev

# Run tests
npm test

# Check database
node test-db-connection.js

# Run migrations
npm run migrate

# Manual restart (in nodemon)
rs

# Exit nodemon
Ctrl+C
```

## 🎉 **Ready to Develop!**

Your development environment is now set up with:
- ✅ Auto-restart on file changes
- ✅ Database connection checking
- ✅ Enhanced logging and feedback
- ✅ Multiple development modes
- ✅ Testing and migration scripts

Start coding with `npm run dev`! 