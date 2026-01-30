import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, LogOut } from 'lucide-react';

const Onboarding = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [formData, setFormData] = useState({
        rank: '',
        firstName: '',
        middleName: '',
        lastName: '',
        suffixName: '',
        email: '',
        contactNumber: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.username || !formData.password) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);

        try {
            await axios.post('/api/staff/onboard', formData);
            alert('Registration successful! Please login with your new credentials.');
            logout();
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="bg-green-900 p-6 text-white flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <UserCheck size={28} />
                            Staff Onboarding
                        </h1>
                        <p className="text-green-200 mt-1">Please complete your profile to access the system.</p>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="text-green-200 hover:text-white flex items-center gap-1 text-sm"
                    >
                        <LogOut size={16} /> Cancel
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    {error && (
                        <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rank</label>
                                <input
                                    type="text"
                                    name="rank"
                                    value={formData.rank}
                                    onChange={handleChange}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 py-2 px-3 border"
                                    placeholder="e.g. CPT, MAJ, SSg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 py-2 px-3 border"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                                <input
                                    type="text"
                                    name="middleName"
                                    value={formData.middleName}
                                    onChange={handleChange}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 py-2 px-3 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 py-2 px-3 border"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Suffix Name</label>
                                <input
                                    type="text"
                                    name="suffixName"
                                    value={formData.suffixName}
                                    onChange={handleChange}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 py-2 px-3 border"
                                    placeholder="e.g. Jr., III"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 py-2 px-3 border"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                <input
                                    type="text"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 py-2 px-3 border"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Account Credentials</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 py-2 px-3 border"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 py-2 px-3 border"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 py-2 px-3 border"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-green-700 text-white py-3 px-8 rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-semibold shadow-lg transition-all ${
                                loading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Processing...' : 'Complete Registration'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Onboarding;