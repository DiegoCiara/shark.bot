import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '@/pages/public/login.tsx';
import PrivateRoute from './private.routes.tsx';
import { useTheme } from '@/context/theme-context.tsx';
import { ToastContainer } from 'react-toastify';
import { Navbar } from '@/components/navbar/navbar.tsx';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar.tsx';
import { AppSidebar } from '@/components/navbar/app-sidebar/app-sidebar.tsx';
import Settings from '@/pages/private/settings/index.tsx';
import ForgotPassword from '@/pages/public/forgot-password.tsx';
import RecoverPassword from '@/pages/public/recover-password.tsx';
import Account from '@/pages/private/account.tsx';
import Service from '@/pages/private/service.tsx';


export const AppRoute = () => {
  const { theme } = useTheme();

  const pages = [
    {
      path: '/service',
      component: Service,
    },
    {
      path: '/settings',
      component: Settings,
    },
    {
      path: '/account',
      component: Account,
    },
    {
      path: '/service',
      component: Service,
    },
    {
      path: '/service/:thread_id',
      component: Service,
    },
  ];

  return (
    <>
      <ToastContainer theme={theme} />
      <Router>
        <Routes>
          <Route path={'/login'} element={<Login />} />
          <Route path={'/forgot-password'} element={<ForgotPassword />} />
          <Route
            path={'/recover/:token/:email'}
            element={<RecoverPassword />}
          />
          <Route path={'/*'} element={<Login />} />
          {pages.map((e) => (
            <Route
              path={e.path}
              element={
                <PrivateRoute>
                  <SidebarProvider>
                    <SidebarInset>
                      <Navbar />
                      <AppSidebar side="right" />
                      <e.component />
                    </SidebarInset>
                  </SidebarProvider>
                </PrivateRoute>
              }
            />
          ))}
        </Routes>
      </Router>
    </>
  );
};
