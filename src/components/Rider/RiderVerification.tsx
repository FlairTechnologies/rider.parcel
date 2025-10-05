"use client"
import React, { useState, useRef } from 'react';
import { 
  Shield, 
  Upload, 
  Check, 
  X, 
  FileText, 
  CreditCard, 
  User,
  AlertCircle,
  Camera,
  Eye,
  EyeOff,
  ArrowLeft,
  Save
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const RiderVerificationPage = () => {
  // Form states
  const [ninNumber, setNinNumber] = useState('');
  const [bvnNumber, setBvnNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const router= useRouter();
  
  // File upload states
  const [ninCardFile, setNinCardFile] = useState(null);
  const [driversLicenseFile, setDriversLicenseFile] = useState(null);
  const [ninCardPreview, setNinCardPreview] = useState(null);
  const [licensePreview, setLicensePreview] = useState(null);
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBvn, setShowBvn] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // File input refs
  const ninCardInputRef = useRef(null);
  const licenseInputRef = useRef(null);
  
  // Verification status (mock data - replace with API data)
  const [verificationStatus] = useState({
    nin: { verified: false, status: 'pending' },
    bvn: { verified: false, status: 'pending' },
    driversLicense: { verified: false, status: 'pending' },
    overall: 'pending'
  });

  // Validation functions
  const validateNIN = (nin) => {
    return nin.length === 11 && /^\d+$/.test(nin);
  };

  const validateBVN = (bvn) => {
    return bvn.length === 11 && /^\d+$/.test(bvn);
  };

  const validateLicenseNumber = (license) => {
    return license.length >= 8 && /^[A-Z0-9]+$/.test(license.toUpperCase());
  };

  // File handling functions
  const handleFileUpload = (file, type) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        [type]: 'Please upload a valid image (JPEG, PNG) or PDF file'
      }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        [type]: 'File size must be less than 5MB'
      }));
      return;
    }

    // Clear previous errors
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[type];
      return newErrors;
    });

    // Set file and preview
    if (type === 'ninCard') {
      setNinCardFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setNinCardPreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setNinCardPreview(null);
      }
    } else if (type === 'driversLicense') {
      setDriversLicenseFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setLicensePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setLicensePreview(null);
      }
    }
  };

  // Form submission
  const handleSubmit = async () => {
    setErrors({});
    setIsSubmitting(true);

    // Validate form
    const newErrors = {};
    
    if (!validateNIN(ninNumber)) {
      newErrors.ninNumber = 'NIN must be exactly 11 digits';
    }
    
    if (bvnNumber && !validateBVN(bvnNumber)) {
      newErrors.bvnNumber = 'BVN must be exactly 11 digits';
    }
    
    if (!validateLicenseNumber(licenseNumber)) {
      newErrors.licenseNumber = 'Please enter a valid driver\'s license number';
    }
    
    if (!expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (new Date(expiryDate) <= new Date()) {
      newErrors.expiryDate = 'License must not be expired';
    }
    
    if (!ninCardFile) {
      newErrors.ninCard = 'NIN card image is required';
    }
    
    if (!driversLicenseFile) {
      newErrors.driversLicense = 'Driver\'s license image is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('ninNumber', ninNumber);
      formData.append('bvnNumber', bvnNumber);
      formData.append('licenseNumber', licenseNumber.toUpperCase());
      formData.append('expiryDate', expiryDate);
      formData.append('ninCard', ninCardFile);
      formData.append('driversLicense', driversLicenseFile);

      // TODO: Replace with actual API call
      console.log('Submitting verification data:', {
        ninNumber,
        bvnNumber,
        licenseNumber: licenseNumber.toUpperCase(),
        expiryDate,
        ninCardFile: ninCardFile.name,
        driversLicenseFile: driversLicenseFile.name
      });

      // Mock API call - simulates processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSuccessMessage('Verification documents submitted successfully! We will review your documents within 24-48 hours.');
      
      /* 
      ==========================================
      ACTUAL API IMPLEMENTATION - UNCOMMENT WHEN READY
      ==========================================
      
      const response = await fetch('/api/rider/verification', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccessMessage('Verification documents submitted successfully! We will review your documents within 24-48 hours.');
        // Optional: Redirect to dashboard or verification status page
        // router.push('/rider/dashboard');
      } else {
        setErrors({ submit: data.message || 'Failed to submit verification' });
      }
      
      ==========================================
      END ACTUAL API IMPLEMENTATION
      ==========================================
      */

    } catch (error) {
      console.error('Verification submission error:', error);
      setErrors({ submit: 'An error occurred while submitting your verification. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <X className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div onClick={()=>router.back()} className="flex items-center space-x-4 mb-8">
          <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
            
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Account Verification</h1>
            <p className="text-gray-600 mt-1">Complete your verification to start accepting orders</p>
          </div>
        </div>

        {/* Verification Status Overview */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="w-6 h-6 text-[#F9CA44]" />
            <h2 className="text-xl font-semibold">Verification Status</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border ${getStatusColor(verificationStatus.nin.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span className="font-medium">NIN</span>
                </div>
                {getStatusIcon(verificationStatus.nin.status)}
              </div>
              <p className="text-sm mt-1 capitalize">{verificationStatus.nin.status}</p>
            </div>

            <div className={`p-4 rounded-lg border ${getStatusColor(verificationStatus.bvn.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span className="font-medium">BVN</span>
                </div>
                {getStatusIcon(verificationStatus.bvn.status)}
              </div>
              <p className="text-sm mt-1 capitalize">{verificationStatus.bvn.status}</p>
            </div>

            <div className={`p-4 rounded-lg border ${getStatusColor(verificationStatus.driversLicense.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Driver's License</span>
                </div>
                {getStatusIcon(verificationStatus.driversLicense.status)}
              </div>
              <p className="text-sm mt-1 capitalize">{verificationStatus.driversLicense.status}</p>
            </div>
          </div>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-8">
            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <p className="text-green-700">{successMessage}</p>
                </div>
              </div>
            )}

            {/* General Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-700">{errors.submit}</p>
                </div>
              </div>
            )}

            {/* NIN Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <User className="w-5 h-5 text-[#F9CA44]" />
                <span>National Identification Number (NIN)</span>
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NIN Number *
                  </label>
                  <input
                    type="text"
                    value={ninNumber}
                    onChange={(e) => setNinNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#F9CA44] focus:border-transparent ${
                      errors.ninNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your 11-digit NIN"
                    maxLength={11}
                  />
                  {errors.ninNumber && (
                    <p className="text-red-600 text-sm mt-1">{errors.ninNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload NIN Card *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      ref={ninCardInputRef}
                      onChange={(e) => handleFileUpload(e.target.files[0], 'ninCard')}
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                    <button
                      type="button"
                      onClick={() => ninCardInputRef.current?.click()}
                      className={`w-full h-12 border-2 border-dashed rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors ${
                        errors.ninCard ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <Upload className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-600">
                        {ninCardFile ? ninCardFile.name : 'Choose file'}
                      </span>
                    </button>
                  </div>
                  {errors.ninCard && (
                    <p className="text-red-600 text-sm mt-1">{errors.ninCard}</p>
                  )}
                  
                  {ninCardPreview && (
                    <div className="mt-3">
                      <img
                        src={ninCardPreview}
                        alt="NIN Card Preview"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* BVN Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-[#F9CA44]" />
                <span>Bank Verification Number (BVN)</span>
                <span className="text-sm font-normal text-gray-500">(Optional)</span>
              </h3>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BVN Number
                </label>
                <div className="relative">
                  <input
                    type={showBvn ? "text" : "password"}
                    value={bvnNumber}
                    onChange={(e) => setBvnNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#F9CA44] focus:border-transparent ${
                      errors.bvnNumber ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your 11-digit BVN"
                    maxLength={11}
                  />
                  <button
                    type="button"
                    onClick={() => setShowBvn(!showBvn)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showBvn ? (
                      <EyeOff className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.bvnNumber && (
                  <p className="text-red-600 text-sm mt-1">{errors.bvnNumber}</p>
                )}
              </div>
            </div>

            {/* Driver's License Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#F9CA44]" />
                <span>Driver's License</span>
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Number *
                    </label>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#F9CA44] focus:border-transparent ${
                        errors.licenseNumber ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., ABC12345DE"
                    />
                    {errors.licenseNumber && (
                      <p className="text-red-600 text-sm mt-1">{errors.licenseNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#F9CA44] focus:border-transparent ${
                        errors.expiryDate ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.expiryDate && (
                      <p className="text-red-600 text-sm mt-1">{errors.expiryDate}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Driver's License *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      ref={licenseInputRef}
                      onChange={(e) => handleFileUpload(e.target.files[0], 'driversLicense')}
                      className="hidden"
                      accept="image/*,.pdf"
                    />
                    <button
                      type="button"
                      onClick={() => licenseInputRef.current?.click()}
                      className={`w-full h-12 border-2 border-dashed rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors ${
                        errors.driversLicense ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <Upload className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-600">
                        {driversLicenseFile ? driversLicenseFile.name : 'Choose file'}
                      </span>
                    </button>
                  </div>
                  {errors.driversLicense && (
                    <p className="text-red-600 text-sm mt-1">{errors.driversLicense}</p>
                  )}
                  
                  {licensePreview && (
                    <div className="mt-3">
                      <img
                        src={licensePreview}
                        alt="Driver's License Preview"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* File Upload Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Document Upload Guidelines:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Accepted formats: JPEG, PNG, PDF</li>
                <li>• Maximum file size: 5MB per document</li>
                <li>• Ensure documents are clear and readable</li>
                <li>• All corners of the document should be visible</li>
                <li>• Documents should not be expired</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#F9CA44] text-white rounded-lg hover:bg-[#e0b63c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Submit for Verification</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">What is NIN?</h4>
              <p>National Identification Number (NIN) is a unique 11-digit number issued to Nigerian citizens and legal residents by NIMC.</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Why do we need these documents?</h4>
              <p>We verify your identity to ensure the safety and security of our platform for all users and to comply with regulatory requirements.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderVerificationPage;