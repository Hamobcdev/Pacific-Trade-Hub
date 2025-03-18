import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const KYC: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [primaryIdFile, setPrimaryIdFile] = useState<File | null>(null);
  const [secondaryIdFile, setSecondaryIdFile] = useState<File | null>(null);
  const [addressFile, setAddressFile] = useState<File | null>(null);
  const [digitalSignature, setDigitalSignature] = useState<string>('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Load existing data from localStorage or Supabase
    const savedData = localStorage.getItem(`kyc_${user.id}`);
    if (savedData) {
      const { digitalSignature } = JSON.parse(savedData);
      setDigitalSignature(digitalSignature || '');
    }
  }, [user, navigate]);

  const handleFileUpload = async (file: File | null, type: 'primary' | 'secondary' | 'address') => {
    if (!file || !user) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${type}_${user.id}_${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage
      .from('kyc-docs')
      .upload(fileName, file);
    if (error) {
      console.error(`Error uploading ${type} file:`, error);
      return null;
    }
    return supabase.storage.from('kyc-docs').getPublicUrl(fileName).data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !primaryIdFile || !addressFile) {
      alert('Please upload primary ID and address proof.');
      return;
    }

    const primaryIdUrl = await handleFileUpload(primaryIdFile, 'primary');
    const secondaryIdUrl = secondaryIdFile ? await handleFileUpload(secondaryIdFile, 'secondary') : null;
    const addressUrl = await handleFileUpload(addressFile, 'address');

    if (!primaryIdUrl || !addressUrl) {
      alert('File upload failed.');
      return;
    }

    const { error } = await supabase.from('kyc_documents').insert({
      user_id: user.id,
      id_file: primaryIdUrl,
      secondary_id_file: secondaryIdUrl,
      address_file: addressUrl,
      status: 'pending',
      digital_signature: digitalSignature,
    });

    if (error) {
      console.error('Error submitting KYC:', error);
      alert('Submission failed.');
    } else {
      alert('KYC submitted successfully!');
      localStorage.removeItem(`kyc_${user.id}`); // Clear draft
      navigate('/profile');
    }
  };

  const saveDraft = () => {
    if (user) {
      localStorage.setItem(
        `kyc_${user.id}`,
        JSON.stringify({ digitalSignature })
      );
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-pacifico text-primary mb-8">KYC Verification</h1>
      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Primary Government ID (with Photo)</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setPrimaryIdFile(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Secondary Government ID (Optional)</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setSecondaryIdFile(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Proof of Address</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setAddressFile(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Digital Signature</label>
            <input
              type="text"
              value={digitalSignature}
              onChange={(e) => {
                setDigitalSignature(e.target.value);
                saveDraft();
              }}
              placeholder="Enter your digital signature"
              className="w-full p-2 border rounded-lg"
            />
            <p className="text-sm text-gray-500">
              Future: Facial recognition or blockchain validation required.
            </p>
          </div>
          <button type="submit" className="btn-primary w-full">
            Submit KYC
          </button>
        </form>
      </div>
    </div>
  );
};

export default KYC;