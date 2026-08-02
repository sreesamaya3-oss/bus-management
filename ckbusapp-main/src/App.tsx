import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ThemeProvider';
import { RoleLayout } from '@/components/layout/RoleLayout';

import RoleSelect from '@/pages/auth/RoleSelect';
import Login from '@/pages/auth/Login';
import NotFound from '@/pages/NotFound';

import StudentDashboard from '@/pages/student/StudentDashboard';
import StudentTracking from '@/pages/student/StudentTracking';
import StudentBusPass from '@/pages/student/StudentBusPass';
import StudentAttendance from '@/pages/student/StudentAttendance';
import StudentLeave from '@/pages/student/StudentLeave';
import StudentComplaints from '@/pages/student/StudentComplaints';
import StudentContact from '@/pages/student/StudentContact';
import StudentRatings from '@/pages/student/StudentRatings';
import StudentNotifications from '@/pages/student/StudentNotifications';

import ParentDashboard from '@/pages/parent/ParentDashboard';
import ParentTracking from '@/pages/parent/ParentTracking';
import ParentChildStatus from '@/pages/parent/ParentChildStatus';
import ParentTimeline from '@/pages/parent/ParentTimeline';
import ParentDriverDetails from '@/pages/parent/ParentDriverDetails';
import ParentEmergency from '@/pages/parent/ParentEmergency';

import DriverDashboard from '@/pages/driver/DriverDashboard';
import DriverTrips from '@/pages/driver/DriverTrips';
import DriverRoute from '@/pages/driver/DriverRoute';
import DriverStudents from '@/pages/driver/DriverStudents';
import DriverScanner from '@/pages/driver/DriverScanner';
import DriverAnnouncements from '@/pages/driver/DriverAnnouncements';
import DriverDelay from '@/pages/driver/DriverDelay';
import DriverSOS from '@/pages/driver/DriverSOS';

import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminFleetControl from '@/pages/admin/AdminFleetControl';
import AdminSchedules from '@/pages/admin/AdminSchedules';
import AdminDailyScheduling from '@/pages/admin/AdminDailyScheduling';
import AdminScheduleCalendar from '@/pages/admin/AdminScheduleCalendar';
import AdminAssignment from '@/pages/admin/AdminAssignment';
import AdminDriverAvailability from '@/pages/admin/AdminDriverAvailability';
import AdminBuses from '@/pages/admin/AdminBuses';
import AdminRoutes from '@/pages/admin/AdminRoutes';
import AdminStops from '@/pages/admin/AdminStops';
import AdminStudents from '@/pages/admin/AdminStudents';
import AdminParents from '@/pages/admin/AdminParents';
import AdminDrivers from '@/pages/admin/AdminDrivers';
import AdminAttendance from '@/pages/admin/AdminAttendance';
import AdminComplaints from '@/pages/admin/AdminComplaints';
import AdminLeaves from '@/pages/admin/AdminLeaves';
import AdminAnnouncements from '@/pages/admin/AdminAnnouncements';
import AdminAnalytics from '@/pages/admin/AdminAnalytics';
import AdminAI from '@/pages/admin/AdminAI';
import AdminReports from '@/pages/admin/AdminReports';
import AdminCalendar from '@/pages/admin/AdminCalendar';
import AdminEmergency from '@/pages/admin/AdminEmergency';

import ProfilePage from '@/pages/shared/ProfilePage';
import SettingsPage from '@/pages/shared/SettingsPage';
import NotificationsPage from '@/pages/shared/NotificationsPage';
import type { UserRole } from '@/lib/constants';

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 } } });

function ProfileWrapper({ role }: { role: UserRole }) {
  return <ProfilePage role={role} />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RoleSelect />} />
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/:role/login" element={<Login />} />

            <Route path="/student" element={<RoleLayout role="student" />}>
              <Route index element={<StudentDashboard />} />
              <Route path="tracking" element={<StudentTracking />} />
              <Route path="pass" element={<StudentBusPass />} />
              <Route path="attendance" element={<StudentAttendance />} />
              <Route path="leave" element={<StudentLeave />} />
              <Route path="complaints" element={<StudentComplaints />} />
              <Route path="contact" element={<StudentContact />} />
              <Route path="ratings" element={<StudentRatings />} />
              <Route path="notifications" element={<StudentNotifications />} />
              <Route path="profile" element={<ProfileWrapper role="student" />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="/parent" element={<RoleLayout role="parent" />}>
              <Route index element={<ParentDashboard />} />
              <Route path="tracking" element={<ParentTracking />} />
              <Route path="child" element={<ParentChildStatus />} />
              <Route path="timeline" element={<ParentTimeline />} />
              <Route path="driver" element={<ParentDriverDetails />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="emergency" element={<ParentEmergency />} />
              <Route path="profile" element={<ProfileWrapper role="parent" />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="/driver" element={<RoleLayout role="driver" />}>
              <Route index element={<DriverDashboard />} />
              <Route path="trips" element={<DriverTrips />} />
              <Route path="route" element={<DriverRoute />} />
              <Route path="students" element={<DriverStudents />} />
              <Route path="scanner" element={<DriverScanner />} />
              <Route path="announcements" element={<DriverAnnouncements />} />
              <Route path="delay" element={<DriverDelay />} />
              <Route path="sos" element={<DriverSOS />} />
              <Route path="profile" element={<ProfileWrapper role="driver" />} />
            </Route>

            <Route path="/admin" element={<RoleLayout role="admin" />}>
              <Route index element={<AdminDashboard />} />
              <Route path="fleet" element={<AdminFleetControl />} />
              <Route path="schedules" element={<AdminSchedules />} />
              <Route path="daily-scheduling" element={<AdminDailyScheduling />} />
              <Route path="schedule-calendar" element={<AdminScheduleCalendar />} />
              <Route path="assignment" element={<AdminAssignment />} />
              <Route path="driver-availability" element={<AdminDriverAvailability />} />
              <Route path="buses" element={<AdminBuses />} />
              <Route path="routes" element={<AdminRoutes />} />
              <Route path="stops" element={<AdminStops />} />
              <Route path="students" element={<AdminStudents />} />
              <Route path="parents" element={<AdminParents />} />
              <Route path="drivers" element={<AdminDrivers />} />
              <Route path="attendance" element={<AdminAttendance />} />
              <Route path="complaints" element={<AdminComplaints />} />
              <Route path="leaves" element={<AdminLeaves />} />
              <Route path="announcements" element={<AdminAnnouncements />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="ai" element={<AdminAI />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="calendar" element={<AdminCalendar />} />
              <Route path="emergency" element={<AdminEmergency />} />
              <Route path="profile" element={<ProfileWrapper role="admin" />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
