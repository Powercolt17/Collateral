import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
    currentView: string;
    isLoggedIn: boolean;
    username?: string;
    onNavigate: (view: string) => void;
    onSignIn: () => void;
    onSignOut: () => void;
}

export function Header({
    currentView,
    isLoggedIn,
    username,
    onNavigate,
    onSignIn,
    onSignOut
}: HeaderProps) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navItems = [
        { path: 'OVERVIEW', label: 'Overview' },
        { path: 'CONTRACTS', label: 'Contracts' },
        { path: 'LEDGER', label: 'Ledger' },
    ];

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-neutral-200 bg-neutral-50/95 backdrop-blur-sm">
            <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
                {/* Left: Brand */}
                <button
                    onClick={() => onNavigate('OVERVIEW')}
                    className="flex items-center gap-2.5 group cursor-pointer"
                >
                    <div className="w-4 h-4 bg-neutral-900 flex items-center justify-center rounded-[1px]">
                        <div className="w-1.5 h-1.5 bg-white rounded-[0.5px]"></div>
                    </div>
                    <span className="font-mono text-xs font-medium tracking-wider uppercase text-neutral-900">
                        Collateral<span className="text-brand-red">.market</span>
                    </span>
                </button>

                {/* Center: Navigation Pills */}
                <div className="hidden md:flex items-center bg-white border border-neutral-200 rounded-full px-1 py-1">
                    {navItems.map((item) => {
                        const isActive = currentView === item.path ||
                            (item.path === 'CONTRACTS' && currentView.startsWith('CONTRACT'));
                        return (
                            <button
                                key={item.path}
                                onClick={() => onNavigate(item.path)}
                                className={`px-4 py-1.5 text-[11px] font-medium tracking-wide uppercase transition-colors rounded-full
                                    ${isActive
                                        ? 'bg-neutral-50 text-neutral-900 shadow-none'
                                        : 'text-neutral-500 hover:text-neutral-900'
                                    }`}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                {/* Right: Auth */}
                <div className="flex items-center gap-4 relative">
                    {!isLoggedIn ? (
                        <button
                            onClick={onSignIn}
                            className="bg-neutral-900 hover:bg-neutral-800 text-white text-[11px] font-medium px-5 py-2 rounded-[2px] transition-all flex items-center gap-2 uppercase tracking-wide"
                        >
                            Sign In
                        </button>
                    ) : (
                        <div ref={dropdownRef} className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-3 bg-white border border-neutral-200 hover:border-neutral-400 text-neutral-900 px-3.5 py-1.5 h-9 rounded-[2px] transition-all shadow-sm"
                            >
                                <div className="w-1.5 h-1.5 bg-brand-green rounded-full"></div>
                                <span className="font-mono text-[11px] font-medium tracking-wide pt-0.5">
                                    {username || '@user'}
                                </span>
                                <svg className={`w-3 h-3 text-neutral-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-neutral-200 shadow-lg rounded-[2px] z-50 py-1.5">
                                    <button
                                        onClick={() => { onNavigate('PROFILE'); setDropdownOpen(false); }}
                                        className="text-left w-full px-5 py-2.5 font-mono text-[10px] text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 uppercase tracking-widest transition-colors"
                                    >
                                        My Identity Record
                                    </button>
                                    <button
                                        onClick={() => { onNavigate('MY_CONTRACTS'); setDropdownOpen(false); }}
                                        className="text-left w-full px-5 py-2.5 font-mono text-[10px] text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 uppercase tracking-widest transition-colors"
                                    >
                                        My Contracts
                                    </button>
                                    <div className="h-px w-full bg-neutral-200 my-1"></div>
                                    <button
                                        onClick={() => { onSignOut(); setDropdownOpen(false); }}
                                        className="text-left w-full px-5 py-2.5 font-mono text-[10px] text-neutral-500 hover:text-brand-red hover:bg-red-50 uppercase tracking-widest transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
