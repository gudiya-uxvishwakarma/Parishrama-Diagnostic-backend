# MongoDB Setup Guide

## Option 1: Install MongoDB Locally (Recommended)

### For Windows:

1. **Download MongoDB Community Server:**
   - Go to https://www.mongodb.com/try/download/community
   - Select Windows, Version 7.0+, MSI package
   - Download and run the installer

2. **Install MongoDB:**
   - Run the downloaded .msi file
   - Choose "Complete" installation
   - Install MongoDB as a Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. **Start MongoDB Service:**
   ```cmd
   # MongoDB should start automatically as a service
   # If not, run:
   net start MongoDB
   ```

4. **Verify Installation:**
   ```cmd
   # Open Command Prompt and run:
   mongosh
   # You should see MongoDB shell
   ```

### For macOS:

1. **Using Homebrew:**
   ```bash
   # Install MongoDB
   brew tap mongodb/brew
   brew install mongodb-community

   # Start MongoDB
   brew services start mongodb/brew/mongodb-community
   ```

### For Linux (Ubuntu/Debian):

1. **Install MongoDB:**
   ```bash
   # Import MongoDB public key
   wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

   # Add MongoDB repository
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

   # Update package list and install
   sudo apt-get update
   sudo apt-get install -y mongodb-org

   # Start MongoDB
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

## Option 2: Fix MongoDB Atlas Connection

If you prefer to use MongoDB Atlas, try these fixes:

### Fix 1: Simplified Connection String
```env
MONGO_URI=mongodb+srv://parishrama:parishrama123@cluster0.dedt4va.mongodb.net/Parishrama_Diagnostic_Laboratory
```

### Fix 2: Check Network Access
1. Go to MongoDB Atlas Dashboard
2. Navigate to Network Access
3. Add your IP address or use 0.0.0.0/0 for all IPs (development only)

### Fix 3: Verify Credentials
1. Go to Database Access in Atlas
2. Check if user "parishrama" exists
3. Verify password is "parishrama123"
4. Ensure user has "readWrite" permissions

### Fix 4: Try Alternative Connection
```env
MONGO_URI=mongodb+srv://goluvis7565_db_user:parishrama1234@cluster0.ugiugpk.mongodb.net/Parishrama_Diagnostic_Laboratory
```

## Quick Test Commands

### Test Local MongoDB:
```bash
# In ParishramaBackend directory
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/test')
  .then(() => console.log('✅ Local MongoDB Connected'))
  .catch(err => console.log('❌ Error:', err.message));
"
```

### Test Atlas Connection:
```bash
# Test Atlas connection
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://parishrama:parishrama123@cluster0.dedt4va.mongodb.net/test')
  .then(() => console.log('✅ Atlas Connected'))
  .catch(err => console.log('❌ Error:', err.message));
"
```

## Recommended Setup for Development

1. **Use Local MongoDB** for development (faster, no internet required)
2. **Use MongoDB Atlas** for production
3. **Switch between them** using environment variables

## After Setup

1. Restart your server:
   ```bash
   npm start
   ```

2. Your server should now connect successfully to MongoDB!