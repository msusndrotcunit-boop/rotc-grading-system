import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Lock, Mail, Phone, Shield, QrCode, MapPin, Calendar, Ruler, Activity, Flag, Globe, Facebook, Briefcase, Edit, Save, X } from 'lucide-react';
import QRCode from 'qrcode';
import { toast } from 'react-hot-toast';

const StaffProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get('/api/staff/me');
            setProfile(res.data);
            setFormData(res.data);
            generateQRCode(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile data.');
            setLoading(false);
        }
    };

    const generateQRCode = async (data) => {
        if (!data) return;
        const qrData = JSON.stringify({
            id: data.id,
            name: `${data.rank} ${data.first_name} ${data.last_name}`,
            afpsn: data.afpsn,
            role: 'training_staff'
        });
        
        try {
            const url = await QRCode.toDataURL(qrData);
            setQrCodeUrl(url);
        } catch (err) {
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put('/api/staff/profile', formData);
            setProfile(prev => ({ ...prev, ...formData }));
            setIsEditing(false);
            toast.success('Profile updated successfully');
        } catch (err) {
            console.error('Error updating profile:', err);
            toast.error(err.response?.data?.message || 'Failed to update profile');
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

    const InfoItem = ({ icon: Icon, label, value, name, type = "text" }) => (
        <div className="flex flex-col">
            <span className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                {Icon && <Icon size={12} />} {label}
            </span>
            {isEditing ? (
                <input
                    type={type}
                    name={name}
                    value={formData[name] || ''}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded px-2 py-1 text-sm w-full focus:outline-none focus:border-green-500"
                />
            ) : (
                <span className="font-medium text-gray-900">{value || '-'}</span>
            )}
        </div>
    );

    const isLocked = profile.is_profile_completed && !isEditing;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-green-800 to-green-900 p-6 text-white relative">
                    
                    <div className="absolute top-4 right-4 flex gap-2">
                        {isEditing ? (
                            <>
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                                    title="Cancel"
                                >
                                    <X size={20} />
                                </button>
                                <button 
                                    onClick={handleSubmit}
                                    className="bg-blue-500/80 hover:bg-blue-600 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                                    title="Save Changes"
                                >
                                    <Save size={20} />
                                </button>
                            </>
                        ) : (
                            !profile.is_profile_completed ? (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                                    title="Edit Profile"
                                >
                                    <Edit size={20} />
                                </button>
                            ) : (
                                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full" title="Profile Locked">
                                    <Lock size={20} className="text-white" />
                                </div>
                            )
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-full bg-white/10 border-4 border-white overflow-hidden flex items-center justify-center shadow-xl">
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
                        <div className="text-center md:text-left flex-1">
                            {isEditing ? (
                                <div className="space-y-2 text-gray-800">
                                    <div className="flex gap-2">
                                        <input name="rank" value={formData.rank || ''} onChange={handleInputChange} placeholder="Rank" className="p-1 rounded w-20" />
                                        <input name="first_name" value={formData.first_name || ''} onChange={handleInputChange} placeholder="First Name" className="p-1 rounded flex-1" />
                                        <input name="last_name" value={formData.last_name || ''} onChange={handleInputChange} placeholder="Last Name" className="p-1 rounded flex-1" />
                                        <input name="suffix_name" value={formData.suffix_name || ''} onChange={handleInputChange} placeholder="Suffix" className="p-1 rounded w-20" />
                                    </div>
                                    <div className="flex gap-2">
                                        <input name="afpsn" value={formData.afpsn || ''} onChange={handleInputChange} placeholder="AFPSN" className="p-1 rounded w-full" />
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            id="is_profile_completed"
                                            name="is_profile_completed"
                                            checked={formData.is_profile_completed == 1}
                                            onChange={(e) => setFormData(prev => ({ ...prev, is_profile_completed: e.target.checked ? 1 : 0 }))}
                                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                                        />
                                        <label htmlFor="is_profile_completed" className="text-sm text-white/90 font-medium cursor-pointer">
                                            Mark Profile as Complete (Locks Editing)
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-bold">{profile.rank} {profile.first_name} {profile.middle_name} {profile.last_name} {profile.suffix_name}</h1>
                                    <p className="text-green-200 text-lg mt-1">{profile.afpsn || 'No AFPSN'} | {profile.role || 'Training Staff'}</p>
                                </>
                            )}
                            
                            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                                <div className="px-3 py-1 rounded-full bg-green-700/50 text-sm border border-green-600 flex items-center">
                                    <Briefcase size={14} className="mr-2" />
                                    {isEditing ? (
                                        <input name="rotc_unit" value={formData.rotc_unit || ''} onChange={handleInputChange} className="bg-transparent border-none text-white w-32 focus:outline-none" placeholder="Unit" />
                                    ) : (
                                        profile.rotc_unit || 'No Unit'
                                    )}
                                </div>
                                <div className="px-3 py-1 rounded-full bg-green-700/50 text-sm border border-green-600 flex items-center">
                                    <MapPin size={14} className="mr-2" />
                                    {isEditing ? (
                                        <input name="mobilization_center" value={formData.mobilization_center || ''} onChange={handleInputChange} className="bg-transparent border-none text-white w-32 focus:outline-none" placeholder="Center" />
                                    ) : (
                                        profile.mobilization_center || 'No Center'
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* QR Code Card */}
                        <div className="bg-white p-3 rounded-lg shadow-lg hidden md:block">
                            {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />}
                            <div className="text-center text-green-900 text-xs font-bold mt-1">SCAN ME</div>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Personal Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center text-green-800">
                                <User className="mr-2" size={20} /> Personal Information
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                                <InfoItem icon={Calendar} label="Birthdate" value={profile.birthdate} name="birthdate" type="date" />
                                <InfoItem icon={MapPin} label="Birthplace" value={profile.birthplace} name="birthplace" />
                                <InfoItem icon={Activity} label="Age" value={profile.age} name="age" type="number" />
                                
                                <InfoItem icon={Flag} label="Nationality" value={profile.nationality} name="nationality" />
                                <InfoItem icon={User} label="Gender" value={profile.gender} name="gender" />
                                <InfoItem icon={User} label="Civil Status" value={profile.civil_status} name="civil_status" />
                                
                                <InfoItem icon={Ruler} label="Height (cm)" value={profile.height} name="height" />
                                <InfoItem icon={Activity} label="Weight (kg)" value={profile.weight} name="weight" />
                                <InfoItem icon={Activity} label="Blood Type" value={profile.blood_type} name="blood_type" />
                                
                                <InfoItem icon={Globe} label="Language Spoken" value={profile.language_spoken} name="language_spoken" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center text-green-800">
                                <Shield className="mr-2" size={20} /> Logistics & Sizes
                            </h3>
                            <div className="grid grid-cols-3 gap-6">
                                <InfoItem label="Combat Boots" value={profile.combat_boots_size} name="combat_boots_size" />
                                <InfoItem label="Uniform Size" value={profile.uniform_size} name="uniform_size" />
                                <InfoItem label="Bullcap Size" value={profile.bullcap_size} name="bullcap_size" />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact & QR (Mobile) */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center text-green-800">
                                <Phone className="mr-2" size={20} /> Contact Information
                            </h3>
                            <div className="space-y-4">
                                <InfoItem icon={MapPin} label="Address" value={profile.address} name="address" />
                                <InfoItem icon={Mail} label="Email Address" value={profile.email} name="email" type="email" />
                                <InfoItem icon={Phone} label="Mobile Number" value={profile.contact_number} name="contact_number" />
                                <InfoItem icon={Facebook} label="Facebook" value={profile.facebook_link} name="facebook_link" />
                            </div>
                        </div>

                        {/* QR Code for Mobile */}
                        <div className="bg-white rounded-lg shadow p-6 md:hidden flex flex-col items-center">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 text-green-800">My QR Code</h3>
                            {qrCodeUrl ? (
                                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 border-4 border-green-800 rounded-lg" />
                            ) : (
                                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center text-gray-400">Loading...</div>
                            )}
                            <p className="text-sm text-gray-500 mt-2 text-center">Present this code for attendance.</p>
                        </div>

                        {profile.is_profile_completed && !isEditing && (
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <Lock className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            Profile is locked. Contact admin for changes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {!profile.is_profile_completed && !isEditing && (
                             <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <Edit className="h-5 w-5 text-blue-400" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-blue-700">
                                            Please complete your profile to lock it.
                                        </p>
                                        <button 
                                            onClick={() => setIsEditing(true)}
                                            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500 underline"
                                        >
                                            Update Profile Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default StaffProfile;