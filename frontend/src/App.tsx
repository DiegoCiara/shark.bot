import '@/App.css';
import Loading from '@/components/loading/loading';
import { AuthProvider } from '@/context/auth-context';
import { ProfileProvider } from '@/context/profile-context';
import { LoadingProvider } from '@/context/loading-context';
import { ThemeProvider } from '@/context/theme-context';
import { UserProvider } from '@/context/user-context';
import { AppRoute } from '@/routes/app.routes';
import { ContactProvider } from './context/contact-context';
import { WorkspaceProvider } from './context/workspace-context';
import { ModeToggle } from './components/mode-toggle/mode-toggle';
import { ProductProvider } from './context/product-context';
import { FunnelProvider } from './context/funnel-context';
import { DealProvider } from './context/deal-context';
import { PartnerProvider } from './context/partner-context';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <LoadingProvider>
        <AuthProvider>
          <WorkspaceProvider>
            <UserProvider>
              <FunnelProvider>
                <DealProvider>
                  <ProfileProvider>
                    <ProductProvider>
                      <PartnerProvider>
                        <ContactProvider>
                          <Loading />
                          <AppRoute />
                          <ModeToggle />
                        </ContactProvider>
                      </PartnerProvider>
                    </ProductProvider>
                  </ProfileProvider>
                </DealProvider>
              </FunnelProvider>
            </UserProvider>
          </WorkspaceProvider>
        </AuthProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
