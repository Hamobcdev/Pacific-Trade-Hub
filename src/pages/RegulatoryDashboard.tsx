import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const RegulatoryDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kycSubmissions, setKycSubmissions] = useState<any[]>([]);
  const adminEmails = ['siaosiw@gmail.com']; // Sync with Marketplace.tsx

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!adminEmails.includes(user.email || '')) {
      console.log('Access denied: Not an admin', user.email);
      alert('Access denied. Admins only.');
      navigate('/marketplace');
      return;
    }

    const fetchKycSubmissions = async () => {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('id, user_id, id_file, address_file, status, submitted_at')
        .order('submitted_at', { ascending: false });
      if (error) {
        console.error('Error fetching KYC submissions:', error);
      } else {
        setKycSubmissions(data || []);
      }
    };

    fetchKycSubmissions();
  }, [user, navigate]);

  const updateKycStatus = async (id: string, newStatus: 'verified' | 'rejected') => {
    const { error } = await supabase
      .from('kyc_documents')
      .update({ status: newStatus, reviewed_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      console.error('Error updating KYC status:', error);
      alert('Failed to update status.');
    } else {
      setKycSubmissions((prev) =>
        prev.map((submission) =>
          submission.id === id ? { ...submission, status: newStatus } : submission
        )
      );

      const submission = kycSubmissions.find((s) => s.id === id);
      if (submission) {
        await supabase
          .from('profiles')
          .update({ kyc_status: newStatus })
          .eq('id', submission.user_id);
      }
    }
  };

  if (!user || !adminEmails.includes(user.email || '')) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-pacifico text-primary mb-8">Regulatory Dashboard</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">KYC/AML Submissions</h2>
        {kycSubmissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">User ID</th>
                <th className="py-2">ID File</th>
                <th className="py-2">Address File</th>
                <th className="py-2">Status</th>
                <th className="py-2">Submitted</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {kycSubmissions.map((submission) => (
                <tr key={submission.id} className="border-b">
                  <td className="py-2">{submission.user_id.slice(0, 8)}...</td>
                  <td className="py-2">
                    <a href={submission.id_file} target="_blank" className="text-primary underline">
                      View
                    </a>
                  </td>
                  <td className="py-2">
                    <a href={submission.address_file} target="_blank" className="text-primary underline">
                      View
                    </a>
                  </td>
                  <td className="py-2">{submission.status}</td>
                  <td className="py-2">
                    {new Date(submission.submitted_at).toLocaleDateString()}
                  </td>
                  <td className="py-2">
                    {submission.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateKycStatus(submission.id, 'verified')}
                          className="btn-primary mr-2"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => updateKycStatus(submission.id, 'rejected')}
                          className="btn-secondary"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RegulatoryDashboard;