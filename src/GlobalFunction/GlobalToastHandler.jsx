import { useSelector, useDispatch } from "react-redux";
import NotificationToast from "../components/SharedComponents/NotificationToast";
import { useEffect } from "react";
import { hideToast } from "../states/NotificationState/Action";

const GlobalToastHandler = () => {
    const dispatch = useDispatch();

    const toastMessage = useSelector(
        (state) => state.notification.toastMessage
    );

    useEffect(() => {
        if (!toastMessage) return;

        const timer = setTimeout(() => {
            dispatch(hideToast());
        }, 4000);

        return () => clearTimeout(timer);
    }, [toastMessage, dispatch]);

    if (!toastMessage) return null;

    return <NotificationToast message={toastMessage} />;
};

export default GlobalToastHandler;