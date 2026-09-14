import { useState } from 'react';
import { AppSidebar, type Screen } from './components/app-sidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from './components/ui/sidebar';
import { HomeScreen } from './screens/home-screen';
import { QslManagerScreen } from './screens/qsl-manager-screen';

const spaceBackgroundUrl = 'https://app.worldradioleague.com/static/media/spaceBg.346ffa44f3f8196bfdff7cdc4a60c738.svg';

export function App() {
  const [screen, setScreen] = useState<Screen>('home');

  return <main
    className="min-h-svh bg-background text-foreground"
    style={{ backgroundImage: `url(${spaceBackgroundUrl})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
  >
    <SidebarProvider>
      <AppSidebar activeScreen={screen} onNavigate={setScreen} />
      <SidebarInset className="bg-transparent">
        <SidebarTrigger />
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{screen === 'home' ? <HomeScreen /> : <QslManagerScreen />}</div>
      </SidebarInset>
    </SidebarProvider>
  </main>;
}
