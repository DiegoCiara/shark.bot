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

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <LoadingProvider>
        <AuthProvider>
          <SessionProvider>
            <UserProvider>
              <ThreadProvider>
                <ContactProvider>
                  <Loading />
                  <AppRoute />
                  <ModeToggle />
                </ContactProvider>
              </ThreadProvider>
            </UserProvider>
          </SessionProvider>
        </AuthProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
