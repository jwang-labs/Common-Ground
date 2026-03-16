import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import MapPage from "@/pages/Map";
import Report from "@/pages/Report";
import Recognize from "@/pages/Recognize";
import Rights from "@/pages/Rights";
import NotFound from "@/pages/not-found";

// Initialize React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Layout>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/map" component={MapPage} />
              <Route path="/report" component={Report} />
              <Route path="/recognize" component={Recognize} />
              <Route path="/rights" component={Rights} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
