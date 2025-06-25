    import React from 'react';
    import Header from './Header'; // Import the Header component
    import { useAuth } from '../context/AuthContext'; // Import useAuth hook
    import Footer from './Footer'; 
    import ChatbotWidget from './ChatbotWidget';
    // The Layout component wraps your page content and provides consistent header/footer
    const Layout = ({ children }) => { // No longer accepts isAuthenticated, onLogout props directly
      const { isLoggedIn, logout } = useAuth(); // Get auth state and logout function from context

      return (
        <div className="flex flex-col min-h-screen">
          {/* Render the Header component, passing props from AuthContext */}
          <Header isAuthenticated={isLoggedIn} onLogout={logout} />

          {/* This main tag will contain the content of your individual pages */}
          <main className="flex-grow">
            {children} {/* This is where the routed page component will be rendered */}
          </main>

          <Footer />
          <ChatbotWidget />
        </div>
      );
    };

    export default Layout;
    