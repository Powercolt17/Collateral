import { useState, useEffect } from 'react';
import { DevLogin } from './pages/DevLogin';
import { ConnectXPage } from './pages/ConnectXPage';
import { CreateContractPage } from './pages/CreateContractPage';
import { ContractDetailPage } from './pages/ContractDetailPage';
import { hasAuthToken, clearAuthToken } from './lib/api/api';

type View = 'LOGIN' | 'CONNECT_X' | 'CREATE' | 'DETAIL';

function App() {
  const [view, setView] = useState<View>('LOGIN');
  const [contractId, setContractId] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b p-4 flex justify-between items-center">
        <div className="font-bold text-xl tracking-tight">COLLATERAL</div>
        {view !== 'LOGIN' && (
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-black">
            Log Out
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
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
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-gray-400 text-sm">
        Collateral Demo • Local End-to-End
      </footer>
    </div>
  );
}

export default App;
