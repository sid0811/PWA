import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { useGlobalAction } from '../redux/actionHooks/useGlobalAction';

// Screen imports - placeholder components for now
import SplashScreen from '../screens/Splash/SplashScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import NotFoundScreen from '../screens/NotFound/NotFoundScreen';

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedin } = useGlobalAction();

  if (!isLoggedin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route wrapper (redirect if logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedin, isSplashShown } = useGlobalAction();

  if (isLoggedin && !isSplashShown) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const Routes = () => {
  return (
    <RouterRoutes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><SplashScreen /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><LoginScreen /></PublicRoute>} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />

      {/* Shop Module */}
      <Route path="/shops" element={<ProtectedRoute><ComingSoon title="Shops" /></ProtectedRoute>} />
      <Route path="/shops/:id" element={<ProtectedRoute><ComingSoon title="Shop Details" /></ProtectedRoute>} />

      {/* Order Module */}
      <Route path="/orders" element={<ProtectedRoute><ComingSoon title="Orders" /></ProtectedRoute>} />
      <Route path="/orders/new" element={<ProtectedRoute><ComingSoon title="Create Order" /></ProtectedRoute>} />

      {/* Collection Module */}
      <Route path="/collections" element={<ProtectedRoute><ComingSoon title="Collections" /></ProtectedRoute>} />

      {/* Activity Module */}
      <Route path="/activity" element={<ProtectedRoute><ComingSoon title="Activity" /></ProtectedRoute>} />

      {/* Reports Module */}
      <Route path="/reports" element={<ProtectedRoute><ComingSoon title="Reports" /></ProtectedRoute>} />

      {/* Data Collection */}
      <Route path="/data-collection" element={<ProtectedRoute><ComingSoon title="Data Collection" /></ProtectedRoute>} />

      {/* Surveys */}
      <Route path="/surveys" element={<ProtectedRoute><ComingSoon title="Surveys" /></ProtectedRoute>} />

      {/* Resources */}
      <Route path="/resources" element={<ProtectedRoute><ComingSoon title="Resources" /></ProtectedRoute>} />

      {/* Settings & Info */}
      <Route path="/about" element={<ProtectedRoute><ComingSoon title="About Us" /></ProtectedRoute>} />
      <Route path="/privacy" element={<ProtectedRoute><ComingSoon title="Privacy Policy" /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<NotFoundScreen />} />
    </RouterRoutes>
  );
};

// Temporary Coming Soon component for routes not yet implemented
const ComingSoon = ({ title }: { title: string }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
  }}>
    <h1 style={{ marginBottom: '16px' }}>{title}</h1>
    <p style={{ color: 'var(--text-hint)' }}>This screen is coming soon</p>
  </div>
);

export default Routes;
