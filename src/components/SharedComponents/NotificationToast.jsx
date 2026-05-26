import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { hideToast } from "../../states/NotificationState/Action";

const NotificationToast = ({ message }) => {
  // const [show, setShow] = useState(false);
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   if (message) {
  //     setShow(true);

  //     const timer = setTimeout(() => {
  //       setShow(false);
  //       dispatch(hideToast());
  //     }, 4000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [message]);

  // if (!show) return null;

  return (
    <div className="fixed top-5 right-5 z-50">
      <div className="bg-white shadow-lg border-l-4 border-blue-500 p-4 rounded-md w-80 animate-slide-in">
        <p className="text-sm text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default NotificationToast;