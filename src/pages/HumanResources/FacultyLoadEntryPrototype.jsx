import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2 } from 'lucide-react';
import Breadcrumb from '../../components/SharedComponents/Breadcrumb';
import OutlineBlueBtn from '../../components/ButtonsComponents/OutlineBlueBtn';
import SearchableSelect from '../../components/ButtonsComponents/SearchableSelect';

const FacultyLoadEntryPrototype = () => {
  // Mock data for dropdowns
  const mockFacultyMembers = [
    { value: '1', label: 'Dr. Maria Santos - Computer Science' },
    { value: '2', label: 'Prof. Juan Cruz - Mathematics' },
    { value: '3', label: 'Ms. Ana Reyes - English Department' },
    { value: '4', label: 'Mr. Pedro Garcia - Physics' },
    { value: '5', label: 'Dr. Lisa Mendoza - Chemistry' },
  ];

  const mockAcademicTerms = [
    { value: '1', label: '1st Semester, AY 2025-2026' },
    { value: '2', label: '2nd Semester, AY 2025-2026' },
    { value: '3', label: 'Summer, AY 2025-2026' },
    { value: '4', label: '1st Semester, AY 2026-2027' },
  ];

  const mockSubjects = [
    { code: 'CS101', description: 'Introduction to Programming' },
    { code: 'CS102', description: 'Data Structures and Algorithms' },
    { code: 'MATH101', description: 'Calculus I' },
    { code: 'ENG101', description: 'Technical Writing' },
    { code: 'PHYS101', description: 'Physics for Engineers' },
    { code: 'CHEM101', description: 'General Chemistry' },
  ];

  // Component state
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [subjectLoads, setSubjectLoads] = useState([
    {
      id: Date.now(),
      subjectCode: '',
      description: '',
      section: '',
      lectureUnits: 0,
      labUnits: 0,
      schedule: '',
    },
  ]);

  // Calculate total units
  const totalUnits = useMemo(() => {
    const totalLecture = subjectLoads.reduce((sum, load) => sum + (Number(load.lectureUnits) || 0), 0);
    const totalLab = subjectLoads.reduce((sum, load) => sum + (Number(load.labUnits) || 0), 0);
    return { totalLecture, totalLab, combined: totalLecture + totalLab };
  }, [subjectLoads]);

  // Add new subject row
  const handleAddSubjectRow = () => {
    setSubjectLoads([
      ...subjectLoads,
      {
        id: Date.now(),
        subjectCode: '',
        description: '',
        section: '',
        lectureUnits: 0,
        labUnits: 0,
        schedule: '',
      },
    ]);
  };

  // Delete subject row
  const handleDeleteRow = (id) => {
    if (subjectLoads.length > 1) {
      setSubjectLoads(subjectLoads.filter((load) => load.id !== id));
    } else {
      alert('At least one subject row must remain.');
    }
  };

  // Update subject row field
  const handleFieldChange = (id, field, value) => {
    setSubjectLoads(
      subjectLoads.map((load) =>
        load.id === id ? { ...load, [field]: value } : load
      )
    );
  };

  // Handle subject code selection (auto-fill description)
  const handleSubjectCodeChange = (id, subjectCode) => {
    const selectedSubject = mockSubjects.find((s) => s.code === subjectCode);
    setSubjectLoads(
      subjectLoads.map((load) =>
        load.id === id
          ? {
              ...load,
              subjectCode: subjectCode,
              description: selectedSubject ? selectedSubject.description : '',
            }
          : load
      )
    );
  };

  // Save faculty load
  const handleSaveFacultyLoad = () => {
    const facultyLoadData = {
      faculty: selectedFaculty,
      academicTerm: selectedTerm,
      subjectLoads: subjectLoads,
      totalUnits: totalUnits,
      timestamp: new Date().toISOString(),
    };

    console.log('=== Faculty Load Entry Data ===');
    console.log(JSON.stringify(facultyLoadData, null, 2));
    console.log('==============================');

    alert(
      `Faculty Load saved successfully!\n\nFaculty: ${selectedFaculty?.label || 'None'}\nTerm: ${selectedTerm?.label || 'None'}\nTotal Units: ${totalUnits.combined}\n\nCheck console for full data.`
    );
  };

  const breadcrumbItems = [
    { label: 'Human Resources', href: '/hrd/dashboard' },
    { label: 'Faculty Load Entry', href: '/hrd/faculty-load-entry-prototype' },
  ];

  return (
    <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
      <div className="mb-4">
        <Breadcrumb items={breadcrumbItems} />
        <h2 className="text-sm font-bold text-black mt-2">Faculty Load Entry (Prototype)</h2>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key="faculty-load-prototype"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Faculty Teaching Load Entry (Static Prototype)
            </h1>

            {/* Selection Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Faculty Member Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Faculty Member <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={mockFacultyMembers}
                  value={selectedFaculty}
                  onChange={setSelectedFaculty}
                  placeholder="Select faculty member..."
                />
              </div>

              {/* Academic Term Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Academic Term <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                  options={mockAcademicTerms}
                  value={selectedTerm}
                  onChange={setSelectedTerm}
                  placeholder="Select academic term..."
                />
              </div>
            </div>

            {/* Subject Load Table */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Subject Load Details</h2>
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Subject Code
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Section
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Lecture Units
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Lab Units
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Schedule
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subjectLoads.map((load, index) => (
                      <tr key={load.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <select
                            value={load.subjectCode}
                            onChange={(e) => handleSubjectCodeChange(load.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          >
                            <option value="">Select...</option>
                            {mockSubjects.map((subject) => (
                              <option key={subject.code} value={subject.code}>
                                {subject.code}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={load.description}
                            onChange={(e) => handleFieldChange(load.id, 'description', e.target.value)}
                            placeholder="Auto-filled or manual"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={load.section}
                            onChange={(e) => handleFieldChange(load.id, 'section', e.target.value)}
                            placeholder="e.g., CS-3A"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={load.lectureUnits}
                            onChange={(e) => handleFieldChange(load.id, 'lectureUnits', e.target.value)}
                            className="w-20 mx-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-center"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={load.labUnits}
                            onChange={(e) => handleFieldChange(load.id, 'labUnits', e.target.value)}
                            className="w-20 mx-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-center"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={load.schedule}
                            onChange={(e) => handleFieldChange(load.id, 'schedule', e.target.value)}
                            placeholder="e.g., MWF 8:00-9:00 AM"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handleDeleteRow(load.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-full transition-colors"
                            title="Delete row"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="3" className="px-4 py-3 text-right font-semibold text-gray-700">
                        Total Units:
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-blue-700">
                        {totalUnits.totalLecture.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-green-700">
                        {totalUnits.totalLab.toFixed(1)}
                      </td>
                      <td colSpan="2" className="px-4 py-3 text-left font-bold text-purple-700">
                        Combined: {totalUnits.combined.toFixed(1)} units
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Add Subject Row Button */}
              <div className="mt-4">
                <button
                  onClick={handleAddSubjectRow}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus size={20} />
                  Add Subject Row
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <OutlineBlueBtn
                btnName="Clear All"
                onClick={() => {
                  setSelectedFaculty(null);
                  setSelectedTerm(null);
                  setSubjectLoads([
                    {
                      id: Date.now(),
                      subjectCode: '',
                      description: '',
                      section: '',
                      lectureUnits: 0,
                      labUnits: 0,
                      schedule: '',
                    },
                  ]);
                }}
              />
              <OutlineBlueBtn
                btnName="Save Faculty Load"
                onClick={handleSaveFacultyLoad}
              />
            </div>
          </div>

          {/* Info Panel */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">
              📋 Static Prototype Information
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• This is a <strong>static frontend prototype</strong> using local state (useState)</li>
              <li>• No Redux or backend integration - all data is mocked</li>
              <li>• Subject code selection auto-fills description from mock data</li>
              <li>• Total units are calculated in real-time</li>
              <li>• "Save Faculty Load" logs complete data structure to console</li>
              <li>• Ideal for UI/UX testing before backend implementation</li>
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FacultyLoadEntryPrototype;
