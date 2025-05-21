// src/components/form/PersonalDetails.tsx
import { ChangeEvent, useState } from 'react';
import { PersonalDetails as PersonalDetailsType } from '@/types';
import { toast } from 'react-hot-toast';

interface Props {
    personalDetails: PersonalDetailsType;
    setPersonalDetails: (details: PersonalDetailsType) => void;
    onNext: () => void;
    onPrevious: () => void;
}

export default function PersonalDetails({
    personalDetails,
    setPersonalDetails,
    onNext,
    onPrevious
}: Props) {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isUploading, setIsUploading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPersonalDetails({
            ...personalDetails,
            [name]: value
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleFocus = (fieldName: string) => {
        setFocusedField(fieldName);
    };

    const handleBlur = () => {
        setFocusedField(null);
    };

    const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please upload a JPEG or PNG image');
            return;
        }

        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('Image size should be less than 2MB');
            return;
        }

        try {
            setIsUploading(true);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'photo');

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload photo');
            }

            const { fileUrl } = await response.json();

            setPersonalDetails({
                ...personalDetails,
                photoUrl: fileUrl
            });

            toast.success('Photo uploaded successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload photo');
        } finally {
            setIsUploading(false);
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        const requiredFields = [
            'name', 'fatherName', 'dateOfBirth', 'phoneNumber',
            'whatsappNumber', 'address', 'photoUrl', 'skssflMembershipId', 'positionHeld'
        ];

        requiredFields.forEach(field => {
            if (!personalDetails[field as keyof PersonalDetailsType]) {
                newErrors[field] = 'This field is required';
            }
        });

        if (personalDetails.phoneNumber && !/^\d{10}$/.test(personalDetails.phoneNumber)) {
            newErrors.phoneNumber = 'Phone number must be 10 digits';
        }

        if (personalDetails.whatsappNumber && !/^\d{10}$/.test(personalDetails.whatsappNumber)) {
            newErrors.whatsappNumber = 'WhatsApp number must be 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateForm()) {
            onNext();
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
                    <span className="text-sm font-semibold text-blue-700 tracking-wide uppercase">Step 2 of 4</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Personal Information</h2>
                <p className="mt-2 text-gray-600">Tell us about yourself to personalize your examination experience</p>
            </div>

            <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                    <h3 className="text-lg font-medium text-blue-800 mb-4">Basic Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label 
                                htmlFor="name" 
                                className={`block text-sm font-medium transition-colors ${focusedField === 'name' ? 'text-blue-700' : 'text-gray-700'}`}
                            >
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className={`relative rounded-lg transition-all duration-300 ${
                                focusedField === 'name' ? 'ring-2 ring-blue-300' : ''
                            }`}>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={personalDetails.name}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('name')}
                                    onBlur={handleBlur}
                                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                                        errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && (
                                    <div className="flex items-center mt-1">
                                        <svg className="h-4 w-4 text-red-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-xs text-red-600">{errors.name}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label 
                                htmlFor="fatherName" 
                                className={`block text-sm font-medium transition-colors ${focusedField === 'fatherName' ? 'text-blue-700' : 'text-gray-700'}`}
                            >
                                Father's Name <span className="text-red-500">*</span>
                            </label>
                            <div className={`relative rounded-lg transition-all duration-300 ${
                                focusedField === 'fatherName' ? 'ring-2 ring-blue-300' : ''
                            }`}>
                                <input
                                    id="fatherName"
                                    type="text"
                                    name="fatherName"
                                    value={personalDetails.fatherName}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('fatherName')}
                                    onBlur={handleBlur}
                                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                                        errors.fatherName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                    placeholder="Enter your father's name"
                                />
                                {errors.fatherName && (
                                    <div className="flex items-center mt-1">
                                        <svg className="h-4 w-4 text-red-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-xs text-red-600">{errors.fatherName}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-100">
                    <h3 className="text-lg font-medium text-indigo-800 mb-4">Contact Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label 
                                htmlFor="dateOfBirth" 
                                className={`block text-sm font-medium transition-colors ${focusedField === 'dateOfBirth' ? 'text-indigo-700' : 'text-gray-700'}`}
                            >
                                Date of Birth <span className="text-red-500">*</span>
                            </label>
                            <div className={`relative rounded-lg transition-all duration-300 ${
                                focusedField === 'dateOfBirth' ? 'ring-2 ring-indigo-300' : ''
                            }`}>
                                <input
                                    id="dateOfBirth"
                                    type="date"
                                    name="dateOfBirth"
                                    value={personalDetails.dateOfBirth}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('dateOfBirth')}
                                    onBlur={handleBlur}
                                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                                        errors.dateOfBirth ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                />
                                {errors.dateOfBirth && (
                                    <div className="flex items-center mt-1">
                                        <svg className="h-4 w-4 text-red-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-xs text-red-600">{errors.dateOfBirth}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label 
                                htmlFor="phoneNumber" 
                                className={`block text-sm font-medium transition-colors ${focusedField === 'phoneNumber' ? 'text-indigo-700' : 'text-gray-700'}`}
                            >
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <div className={`relative rounded-lg transition-all duration-300 ${
                                focusedField === 'phoneNumber' ? 'ring-2 ring-indigo-300' : ''
                            }`}>
                                <input
                                    id="phoneNumber"
                                    type="tel"
                                    name="phoneNumber"
                                    value={personalDetails.phoneNumber}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('phoneNumber')}
                                    onBlur={handleBlur}
                                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                                        errors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                    placeholder="10-digit phone number"
                                    maxLength={10}
                                />
                                {errors.phoneNumber && (
                                    <div className="flex items-center mt-1">
                                        <svg className="h-4 w-4 text-red-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-xs text-red-600">{errors.phoneNumber}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                        <div className="space-y-2">
                            <label 
                                htmlFor="whatsappNumber" 
                                className={`block text-sm font-medium transition-colors ${focusedField === 'whatsappNumber' ? 'text-indigo-700' : 'text-gray-700'}`}
                            >
                                WhatsApp Number <span className="text-red-500">*</span>
                            </label>
                            <div className={`relative rounded-lg transition-all duration-300 ${
                                focusedField === 'whatsappNumber' ? 'ring-2 ring-indigo-300' : ''
                            }`}>
                                <div className="flex items-center">
                                    <input
                                        id="whatsappNumber"
                                        type="tel"
                                        name="whatsappNumber"
                                        value={personalDetails.whatsappNumber}
                                        onChange={handleChange}
                                        onFocus={() => handleFocus('whatsappNumber')}
                                        onBlur={handleBlur}
                                        className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                                            errors.whatsappNumber ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                        placeholder="10-digit WhatsApp number"
                                        maxLength={10}
                                    />
                                    <button
                                        type="button"
                                        className="ml-2 text-indigo-600 hover:text-indigo-800"
                                        onClick={() => {
                                            if (personalDetails.phoneNumber) {
                                                setPersonalDetails({
                                                    ...personalDetails,
                                                    whatsappNumber: personalDetails.phoneNumber
                                                });
                                                if (errors.whatsappNumber) {
                                                    setErrors({
                                                        ...errors,
                                                        whatsappNumber: ''
                                                    });
                                                }
                                            } else {
                                                toast.error('Please enter phone number first');
                                            }
                                        }}
                                    >
                                        <span className="text-xs font-medium">Same as phone</span>
                                    </button>
                                </div>
                                {errors.whatsappNumber && (
                                    <div className="flex items-center mt-1">
                                        <svg className="h-4 w-4 text-red-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-xs text-red-600">{errors.whatsappNumber}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label 
                                htmlFor="skssflMembershipId" 
                                className={`block text-sm font-medium transition-colors ${focusedField === 'skssflMembershipId' ? 'text-indigo-700' : 'text-gray-700'}`}
                            >
                                SKSSF Membership ID <span className="text-red-500">*</span>
                            </label>
                            <div className={`relative rounded-lg transition-all duration-300 ${
                                focusedField === 'skssflMembershipId' ? 'ring-2 ring-indigo-300' : ''
                            }`}>
                                <input
                                    id="skssflMembershipId"
                                    type="text"
                                    name="skssflMembershipId"
                                    value={personalDetails.skssflMembershipId}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus('skssflMembershipId')}
                                    onBlur={handleBlur}
                                    className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                                        errors.skssflMembershipId ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                    placeholder="Enter your SKSSF Membership ID"
                                />
                                {errors.skssflMembershipId && (
                                    <div className="flex items-center mt-1">
                                        <svg className="h-4 w-4 text-red-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-xs text-red-600">{errors.skssflMembershipId}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 space-y-2">
                        <label 
                            htmlFor="address" 
                            className={`block text-sm font-medium transition-colors ${focusedField === 'address' ? 'text-indigo-700' : 'text-gray-700'}`}
                        >
                            Address <span className="text-red-500">*</span>
                        </label>
                        <div className={`relative rounded-lg transition-all duration-300 ${
                            focusedField === 'address' ? 'ring-2 ring-indigo-300' : ''
                        }`}>
                            <textarea
                                id="address"
                                name="address"
                                value={personalDetails.address}
                                onChange={handleChange}
                                onFocus={() => handleFocus('address')}
                                onBlur={handleBlur}
                                rows={3}
                                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                                    errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                }`}
                                placeholder="Enter your complete address"
                            />
                            {errors.address && (
                                <div className="flex items-center mt-1">
                                    <svg className="h-4 w-4 text-red-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-xs text-red-600">{errors.address}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-green-50 rounded-lg p-5 border border-green-100">
                    <h3 className="text-lg font-medium text-green-800 mb-4">Additional Information</h3>
                    
                    <div className="space-y-2">
                        <label 
                            htmlFor="positionHeld" 
                            className={`block text-sm font-medium transition-colors ${focusedField === 'positionHeld' ? 'text-green-700' : 'text-gray-700'}`}
                        >
                            Position Held in Organization(SKSSF) <span className="text-red-500">*</span>
                        </label>
                        <div className={`relative rounded-lg transition-all duration-300 ${
                            focusedField === 'positionHeld' ? 'ring-2 ring-green-300' : ''
                        }`}>
                            <input
                                id="positionHeld"
                                type="text"
                                name="positionHeld"
                                value={personalDetails.positionHeld}
                                onChange={handleChange}
                                onFocus={() => handleFocus('positionHeld')}
                                onBlur={handleBlur}
                                className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                                    errors.positionHeld ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                }`}
                                placeholder="Enter your position in the organization"
                            />
                            {errors.positionHeld && (
                                <div className="flex items-center mt-1">
                                    <svg className="h-4 w-4 text-red-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-xs text-red-600">{errors.positionHeld}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-5 border border-purple-100">
                    <h3 className="text-lg font-medium text-purple-800 mb-4">Profile Photo</h3>
                    
                    <div className="space-y-2">
                        <label htmlFor="photoUpload" className="block text-sm font-medium text-gray-700">
                            Photo <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-col md:flex-row items-center gap-5">
                            <div className="flex-shrink-0">
                                {personalDetails.photoUrl ? (
                                    <div className="relative group">
                                        <img
                                            src={personalDetails.photoUrl}
                                            alt="Profile"
                                            className="w-32 h-32 rounded-lg object-cover border-2 border-purple-200"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a 
                                                href={personalDetails.photoUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-white text-xs underline"
                                            >
                                                View Full Size
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 rounded-lg border-2 border-dashed border-purple-300 flex flex-col items-center justify-center bg-purple-50 text-purple-400">
                                        <svg className="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span className="text-xs mt-2">No photo</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex-grow space-y-3">
                                <div className="relative border border-dashed border-purple-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white hover:bg-purple-50 transition-colors cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png"
                                        onChange={handlePhotoUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        id="photo-upload"
                                        disabled={isUploading}
                                    />
                                    {isUploading ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 text-purple-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span className="text-purple-500 font-medium">Uploading...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <svg className="h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                                            </svg>
                                            <p className="mt-2 text-sm font-medium text-gray-900">
                                                Drag and drop a photo, or click to browse
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                JPEG or PNG, max 2MB
                                            </p>
                                        </>
                                    )}
                                </div>
                                
                                <div className="flex items-center text-xs text-gray-500">
                                    <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Upload a recent passport-sized photo with a white background
                                </div>
                            </div>
                        </div>
                        {errors.photoUrl && (
                            <div className="flex items-center mt-1">
                                <svg className="h-4 w-4 text-red-500 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <p className="text-xs text-red-600">{errors.photoUrl}</p>
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
                    onClick={handleNext}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                    Next Step
                    <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}