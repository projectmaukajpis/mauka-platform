import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  supabaseId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['volunteer', 'ngo', 'admin'],
    required: true
  },
  profile: {
    // Volunteer fields
    skills: [String],
    interests: [String],
    bio: String,
    availability: String,
    experience: String,
    
    // NGO fields
    organizationName: String,
    description: String,
    contactPerson: String,
    website: String,
    registrationNumber: String,
    focusAreas: [String],
    
    // Common fields
    location: {
      address: String,
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          index: '2dsphere'
        }
      },
      city: String,
      state: String,
      country: { type: String, default: 'India' }
    }
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Create 2dsphere index for location-based queries
userSchema.index({ 'profile.location.coordinates': '2dsphere' });
userSchema.index({ userType: 1 });
userSchema.index({ verified: 1 });
userSchema.index({ email: 1 });

export default mongoose.model('User', userSchema);