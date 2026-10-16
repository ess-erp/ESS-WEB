import React from 'react';
import { BellRing } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchUpdateNotificationStatusData,
} from "../../states/NotificationState/Action";


const NotificationToast = ({ toastData }) => {
  console.log(toastData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const plainText = typeof toastData === 'string'
    ? toastData
    : toastData?.Message || toastData?.message || "New notification received";

  const appId = toastData?.AppId || toastData?.appId;
  const journalId = toastData?.JournalId || toastData?.journalId;
  const orNumber = toastData?.OrNumber || toastData?.orNumber;

  const typeOfNotification = toastData?.TypeOfNotification || toastData?.typeOfNotification;

  const handleToastClick = () => {
    // Notification types that are always clickable
    const clickableTypes = ['CANCELLATION_APPROVED', 'CANCELLATION_DECLINED', 'CANCELLATION_REQUEST'];
    
    // Handle different notification types with their respective IDs or clickable types
    if (!appId && !journalId && !orNumber && !clickableTypes.includes(typeOfNotification)) return;

    switch (typeOfNotification) {
      case "StudentOnlineApp":
        dispatch(fetchUpdateNotificationStatusData(toastData?.notificationId));
        navigate(`/admission/studentappform?AppId=${appId}`);
        break;

      case "NEW_JOURNAL_ENTRY":
        if (journalId) {
          dispatch(fetchUpdateNotificationStatusData(toastData?.notificationId));
          navigate(`/accounting/journal-entry?journalId=${journalId}`);
        }
        break;

      case "CANCELLATION_APPROVED":
      case "CANCELLATION_DECLINED":
        dispatch(fetchUpdateNotificationStatusData(toastData?.notificationId));
        navigate(`/cashier/transaction-history`);
        break;

      case "CANCELLATION_REQUEST":
        // Navigate to journal entry page to review cancellation request
        dispatch(fetchUpdateNotificationStatusData(toastData?.notificationId));
        navigate(`/accounting/journal-entry`);
        break;

      default:
        return;
    };

  };

  // Determine if notification is clickable
  const clickableTypes = ['CANCELLATION_APPROVED', 'CANCELLATION_DECLINED', 'CANCELLATION_REQUEST'];
  const isClickable = appId || journalId || orNumber || clickableTypes.includes(typeOfNotification);

  return (
    <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
      <a
        onClick={handleToastClick}
        // 🪄 Added interactivity styles if clickable: cursor-pointer, hover scales, active states
        className={`animate-slide-down pointer-events-auto flex items-center gap-3 bg-white border border-gray-100 px-5 py-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] min-w-[320px] max-w-[450px] transition-all duration-200
                    ${isClickable
            ? 'cursor-pointer hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]'
            : ''
          }`}
      >

        {/* Visual Icon Alert Accent */}
        <div className="flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg p-2 shrink-0">
          <BellRing className="w-5 h-5 animate-bounce" style={{ animationDuration: '2s' }} />
        </div>

        {/* Main Notification Content */}
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              System Notice
            </span>
            {/* Little helper tag to clue the user in */}
            {isClickable && (
              <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium">
                Click to View
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-gray-800 mt-0.5 line-clamp-2">
            {plainText}
          </p>
        </div>
      </a>
    </div>
  );
};

export default NotificationToast;