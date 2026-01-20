import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { useGlobalAction } from '../redux/actionHooks/useGlobalAction';

// Screen imports
import SplashScreen from '../screens/Splash/SplashScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import NotFoundScreen from '../screens/NotFound/NotFoundScreen';

// Report screens
import {
  MyReportList,
  TargetVsAchievementReport,
  BrandWiseSalesReport,
  NegativeShopReport,
  OutstandingAgeReport,
  DistributorDataStatus,
  OutletMyActivityPartyList,
  MyActivityReport,
  OutletVisitReports,
  OutletVisitActivity,
} from '../screens/Reports';

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

      {/* Dashboard Report Screens */}
      <Route path="/reports/target-achievement" element={<ProtectedRoute><TargetVsAchievementReport /></ProtectedRoute>} />
      <Route path="/reports/brand-wise-sales" element={<ProtectedRoute><BrandWiseSalesReport /></ProtectedRoute>} />
      <Route path="/reports/negative-shop" element={<ProtectedRoute><NegativeShopReport /></ProtectedRoute>} />
      <Route path="/reports/outstanding-age" element={<ProtectedRoute><OutstandingAgeReport /></ProtectedRoute>} />

      {/* Reports Module (Sidemenu) */}
      <Route path="/reports" element={<ProtectedRoute><MyReportList /></ProtectedRoute>} />

      {/* Additional Report Screens */}
      <Route path="/reports/distributor-data-status" element={<ProtectedRoute><DistributorDataStatus /></ProtectedRoute>} />
      <Route path="/reports/outlet-visit" element={<ProtectedRoute><OutletVisitReports /></ProtectedRoute>} />
      <Route path="/reports/my-activity" element={<ProtectedRoute><OutletMyActivityPartyList /></ProtectedRoute>} />
      <Route path="/reports/my-activity-detail" element={<ProtectedRoute><MyActivityReport /></ProtectedRoute>} />
      <Route path="/reports/outlet-visit-activity" element={<ProtectedRoute><OutletVisitActivity /></ProtectedRoute>} />
      <Route path="/reports/outlet-performance" element={<ProtectedRoute><ComingSoon title="Outlet Performance Report" /></ProtectedRoute>} />
      <Route path="/reports/visit-based-map" element={<ProtectedRoute><ComingSoon title="Visit Based MapView" /></ProtectedRoute>} />
      <Route path="/reports/live-location-map" element={<ProtectedRoute><ComingSoon title="Live Location MapView" /></ProtectedRoute>} />

      {/* Data Collection */}
      <Route path="/data-collection" element={<ProtectedRoute><ComingSoon title="Data Collection" /></ProtectedRoute>} />

      {/* Surveys */}
      <Route path="/surveys" element={<ProtectedRoute><ComingSoon title="Surveys" /></ProtectedRoute>} />

      {/* Resources */}
      <Route path="/resources" element={<ProtectedRoute><ComingSoon title="Resources" /></ProtectedRoute>} />

      {/* POD */}
      <Route path="/pod" element={<ProtectedRoute><ComingSoon title="Proof of Delivery" /></ProtectedRoute>} />

      {/* Settings & Info */}
      <Route path="/settings" element={<ProtectedRoute><ComingSoon title="Settings" /></ProtectedRoute>} />
      <Route path="/about" element={<ProtectedRoute><ComingSoon title="About Us" /></ProtectedRoute>} />
      <Route path="/privacy" element={<ProtectedRoute><ComingSoon title="Privacy Policy" /></ProtectedRoute>} />
      <Route path="/security" element={<ProtectedRoute><ComingSoon title="Security Notice" /></ProtectedRoute>} />

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
