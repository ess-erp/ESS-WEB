import React from 'react';
import { Mail, Phone, MapPin, Briefcase, Camera, Shield, Calendar } from 'lucide-react';

const ProfileComponent = ({ userId }) => {
    console.log(userId);

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
            
            {/* Modern Header Section - No Cover Photo */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* Avatar & Basic Info */}
                <div className="px-6 sm:px-10 py-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Profile Image with Edit Button */}
                        <div className="relative group flex-shrink-0">
                            <div className="relative w-28 h-28">
                                <img 
                                    src={employee.avatar} 
                                    alt="Profile" 
                                    className="w-full h-full rounded-2xl shadow-md bg-white object-cover ring-2 ring-gray-100"
                                />
                                <button className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                                    <Camera className="w-6 h-6 text-white" />
                                </button>
                            </div>
                        </div>
                        
                        {/* Name and Role */}
                        <div className="flex-1 text-center sm:text-left space-y-2">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {employee.firstName} {employee.lastName}
                            </h1>
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-green-600">
                                <Briefcase className="w-4 h-4" />
                                <p className="text-sm font-medium">
                                    {employee.role}
                                </p>
                            </div>
                            <p className="text-sm text-gray-500">
                                {employee.department}
                            </p>
                        </div>

                        {/* Edit Profile Button */}
                        <div className="flex items-start flex-shrink-0">
                            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md">
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
                        <h3 className="text-base font-semibold text-gray-900 mb-5">
                            Contact Information
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 mb-0.5">Email</p>
                                    <p className="text-sm text-gray-900 truncate">{employee.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 mb-0.5">Phone</p>
                                    <p className="text-sm text-gray-900">{employee.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 mb-0.5">Location</p>
                                    <p className="text-sm text-gray-900">{employee.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-base font-semibold text-gray-900 mb-5">
                            Employment Details
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 mb-0.5">Department</p>
                                    <p className="text-sm text-gray-900">{employee.department}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Calendar className="w-5 h-5 text-orange-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-gray-500 mb-0.5">Join Date</p>
                                    <p className="text-sm text-gray-900">{employee.joinDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Security & Access */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Security & Access</h3>
                            <p className="text-sm text-gray-500">
                                Manage your account security settings and password
                            </p>
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <h4 className="text-base font-semibold text-gray-900 mb-2">Password Management</h4>
                            <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                Ensure your account is using a long, random password to stay secure.
                            </p>
                            <button className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md">
                                Change Password
                            </button>
                        </div>

                        {/* Security Info */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <div className="flex gap-3">
                                <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-amber-900 mb-1">Security Tip</p>
                                    <p className="text-xs text-amber-700 leading-relaxed">
                                        Use a unique password for your account and enable two-factor authentication for added security.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfileComponent;