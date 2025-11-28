import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 px-6">
      {/* 404 Number */}
      <h1 className="text-7xl font-extrabold text-[#3FDCBF] drop-shadow-sm">
        404
      </h1>

      {/* Message */}
      <p className="mt-4 text-lg text-gray-600 text-center max-w-md">
        Oops! The page you’re looking for doesn’t exist or may have been moved.
      </p>

      {/* Button */}
      <Link
        to="/"
        className="
          mt-6 inline-flex items-center px-6 py-3 rounded-xl
          bg-[#3FDCBF] text-white font-medium shadow-md
          hover:bg-[#34c7a8] transition-all
        "
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
