import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar } from 'lucide-react';

const CadetDashboard = () => {
    const [grades, setGrades] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const gradesRes = await axios.get('/api/cadet/my-grades');
                const activitiesRes = await axios.get('/api/cadet/activities');
                setGrades(gradesRes.data);
                setActivities(activitiesRes.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-center p-10">Loading...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">My Portal</h1>

            {/* Grades Section */}
            <div className="bg-white rounded shadow p-6">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Grading Summary</h2>
                {grades ? (
                    <div className="space-y-6">
                        {/* Raw Scores */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-blue-50 p-4 rounded text-center">
                                <h3 className="text-sm text-blue-800 font-semibold uppercase">Attendance (30%)</h3>
                                <div className="text-2xl font-bold mt-2">{grades.attendanceScore.toFixed(2)} pts</div>
                                <div className="text-xs text-gray-500 mt-1">{grades.attendance_present} / 15 days</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded text-center">
                                <h3 className="text-sm text-green-800 font-semibold uppercase">Aptitude (30%)</h3>
                                <div className="text-2xl font-bold mt-2">{grades.aptitudeScore.toFixed(2)} pts</div>
                                <div className="text-xs text-gray-500 mt-1">M: {grades.merit_points} | D: {grades.demerit_points}</div>
                            </div>
                            <div className="bg-purple-50 p-4 rounded text-center">
                                <h3 className="text-sm text-purple-800 font-semibold uppercase">Proficiency (40%)</h3>
                                <div className="text-2xl font-bold mt-2">{grades.subjectScore.toFixed(2)} pts</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    P: {grades.prelim_score} | M: {grades.midterm_score} | F: {grades.final_score}
                                </div>
                            </div>
                        </div>

                        {/* Final Grades */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="bg-gray-100 p-4 rounded text-center border">
                                <h3 className="text-sm text-gray-800 font-semibold uppercase">Final Grade (Numerical)</h3>
                                <div className="text-4xl font-bold mt-2 text-gray-800">{grades.finalGrade.toFixed(2)}</div>
                            </div>
                            <div className={`p-4 rounded text-center shadow-lg transform md:scale-105 ${
                                grades.transmutedGrade === '5.00' || ['DO', 'INC', 'T'].includes(grades.transmutedGrade)
                                ? 'bg-red-600 text-white'
                                : 'bg-green-600 text-white'
                            }`}>
                                <h3 className="text-sm font-semibold uppercase">Transmuted Grade</h3>
                                <div className="text-5xl font-extrabold mt-2">{grades.transmutedGrade}</div>
                                <div className="text-lg font-medium mt-1 uppercase tracking-wide">
                                    {grades.remarks}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>No grades available yet.</p>
                )}
            </div>

            {/* Activities Section */}
            <div>
                <h2 className="text-xl font-bold mb-4">Activities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activities.map(activity => (
                        <div key={activity.id} className="bg-white rounded shadow overflow-hidden">
                            {activity.image_path && (
                                <img 
                                    src={`${import.meta.env.VITE_API_URL || ''}${activity.image_path}`} 
                                    alt={activity.title} 
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <h3 className="text-lg font-bold mb-2">{activity.title}</h3>
                                <div className="flex items-center text-gray-500 text-sm mb-2">
                                    <Calendar size={14} className="mr-1" />
                                    {activity.date}
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-3">{activity.description}</p>
                            </div>
                        </div>
                    ))}
                    {activities.length === 0 && <p className="text-gray-500">No activities posted.</p>}
                </div>
            </div>
        </div>
    );
};

export default CadetDashboard;
