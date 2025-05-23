import { Schema, model, models, Model } from 'mongoose';
import { FormStatus, Submission } from '@/types';

const PersonalDetailsSchema = new Schema({
    name: { type: String, required: true },
    fatherName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    address: { type: String, required: true },
    photoUrl: { type: String, required: true },
    skssflMembershipId: { type: String, required: true },
    positionHeld: { type: String, required: true },
});

const EducationDetailsSchema = new Schema({
    instituteType: { type: String, enum: ['Dars', 'Arabic College', 'Hifz College'], required: true },
    instituteName: { type: String, required: true },
    principalOrMudarisName: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    zone: { type: String, required: true },
    // hallTicketDetails: { type: String, required: true },
    paymentProofUrl: { type: String, required: true },
});

const SubmissionSchema = new Schema({
    uniqueId: {
        type: String,
        required: true,
        unique: true,
    },
    category: {
        type: String,
        enum: ['ECC', 'TCC'],
        required: true
    },
    personalDetails: PersonalDetailsSchema,
    educationDetails: EducationDetailsSchema,
    status: {
        type: String,
        enum: Object.values(FormStatus),
        default: FormStatus.DRAFT
    },
}, {
    timestamps: true
});

// Generate unique ID before saving
SubmissionSchema.pre('save', async function (next) {
    try {
        if (this.isNew && !this.uniqueId) {
            const prefix = this.category === 'ECC' ? 'ECC' : 'TCC';
            const timestamp = Date.now().toString().slice(-6);
            const random = Math.floor(Math.random() * 900) + 100; // 3-digit random number
            this.uniqueId = `${prefix}${timestamp}${random}`;
            console.log('Generated uniqueId:', this.uniqueId);
        }
        next();
    } catch (error) {
        console.error('Error generating uniqueId:', error);
        next(error as Error);
    }
});

const SubmissionModel = models.Submission || model<Submission>('Submission', SubmissionSchema);

export default SubmissionModel as Model<Submission>;