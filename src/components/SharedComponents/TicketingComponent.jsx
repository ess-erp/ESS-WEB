import React, { useState } from 'react';
import { Ticket, Paperclip, Send, AlertCircle, X } from 'lucide-react';

const TicketingComponent = () => {
    // Form state management
    const [formData, setFormData] = useState({
        category: '',
        priority: 'Medium',
        subject: '',
        description: ''
    });
    const [attachedFile, setAttachedFile] = useState(null);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle file upload selection
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setAttachedFile(e.target.files[0]);
        }
    };

    // Form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting Ticket Data:", formData);
        console.log("Attached File:", attachedFile);
        // Here you will dispatch your Redux action to send data to your C# backend!
    };

    return (
        <div className="mx-auto p-4 md:p-6 lg:p-8">
            
            {/* Header Section */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Ticket className="w-6 h-6 text-green-600" />
                    Submit a Support Ticket
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                    Need help with IT, HR, or Maintenance? Fill out the form below and our team will get back to you.
                </p>
            </div>

            {/* Main Form Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* Helpful Banner */}
                <div className="bg-blue-50 border-b border-blue-100 p-4 flex gap-3 items-start">
                    <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                        <strong>Tip:</strong> If you are experiencing a login issue with the Student Portal, please check the <a href="#" className="underline font-semibold hover:text-blue-900">Knowledge Base</a> first before submitting a ticket.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                    
                    {/* Row 1: Category and Priority */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Support Category <span className="text-red-500">*</span>
                            </label>
                            <select 
                                name="category"
                                required
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 block p-2.5 transition-colors"
                            >
                                <option value="" disabled>Select a department...</option>
                                <option value="IT">IT & Software Support</option>
                                <option value="HR">Human Resources</option>
                                <option value="Payroll">Payroll & Accounting</option>
                                <option value="Maintenance">Facilities & Maintenance</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Priority Level
                            </label>
                            <select 
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 block p-2.5 transition-colors"
                            >
                                <option value="Low">Low - Not urgent</option>
                                <option value="Medium">Medium - Standard request</option>
                                <option value="High">High - Blocking my work</option>
                                <option value="Urgent">Urgent - System down/Emergency</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 2: Subject */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Ticket Subject <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text"
                            name="subject"
                            required
                            placeholder="Briefly summarize the issue..."
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 block p-2.5 transition-colors"
                        />
                    </div>

                    {/* Row 3: Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Detailed Description <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                            name="description"
                            required
                            rows="5"
                            placeholder="Please provide as much detail as possible so we can help you quickly..."
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 block p-2.5 transition-colors resize-y"
                        ></textarea>
                    </div>

                    {/* Row 4: File Attachment */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Attachments (Optional)
                        </label>
                        
                        {!attachedFile ? (
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                                        <Paperclip className="w-6 h-6 mb-2 text-gray-400" />
                                        <p className="text-sm"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                        <p className="text-xs mt-1 text-gray-400">PNG, JPG, PDF or DOCX (MAX. 10MB)</p>
                                    </div>
                                    <input type="file" className="hidden" onChange={handleFileChange} />
                                </label>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="p-2 bg-white rounded shadow-sm shrink-0">
                                        <Paperclip className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 truncate">
                                        {attachedFile.name}
                                    </span>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => setAttachedFile(null)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <button 
                            type="button"
                            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                        >
                            <Send className="w-4 h-4" />
                            Submit Ticket
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default TicketingComponent;