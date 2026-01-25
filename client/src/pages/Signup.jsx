import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '', password: '', 
        rank: '', firstName: '', middleName: '', lastName: '', suffixName: '',
        studentId: '', email: '', contactNumber: '', address: '',
        course: '', yearLevel: '', schoolYear: '',
        battalion: '', company: '', platoon: '',
        cadetCourse: 'MS1', semester: '', status: 'Ongoing'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/signup', formData);
            alert('Registration successful! Your account is pending approval by the administrator.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 py-10">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Cadet Registration</h2>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Personal Info */}
                    <h3 className="font-semibold text-lg text-gray-700 border-b pb-2">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} className="border p-2 rounded" required />
                         <input type="text" name="middleName" placeholder="Middle Name" onChange={handleChange} className="border p-2 rounded" />
                         <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} className="border p-2 rounded" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" name="suffixName" placeholder="Suffix (e.g., Jr.)" onChange={handleChange} className="border p-2 rounded" />
                        <input type="text" name="rank" placeholder="Rank" onChange={handleChange} className="border p-2 rounded" />
                        <input type="text" name="studentId" placeholder="Student ID" onChange={handleChange} className="border p-2 rounded" required />
                    </div>
                    
                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border p-2 rounded" required />
                        <input type="text" name="contactNumber" placeholder="Contact Number" onChange={handleChange} className="border p-2 rounded" />
                    </div>
                    <input type="text" name="address" placeholder="Address" onChange={handleChange} className="w-full border p-2 rounded" />

                    {/* Academic Info */}
                    <h3 className="font-semibold text-lg text-gray-700 border-b pb-2 mt-4">Academic & ROTC Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" name="course" placeholder="Course" onChange={handleChange} className="border p-2 rounded" />
                        <input type="text" name="yearLevel" placeholder="Year Level" onChange={handleChange} className="border p-2 rounded" />
                        <input type="text" name="schoolYear" placeholder="School Year" onChange={handleChange} className="border p-2 rounded" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input type="text" name="battalion" placeholder="Battalion" onChange={handleChange} className="border p-2 rounded" />
                        <input type="text" name="company" placeholder="Company" onChange={handleChange} className="border p-2 rounded" />
                        <input type="text" name="platoon" placeholder="Platoon" onChange={handleChange} className="border p-2 rounded" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Cadet Course</label>
                            <select name="cadetCourse" onChange={handleChange} className="w-full border p-2 rounded" value={formData.cadetCourse}>
                                <option value="MS1">MS1</option>
                                <option value="MS2">MS2</option>
                                <option value="COQC">COQC</option>
                                <option value="MS31">MS31</option>
                                <option value="MS32">MS32</option>
                                <option value="MS41">MS41</option>
                                <option value="MS42">MS42</option>
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm text-gray-600 mb-1">Semester</label>
                             <input type="text" name="semester" placeholder="Semester" onChange={handleChange} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Status</label>
                            <select name="status" onChange={handleChange} className="w-full border p-2 rounded" value={formData.status}>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Completed">Completed</option>
                                <option value="Incomplete">Incomplete</option>
                                <option value="Drop">Drop</option>
                                <option value="Failed">Failed</option>
                                <option value="Transferred">Transferred</option>
                            </select>
                        </div>
                    </div>

                    {/* Account Credentials */}
                    <h3 className="font-semibold text-lg text-gray-700 border-b pb-2 mt-4">Account Credentials</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="username" placeholder="Username" onChange={handleChange} className="border p-2 rounded" required />
                        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border p-2 rounded" required />
                    </div>

                    <button type="submit" className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition font-bold text-lg mt-6">
                        Register
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm">Already registered? <Link to="/login" className="text-blue-600 hover:underline">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
