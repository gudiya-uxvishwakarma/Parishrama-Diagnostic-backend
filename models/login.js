import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const loginSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  }
}, { 
  timestamps: true 
});

// Password hash karne ke liye
loginSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password compare method
loginSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
loginSchema.methods.toJSON = function() {
  const loginObject = this.toObject();
  delete loginObject.password;
  return loginObject;
};

// Index for better performance
loginSchema.index({ email: 1 });

const Login = mongoose.model("Login", loginSchema);
export default Login;