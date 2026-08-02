import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { ThemeProvider } from '@/components/theme-provider';
import { SplashScreen } from '@/components/splash-screen';
import { LockedPage } from '@/components/locked-page';
import { FocusLock } from '@/components/focus-lock';
import NotFound from '@/pages/not-found';
import { SidebarLayout } from '@/components/layout/sidebar-layout';
import { getCurrentPlan, canAccess, requiredPlanFor, type Plan } from '@/lib/plan';
import { auth } from '@/lib/firebase';
import { useRequireAuth } from '@/hooks/use-require-auth';
import LandingPage from '@/pages/landing';
import Login from '@/pages/login';
import Signup from '@/pages/signup';

// Pages
import Dashboard from '@/pages/dashboard';
import LearningHub from '@/pages/learning';
import YouTubeResources from '@/pages/youtube';
import Notes from '@/pages/notes';
import PastPapers from '@/pages/past-papers';
import StudyGroups from '@/pages/study-groups';
import Assignments from '@/pages/assignments';
import Jobs from '@/pages/jobs';
import CvBuilder from '@/pages/cv-builder';
import Marketplace from '@/pages/marketplace';
import Settings from '@/pages/settings';
import Messages from '@/pages/messages';
import Friends from '@/pages/friends';
import Pricing from '@/pages/pricing';
import FocusTimer from '@/pages/timer';
import Leaderboard from '@/pages/leaderboard';
import MusicPage from '@/pages/music';
import { MusicProvider } from '@/lib/music-context';

const queryClient = new QueryClient();

function Gated({ path, component: Page }: { path: string; component: React.ComponentType }) {
  const [plan, setPlan] = useState<Plan>(getCurrentPlan());

  useEffect(() => {
    const handler = () => setPlan(getCurrentPlan());
    window.addEventListener('onex_plan_changed', handler);
    return () => window.removeEventListener('onex_plan_changed', handler);
  }, []);

  if (!canAccess(path, plan)) {
    return <LockedPage required={requiredPlanFor(path)} />;
  }
  return <Page />;
}

function LandingWrapper({ setAppEntered }: { setAppEntered: (val: boolean) => void }) {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    setAppEntered(true);
    if (auth.currentUser) {
      setLocation('/');
    } else {
      setLocation('/login');
    }
  };

  return <LandingPage onGetStarted={handleGetStarted} />;
}

function MainAppRoutes() {
  const user = useRequireAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user === null) {
      setLocation('/login');
    }
  }, [user, setLocation]);

  if (!user) {
    return null;
  }

  return (
    <MusicProvider>
      <SidebarLayout>
        <Switch>
          <Route path="/"             component={() => <Gated path="/"             component={Dashboard}       />} />
          <Route path="/assignments"  component={() => <Gated path="/assignments"  component={Assignments}     />} />
          <Route path="/timer"        component={() => <Gated path="/timer"        component={FocusTimer}      />} />
          <Route path="/leaderboard"  component={() => <Gated path="/leaderboard"  component={Leaderboard}     />} />
          <Route path="/learning"     component={() => <Gated path="/learning"     component={LearningHub}     />} />
          <Route path="/youtube"      component={() => <Gated path="/youtube"      component={YouTubeResources}/>} />
          <Route path="/notes"        component={() => <Gated path="/notes"        component={Notes}           />} />
          <Route path="/past-papers"  component={() => <Gated path="/past-papers"  component={PastPapers}      />} />
          <Route path="/study-groups" component={() => <Gated path="/study-groups" component={StudyGroups}     />} />
          <Route path="/jobs"         component={() => <Gated path="/jobs"         component={Jobs}            />} />
          <Route path="/cv-builder"   component={() => <Gated path="/cv-builder"   component={CvBuilder}       />} />
          <Route path="/marketplace"  component={() => <Gated path="/marketplace"  component={Marketplace}     />} />
          <Route path="/messages"     component={() => <Gated path="/messages"     component={Messages}        />} />
          <Route path="/friends"      component={() => <Gated path="/friends"      component={Friends}         />} />
          <Route path="/music"        component={() => <Gated path="/music"        component={MusicPage}       />} />
          <Route path="/settings"     component={Settings} />
          <Route path="/pricing"      component={Pricing} />
          <Route component={NotFound} />
        </Switch>
    </SidebarLayout>
  </MusicProvider>
  );
}

function App() {
  // true once the splash animation is fully done
  const [splashDone, setSplashDone] = useState(false);
  // true once the user enters the app
  const [appEntered, setAppEntered] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} themes={['light', 'dark', 'purple-black', 'red-black']}>
        {/* Focus lock overlay — sits above everything */}
        <FocusLock />

        {/* Splash animation — fires onDone when finished */}
        <SplashScreen onDone={() => setSplashDone(true)} />

        {/* Main routing once splash completes */}
        {splashDone && (
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route>
                {!appEntered ? (
                  <LandingWrapper setAppEntered={setAppEntered} />
                ) : (
                  <MainAppRoutes />
                )}
              </Route>
            </Switch>
          </WouterRouter>
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

