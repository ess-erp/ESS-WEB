import React from "react";

const AnnouncementComponent = () => {
    const events = [
        {
            id: 1,
            title: "School Orientation 2025",
            date: "August 15, 2025",
            time: "9:00 AM - 11:00 AM",
            description: "A welcoming orientation for all incoming students.",
            image: "https://source.unsplash.com/random/600x400?school",
        },
        {
            id: 2,
            title: "Campus Clean-Up Drive",
            date: "August 20, 2025",
            time: "1:00 PM - 4:00 PM",
            description: "Join us in keeping our campus clean and green!",
            image: "https://source.unsplash.com/random/600x400?environment",
        },
    ];

    return (
        <>
            <hr className="border-t-1 border-solid border-gray-400 my-6" />
            <div className="flex justify-center">
                <h2 className="text-2xl font-bold text-black mt-2">
                    News & Announcement
                </h2>
            </div>
            <div className="space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        {event.image && (
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-48 object-cover"
                            />
                        )}
                        <div className="p-5">
                            <h3 className="text-xl font-semibold text-gray-800">
                                {event.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">
                                {event.date} | {event.time}
                            </p>
                            <p className="text-gray-700 mb-4">{event.description}</p>
                            <button className="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                                View More
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </>


    );
};

export default AnnouncementComponent;