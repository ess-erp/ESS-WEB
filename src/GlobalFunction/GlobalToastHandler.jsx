import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import NotificationToast from "../components/SharedComponents/NotificationToast";
import { hideToast } from "../states/NotificationState/Action";
import notificationSound from "../../public/assets/soundEffects/notification-sounds.wav";

const GlobalToastHandler = () => {
    const dispatch = useDispatch();

    const toastData = useSelector(
        (state) => state.notification.toastData
    );
    const audioRef = useRef(new Audio(notificationSound));

    useEffect(() => {
        if (toastData.length === 0) return;

        // Play notification sound
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => {
            console.log("Audio play blocked until user clicks somewhere first:", err);
        });

        // Optional: Auto-hide toast after 7 seconds
        // const timer = setTimeout(() => {
        //     dispatch(hideToast());
        // }, 7000);

        // return () => clearTimeout(timer);
    }, [toastData, dispatch]);

    if (toastData.length === 0) return null;
    console.log(toastData);

    return <NotificationToast toastData={toastData} />;
};

export default GlobalToastHandler;