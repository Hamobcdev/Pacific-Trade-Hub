import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

const KYC: React.FC = () => {
  const [idFile, setIdFile] = useState<File | null>(null);
  const [addressFile, setAddressFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'pending' | 'verified' | 'rejected'>('pending');
  const [idPreview, setIdPreview] = useState<string>('');
  const [addressPreview, setAddressPreview] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'address') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'id') {
          setIdFile(file);
          setIdPreview(reader.result as string);
        } else {
          setAddressFile(file);
          setAddressPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Here you would implement the actual file upload to Supabase
      // and update the verification status
      setStatus('pending');
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('KYC submitted:', { idFile, addressFile });
    } catch (error) {
      console.error('Error submitting KYC:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-pacifico text-primary mb-8">KYC Verification</h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold">Identity Verification</h2>
              {status === 'verified' && <CheckCircle className="text-green-500" />}
              {status === 'rejected' && <AlertCircle className="text-red-500" />}
            </div>
            <p className="text-gray-600 mt-2">
              Please provide the following documents to verify your identity. This is required for crypto trading compliance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Government-Issued ID
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="flex flex-col items-center">
                  <Upload className="text-gray-400 mb-2" size={24} />
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'id')}
                    accept="image/*,.pdf"
                    className="hidden"
                    id="id-upload"
                  />
                  <label
                    htmlFor="id-upload"
                    className="btn-primary cursor-pointer"
                  >
                    Upload ID
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Passport, Driver's License, or National ID
                  </p>
                </div>
                {idPreview && (
                  <div className="mt-4">
                    <img src={idPreview} alt="ID Preview" className="max-h-40 mx-auto" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proof of Address
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="flex flex-col items-center">
                  <Upload className="text-gray-400 mb-2" size={24} />
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, 'address')}
                    accept="image/*,.pdf"
                    className="hidden"
                    id="address-upload"
                  />
                  <label
                    htmlFor="address-upload"
                    className="btn-primary cursor-pointer"
                  >
                    Upload Document
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Utility Bill or Bank Statement (not older than 3 months)
                  </p>
                </div>
                {addressPreview && (
                  <div className="mt-4">
                    <img src={addressPreview} alt="Address Document Preview" className="max-h-40 mx-auto" />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Verification Status</h3>
              <div className={`text-sm ${
                status === 'verified' ? 'text-green-600' :
                status === 'rejected' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {status === 'verified' && 'Verified'}
                {status === 'rejected' && 'Rejected'}
                {status === 'pending' && 'Pending Review'}
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={!idFile || !addressFile}
            >
              Submit for Verification
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default KYC;