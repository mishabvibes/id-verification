// src/components/form/EducationDetails.tsx
import { ChangeEvent, useState } from 'react';
import { EducationDetails as EducationDetailsType, InstituteType } from '@/types';
import { toast } from 'react-hot-toast';

interface Props {
  educationDetails: EducationDetailsType;
  setEducationDetails: (details: EducationDetailsType) => void;
  onPrevious: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

// List of zones - this would be fetched from an API in a real application
const ZONES = [
  'AREEKODE 1',
  'EDAVANNAPPARA 2',
  'EDAKKARA 3',
  'KALIKAVU 4',
  'KARUVARAKUNDU 5',
  'KIZHISSERY 6',
  'KOLATHUR 7',
  'KONDOTTY 8',
  'MAKKARAPARAMBA 9',
  'MALAPPURAM 10',
  'MANJERI 11',
  'MELATTUR 12',
  'MONGAM 13',
  'NILAMBUR 14',
  'PANDIKKAD 15',
  'PERINTHALMANNA 16',
  'PULAMANTHOL 17',
  'PULIKKAL 18',
  'THAZHEKODE 19',
  'WANDOOR 20',
];

export default function EducationDetails({
  educationDetails,
  setEducationDetails,
  onPrevious,
  onSubmit,
  isSubmitting
}: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [useScannerMode, setUseScannerMode] = useState(false);
  const [scannedFile, setScannedFile] = useState<File | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEducationDetails({
      ...educationDetails,
      [name]: value
    });

    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleScannerToggle = () => {
    setUseScannerMode(!useScannerMode);
  };

  const captureScannedFile = (base64Data: string) => {
    // Convert the base64 data to a file
    const blobBin = atob(base64Data.split(',')[1]);
    const array = [];
    for (let i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }
    const file = new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
    const timestamp = new Date().getTime();
    const scanFile = new File([file], `scanned_document_${timestamp}.jpg`, { type: 'image/jpeg' });

    setScannedFile(scanFile);
    handleFileProcessing(scanFile);
  };

  const handlePaymentProofUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    handleFileProcessing(file);
  };

  const handleFileProcessing = async (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a JPEG, PNG or PDF file');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'payment');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload payment proof');
      }

      const { fileUrl } = await response.json();

      setEducationDetails({
        ...educationDetails,
        paymentProofUrl: fileUrl
      });

      toast.success('Payment proof uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload payment proof');
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    const requiredFields = [
      'instituteType', 'instituteName', 'principalOrMudarisName',
      'district', 'state', 'zone', 'paymentProofUrl'
    ];

    requiredFields.forEach(field => {
      if (!educationDetails[field as keyof EducationDetailsType]) {
        newErrors[field] = 'This field is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    } else {
      toast.error('Please fill all required fields correctly');

      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-block p-1 px-3 bg-blue-100 rounded-full mb-2">
          <span className="text-sm font-semibold text-blue-700 tracking-wide uppercase">Step 3 of 4</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Education Details</h2>
        <p className="mt-2 text-gray-600">Please provide your educational information</p>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
          <h3 className="text-lg font-medium text-blue-800 mb-3">Institution Type & Information</h3>

          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="instituteType" className="block text-sm font-medium text-gray-700">
                Institution Type <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {['Dars', 'Arabic College', 'Hifz College'].map((type) => (
                  <label
                    key={type}
                    className={`flex items-center px-4 py-2 border-2 rounded-lg cursor-pointer transition ${educationDetails.instituteType === type
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-gray-300 hover:border-blue-300'
                      }`}
                  >
                    <input
                      type="radio"
                      name="instituteType"
                      value={type}
                      checked={educationDetails.instituteType === type}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{type}</span>
                    {educationDetails.instituteType === type && (
                      <svg className="ml-2 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </label>
                ))}
              </div>
              {errors.instituteType && (
                <p className="text-sm text-red-600 mt-1">{errors.instituteType}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="instituteName" className="block text-sm font-medium text-gray-700">
                  Institute Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="instituteName"
                  type="text"
                  name="instituteName"
                  value={educationDetails.instituteName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.instituteName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  placeholder="Enter institute name"
                />
                {errors.instituteName && (
                  <p className="text-sm text-red-600">{errors.instituteName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="principalOrMudarisName" className="block text-sm font-medium text-gray-700">
                  {educationDetails.instituteType === 'Dars' ? 'Mudaris Name' : 'Principal Name'} <span className="text-red-500">*</span>
                </label>
                <input
                  id="principalOrMudarisName"
                  type="text"
                  name="principalOrMudarisName"
                  value={educationDetails.principalOrMudarisName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.principalOrMudarisName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  placeholder={educationDetails.instituteType === 'Dars' ? 'Enter Mudaris name' : 'Enter Principal name'}
                />
                {errors.principalOrMudarisName && (
                  <p className="text-sm text-red-600">{errors.principalOrMudarisName}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-100">
          <h3 className="text-lg font-medium text-indigo-800 mb-3">Location Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Zone */}
            <div className="space-y-2">
              <label htmlFor="zone" className="block text-sm font-medium text-gray-700">
                Zone <span className="text-red-500">*</span>
              </label>
              <select
                id="zone"
                name="zone"
                value={educationDetails.zone}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.zone ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <option value="">Select Zone</option>
                {ZONES.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
              {errors.zone && (
                <p className="text-sm text-red-600">{errors.zone}</p>
              )}
            </div>

            {/* State */}
            <div className="space-y-2">
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State <span className="text-red-500">*</span>
              </label>
              <input
                id="state"
                type="text"
                name="state"
                value={educationDetails.state}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.state ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                placeholder="Enter state"
              />
              {errors.state && (
                <p className="text-sm text-red-600">{errors.state}</p>
              )}
            </div>

            {/* District */}
            <div className="space-y-2">
              <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                District <span className="text-red-500">*</span>
              </label>
              <input
                id="district"
                type="text"
                name="district"
                value={educationDetails.district}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${errors.district ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                placeholder="Enter district"
              />
              {errors.district && (
                <p className="text-sm text-red-600">{errors.district}</p>
              )}
            </div>
          </div>
        </div>


        {/* <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-3">Hall Ticket Information</h3>

          <div className="space-y-2">
            <label htmlFor="hallTicketDetails" className="block text-sm font-medium text-gray-700">
              Hall Ticket Details <span className="text-red-500">*</span>
            </label>
            <textarea
              id="hallTicketDetails"
              name="hallTicketDetails"
              value={educationDetails.hallTicketDetails}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border transition-colors focus:ring-2 focus:ring-gray-500 focus:border-gray-500 ${errors.hallTicketDetails ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              placeholder="Enter details about how you want to receive your hall ticket"
            />
            {errors.hallTicketDetails && (
              <p className="text-sm text-red-600">{errors.hallTicketDetails}</p>
            )}
          </div>
        </div> */}

        <div className="bg-green-50 rounded-lg p-5 border border-green-100">
          <h3 className="text-lg font-medium text-green-800 mb-3">Payment Information</h3>

          <div className="mb-4 p-4 bg-white rounded-lg border border-green-200 shadow-sm">
            <div className="flex flex-col md:flex-row gap-5">
              {/* Payment information column */}
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <svg className="h-6 w-6 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700">
                    Please make a payment of ₹200 to proceed with your application
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Account Name:</span> MUHAMMED ANSHID
                  </div>
                  <div>
                    <span className="font-medium">Account Number:</span> 67224371735
                  </div>
                  <div>
                    <span className="font-medium">IFSC Code:</span> SBIN0070710
                  </div>
                  <div>
                    <span className="font-medium">Bank:</span> SBI
                  </div>
                </div>

                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-800 mb-2">Payment Methods:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Bank Transfer (NEFT/IMPS/RTGS)</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Google Pay (UPI)</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">Other UPI Apps (PhonePe, Paytm, etc.)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR code column */}
              <div className="flex-shrink-0 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-5">
                <div className="bg-white p-2 border border-gray-200 rounded-lg mb-2">
                  {/* Replace this with your actual QR code image */}
                  <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                    {/* This is a placeholder - in your real application, you'd use an image tag with your QR code */}
                    <img src="/qr-code.jpeg" alt="Payment QR Code" className="w-32 h-32" />
                  </div>
                </div>
                <p className="text-xs text-center font-medium text-gray-600 mb-1">Scan to pay via Google Pay</p>
                <p className="text-xs text-center text-gray-500 mb-2">UPI ID: anshidanshumanalpadam-1@oksbi</p>
                <div className="flex flex-col gap-2 w-full">
                  <a
                    href="/qr-code.jpeg"
                    download="qr-code.jpeg"
                    className="inline-flex items-center justify-center px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded hover:bg-blue-100 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download QR Code
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        "upi://pay?pa=anshidanshumanalpadam-1@oksbi&pn=Muhammed+Anshid&am=200&cu=INR&tn=ExamFee",
                        "_blank"
                      )
                    }
                    className="inline-flex items-center justify-center px-3 py-1.5 bg-green-50 text-green-700 text-xs font-medium rounded hover:bg-green-100 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Pay Now
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex items-center">
                <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-xs text-gray-600">
                  After making the payment, please upload the payment screenshot or receipt below to complete your application.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="paymentProofUrl" className="block text-sm font-medium text-gray-700">
              Payment Proof <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
              <div className="flex-shrink-0">
                {educationDetails.paymentProofUrl ? (
                  <div className="h-24 w-24 rounded-md overflow-hidden bg-gray-100 border border-gray-200 relative group">
                    <img
                      src={educationDetails.paymentProofUrl}
                      alt="Payment proof"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={educationDetails.paymentProofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white text-xs underline"
                      >
                        View Full Size
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-grow space-y-3">
                <div className="relative border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handlePaymentProofUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="payment-upload"
                    disabled={isUploading}
                  />

                  {isUploading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 text-blue-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-blue-500 font-medium">Uploading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="bg-blue-100 rounded-full p-2 mb-2">
                        <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-gray-800 text-center">
                        Upload Payment Receipt
                      </p>
                      <p className="mt-1 text-xs text-gray-500 text-center">
                        Drag and drop your receipt, or click to browse
                      </p>
                    </>
                  )}
                </div>

                <div className="flex items-start md:items-center text-xs text-gray-500 bg-yellow-50 p-2 rounded-md border border-yellow-100">
                  <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-yellow-500 mt-0.5 md:mt-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>
                    Take a clear screenshot of your payment receipt or confirmation screen. Make sure all transaction details are visible.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 items-center text-xs">
                  <span className="text-gray-500">Supported file types:</span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-medium">JPG/JPEG</span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-medium">PNG</span>
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded font-medium">PDF</span>
                  <span className="text-gray-500 ml-2">(Max 5MB)</span>
                </div>
              </div>
            </div>

            {errors.paymentProofUrl && (
              <div className="flex items-center mt-1">
                <svg className="h-4 w-4 text-red-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-600">{errors.paymentProofUrl}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onPrevious}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 font-medium flex items-center justify-center shadow-sm"
        >
          <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous Step
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-8 py-3 rounded-lg transition-all duration-200 font-medium shadow-md flex items-center justify-center ${isSubmitting
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:-translate-y-0.5 hover:shadow-lg'
            }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              Submit Application
              <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}