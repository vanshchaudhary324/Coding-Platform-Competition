import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/LoginPage';
import { PasskeyPage } from './components/PasskeyPage';
import { StudentWorkspace } from './components/StudentWorkspace';
import { AdminDashboard } from './components/admin/AdminDashboard';

function AppRouter() {
  const { view } = useApp();
  switch (view) {
    case 'login':    return <LoginPage />;
    case 'passkey':  return <PasskeyPage />;
    case 'student':  return <StudentWorkspace />;
    case 'admin':    return <AdminDashboard />;
    default:         return <LoginPage />;
  }
}

export function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
