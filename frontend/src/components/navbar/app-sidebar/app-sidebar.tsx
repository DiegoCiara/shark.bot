import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/auth-context';
import { useIsMobile } from '@/hooks/use-mobile';
import { Navigation } from '../navigation/navigation';
import { NavUser } from './nav-user/nav-user';
import { useTheme } from '@/context/theme-context';

export function AppSidebar({ ...props }) {
  const { user } = useAuth();
  const { logo } = useTheme()

  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sidebar {...props}>
        <SidebarHeader>
          <img className='h-[2rem]' src={logo}/>
        </SidebarHeader>
        <SidebarContent>
          <Navigation />
          {/* <NavMain items={data.navMain} /> */}
          {/* <NavProjects projects={data.projects} /> */}
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user!} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }
}
