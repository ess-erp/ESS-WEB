import { useEffect, useState } from "react";
import Breadcrumb from "../../components/SharedComponents/Breadcrumb";
import ProfileComponent from "../../components/SharedComponents/ProfileComponent";

const Profile = () => {
    useEffect(() => {
        document.title = "Profile";
    }, []);

    const breadcrumbItems = [
        { label: 'Dasboard', href: '/dashboard' },
        { label: 'Profile', href: '/profile' }
    ];

    const [user] = useState(() => {
        const savedUser = localStorage.getItem("userData");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const userId = user?.UserId;
    
    return (
        <div className="flex-1 min-h-screen bg-gray-50 px-6 py-4">
            <div className="mb-4">
                <Breadcrumb items={breadcrumbItems} />
                <h2 className="text-2x1 font-bold text-black mt-2">Profile</h2>
            </div>

            <section className="flex items-center justify-center h-[calc(100%-5rem)]">
                <div className="flex flex-col space-y-4 h-full w-full">
                    <div className="flex justify-center">
                    </div>
                    <ProfileComponent userId={userId} />
                </div>
            </section>
        </div>
    );
};

export default Profile;
