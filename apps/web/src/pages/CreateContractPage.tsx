import { useState } from 'react';
import { createContract } from '../lib/hooks/use-create-contract';
import { runActionWithState, createActionState } from '../lib/api/run-action';

// Exact FRONTEND styles as React CSS
const wizardStyles = `
/* === GLOBAL ACCENT TOKENS === */
:root {
    --accent-red: #8B1E1E;
    --accent-gold: #C9A227;
    --ink: #111111;
    --muted: #666666;
    --light: #999999;
    --border: rgba(0,0,0,0.12);
    --border-strong: rgba(0,0,0,0.22);
    --panel: rgba(0,0,0,0.02);
    --step-active-bg: rgba(139,30,30,0.03);
}

/* Typography Scale */
.text-display-lg { font-size: 3.5rem; letter-spacing: -0.03em; line-height: 0.95; font-weight: 700; color: var(--ink); }
.text-display-md { font-size: 2rem; letter-spacing: -0.02em; line-height: 1; font-weight: 600; color: var(--ink); }
.text-body-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.75rem; letter-spacing: 0.05em; }
.text-body-serif { font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif; font-size: 1.125rem; line-height: 1.6; color: var(--muted); }
.text-legal { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 0.75rem; color: var(--muted); letter-spacing: 0.01em; }

/* Accent Colors */
.text-accent-red { color: var(--accent-red); }
.text-accent-gold { color: var(--accent-gold); }

/* Reward Chip (Gold) */
.reward-chip {
    display: inline-block;
    border: 1px solid var(--accent-gold);
    color: var(--accent-gold);
    background: transparent;
    font-family: ui-monospace, monospace;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    padding: 4px 8px;
    text-transform: uppercase;
}

/* Cards */
.card-standard {
    border: 1px solid var(--border);
    background: #ffffff;
    transition: all 0.15s ease;
    cursor: pointer;
}
.card-standard:hover {
    border-color: var(--border-strong);
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.card-selected {
    border: 2px solid var(--ink) !important;
    background: #fafafa;
}
.card-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

/* Headline Accent Underline */
.headline-accent::after {
    content: '';
    display: block;
    width: 60px;
    height: 2px;
    background: var(--accent-red);
    margin-top: 12px;
}

/* === STEP HEADER === */
.step-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 48px;
    height: 72px;
    background: #ffffff;
    border-bottom: 1px solid var(--border);
}

.step-nav {
    display: flex;
    align-items: center;
    gap: 48px;
}

.step-item {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: default;
    position: relative;
    padding-bottom: 4px;
}

.step-item.clickable { cursor: pointer; }
.step-item.clickable:hover .step-label { color: var(--ink); }

.step-number {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
    letter-spacing: 0.1em;
    color: var(--light);
    transition: color 0.2s;
}

.step-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--light);
    transition: color 0.2s;
}

/* Step States */
.step-item.active .step-number { color: var(--muted); }
.step-item.active .step-label { color: var(--ink); }
.step-item.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background: var(--accent-red);
}

.step-item.completed .step-number { color: var(--muted); }
.step-item.completed .step-label { color: var(--ink); font-weight: 500; }
.step-item.completed .step-check {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    background: var(--accent-red);
    color: white;
    font-size: 10px;
    margin-left: 6px;
}

.step-check { display: none; }

.step-status {
    font-family: ui-monospace, monospace;
    font-size: 11px;
    letter-spacing: 0.05em;
    color: var(--light);
    text-transform: uppercase;
}

/* === PROGRESS BAR === */
.progress-container {
    position: relative;
    height: 3px;
    background: #f0f0f0;
    overflow: hidden;
}

.progress-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--accent-red);
    width: 0%;
    transition: width 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Utility */
.section-box { border: 1px solid var(--border); padding: 1.5rem; background: var(--panel); }
`;

type RiskTier = 'STEADY' | 'BOLD' | 'ALL_IN' | null;
type MetricSource = 'TWITTER' | 'STRIPE' | null;

interface Props {
    onContractCreated: (id: string) => void;
}

