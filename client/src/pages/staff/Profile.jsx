import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Lock, Mail, Phone, Shield } from 'lucide-react';

const StaffProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('/api/staff/me');
            setProfile(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile data.');
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading profile...</div>;
    if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
    if (!profile) return <div className="p-8 text-center">No profile found.</div>;

    const getProfileImage = () => {
        if (profile.profile_pic) {
             if (profile.profile_pic.startsWith('data:')) return profile.profile_pic;
             const normalizedPath = profile.profile_pic.replace(/\\/g, '/');
             return `${import.meta.env.VITE_API_URL || ''}${normalizedPath}`;
        }
        return null;
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                {/* Header / Banner */}
                <div className="bg-gradient-to-r from-green-800 to-green-900 p-6 text-white relative">
                     <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full" title="Profile Locked">
                        <Lock size={20} className="text-white" />
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-white/10 border-4 border-white overflow-hidden flex items-center justify-center">
                                {getProfileImage() ? (
                                    <img 
                                        src={getProfileImage()} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={64} className="text-green-200" />
                                )}
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold">{profile.rank} {profile.first_name} {profile.last_name} {profile.suffix_name}</h1>
                            <p className="text-green-200 text-lg mt-1">{profile.role || 'Training Staff'}</p>
                            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-green-700/50 text-sm border border-green-600">
                                <Lock size={14} className="mr-2" />
                                <span>Profile Locked</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="p-8">
                     <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <Lock className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    This profile is read-only. To update your information, please contact the system administrator.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Personal Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
                                <User className="mr-2 text-green-700" size={20} />
                                Personal Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                                    <p className="mt-1 text-gray-900 font-medium">{profile.rank} {profile.first_name} {profile.middle_name} {profile.last_name} {profile.suffix_name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Role</label>
                                    <p className="mt-1 text-gray-900 font-medium">{profile.role}</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2 flex items-center">
                                <Shield className="mr-2 text-green-700" size={20} />
                                Contact & Account
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 flex items-center">
                                        <Mail size={14} className="mr-1" /> Email Address
                                    </label>
                                    <p className="mt-1 text-gray-900 font-medium">{profile.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 flex items-center">
                                        <Phone size={14} className="mr-1" /> Contact Number
                                    </label>
                                    <p className="mt-1 text-gray-900 font-medium">{profile.contact_number || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffProfile;