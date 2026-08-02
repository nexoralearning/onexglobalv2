import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { ThemeProvider } from '@/components/theme-provider';
import { SplashScreen } from '@/components/splash-screen';
import NotFound from '@/pages/not-found';
import { SidebarLayout } from '@/components/layout/sidebar-layout';

// Pages
import Login from '@/pages/login';
import Signup from '@/pages/signup';
import Dashboard from '@/pages/dashboard';
import LearningHub from '@/pages/learning';
import YouTubeResources from '@/pages/youtube';
import Notes from '@/pages/notes';
import PastPapers from '@/pages/past-papers';
import StudyGroups from '@/pages/study-groups';
import Assignments from '@/pages/assignments';
import Jobs from '@/pages/jobs';
import Marketplace from '@/pages/marketplace';
import Settings from '@/pages/settings';
import Messages from '@/pages/messages';
import Friends from '@/pages/friends';

const queryClient = new QueryClient();

function AppContent() {
  const [location] = useLocation();
  const isAuthPage = location === '/login' || location === '/signup';

  if (isAuthPage) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </Switch>
    );
  }

  return (
    <SidebarLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/learning" component={LearningHub} />
        <Route path="/youtube" component={YouTubeResources} />
        <Route path="/notes" component={Notes} />
        <Route path="/past-papers" component={PastPapers} />
        <Route path="/study-groups" component={StudyGroups} />
        <Route path="/assignments" component={Assignments} />
        <Route path="/jobs" component={Jobs} />
        <Route path="/marketplace" component={Marketplace} />
        <Route path="/messages" component={Messages} />
        <Route path="/friends" component={Friends} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </SidebarLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} themes={['light', 'dark', 'purple-black', 'red-black']}>
        <SplashScreen />
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AppContent />
        </WouterRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
