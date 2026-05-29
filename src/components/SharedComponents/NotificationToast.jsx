import React from 'react';
import { BellRing } from 'lucide-react';

const NotificationToast = ({ toastData }) => {
  console.log(toastData);
  // 🔍 1. Extract the text message safely
  const plainText = typeof toastData === 'string'
    ? toastData
    : toastData?.Message || toastData?.message || "New notification received";

  // 🔑 2. Safely extract the AppId from your SignalR payload (checking casing variants)
  const appId = toastData?.AppId || toastData?.appId;

  // 🚀 3. Click Handler to open the application form in a new tab
  const handleToastClick = () => {
    if (!appId) return; // Ignore clicks if there's no dynamic AppId attached

    const url = `/admission/studentappform?AppId=${appId}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
      <a
        onClick={handleToastClick}
        // 🪄 Added interactivity styles if appId is present: cursor-pointer, hover scales, active states
        className={`animate-slide-down pointer-events-auto flex items-center gap-3 bg-white border border-gray-100 px-5 py-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] min-w-[320px] max-w-[450px] transition-all duration-200
                    ${appId
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
            {appId && (
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