import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarTrigger } from '../ui/sidebar';
import { Navigation } from './navigation/navigation';
// import { useTheme } from '@/context/theme-context';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

export function Navbar() {
  const isMobile = useIsMobile();

  // const { logo } = useTheme()

  return (
    <header className="w-full h-[60px] flex items-center justify-between px-10 fixed">
      {/* <img src={logo} className='h-[2.2rem]'/> */}
      <h1 className='text-2xl font-bold '>Shark CRM</h1>
      <div className='mx-9 relative w-full max-w-[400px]'>

      <Input placeholder='Busque um lead' className='w-full pl-3' disabled/>
      <Search className='absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 h-4' />

      </div>
      {isMobile ? <SidebarTrigger className="-ml-1" /> : <Navigation />}
    </header>
  );
}
