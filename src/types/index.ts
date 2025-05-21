export type FormCategory = 'ECC' | 'TCC';

export type InstituteType = 'Dars' | 'Arabic College' | 'Hifz College';

export enum FormStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface PersonalDetails {
  name: string;
  fatherName: string;
  dateOfBirth: string;
  phoneNumber: string;
  whatsappNumber: string;
  address: string;
  photoUrl: string;
  skssflMembershipId: string;
  positionHeld: string;
}

export interface EducationDetails {
  instituteType: InstituteType;
  instituteName: string;
  principalOrMudarisName: string;
  district: string;
  state: string;
  zone: string;
  hallTicketDetails: string;
  paymentProofUrl: string;
}

export interface Submission {
  _id?: string;
  uniqueId: string;
  category: FormCategory;
  personalDetails: PersonalDetails;
  educationDetails: EducationDetails;
  status: FormStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  _id?: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'superadmin';
}

// Add Hall Ticket related types
export interface HallTicket {
    _id?: string;
    submissionId: string;
    uniqueId: string;
    programCode: FormCategory; // ECC or TCC
    centre: string;
    name: string;
    dateOfBirth: string;
    zone: string;
    membershipId: string;
    issuedAt: Date;
    status: 'issued' | 'downloaded' | 'used';
    photoUrl?: string;
}