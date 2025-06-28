    import React, { useState, useEffect, useRef } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { useAuth } from '../context/AuthContext'; // Import useAuth hook

    const UserAvatarDropdown = () => { // No longer needs onLogout prop
      const [isOpen, setIsOpen] = useState(false);
      const dropdownRef = useRef(null);
      const navigate = useNavigate();
      const { logout, user } = useAuth(); // Get logout function and user object from context

      useEffect(() => {
        const handleClickOutside = (event) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
          }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []);

      const handleProfileClick = () => {
        navigate('/complete-profile'); // Navigate to the complete-profile/edit profile page
        setIsOpen(false);
      };

      const handleLogoutClick = () => {
        logout(); // Call the logout function from AuthContext
        setIsOpen(false);
        // navigate('/login'); // Redirection is handled by logout function in AuthContext
      };

      return (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-200 text-indigo-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
            aria-label="User menu"
            aria-haspopup="true"
            aria-expanded={isOpen}
          >
            {/* Display first initial of username or 'U' as fallback */}
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            {/* If you have a profile picture URL:
            <img 
              src={user?.profilePicUrl || "https://placehold.co/40x40/ADD8E6/000000?text=U"} 
              alt="User Avatar" 
              className="w-full h-full rounded-full object-cover" 
            />
            */}
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 transition-all duration-150 ease-out transform origin-top-right scale-y-100 opacity-100">
              <button
                onClick={handleProfileClick}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                My Profile
              </button>
              <button
                onClick={handleLogoutClick}
                className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      );
    };

    export default UserAvatarDropdown;
    