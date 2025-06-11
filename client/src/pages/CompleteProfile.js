import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CompleteProfile = () => {
  const [profileData, setProfileData] = useState({
    fullName: '',
    skills: '',
    bio: '',
    discordHandle: '',
    profilePicUrl: '',
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/profile/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const user = await res.json();
        setProfileData({
          fullName: user.fullName || '',
          skills: user.skills?.join(', ') || '',
          bio: user.bio || '',
          discordHandle: user.discordHandle || '',
          profilePicUrl: user.profilePicUrl || ''
        });
        setPreviewUrl(user.profilePicUrl || '');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (field === 'profilePicUrl') {
      setPreviewUrl(value);
    }
  };

  const validateDiscord = (discord) => {
    return /^.+#\d{4}$/.test(discord); // username#1234
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (profileData.discordHandle && !validateDiscord(profileData.discordHandle)) {
      return alert('Invalid Discord handle format (expected username#1234)');
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/profile/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        navigate('/');
      } else {
        alert('Profile update failed');
      }
    } catch (err) {
      console.error('Profile error:', err);
      alert('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-[#141416] flex justify-center items-center py-10 px-4">
      <div className="w-full max-w-xl bg-[#533F4D] rounded-2xl p-6 shadow-xl">
        <h2 className="text-white text-2xl font-semibold text-center mb-6">
          {profileData.fullName ? 'Edit Profile' : 'Complete Your Profile'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-white block mb-1">Full Name</label>
            <input
              type="text"
              value={profileData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-white block mb-1">Your Skills (comma separated)</label>
            <input
              type="text"
              value={profileData.skills}
              onChange={(e) => handleChange('skills', e.target.value)}
              className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-white block mb-1">Bio</label>
            <textarea
              value={profileData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white min-h-[100px] resize-none focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="text-white block mb-1">Discord Handle (username#1234)</label>
            <input
              type="text"
              value={profileData.discordHandle}
              onChange={(e) => handleChange('discordHandle', e.target.value)}
              className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-white block mb-1">Profile Picture URL</label>
            <input
              type="url"
              value={profileData.profilePicUrl}
              onChange={(e) => handleChange('profilePicUrl', e.target.value)}
              className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white focus:outline-none"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-3 w-24 h-24 rounded-full border-2 border-white object-cover"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#A3492F] text-white font-semibold rounded hover:bg-[#EE7C53]"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
