import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState({ totalCadets: 0, totalActivities: 0 });

    useEffect(() => {
        // Fetch stats (mocked or derived from lists for now)
        const fetchStats = async () => {
            try {
                const cadetsRes = await axios.get('/api/admin/cadets');
                const activitiesRes = await axios.get('/api/cadet/activities'); // Public read
                setStats({
                    totalCadets: cadetsRes.data.length,
                    totalActivities: activitiesRes.data.length
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
                <h3 className="text-gray-500 text-sm font-medium">Total Cadets</h3>
                <p className="text-3xl font-bold text-gray-800">{stats.totalCadets}</p>
            </div>
            <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
                <h3 className="text-gray-500 text-sm font-medium">Active Activities</h3>
                <p className="text-3xl font-bold text-gray-800">{stats.totalActivities}</p>
            </div>
             <div className="bg-white p-6 rounded shadow border-l-4 border-purple-500">
                <h3 className="text-gray-500 text-sm font-medium">Training Days</h3>
                <p className="text-3xl font-bold text-gray-800">15</p>
            </div>
        </div>
    );
};

export default Dashboard;
