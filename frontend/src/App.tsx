import '@/App.css';
import Loading from '@/components/loading/loading';
import { AuthProvider } from '@/context/auth-context';
import { LoadingProvider } from '@/context/loading-context';
import { ThemeProvider } from '@/context/theme-context';
import { UserProvider } from '@/context/user-context';
import { AppRoute } from '@/routes/app.routes';
import { ContactProvider } from './context/contact-context';
import { ModeToggle } from './components/mode-toggle/mode-toggle';
import { SessionProvider } from './context/session-context';
import { ThreadProvider } from './context/thread-context';
import { SocketProvider } from './context/socket-context';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <SocketProvider>
        <LoadingProvider>
          <AuthProvider>
            <SessionProvider>
              <UserProvider>
                <ContactProvider>
                  <ThreadProvider>
                    <Loading />
                    <AppRoute />
                    <ModeToggle />
                  </ThreadProvider>
                </ContactProvider>
              </UserProvider>
            </SessionProvider>
          </AuthProvider>
        </LoadingProvider>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;
