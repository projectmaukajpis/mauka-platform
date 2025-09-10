import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  postingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Posting',
    required: true
  },
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverLetter: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: Date,
  ngoNotes: String
}, {
  timestamps: true
});

// Ensure unique applications per volunteer per posting
applicationSchema.index({ postingId: 1, volunteerId: 1 }, { unique: true });
applicationSchema.index({ volunteerId: 1 });
applicationSchema.index({ status: 1 });

export default mongoose.model('Application', applicationSchema);