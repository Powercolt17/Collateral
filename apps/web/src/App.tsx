import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StatusBar } from './components/StatusBar';
import { DevLogin } from './pages/DevLogin';
import { ConnectXPage } from './pages/ConnectXPage';
import { CreateContractPage } from './pages/CreateContractPage';
import { ContractDetailPage } from './pages/ContractDetailPage';
import { hasAuthToken, clearAuthToken } from './lib/api/api';

type View = 'LOGIN' | 'CONNECT_X' | 'CREATE' | 'DETAIL';

function App() {
  const [view, setView] = useState<View>('LOGIN');
  const [contractId, setContractId] = useState<string | null>(null);
  const [username] = useState<string>('@user_demo');

  useEffect(() => {
    if (hasAuthToken()) {
      setView('CONNECT_X');
    }
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    setView('LOGIN');
    setContractId(null);
  };

  const handleNavigate = (newView: string) => {
    if (newView === 'CONTRACTS' || newView === 'CREATE') {
      setView('CREATE');
    } else if (newView === 'OVERVIEW') {
      // For now, go to CREATE as we don't have Overview yet
      setView('CREATE');
    }
  };

  const isLoggedIn = view !== 'LOGIN';

  return (
    // Exact FRONTEND body classes
    <div className="min-h-screen flex flex-col font-sans relative text-[#0E0E11] bg-[#F7F7F6] antialiased overflow-x-hidden">
      {/* Background Noise (exact from FRONTEND) */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')"
        }}
      />

      {/* Header */}
      {isLoggedIn && (
        <Header
          currentView={view}
          isLoggedIn={isLoggedIn}
          username={username}
          onNavigate={handleNavigate}
          onSignIn={() => setView('LOGIN')}
          onSignOut={handleLogout}
        />
      )}

      {/* Main Content - pt-16 for header offset, pb-10 for status bar */}
      <div id="app" className={`${isLoggedIn ? 'pt-16' : ''} relative z-10 min-h-screen flex flex-col pb-10`}>
        {view === 'LOGIN' && (
          <DevLogin onLogin={() => setView('CONNECT_X')} />
        )}

        {view === 'CONNECT_X' && (
          <ConnectXPage onNext={() => setView('CREATE')} />
        )}

        {view === 'CREATE' && (
          <CreateContractPage onContractCreated={(id) => {
            setContractId(id);
            setView('DETAIL');
          }} />
        )}

        {view === 'DETAIL' && contractId && (
          <ContractDetailPage
            contractId={contractId}
            onBack={() => setView('CREATE')}
          />
        )}
      </div>

      {/* Status Bar (Fixed Bottom) - exact from FRONTEND */}
      {isLoggedIn && <StatusBar />}
    </div>
  );
}

export default App;
