import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Weight from "@/pages/Weight";
import Water from "@/pages/Water";
import Sleep from "@/pages/Sleep";
import Layout from "@/components/Layout";
import { HealthDataProvider } from "@/contexts/HealthDataContext";
import { initializeNotifications } from "@/lib/notification";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/weight" component={Weight} />
        <Route path="/water" component={Water} />
        <Route path="/sleep" component={Sleep} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  useEffect(() => {
    const checkNotificationPermission = async () => {
      const permission = await initializeNotifications();
      setPermissionGranted(permission === 'granted');
    };
    
    checkNotificationPermission();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <HealthDataProvider>
          <Toaster />
          <Router />
        </HealthDataProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
