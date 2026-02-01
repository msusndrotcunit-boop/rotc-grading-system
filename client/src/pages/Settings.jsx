import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Bell, Monitor, PaintBucket } from 'lucide-react';

const Settings = ({ role }) => {
    const [settings, setSettings] = useState({
        notifications: {
            emailAlerts: true,
            pushNotifications: true,
            activityUpdates: true
        },
        display: {
            darkMode: false,
            compactMode: false
        },
        theme: {
            primaryColor: 'blue'
        }
    });

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // In a real app, fetch user specific settings from DB
        // For now, load from localStorage
        const savedSettings = localStorage.getItem(`settings_${role}`);
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, [role]);

    const handleChange = (section, key, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Save to localStorage for demo
            localStorage.setItem(`settings_${role}`, JSON.stringify(settings));
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            
            alert('Settings saved successfully');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <PaintBucket className="text-blue-600" />
                App Settings ({role})
            </h2>

            <div className="space-y-8">
                {/* Notifications Settings */}
                <section>
                    <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                        <Bell size={20} />
                        Notifications
                    </h3>
                    <div className="space-y-3 pl-4 border-l-2 border-gray-100">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.notifications.emailAlerts}
                                onChange={(e) => handleChange('notifications', 'emailAlerts', e.target.checked)}
                                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Email Alerts</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.notifications.pushNotifications}
                                onChange={(e) => handleChange('notifications', 'pushNotifications', e.target.checked)}
                                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Push Notifications</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.notifications.activityUpdates}
                                onChange={(e) => handleChange('notifications', 'activityUpdates', e.target.checked)}
                                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Activity Updates</span>
                        </label>
                    </div>
                </section>

                {/* Display Settings */}
                <section>
                    <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                        <Monitor size={20} />
                        Display
                    </h3>
                    <div className="space-y-3 pl-4 border-l-2 border-gray-100">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.display.darkMode}
                                onChange={(e) => handleChange('display', 'darkMode', e.target.checked)}
                                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Dark Mode (Beta)</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.display.compactMode}
                                onChange={(e) => handleChange('display', 'compactMode', e.target.checked)}
                                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="text-gray-700">Compact Mode</span>
                        </label>
                    </div>
                </section>

                {/* Theme Settings */}
                <section>
                    <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
                        <PaintBucket size={20} />
                        Theme Customization
                    </h3>
                    <div className="pl-4 border-l-2 border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                        <div className="flex space-x-4">
                            {['blue', 'green', 'indigo', 'purple', 'red'].map(color => (
                                <button
                                    key={color}
                                    onClick={() => handleChange('theme', 'primaryColor', color)}
                                    className={`w-8 h-8 rounded-full focus:outline-none ring-2 ring-offset-2 ${
                                        settings.theme.primaryColor === color ? 'ring-gray-400 scale-110' : 'ring-transparent'
                                    }`}
                                    style={{ backgroundColor: color === 'blue' ? '#2563eb' : color === 'green' ? '#16a34a' : color === 'indigo' ? '#4f46e5' : color === 'purple' ? '#9333ea' : '#dc2626' }}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                <div className="pt-6 border-t border-gray-200">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                    >
                        <Save size={20} />
                        <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
