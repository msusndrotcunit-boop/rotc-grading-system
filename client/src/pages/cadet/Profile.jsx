import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Moon, Sun, Lock } from 'lucide-react';
import { cacheSingleton, getSingleton } from '../../utils/db';
import { 
    YEAR_LEVEL_OPTIONS, 
    SCHOOL_YEAR_OPTIONS, 
    BATTALION_OPTIONS, 
    COMPANY_OPTIONS, 
    PLATOON_OPTIONS, 
    SEMESTER_OPTIONS, 
    COURSE_OPTIONS,
    CADET_COURSE_OPTIONS 
} from '../../constants/options';

const Profile = () => {
    const [profile, setProfile] = useState({
        rank: '',
        firstName: '',
        middleName: '',
        lastName: '',
        suffixName: '',
        email: '',
        contactNumber: '',
        address: '',
        course: '',
        yearLevel: '',
        schoolYear: '',
        battalion: '',
        company: '',
        platoon: '',
        cadetCourse: 'MS1',
        semester: '',
        status: 'Ongoing',
        studentId: ''
    });
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        fetchProfile();
        
        // Load Dark Mode Preference
        const isDark = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const fetchProfile = async () => {
        try {
            try {
                const cached = await getSingleton('profiles', 'cadet');
                if (cached) {
                    updateProfileState(cached);
                    setLoading(false);
                }
            } catch {}
            const res = await axios.get('/api/cadet/profile');
            updateProfileState(res.data);
            await cacheSingleton('profiles', 'cadet', res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const updateProfileState = (data) => {
        setProfile({
            rank: data.rank || '',
            firstName: data.first_name,
            middleName: data.middle_name || '',
            lastName: data.last_name,
            suffixName: data.suffix_name || '',
            email: data.email,
            contactNumber: data.contact_number || '',
            address: data.address || '',
            course: data.course || '',
            yearLevel: data.year_level || '',
            schoolYear: data.school_year || '',
            battalion: data.battalion || '',
            company: data.company || '',
            platoon: data.platoon || '',
            cadetCourse: data.cadet_course || 'MS1',
            semester: data.semester || '',
            status: data.status || 'Ongoing'
        });
        if (data.profile_pic) {
            if (data.profile_pic.startsWith('data:')) {
                setPreview(data.profile_pic);
            } else {
                const normalizedPath = data.profile_pic.replace(/\\/g, '/');
                setPreview(`${import.meta.env.VITE_API_URL || ''}${normalizedPath}`);
            }
        }
    };

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    if (loading) return <div className="text-center p-10 dark:text-white">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-10">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Profile</h1>
                <button 
                    onClick={toggleDarkMode}
                    className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-full transition"
                >
                    {darkMode ? <Sun className="text-yellow-400" size={20} /> : <Moon className="text-gray-600" size={20} />}
                    <span className="text-sm font-medium dark:text-white">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
            </div>

            {/* About the App Section */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg border border-indigo-100 dark:border-indigo-800 mb-8">
                <h2 className="text-xl font-bold text-indigo-800 dark:text-indigo-300 mb-2">About the App</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                    The ROTC Grading Management System is the official platform for the MSU-SND ROTC Unit. 
                    This system streamlines the management of cadet records, attendance tracking, grading, and merit/demerit points.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="font-semibold text-gray-900 dark:text-gray-200">Version:</span> 
                        <span className="text-gray-600 dark:text-gray-400 ml-2">2.3.18</span>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-900 dark:text-gray-200">Developer:</span> 
                        <span className="text-gray-600 dark:text-gray-400 ml-2">MSU-SND ROTC Unit</span>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-900 dark:text-gray-200">Contact:</span> 
                        <span className="text-gray-600 dark:text-gray-400 ml-2">msusndrotcunit@gmail.com</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Photo & Settings */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-center">
                        <div className="relative inline-block">
                            <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-100 mx-auto border-4 border-white dark:border-gray-700 shadow-lg">
                                {preview ? (
                                    <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <User size={64} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <h2 className="mt-4 text-xl font-bold dark:text-white">{profile.lastName}, {profile.firstName}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{profile.rank || 'Cadet'}</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                         <h3 className="font-bold mb-4 dark:text-white">Account Status</h3>
                         <div className={`text-center p-3 rounded font-bold ${
                             profile.status === 'Ongoing' ? 'bg-green-100 text-green-800' :
                             profile.status === 'Failed' || profile.status === 'Drop' ? 'bg-red-100 text-red-800' :
                             'bg-gray-100 text-gray-800'
                         }`}>
                             {profile.status}
                         </div>
                    </div>
                </div>

                {/* Right Column: Form Fields */}
                <div className="md:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-6 border-b pb-2">
                        <h3 className="text-xl font-bold dark:text-white">Personal Information</h3>
                        <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
                            <Lock size={12} className="mr-1" />
                            Read Only
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rank</label>
                                <input className="w-full border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-2 rounded cursor-not-allowed" value={profile.rank} disabled />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Suffix</label>
                                <input className="w-full border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-2 rounded cursor-not-allowed" value={profile.suffixName} disabled />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                                <input className="w-full border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-2 rounded cursor-not-allowed" value={profile.firstName} disabled />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Middle Name</label>
                                <input className="w-full border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-2 rounded cursor-not-allowed" value={profile.middleName} disabled />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                                <input className="w-full border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-2 rounded cursor-not-allowed" value={profile.lastName} disabled />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <input className="w-full border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-2 rounded cursor-not-allowed" value={profile.email} disabled />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Number</label>
                                <input className="w-full border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-2 rounded cursor-not-allowed" value={profile.contactNumber} disabled />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                            <textarea className="w-full border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-2 rounded cursor-not-allowed" rows="2" value={profile.address} disabled></textarea>
                        </div>

                        <h3 className="text-xl font-bold mt-8 mb-4 border-b pb-2 dark:text-white">Military &amp; School Info</h3>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course</label>
                                <select
                                    className="w-full border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-2 rounded cursor-not-allowed"
                                    value={profile.course}
                                    disabled
                                >
                                    <option value="">Select Course</option>
                                    {COURSE_OPTIONS.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year Level</label>
                                <select
                                    className="w-full border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-2 rounded cursor-not-allowed"
                                    value={profile.yearLevel}
                                    disabled
                                >
                                    <option value="">Select Year Level</option>
                                    {YEAR_LEVEL_OPTIONS.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">School Year</label>
                                <select
                                    className="w-full border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-2 rounded cursor-not-allowed"
                                    value={profile.schoolYear}
                                    disabled
                                >
                                    <option value="">Select School Year</option>
                                    {SCHOOL_YEAR_OPTIONS.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Battalion</label>
                                <select
                                    className="w-full border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-2 rounded cursor-not-allowed"
                                    value={profile.battalion}
                                    disabled
                                >
                                    <option value="">Select Battalion</option>
                                    {BATTALION_OPTIONS.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company</label>
                                <select
                                    className="w-full border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-2 rounded cursor-not-allowed"
                                    value={profile.company}
                                    disabled
                                >
                                    <option value="">Select Company</option>
                                    {COMPANY_OPTIONS.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Platoon</label>
                                <select
                                    className="w-full border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-2 rounded cursor-not-allowed"
                                    value={profile.platoon}
                                    disabled
                                >
                                    <option value="">Select Platoon</option>
                                    {PLATOON_OPTIONS.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                         <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cadet Course</label>
                                <select
                                    className="w-full border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-2 rounded cursor-not-allowed"
                                    value={profile.cadetCourse}
                                    disabled
                                >
                                    {CADET_COURSE_OPTIONS.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Semester</label>
                                <select
                                    className="w-full border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-2 rounded cursor-not-allowed"
                                    value={profile.semester}
                                    disabled
                                >
                                    {SEMESTER_OPTIONS.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-sm text-yellow-800 dark:text-yellow-200">
                        <p className="font-bold mb-1 flex items-center"><Lock size={14} className="mr-1"/> Profile Locked</p>
                        <p>To update your information, please contact your Training Staff or Administrator.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
