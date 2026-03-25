import { Moon, Sun, Monitor, Zap } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const { theme, setTheme } = useTheme()
  const { isMobile } = useSidebar()

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 md:px-6 backdrop-blur-md shadow-subtle transition-colors duration-200">
      <div className="flex items-center gap-4">
        {isMobile && <SidebarTrigger />}
        {isMobile && (
          <div className="flex items-center gap-2 text-primary font-bold tracking-tight">
            <Zap className="h-5 w-5 fill-current" />
            <span>ADAPTA EVENT</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex h-9 rounded-md border-dashed border-primary/30 hover:border-primary/50 text-foreground"
            >
              Workspace Global
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="font-medium">Workspace Global</DropdownMenuItem>
            <DropdownMenuItem disabled>+ Novo Workspace</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9 text-muted-foreground hover:text-foreground"
            >
              {theme === 'light' ? (
                <Sun className="h-4 w-4" />
              ) : theme === 'dark' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Monitor className="h-4 w-4" />
              )}
              <span className="sr-only">Alternar tema</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>Claro</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>Escuro</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>Sistema</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
