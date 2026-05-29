import React, { useState } from 'react';
import { Mail, Phone, MapPin, Briefcase, Camera, User, Shield, Calendar } from 'lucide-react';

const ProfileComponent = ({ userId }) => {
    console.log(userId);
    // Simple state to handle tab switching
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data - You will eventually fetch this from your C# backend
    const employee = {
        firstName: "Admission",
        lastName: "Admin",
        role: "Admissions Officer",
        department: "Registrar & Admissions",
        email: "admission@ess.edu.ph",
        phone: "+63 912 345 6789",
        location: "Dasmariñas Campus",
        joinDate: "August 2021",
        avatar: "https://ui-avatars.com/api/?name=Admission+Admin&background=10b981&color=fff&size=128"
    };

    return (
        <div className="mx-auto p-4 md:p-6 lg:p-8">
            
            {/* Header / Cover Photo Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Cover Image */}
                <div className="h-32 md:h-48 w-full bg-gradient-to-r from-green-600 to-emerald-400 relative">
                    <button className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-all">
                        <Camera className="w-5 h-5" />
                    </button>
                </div>

                {/* Avatar & Basic Info */}
                <div className="px-6 sm:px-10 pb-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-16 sm:-mt-20 mb-4 relative z-10">
                        <div className="relative">
                            <img 
                                src={employee.avatar} 
                                alt="Profile" 
                                className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white"
                            />
                            <button className="absolute bottom-1 right-1 bg-gray-100 p-2 rounded-full border border-gray-200 hover:bg-gray-200 text-gray-600 transition-colors">
                                <Camera className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="text-center sm:text-left flex-1 pb-2">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {employee.firstName} {employee.lastName}
                            </h1>
                            <p className="text-sm font-medium text-green-600 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                                <Briefcase className="w-4 h-4" />
                                {employee.role}
                            </p>
                        </div>

                        <div className="pb-2">
                            <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Two-Column Layout for Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                
                {/* Left Column: Quick Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
                            Contact Information
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <span className="text-sm">{employee.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <span className="text-sm">{employee.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <span className="text-sm">{employee.location}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">
                            Employment Details
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Shield className="w-5 h-5 text-gray-400" />
                                <span className="text-sm">{employee.department}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <span className="text-sm">Joined {employee.joinDate}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Tabbed Content */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    
                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-gray-100 mb-6">
                        <button 
                            onClick={() => setActiveTab('overview')}
                            className={`pb-3 text-sm font-semibold transition-colors relative 
                                ${activeTab === 'overview' ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Overview
                            {activeTab === 'overview' && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-t-full"></span>
                            )}
                        </button>
                        <button 
                            onClick={() => setActiveTab('security')}
                            className={`pb-3 text-sm font-semibold transition-colors relative 
                                ${activeTab === 'security' ? 'text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Security & Access
                            {activeTab === 'security' && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-t-full"></span>
                            )}
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div>
                        {activeTab === 'overview' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <h4 className="text-sm font-bold text-gray-900">About</h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Primary contact for incoming student applications, managing enrollment procedures, 
                                    and assisting parents with the admission pipeline at the Dasmariñas Campus.
                                </p>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-4 animate-in fade-in duration-300">
                                <h4 className="text-sm font-bold text-gray-900">Password Management</h4>
                                <p className="text-sm text-gray-600 mb-3">
                                    Ensure your account is using a long, random password to stay secure.
                                </p>
                                <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                                    Change Password
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfileComponent;