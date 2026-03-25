import { Link, useLocation } from 'react-router-dom'
import {
  BarChart3,
  Users,
  Mail,
  QrCode,
  Truck,
  Settings,
  HelpCircle,
  LogOut,
  Zap,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const navigation = [
  { name: 'Métricas', href: '/dashboard', icon: BarChart3 },
  { name: 'Contatos', href: '/contacts', icon: Users },
  { name: 'Campanhas', href: '/campaigns', icon: Mail },
  { name: 'Check-in', href: '/checkin', icon: QrCode },
  { name: 'Fornecedores', href: '/suppliers', icon: Truck },
  { name: 'Configurações', href: '/settings', icon: Settings },
  { name: 'Ajuda', href: '/help', icon: HelpCircle },
]

export function AppSidebar() {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="h-16 flex justify-center px-6 border-b border-sidebar-border/20">
        <div className="flex items-center gap-2 text-primary">
          <Zap className="h-6 w-6 fill-current" />
          <span className="font-bold text-xl tracking-tight text-sidebar-foreground">
            ADAPTA EVENT
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-3">
              {navigation.map((item) => {
                const isActive = location.pathname.startsWith(item.href)
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      onClick={() => isMobile && setOpenMobile(false)}
                      className={cn(
                        'h-11 rounded-lg transition-all duration-200 text-sidebar-foreground/70',
                        isActive &&
                          'bg-primary/10 text-primary hover:bg-primary/15 font-medium border-l-4 border-primary rounded-l-none',
                      )}
                      tooltip={item.name}
                    >
                      <Link to={item.href} className="flex items-center gap-3 px-2">
                        <item.icon
                          className={cn(
                            'h-5 w-5',
                            isActive ? 'text-primary' : 'text-sidebar-foreground/50',
                          )}
                        />
                        <span className="text-base">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/20 p-4 pb-6">
        <div className="flex items-center gap-3 mb-4 px-2">
          <Avatar className="h-10 w-10 border border-sidebar-border/30">
            <AvatarFallback className="bg-primary/20 text-primary font-bold">
              {user?.user_metadata?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold truncate text-sidebar-foreground">
              {user?.user_metadata?.full_name || 'Usuário'}
            </span>
            <span className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</span>
          </div>
        </div>
        <SidebarMenuButton
          onClick={signOut}
          variant="outline"
          className="w-full h-10 justify-center text-red-400 hover:text-red-300 hover:bg-red-400/10 border-red-400/20 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair da conta
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}