export function CreateContractPage({ onContractCreated }: Props) {
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [selectedRisk, setSelectedRisk] = useState<RiskTier>(null);
    const [selectedSource, setSelectedSource] = useState<MetricSource>(null);
    const [capitalAmount, setCapitalAmount] = useState(5000);
    const [state, setState] = useState(createActionState());
    // Hold-to-execute removed for simplicity - using click instead

    const progressWidth = { 1: '33%', 2: '66%', 3: '100%' }[currentStep] || '0%';

    const markCompleted = (step: number) => {
        if (!completedSteps.includes(step)) {
            setCompletedSteps([...completedSteps, step]);
        }
    };

    const nextStep = () => {
        markCompleted(currentStep);
        setCurrentStep(currentStep + 1);
    };

    const goToStep = (step: number) => {
        if (completedSteps.includes(step) || step === currentStep) {
            setCurrentStep(step);
        }
    };

    const handleExecute = async () => {
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 30);

        const params = {
            platform: 'X' as const,
            metricType: 'FOLLOWERS',
            condition: {
                operator: 'GTE' as const,
                threshold: 10000,
                deadline: deadline.toISOString(),
            },
            lockAmountUsdCents: capitalAmount * 100,
            payoutAmountUsdCents: capitalAmount * 100,
        };

        await runActionWithState(state, () => createContract(params, true), (response) => {
            const data = (response as any).data || response;
            if (data.contractId) {
                onContractCreated(data.contractId);
            } else if (data.contract?.id) {
                onContractCreated(data.contract.id);
            }
        });
        setState({ ...state });
    };

    return (
        <>
            <style>{wizardStyles}</style>

            <div className="h-[calc(100vh-64px)] flex flex-col bg-white font-sans text-black overflow-hidden relative">
                {/* Step Header */}
                <header className="step-header shrink-0">
                    <nav className="step-nav">
                        <div
                            className={`step-item ${currentStep === 1 ? 'active' : ''} ${completedSteps.includes(1) ? 'completed clickable' : ''}`}
                            onClick={() => goToStep(1)}
                        >
                            <span className="step-number">01</span>
                            <span className="step-label">Profile</span>
                            <span className="step-check">✓</span>
                        </div>
                        <div
                            className={`step-item ${currentStep === 2 ? 'active' : ''} ${completedSteps.includes(2) ? 'completed clickable' : ''}`}
                            onClick={() => goToStep(2)}
                        >
                            <span className="step-number">02</span>
                            <span className="step-label">Source</span>
                            <span className="step-check">✓</span>
                        </div>
                        <div
                            className={`step-item ${currentStep === 3 ? 'active' : ''} ${completedSteps.includes(3) ? 'completed clickable' : ''}`}
                            onClick={() => goToStep(3)}
                        >
                            <span className="step-number">03</span>
                            <span className="step-label">Lock</span>
                            <span className="step-check">✓</span>
                        </div>
                    </nav>
                    <div className="step-status">S: {currentStep === 1 ? 'Profile' : currentStep === 2 ? 'Source' : 'Lock'}</div>
                </header>

                {/* Progress Bar */}
                <div className="progress-container">
                    <div className="progress-fill" style={{ width: progressWidth }}></div>
                </div>

                {/* Main Content Area */}
                <main className="flex-1 relative overflow-y-auto flex flex-col px-6 md:px-12 py-8 md:py-16">

                    {/* STEP 1: RISK PROFILE */}
                    {currentStep === 1 && (
                        <section className="max-w-5xl mx-auto w-full flex flex-col h-full">
                            <div className="mb-16">
                                <h1 className="text-display-lg headline-accent">Select Exposure</h1>
                                <p className="text-body-serif max-w-xl mt-6">Choose an enforcement profile. This determines your verification threshold and potential multiplier.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                                {/* Steady */}
                                <button
                                    className={`card-standard p-8 text-left flex flex-col justify-between h-64 ${selectedRisk === 'STEADY' ? 'card-selected' : ''}`}
                                    onClick={() => setSelectedRisk('STEADY')}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="text-body-mono text-neutral-500 uppercase">Tier 1</span>
                                        <span className="reward-chip">1.5x</span>
                                    </div>
                                    <div>
                                        <h2 className="text-display-md mb-2">Steady</h2>
                                        <p className="text-sm text-neutral-500 leading-relaxed">Consistent baseline performance. Low variance expected.</p>
                                    </div>
                                </button>

                                {/* Bold */}
                                <button
                                    className={`card-standard p-8 text-left flex flex-col justify-between h-64 ${selectedRisk === 'BOLD' ? 'card-selected' : ''}`}
                                    onClick={() => setSelectedRisk('BOLD')}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="text-body-mono text-neutral-500 uppercase">Tier 2</span>
                                        <span className="reward-chip">2.0x</span>
                                    </div>
                                    <div>
                                        <h2 className="text-display-md mb-2">Bold</h2>
                                        <p className="text-sm text-neutral-500 leading-relaxed">Significant deviation from baseline. Requires strict discipline.</p>
                                    </div>
                                </button>

                                {/* All-In */}
                                <button
                                    className={`card-standard p-8 text-left flex flex-col justify-between h-64 ${selectedRisk === 'ALL_IN' ? 'card-selected' : ''}`}
                                    onClick={() => setSelectedRisk('ALL_IN')}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="text-body-mono text-neutral-500 uppercase">Tier 3</span>
                                        <span className="reward-chip">4.0x</span>
                                    </div>
                                    <div>
                                        <h2 className="text-display-md mb-2">All-In</h2>
                                        <p className="text-sm text-neutral-500 leading-relaxed">Maximum exposure. Failure results in immediate <span className="text-accent-red">total forfeiture</span>.</p>
                                    </div>
                                </button>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    className="bg-black text-white text-body-mono uppercase px-8 py-4 hover:bg-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors"
                                    disabled={!selectedRisk}
                                    onClick={nextStep}
                                >
                                    Confirm Profile →
                                </button>
                            </div>
                        </section>
                    )}

                    {/* STEP 2: METRIC SOURCE */}
                    {currentStep === 2 && (
                        <section className="max-w-5xl mx-auto w-full flex flex-col h-full">
                            <div className="mb-16">
                                <h1 className="text-display-lg headline-accent">Select Authority</h1>
                                <p className="text-body-serif max-w-xl mt-6">Designate the external source of truth. The selected authority will be the sole arbiter of the contract outcome.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-t border-neutral-100 pt-8">
                                {/* X (Twitter) */}
                                <button
                                    className={`card-standard p-8 text-left h-52 flex flex-col justify-between group ${selectedSource === 'TWITTER' ? 'card-selected' : ''}`}
                                    onClick={() => setSelectedSource('TWITTER')}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="text-body-mono text-neutral-400 uppercase">Oracle_01</span>
                                        <span className="text-body-mono text-neutral-400 uppercase text-[10px]">Integrity: High</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">X (Twitter)</h3>
                                        <p className="text-legal">Public, immutable follower snapshots.</p>
                                    </div>
                                </button>

                                {/* Stripe */}
                                <button
                                    className={`card-standard p-8 text-left h-52 flex flex-col justify-between group ${selectedSource === 'STRIPE' ? 'card-selected' : ''}`}
                                    onClick={() => setSelectedSource('STRIPE')}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="text-body-mono text-neutral-400 uppercase">Oracle_02</span>
                                        <span className="text-body-mono text-neutral-400 uppercase text-[10px]">Integrity: Proven</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Stripe</h3>
                                        <p className="text-legal">Verified gross revenue from Stripe Connect.</p>
                                    </div>
                                </button>

                                {/* GitHub (Coming Soon) */}
                                <div className="card-standard card-disabled p-8 text-left h-52 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <span className="text-body-mono text-neutral-400 uppercase">Oracle_03</span>
                                        <span className="text-body-mono text-neutral-300 uppercase text-[10px]">Coming Soon</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2 text-neutral-400">GitHub</h3>
                                        <p className="text-legal">Commit history from GitHub API.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pb-40">
                                <button
                                    className="bg-black text-white text-body-mono uppercase px-8 py-4 hover:bg-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors"
                                    disabled={!selectedSource}
                                    onClick={nextStep}
                                >
                                    Bind Authority →
                                </button>
                            </div>
                        </section>
                    )}

                    {/* STEP 3: FINAL LOCK */}
                    {currentStep === 3 && (
                        <section className="max-w-5xl mx-auto w-full flex flex-col h-full">
                            <div className="mb-10">
                                <h1 className="text-display-lg headline-accent">Execute Contract</h1>
                                <p className="text-body-mono text-neutral-500 uppercase mt-6">Ref: <span className="text-black">0x7A...9F</span></p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
                                {/* LEFT: Contract Definition */}
                                <div className="space-y-6">
                                    <div className="section-box space-y-4">
                                        <div className="flex justify-between border-b border-black/5 pb-2">
                                            <span className="text-body-mono text-neutral-500 uppercase">Authority</span>
                                            <span className="font-mono text-sm font-semibold">{selectedSource === 'TWITTER' ? 'X (Twitter)' : 'Stripe'}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-black/5 pb-2">
                                            <span className="text-body-mono text-neutral-500 uppercase">Condition</span>
                                            <span className="font-mono text-sm">Target &gt; Baseline + 15%</span>
                                        </div>
                                        <div className="flex justify-between border-b border-black/5 pb-2">
                                            <span className="text-body-mono text-neutral-500 uppercase">Time Window</span>
                                            <span className="font-mono text-sm">30 Days</span>
                                        </div>
                                        <div className="flex justify-between border-b border-black/5 pb-2">
                                            <span className="text-body-mono text-neutral-500 uppercase">Payout</span>
                                            <span className="font-mono text-sm font-semibold text-accent-gold">
                                                {selectedRisk === 'STEADY' ? '1.5x' : selectedRisk === 'BOLD' ? '2.0x' : '4.0x'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between pt-2">
                                            <span className="text-body-mono text-neutral-500 uppercase">Failure Outcome</span>
                                            <span className="font-mono text-sm text-accent-red font-semibold">Forfeiture on failure</span>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT: Execution */}
                                <div className="flex flex-col">
                                    {/* Capital Allocation */}
                                    <div className="section-box mb-6">
                                        <label className="text-body-mono text-neutral-400 mb-4 block uppercase">Capital Allocation</label>
                                        <div className="flex items-baseline border-b-2 border-neutral-200 focus-within:border-black transition-colors pb-3">
                                            <span className="text-3xl text-neutral-400 mr-2 font-normal">$</span>
                                            <input
                                                type="number"
                                                value={capitalAmount}
                                                onChange={(e) => setCapitalAmount(Number(e.target.value))}
                                                className="w-full text-4xl font-medium text-neutral-900 bg-transparent border-none outline-none p-0 placeholder-neutral-200"
                                                placeholder="0"
                                            />
                                        </div>
                                        <p className="text-legal mt-3">This amount will be <span className="text-accent-red">unavailable</span> until resolution.</p>
                                    </div>

                                    {/* Execute Button */}
                                    <div className="relative select-none">
                                        <button
                                            className="w-full bg-neutral-900 text-white text-body-mono uppercase py-5 relative overflow-hidden transition-colors group hover:bg-black disabled:opacity-50"
                                            onClick={handleExecute}
                                            disabled={state.loading}
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                <span>{state.loading ? 'Executing...' : 'Execute Contract'}</span>
                                            </span>
                                        </button>
                                        <p className="text-legal text-center mt-3">Execution finalizes the contract and records the baseline.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quote (below grid) */}
                            <div className="border-t border-neutral-100 pt-6 mt-auto">
                                <p className="font-serif italic text-neutral-600 text-base">"This contract will execute exactly as written."</p>
                                <p className="text-legal mt-1">No manual review. <span className="text-accent-red">No overrides.</span></p>
                            </div>
                        </section>
                    )}

                    {/* Footer Spacer */}
                    <div className="h-32"></div>
                </main>
            </div>
        </>
    );
}
