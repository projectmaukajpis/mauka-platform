import mongoose from 'mongoose';

const postingSchema = new mongoose.Schema({
  ngoUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  skillsRequired: [String],
  location: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        index: '2dsphere'
      }
    },
    city: String,
    state: String,
    country: { type: String, default: 'India' }
  },
  timeCommitment: String,
  duration: String,
  benefits: [String],
  requirements: String,
  applicationDeadline: Date,
  maxVolunteers: {
    type: Number,
    required: true,
    min: 1
  },
  currentVolunteers: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'closed', 'draft'],
    default: 'active'
  },
  tags: [String] // For filtering and search
}, {
  timestamps: true
});

// Create 2dsphere index for location-based queries
postingSchema.index({ 'location.coordinates': '2dsphere' });
postingSchema.index({ ngoUserId: 1 });
postingSchema.index({ status: 1 });
postingSchema.index({ applicationDeadline: 1 });
postingSchema.index({ tags: 1 });

export default mongoose.model('Posting', postingSchema);