import React, { useState, useEffect } from 'react';

const ReturneeEnrollyComponent = () => {
    const [step, setStep] = useState(1);
    const stepTitle = {
        1: "Returnee",
        2: "Campus Information",
    };
    const [options, setOptions] = useState(["Option 1", "Option 2", "Option 3", "asdasdsa", "test 1"]);
    const [value, setValue] = useState("");

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const handleAddOption = () => {
        if (value && !options.includes(value)) {
            setOptions([...options, value]);
        }
    };
    return (
        <>
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden flex w-full max-w-5xl">

                    <div className="hidden md:flex md:w-1/2 bg-blue-50 items-center justify-center p-8">
                        <div className="text-center">
                            <img
                                src="/assets/img/seton-logo.png"
                                alt="Welcome"
                                className="mx-auto mb-6 rounded-lg"
                            />
                            <h2 className="text-2xl font-bold text-green-800 mb-2">
                                Welcome to Elizabeth Seton School
                            </h2>
                            <p className="text-gray-600">
                                Join us and be part of our amazing community.
                            </p>
                            <p className="text-gray-600">
                                Enroll your child by using this Online Application.
                            </p>
                        </div>
                    </div>

                   <div className="w-full md:w-1/2 p-8">
                        <h2 className="text-2xl font-bold text-green-800 mb-6">
                            {stepTitle[step]}
                        </h2>
                        <div className="max-h-96 overflow-y-auto pr-2 space-y-6">
                            <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search Student <span className='text-red-500'>*</span></label>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                                {/* Editable input with dropdown */}
                                <input
                                    list="dropdown-options"
                                    value={value}
                                    onChange={handleChange}
                                    placeholder="Search student by using student number or fullname..."
                                    className="border rounded-md px-3 py-2 w-full sm:w-auto flex-grow"
                                />
                                <datalist id="dropdown-options">
                                    {options.map((option, i) => (
                                        <option key={i} value={option} />
                                    ))}
                                </datalist>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
                            <input
                                type="text"
                                name="Email"
                                // value={form.Fname}
                                // onChange={handleChange}
                                placeholder="Enter the first name of the student..."
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        </div>
                        

                    </div>
                    {/* <ModalComponent
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        title="Warning"
                        body="Are you sure you want to continue?"
                        buttons={[
                            { label: "Yes", type: "green", onClick: handleSubmit },
                            { label: "No", type: "red", onClick: () => console.log("No clicked") },
                        ]}
                    /> */}
                </div>
            </div>
        </>
    );
};

export default ReturneeEnrollyComponent;