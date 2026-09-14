import { HomeIcon, MailCheckIcon } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';

export type Screen = 'home' | 'qsl-manager';

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
    activeScreen: Screen;
    onNavigate: (screen: Screen) => void;
};

const navigation = [
    { screen: 'home' as const, label: 'Home', icon: HomeIcon },
    { screen: 'qsl-manager' as const, label: 'QSL Manager', icon: MailCheckIcon }
];

export function AppSidebar({ activeScreen, onNavigate, ...props }: AppSidebarProps) {
    return <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton><span className="text-base font-semibold">HamLogger</span></SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>{navigation.map(({ screen, label, icon: Icon }) =>
                        <SidebarMenuItem key={screen}>
                            <SidebarMenuButton isActive={activeScreen === screen} onClick={() => onNavigate(screen)}><Icon /><span>{label}</span>
                            </SidebarMenuButton></SidebarMenuItem>)}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>;
}
