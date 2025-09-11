import { Link } from "react-router-dom";

const AccessDenied = () => {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-gray-50 p-6">
      {/* 🎓 SVG Illustration */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 500"
        className="h-[40vh] w-auto mb-8"
      >
        {/* Book */}
        <rect
          x="120"
          y="200"
          width="260"
          height="150"
          rx="12"
          fill="#f8fafc"
          stroke="#1e293b"
          strokeWidth="3"
        />
        <line x1="250" y1="200" x2="250" y2="350" stroke="#1e293b" strokeWidth="3" />

        {/* Graduation cap */}
        <polygon points="250,120 180,160 250,200 320,160" fill="#1e293b" />
        <line x1="250" y1="200" x2="250" y2="220" stroke="#1e293b" strokeWidth="3" />
        <circle cx="250" cy="225" r="5" fill="#e11d48" />

        {/* Lock in front of book */}
        <rect
          x="200"
          y="240"
          width="100"
          height="70"
          rx="8"
          fill="#e2e8f0"
          stroke="#1e293b"
          strokeWidth="3"
        />
        <path
          d="M220 240 v-25 a30 30 0 0 1 60 0 v25"
          fill="none"
          stroke="#1e293b"
          strokeWidth="3"
        />
      </svg>

      {/* 🚫 Text Section */}
      <h1 className="text-4xl font-extrabold text-gray-800">Access Denied</h1>
      <p className="text-lg text-gray-600 mt-4 max-w-md text-center">
        Sorry, you don’t have permission to view this page.
        Please contact the school administrator if you think this is a mistake.
      </p>

      {/* 🔘 Return to Home Button */}
      <Link
        to="/"
        className="mt-8 px-6 py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold shadow-sm hover:bg-blue-600 hover:text-white transition"
      >
        Return to Home
      </Link>

    </div>
  );
};

export default AccessDenied;
