const EnrollmentStatusComponent = () => {
    return (
        <div className="flex justify-center">

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full min-w-0">
                {[
                    { count: 21, label: 'Pending', color: 'text-red-500' },
                    { count: 17, label: 'Ongoing', color: 'text-amber-500 text-amber-600' },
                    { count: 24, label: 'Enrolled', color: 'text-green-500 text-green-600' },
                    { count: 38, label: 'Total Student', color: 'text-primary-900' },
                ].map(({ count, label, color }, idx) => (
                    <div key={idx} className="flex flex-col px-6 py-2 bg-white shadow rounded-lg overflow-hidden">
                        <div className="flex flex-col items-center space-y-2">
                            <div className={`text-6xl font-bold tracking-tight leading-none ${color.split(' ')[0]}`}>{count}</div>
                            <div className={`text-lg font-medium ${color.split(' ')[1] || color.split(' ')[0]}`}>{label}</div>
                        </div>
                    </div>
                ))}
            </div>

        </div>

    );
};

export default EnrollmentStatusComponent;