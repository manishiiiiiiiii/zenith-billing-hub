import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext,
} from "@tanstack/react-router";

import { ThemeProvider } from "@/lib/theme";
import { StoreProvider } from "@/lib/store";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TopNav } from "@/components/top-nav";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold gradient-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-xl gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground">Go home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={() => { reset(); }} className="mt-6 rounded-xl gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <StoreProvider>
          <TooltipProvider delayDuration={150}>
            <SidebarProvider>
              <div className="flex min-h-screen w-full bg-background">
                <AppSidebar />
                <div className="relative flex min-w-0 flex-1 flex-col">
                  <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[420px] mesh-bg opacity-60" />
                  <TopNav />
                  <main className="relative z-10 flex-1 px-4 py-6 md:px-8 md:py-8">
                    <Outlet />
                  </main>
                </div>
              </div>
              <Toaster richColors position="bottom-right" />
            </SidebarProvider>
          </TooltipProvider>
        </StoreProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
