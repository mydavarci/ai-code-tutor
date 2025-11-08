import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { useProgressStore } from '../store/progress.store';
import { useEffect } from 'react';

export default function Layout() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { streak, fetchStreak } = useProgressStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchStreak();
    }
  }, [isAuthenticated, fetchStreak]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-primary-600">AI Code Tutor</div>
            </Link>

            <nav className="flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-primary-600">
                    Dashboard
                  </Link>
                  <Link to="/editor" className="text-gray-700 hover:text-primary-600">
                    Practice
                  </Link>
                  <Link to="/progress" className="text-gray-700 hover:text-primary-600">
                    Progress
                  </Link>

                  {streak && (
                    <div className="flex items-center space-x-2 px-3 py-1 bg-orange-100 rounded-full">
                      <span className="text-orange-600">🔥</span>
                      <span className="font-semibold text-orange-600">{streak.currentStreak}</span>
                    </div>
                  )}

                  <div className="text-sm text-gray-600">{user?.email}</div>

                  <button onClick={handleLogout} className="btn btn-secondary">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-primary-600">
                    Login
                  </Link>
                  <Link to="/signup" className="btn btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-600">
            © 2024 AI Code Tutor. Learn JavaScript & React with AI-powered exercises.
          </p>
        </div>
      </footer>
    </div>
  );
}
