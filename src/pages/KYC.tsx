// src/pages/KYC.tsx
import { useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '/home/bcdev/Downloads/project-bolt-sb1-sasdzuuz/Pacific-Trade-Hub/src/lib/supabaseClient.ts';

const KYC = () => {
  const [primaryId, setPrimaryId] = useState<File | null>(null);
  const [secondaryId, setSecondaryId] = useState<File | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!primaryId || !secondaryId) return alert('Please upload both IDs');

    const primaryUpload = await supabase.storage
      .from('kyc-documents')
      .upload(`${user?.email}/primary-${Date.now()}.jpg`, primaryId);
    const secondaryUpload = await supabase.storage
      .from('kyc-documents')
      .upload(`${user?.email}/secondary-${Date.now()}.jpg`, secondaryId);

    if (primaryUpload.error || secondaryUpload.error) {
      console.error('Upload error:', primaryUpload.error || secondaryUpload.error);
      return alert('Upload failed—please try again');
    }

    await supabase.from('users').update({ kyc_status: 'pending' }).eq('email', user?.email);
    alert('KYC submitted for manual review by Pacific Trade Hub and Central Bank');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
        <h1 style={{ fontSize: '24px', color: '#333' }}>Pacific Trade Hub</h1>
        <h2 style={{ fontSize: '18px', color: '#666' }}>KYC Verification Form</h2>
        <p style={{ fontSize: '14px', color: '#888' }}>
          Required only for Samoan users purchasing with cryptocurrency. Please submit valid government-issued IDs.
        </p>
      </header>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
            Primary Government-Issued Photo ID
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPrimaryId(e.target.files?.[0] || null)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <small style={{ color: '#666' }}>E.g., Passport, Driver’s License</small>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>
            Secondary Government-Issued Photo ID
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSecondaryId(e.target.files?.[0] || null)}
            style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <small style={{ color: '#666' }}>E.g., National ID, Voter ID</small>
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Submit for Verification
        </button>
      </form>
      <footer style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#888' }}>
        <p>Your documents will be reviewed by Pacific Trade Hub in collaboration with the Central Bank of Samoa.</p>
        <p>Contact support@pacifictradehub.com for assistance.</p>
      </footer>
    </div>
  );
};

export default KYC;