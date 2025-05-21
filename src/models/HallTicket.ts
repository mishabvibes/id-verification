import { Schema, model, models, Model } from 'mongoose';
import { HallTicket } from '@/types';

const HallTicketSchema = new Schema({
  submissionId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Submission',
    required: true 
  },
  uniqueId: { 
    type: String, 
    required: true,
    unique: true 
  },
  programCode: { 
    type: String, 
    enum: ['ECC', 'TCC'], 
    required: true 
  },
  centre: { 
    type: String, 
    default: 'ANVARUL ISLAM ARABIC COLLAGE RAMAPURAM',
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  dateOfBirth: { 
    type: String, 
    required: true 
  },
  zone: { 
    type: String, 
    required: true 
  },
  membershipId: { 
    type: String, 
    required: true 
  },
  issuedAt: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['issued', 'downloaded', 'used'],
    default: 'issued'
  }
}, { 
  timestamps: true 
});

const HallTicketModel = models.HallTicket || model<HallTicket>('HallTicket', HallTicketSchema);

export default HallTicketModel as Model<HallTicket>;