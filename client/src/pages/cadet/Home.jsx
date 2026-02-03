import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, ChevronLeft, ChevronRight, X, User, QrCode, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import { cacheData, getCachedData } from '../../utils/db';
import { toast } from 'react-hot-toast';

const CadetHome = () => {
    const [activities, setActivities] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedActivity, setSelectedActivity] = useState(null);

    // Welcome & Guide States
    const [profile, setProfile] = useState(null);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    const [showGuideModal, setShowGuideModal] = useState(false);
    const [guideStep, setGuideStep] = useState(0);

    const guideSteps = [
        {
            title: "Dashboard Overview",
            description: "Stay updated with the latest activities and announcements.",
            icon: CheckCircle
        },
        {
            title: "Profile Management",
            description: "Keep your personal information up to date.",
            icon: User
        },
        {
            title: "QR Code Attendance",
            description: "Use your unique QR code for quick attendance scanning during training.",
            icon: QrCode
        },
        {
            title: "Performance Tracking",
            description: "Monitor your grades, merits, and demerits in real-time.",
            icon: FileText
        }
    ];

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                try {
                    const cached = await getCachedData('activities');
                    if (cached?.length) setActivities(cached);
                } catch {}
                const res = await axios.get('/api/cadet/activities');
                setActivities(res.data || []);
                await cacheData('activities', res.data || []);

                // Fetch Profile for Welcome Message
                const profileRes = await axios.get('/api/cadet/profile');
                setProfile(profileRes.data);

                // Check if user has seen guide
                if (profileRes.data && !profileRes.data.has_seen_guide) {
                    setShowWelcomeModal(true);
                }

            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
    }, []);

    const handleStartGuide = () => {
        setShowWelcomeModal(false);
        setShowGuideModal(true);
    };

    const handleNextGuideStep = () => {
        if (guideStep < guideSteps.length - 1) {
            setGuideStep(prev => prev + 1);
        } else {
            handleFinishGuide();
        }
    };

    const handleFinishGuide = async () => {
        try {
            await axios.post('/api/cadet/acknowledge-guide');
            setShowGuideModal(false);
            toast.success("You're all set! Welcome aboard.");
        } catch (err) {
            console.error("Error acknowledging guide:", err);
            setShowGuideModal(false); // Close anyway
        }
    };

    const hasActivities = activities && activities.length > 0;

    useEffect(() => {
        if (!hasActivities) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % activities.length);
        }, 8000); // 2s transition + 6s wait

        return () => clearInterval(interval);
    }, [hasActivities, activities.length]);

    const goPrev = (e) => {
        e.stopPropagation();
        if (!hasActivities) return;
        setCurrentIndex((prev) => (prev - 1 + activities.length) % activities.length);
    };

    const goNext = (e) => {
        e.stopPropagation();
        if (!hasActivities) return;
        setCurrentIndex((prev) => (prev + 1) % activities.length);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Home</h1>
            <p className="text-gray-600">
                All ROTC activities and announcements from the administrator will appear here.
            </p>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4 border-b pb-2">Activities &amp; Announcements</h2>

                {!hasActivities && (
                    <div className="text-center text-gray-500 py-10">
                        No activities or announcements have been posted yet.
                    </div>
                )}

                {hasActivities && (
                    <div className="relative max-w-4xl mx-auto">
                        <div className="overflow-hidden rounded-lg shadow cursor-pointer">
                            <div
                                className="flex transition-transform duration-[2000ms] ease-in-out"
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {activities.map((activity) => (
                                    <div 
                                        key={activity.id} 
                                        className="w-full flex-shrink-0 bg-white"
                                        onClick={() => setSelectedActivity(activity)}
                                    >
                                        {activity.image_path && (
                                            <div className="w-full bg-gray-100 flex justify-center items-center h-[400px]">
                                                <img
                                                    src={
                                                        activity.image_path.startsWith('data:')
                                                            ? activity.image_path
                                                            : `${import.meta.env.VITE_API_URL || ''}${activity.image_path.replace(/\\/g, '/')}`
                                                    }
                                                    alt={activity.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <div className="flex items-center text-gray-500 text-sm mb-2">
                                                <Calendar size={16} className="mr-2" />
                                                {activity.date}
                                            </div>
                                            <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
                                            <p className="text-gray-700 whitespace-pre-line line-clamp-3">
                                                {activity.description || 'No description provided.'}
                                            </p>
                                            <p className="text-blue-600 text-sm mt-2">Click to view details</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {activities.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={goPrev}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 rounded-full p-2 shadow-md"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    type="button"
                                    onClick={goNext}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 rounded-full p-2 shadow-md"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}

                        {activities.length > 1 && (
                            <div className="flex justify-center mt-4 space-x-2">
                                {activities.map((activity, index) => (
                                    <button
                                        key={activity.id}
                                        type="button"
                                        onClick={() => setCurrentIndex(index)}
                                        className={`w-3 h-3 rounded-full ${
                                            index === currentIndex ? 'bg-green-700' : 'bg-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Activity Detail Modal */}
            {selectedActivity && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm"
                    onClick={() => setSelectedActivity(null)}
                >
                    <div 
                        className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold text-gray-900 pr-8">{selectedActivity.title}</h3>
                            <button 
                                onClick={() => setSelectedActivity(null)}
                                className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-gray-100"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {selectedActivity.image_path && (
                                <div className="mb-6 bg-gray-50 rounded-lg p-2 border">
                                    <img
                                        src={
                                            selectedActivity.image_path.startsWith('data:')
                                                ? selectedActivity.image_path
                                                : `${import.meta.env.VITE_API_URL || ''}${selectedActivity.image_path.replace(/\\/g, '/')}`
                                        }
                                        alt={selectedActivity.title}
                                        className="w-full h-auto max-h-[60vh] object-contain rounded mx-auto"
                                    />
                                </div>
                            )}
                            
                            <div className="flex items-center text-gray-500 text-sm mb-4 bg-gray-50 p-2 rounded inline-block">
                                <Calendar size={16} className="mr-2" />
                                <span className="font-medium">{selectedActivity.date}</span>
                            </div>
                            
                            <div className="prose max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed text-lg">
                                {selectedActivity.description}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Welcome Modal */}
            {showWelcomeModal && profile && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 text-center animate-fade-in-up">
                        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <User size={40} className="text-green-700" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome!</h2>
                        <h3 className="text-xl font-semibold text-green-700 mb-4">
                            {profile.rank} {profile.first_name} {profile.last_name}
                        </h3>
                        <p className="text-gray-600 mb-8">
                            to MSU-SND ROTC Grading Management System
                        </p>
                        <button
                            onClick={handleStartGuide}
                            className="w-full bg-green-700 text-white py-3 rounded-lg font-bold hover:bg-green-800 transition flex items-center justify-center"
                        >
                            Start User Guide <ArrowRight size={20} className="ml-2" />
                        </button>
                    </div>
                </div>
            )}

            {/* User Guide Modal */}
            {showGuideModal && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-8 relative animate-fade-in-up">
                        {/* Progress Dots */}
                        <div className="absolute top-6 right-8 flex space-x-2">
                            {guideSteps.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`w-2 h-2 rounded-full transition-all ${idx === guideStep ? 'bg-green-600 w-4' : 'bg-gray-300'}`}
                                />
                            ))}
                        </div>

                        <div className="mb-8 mt-4 text-center">
                            <div className="mx-auto w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                {React.createElement(guideSteps[guideStep].icon, { size: 48, className: "text-green-600" })}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">{guideSteps[guideStep].title}</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {guideSteps[guideStep].description}
                            </p>
                        </div>

                        <div className="flex justify-between items-center mt-8">
                            <button
                                onClick={() => {
                                    if (guideStep > 0) setGuideStep(prev => prev - 1);
                                    else setShowGuideModal(false);
                                }}
                                className={`text-gray-500 hover:text-gray-800 font-semibold px-4 py-2 ${guideStep === 0 ? 'invisible' : ''}`}
                            >
                                Back
                            </button>
                            <button
                                onClick={handleNextGuideStep}
                                className="bg-green-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-800 transition shadow-lg flex items-center"
                            >
                                {guideStep === guideSteps.length - 1 ? 'Get Started' : 'Next'}
                                {guideStep < guideSteps.length - 1 && <ChevronRight size={20} className="ml-1" />}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CadetHome;

