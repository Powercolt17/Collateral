(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const u of o.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&i(u)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();class G{constructor(t){this.routes=t,this.currentRoute=null,window.addEventListener("hashchange",()=>this.handleRoute()),window.addEventListener("load",()=>this.handleRoute())}navigate(t){window.location.hash=t}handleRoute(){const t=window.location.hash.slice(1)||"/overview";let n=this.routes.find(i=>i.path===t);if(!n){for(const i of this.routes)if(i.path.includes(":")){const s=i.path.replace(/:(\w+)/g,"([^/]+)"),o=new RegExp(`^${s}$`),u=t.match(o);if(u){n={...i,params:{id:u[1]}};break}}}if(!n){this.navigate("/overview");return}this.currentRoute=t,this.onRouteChange&&this.onRouteChange(n,t)}getCurrentPath(){return this.currentRoute||"/overview"}}function W(e){return`
        <nav id="main-nav" class="fixed top-0 w-full z-50 border-b border-[#D9DBE1] bg-[#F7F7F6]/95 backdrop-blur-sm">
            <div class="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
                <!-- Left: Brand -->
                <a href="#" onclick="window.router.navigate('/overview'); return false;" class="flex items-center gap-2.5 group cursor-pointer">
                    <div class="w-4 h-4 bg-[#0E0E11] flex items-center justify-center rounded-[1px]">
                        <div class="w-1.5 h-1.5 bg-white rounded-[0.5px]"></div>
                    </div>
                    <span class="font-mono text-xs font-medium tracking-wider uppercase text-[#0E0E11]">
                        Collateral<span class="text-[#921818]">.market</span>
                    </span>
                </a>

                <!-- Center: Links -->
                <div class="hidden md:flex items-center bg-white border border-[#D9DBE1] rounded-full px-1 py-1">
                    ${[{path:"/overview",label:"Overview"},{path:"/ledger",label:"Ledger"},{path:"/contracts",label:"Contracts"},{path:"/docs",label:"Docs"}].map(i=>{const s=e===i.path||i.path==="/contracts"&&e.startsWith("/contracts");return`
            <button onclick="window.router.navigate('${i.path}')" 
                class="nav-btn relative px-4 py-1.5 text-[11px] font-medium tracking-wide uppercase transition-colors rounded-full
                    ${s?"bg-[#F7F7F6] text-[#0E0E11] shadow-none":"text-[#6B6E76] hover:text-[#0E0E11]"}" 
                data-target="${i.path}" 
                data-active="${s}">
                ${i.label}
            </button>
        `}).join("")}
                </div>

                <!-- Right: Identity/Login -->
                <div class="flex items-center gap-4 relative">
                    <!-- Guest State -->
                    <button onclick="window.app.handleAuthClick()" id="btn-auth" class="bg-[#0E0E11] hover:bg-[#1E1F23] text-white text-[11px] font-medium px-5 py-2 rounded-[2px] transition-all flex items-center gap-2 uppercase tracking-wide">
                        <span>Sign In</span>
                    </button>

                    <!-- Authenticated State (Dropdown) - Hidden by default -->
                    <div id="user-menu" class="relative group hidden">
                        <button id="user-menu-btn" onclick="window.app.toggleMenuPersistence(event)" class="flex items-center gap-3 bg-white border border-[#D9DBE1] hover:border-[#6B6E76] text-[#0E0E11] px-3.5 py-1.5 h-9 rounded-[2px] transition-all shadow-sm group-hover:border-[#6B6E76]">
                            <div class="w-1.5 h-1.5 bg-[#1F7A4D] rounded-full"></div>
                            <span class="font-mono text-[11px] font-medium tracking-wide pt-0.5" id="menu-username">@username</span>
                            <i data-lucide="chevron-down" class="w-3 h-3 text-[#6B6E76] transition-transform duration-200 group-hover:text-[#0E0E11]"></i>
                        </button>
                        
                        <!-- Dropdown Menu -->
                        <div id="user-dropdown-content" class="absolute right-0 top-full mt-2 w-52 bg-white border border-[#D9DBE1] shadow-[0_10px_30px_rgba(0,0,0,0.06)] rounded-[2px] hidden group-hover:block z-50 py-1.5">
                            <div class="flex flex-col">
                                <button onclick="window.router.navigate('/profile')" class="text-left w-full px-5 py-2.5 font-mono text-[10px] text-[#6B6E76] hover:text-[#0E0E11] hover:bg-[#F7F7F6] uppercase tracking-widest transition-colors">
                                    My Identity Record
                                </button>
                                <button onclick="window.router.navigate('/my-contracts')" class="text-left w-full px-5 py-2.5 font-mono text-[10px] text-[#6B6E76] hover:text-[#0E0E11] hover:bg-[#F7F7F6] uppercase tracking-widest transition-colors">
                                    My Contracts
                                </button>
                                <button onclick="window.router.navigate('/receipts')" class="text-left w-full px-5 py-2.5 font-mono text-[10px] text-[#6B6E76] hover:text-[#0E0E11] hover:bg-[#F7F7F6] uppercase tracking-widest transition-colors">
                                    Receipts
                                </button>
                                <button onclick="window.router.navigate('/funding')" class="text-left w-full px-5 py-2.5 font-mono text-[10px] text-[#6B6E76] hover:text-[#0E0E11] hover:bg-[#F7F7F6] uppercase tracking-widest transition-colors">
                                    Funding & Payouts
                                </button>
                                <button onclick="window.app.openSettingsModal()" class="text-left w-full px-5 py-2.5 font-mono text-[10px] text-[#6B6E76] hover:text-[#0E0E11] hover:bg-[#F7F7F6] uppercase tracking-widest transition-colors">
                                    Settings
                                </button>
                                <div class="h-px w-full bg-[#D9DBE1] my-1"></div>
                                <button onclick="window.app.handleSignOut()" class="text-left w-full px-5 py-2.5 font-mono text-[10px] text-[#6B6E76] hover:text-[#921818] hover:bg-[#921818]/5 uppercase tracking-widest transition-colors">
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    `}function q(){return`
        <div class="pb-32 w-full max-w-5xl mx-auto px-6 relative z-10 min-h-screen flex flex-col">
            <main id="view-landing" class="view-section flex flex-col items-start opacity-0 animate-activate">
                <div class="w-full mt-12 relative">
                    <div class="absolute -left-4 top-0 bottom-0 w-[1px] bg-[#D9DBE1] hidden md:block"></div>
                    
                    <div class="relative">
                        <h1 class="font-display font-normal text-5xl md:text-7xl leading-[0.9] tracking-tight text-[#0E0E11] mb-6 max-w-3xl">
                            YOU ARE BETTING <br>
                            <span class="text-[#921818] font-medium tracking-tighter">ON YOURSELF.</span>
                        </h1>
                    </div>

                    <div class="flex flex-col md:flex-row gap-12 items-start max-w-4xl">
                        <div class="flex flex-col gap-5 max-w-lg">
                            <p class="font-sans text-sm font-medium text-[#4D5057] leading-snug tracking-tight bg-[rgba(161,130,57,0.06)] px-3 py-2 -ml-3 border-l-2 border-[#A18239]/50 w-fit">
                                Unlock up to <span class="text-[#A18239] font-semibold">2.5x</span> if you deliver—funded by those who don't.
                            </p>

                            <p class="font-sans text-lg text-[#6B6E76] leading-relaxed tracking-tight">
                                Set a target that forces action. Your profit only unlocks if you follow through.
                            </p>
                            
                            <p class="font-sans text-sm text-[#6B6E76]/80 leading-relaxed pl-1">
                                Lock $500 against shipping a feature or generating revenue — verified automatically.
                            </p>
                        </div>

                        <div class="flex flex-col gap-4 w-full md:w-auto mt-4">
                            <div class="flex items-center gap-3">
                                <button onclick="window.app.handleInitiate()" class="group h-12 px-6 bg-[#921818] hover:bg-[#751212] text-white text-xs font-medium uppercase tracking-widest rounded-[2px] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-sm">
                                    <span>Execute Contract</span>
                                    <i data-lucide="arrow-right" class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5"></i>
                                </button>
                                <a href="#" onclick="window.router.navigate('/ledger'); return false;" class="h-12 px-6 border border-[#D9DBE1] bg-white text-[#6B6E76] text-xs font-medium uppercase tracking-widest rounded-[2px] flex items-center justify-center hover:border-[#B0B2B8] hover:text-[#0E0E11] transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                                    See Live Contracts
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="w-full mt-24 max-w-2xl">
                     <p class="font-display font-normal text-lg text-[#6B6E76] italic">"Most people underestimate how motivating locked capital is."</p>
                </div>

                <!-- RISK PROFILE SECTION -->
                <div class="w-full mt-16">
                    <h2 class="font-display font-semibold text-lg uppercase tracking-tight text-[#921818] mb-8">Choose Your Risk Profile</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div class="p-6 border border-[#D9DBE1] bg-white rounded-[2px] flex flex-col h-full group transition-all duration-200 hover:border-[#B0B2B8]">
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="font-mono text-xs font-medium uppercase tracking-wider text-[#0E0E11]">Steady</h3>
                                <span class="font-mono text-[10px] font-medium text-[#6B6E76] bg-[#F0F0F0] px-1.5 py-0.5 rounded-[1px] border border-[#D9DBE1]">UP TO 1.6X</span>
                            </div>
                            <p class="font-mono text-[10px] text-[#6B6E76] uppercase tracking-widest mb-4">Higher probability</p>
                            
                            <div class="flex-grow flex flex-col gap-1">
                                <p class="text-sm text-[#6B6E76] leading-relaxed">Designed to be achievable.</p>
                                <p class="text-sm text-[#6B6E76] leading-relaxed">Most contracts here succeed.</p>
                                <p class="text-sm text-[#6B6E76] leading-relaxed">Returns feel fair.</p>
                            </div>
                        </div>

                        <div class="p-6 border-2 border-[#0E0E11] bg-[#FBFBFA] rounded-[2px] flex flex-col h-full shadow-[0_4px_12px_rgba(0,0,0,0.04)] relative z-10">
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="font-mono text-xs font-medium uppercase tracking-wider text-[#0E0E11]">Bold</h3>
                                <span class="font-mono text-[10px] font-medium text-[#0E0E11] bg-[#D9DBE1]/30 px-1.5 py-0.5 rounded-[1px] border border-[#D9DBE1]">UP TO 2X</span>
                            </div>
                            <p class="font-mono text-[10px] text-[#6B6E76] uppercase tracking-widest mb-4">Balanced risk</p>

                            <div class="flex-grow flex flex-col gap-1">
                                <p class="text-sm text-[#0E0E11] leading-relaxed font-medium">Assumes you outperform baseline.</p>
                                <p class="text-sm text-[#0E0E11] leading-relaxed">Many fail.</p>
                                <p class="text-sm text-[#0E0E11] leading-relaxed">Winners changed something real.</p>
                            </div>
                            
                            <div class="mt-4 pt-4 border-t border-[#D9DBE1] flex items-center gap-2">
                                 <div class="w-1.5 h-1.5 bg-[#0E0E11] rounded-full"></div>
                                 <span class="font-mono text-[9px] uppercase tracking-widest text-[#0E0E11]">Selected Strategy</span>
                            </div>
                        </div>

                        <div class="p-6 border border-[#D9DBE1] bg-white rounded-[2px] flex flex-col h-full group transition-all duration-200 hover:border-[#B0B2B8]">
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="font-mono text-xs font-medium uppercase tracking-wider text-[#0E0E11]">All In</h3>
                                <span class="font-mono text-[10px] font-bold text-[#A18239] bg-[rgba(161,130,57,0.06)] px-1.5 py-0.5 rounded-[1px] border border-[#A18239]/20">2.5X+ REWARD</span>
                            </div>
                            <p class="font-mono text-[10px] text-[#A18239] uppercase tracking-widest mb-4">Low probability</p>

                            <div class="flex-grow flex flex-col gap-1">
                                <p class="text-sm text-[#6B6E76] leading-relaxed">Not a stretch goal.</p>
                                <p class="text-sm text-[#6B6E76] leading-relaxed">A declaration.</p>
                                <p class="text-sm text-[#6B6E76] leading-relaxed">Failure is the expected outcome.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Live Market Activity -->
                    <div class="w-full border-t border-b border-[#D9DBE1] py-4 mb-4 bg-white">
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div class="flex items-center gap-2 flex-shrink-0">
                                <div class="relative w-2 h-2">
                                    <div class="relative w-2 h-2 bg-[#1F7A4D] rounded-full"></div>
                                </div>
                                <span class="font-mono text-[10px] uppercase tracking-widest text-[#6B6E76]">Market Live: <span class="text-[#0E0E11] font-medium">127 Active Contracts</span></span>
                            </div>
                            
                            <div class="hidden md:block h-3 w-px bg-[#D9DBE1] flex-shrink-0"></div>
                            
                            <span class="font-mono text-[10px] uppercase tracking-widest text-[#6B6E76] flex-shrink-0">$412,000 Total Value Locked</span>
                            
                            <div class="hidden md:block h-3 w-px bg-[#D9DBE1] flex-shrink-0"></div>
                            
                            <div class="flex items-center gap-2 overflow-hidden h-5 w-full max-w-[320px] relative">
                                <span class="font-mono text-[10px] uppercase tracking-widest text-[#6B6E76] whitespace-nowrap flex-shrink-0 z-10 bg-white pr-1">Recent Win:</span>
                                <div class="relative h-full w-full overflow-hidden">
                                    <div id="ticker-track" class="absolute top-0 left-0 w-full flex flex-col gap-0 transition-transform duration-500 ease-in-out">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <p class="font-mono text-[10px] text-[#6B6E76] uppercase tracking-widest leading-relaxed mt-4">
                        Collateral does not recommend difficulty. Users self-select.
                    </p>
                </div>

                <!-- WHAT CAN BE VERIFIED SECTION -->
                <div class="w-full mt-24 max-w-4xl">
                     <h2 class="font-display font-semibold text-lg uppercase tracking-tight text-[#921818] mb-2">What Can Be Verified</h2>
                     <div class="w-full h-px bg-[#D9DBE1] mb-8"></div>
                     
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                        <div class="flex flex-col">
                            <h3 class="font-mono text-xs font-medium uppercase tracking-wider text-[#0E0E11] mb-4">Public Signals</h3>
                            <ul class="flex flex-col gap-1.5 mb-4">
                                <li class="font-sans text-sm text-[#6B6E76]">X / Twitter</li>
                                <li class="font-sans text-sm text-[#6B6E76]">GitHub</li>
                                <li class="font-sans text-sm text-[#6B6E76]">Other public platforms</li>
                            </ul>
                            <p class="font-sans text-xs text-[#6B6E76]/70">
                                Publicly observable. Reputation at stake.
                            </p>
                        </div>

                        <div class="flex flex-col">
                            <h3 class="font-mono text-xs font-medium uppercase tracking-wider text-[#0E0E11] mb-4">Economic Signals</h3>
                            <ul class="flex flex-col gap-1.5 mb-4">
                                <li class="font-sans text-sm text-[#6B6E76]">Stripe</li>
                                <li class="font-sans text-sm text-[#6B6E76]">Revenue sources</li>
                            </ul>
                            <p class="font-sans text-xs text-[#6B6E76]/70">
                                No vanity. Money settles truth.
                            </p>
                        </div>
                     </div>
                </div>

                <!-- EXECUTION MODEL SECTION -->
                <div class="w-full mt-24 max-w-4xl">
                    <h2 class="font-display font-semibold text-lg uppercase tracking-tight text-[#921818] mb-2">Execution Model</h2>
                    <div class="w-full h-px bg-[#921818]/20 mb-8"></div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
                        <div class="flex flex-col">
                            <p class="font-sans text-sm font-medium text-[#0E0E11] mb-6 leading-relaxed">
                                Capital is committed at execution.<br>Funds are inaccessible until verification.
                            </p>
                            
                            <p class="font-sans text-sm text-[#6B6E76] leading-relaxed mb-6">
                                Outcomes are final.
                            </p>
                            
                            <div class="w-full h-px bg-[#D9DBE1] mb-6"></div>
                        </div>

                        <div class="flex flex-col gap-8">
                            <div>
                                <h3 class="font-display font-medium text-sm text-[#0E0E11] uppercase tracking-wide mb-3">On Success</h3>
                                <ul class="flex flex-col gap-1 mb-2">
                                    <li class="font-sans text-sm text-[#6B6E76]">Capital released.</li>
                                    <li class="font-sans text-sm text-[#6B6E76]">Incentives settled automatically.</li>
                                </ul>
                            </div>

                            <div class="pl-4 border-l border-[#921818]">
                                <h3 class="font-display font-medium text-sm text-[#0E0E11] uppercase tracking-wide mb-2">On Failure</h3>
                                <p class="font-sans text-sm text-[#0E0E11] mb-2">
                                    Capital forfeited.
                                </p>
                                <p class="font-sans text-sm text-[#0E0E11]">
                                    No recovery possible.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mt-8 pt-6 border-t border-[#D9DBE1]">
                        <p class="font-mono text-[10px] text-[#6B6E76] uppercase tracking-widest leading-relaxed">
                            External systems decide outcomes. Collateral does not arbitrate.
                        </p>
                    </div>
                </div>
                
                <div class="w-full mt-32 mb-8 text-center">
                    <p class="font-sans text-sm text-[#6B6E76]">Contracts are enforced by external data sources, not internal discretion.</p>
                </div>
            </main>
        </div>
    `}function K(){const e=document.getElementById("ticker-track");if(!e)return;const t=[{user:"@alex_ship",val1:"$1K",val2:"$2.5K"},{user:"@sarah_dev",val1:"$500",val2:"$1.2K"},{user:"@david_builds",val1:"$2K",val2:"$5.2K"},{user:"@jason_v1",val1:"$100",val2:"$250"},{user:"@emma_scale",val1:"$5K",val2:"$12.5K"}],n=i=>`
        <span class="font-mono text-[10px] text-[#2A523E] bg-[#F4F5F4] px-2 py-0.5 rounded-[1px] h-5 flex items-center w-fit whitespace-nowrap">
            ${i.user} turned ${i.val1} → ${i.val2}
        </span>`;e.innerHTML="",t.forEach(i=>e.innerHTML+=n(i)),setInterval(()=>{e.style.transition="transform 500ms cubic-bezier(0.4, 0, 0.2, 1)",e.style.transform="translateY(-20px)",setTimeout(()=>{if(e.style.transition="none",e.appendChild(e.firstElementChild),e.style.transform="translateY(0)",Math.random()>.7){const s=Math.floor(Math.random()*50)*100,o=(1.5+Math.random()).toFixed(1),u={user:`@user_${Math.floor(Math.random()*900)+100}`,val1:`$${s}`,val2:`$${Math.floor(s*o)}`},m=document.createElement("div");m.innerHTML=n(u),e.appendChild(m.firstElementChild)}},500)},3e3),window.lucide&&window.lucide.createIcons()}function J(){return`
        <style>
            @keyframes slideIn {
                from { opacity: 0; transform: translateY(-12px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes flashGreen {
                0% { background-color: rgba(16, 185, 129, 0.08); }
                100% { background-color: transparent; }
            }
            @keyframes flashRed {
                0% { background-color: rgba(159, 29, 29, 0.08); }
                100% { background-color: transparent; }
            }
            .animate-new-row {
                animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
            .flash-success {
                animation: flashGreen 1.5s ease-out forwards;
            }
            .flash-failure {
                animation: flashRed 1.5s ease-out forwards;
            }
            .live-dot {
                box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
                animation: pulse-green 2s infinite;
            }
            @keyframes pulse-green {
                0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
                100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
            }
        </style>
        <div class="pb-32 w-full max-w-6xl mx-auto px-6 relative z-10 min-h-screen flex flex-col">
            <main id="view-ledger" class="view-section flex flex-col gap-0 w-full animate-activate">
                
                <!-- Page Header -->
                <div class="w-full mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-neutral-200 pb-8 mt-12">
                    <div>
                        <div class="flex flex-col gap-1 mb-4">
                            <div class="flex items-center gap-2">
                                <span class="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Network: Mainnet</span>
                                <span class="text-neutral-300">|</span>
                                <div class="flex items-center gap-1.5">
                                    <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 live-dot"></div>
                                    <span class="font-mono text-[10px] uppercase tracking-widest text-emerald-600 font-medium">Live Feed</span>
                                </div>
                            </div>
                            <span class="font-mono text-[10px] uppercase tracking-widest text-neutral-500">System Status: Operational</span>
                        </div>
                        <h1 class="font-display font-bold text-3xl tracking-tight text-[#921818] uppercase">Public Record</h1>
                        <p class="font-mono text-[10px] text-neutral-400 mt-3 uppercase tracking-widest">Every contract settles. Outcomes are permanent.</p>
                    </div>

                    <!-- Global Stats -->
                    <div class="flex gap-12">
                        <div class="flex flex-col gap-1">
                            <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Total Value Locked</span>
                            <span class="font-mono text-xs text-neutral-500" id="global-tvl">2,840,500 USD</span>
                        </div>
                    </div>
                </div>

                <!-- Filters -->
                <div class="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
                    <div class="flex gap-4 w-full sm:w-auto">
                        <div class="relative w-full sm:w-80">
                            <input type="text" placeholder="Search transaction hash or principal" class="h-10 pl-0 pr-3 w-full bg-white border-b border-neutral-200 font-mono text-[11px] focus:outline-none focus:border-neutral-900 transition-colors placeholder-neutral-400 text-neutral-900 rounded-none">
                        </div>
                        
                        <div class="relative">
                            <select class="h-10 pl-2 pr-8 w-full sm:w-40 bg-white border-b border-neutral-200 font-mono text-[11px] focus:outline-none focus:border-neutral-900 transition-colors text-neutral-500 cursor-pointer appearance-none rounded-none uppercase tracking-wide">
                                <option value="" selected>All Events</option>
                                <option value="created">Contract Authored</option>
                                <option value="locked">Contract Executed</option>
                                <option value="settled">Contract Settled</option>
                                <option value="forfeited">Forfeited</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Table -->
                <div class="w-full">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse table-fixed">
                            <thead>
                                <tr class="border-b border-neutral-200">
                                    <th class="py-3 pr-4 font-mono text-[10px] uppercase font-medium text-neutral-400 tracking-widest w-[150px]">Timestamp</th>
                                    <th class="py-3 px-4 font-mono text-[10px] uppercase font-medium text-neutral-400 tracking-widest w-[180px]">Event Type</th>
                                    <th class="py-3 px-4 font-mono text-[10px] uppercase font-medium text-neutral-400 tracking-widest w-[120px]">Tx Hash</th>
                                    <th class="py-3 px-4 font-mono text-[10px] uppercase font-medium text-neutral-400 tracking-widest w-[160px]">Principal</th>
                                    <th class="py-3 px-4 font-mono text-[10px] uppercase font-medium text-neutral-400 tracking-widest text-right w-[110px]">Value (USD)</th>
                                    <th class="py-3 px-4 font-mono text-[10px] uppercase font-medium text-neutral-400 tracking-widest text-right w-[110px]">Multiplier</th>
                                    <th class="py-3 px-4 font-mono text-[10px] uppercase font-medium text-neutral-400 tracking-widest text-right w-[100px]">Status</th>
                                    <th class="py-3 pl-4 font-mono text-[10px] uppercase font-medium text-neutral-400 tracking-widest text-right w-[100px]">Outcome</th>
                                </tr>
                            </thead>
                            <tbody id="ledger-body" class="divide-y divide-neutral-100">
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Footer Authority Line -->
                <div class="mt-20 border-t border-neutral-200 pt-8">
                    <p class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest text-center select-none">
                        Records are immutable. Outcomes cannot be appealed.
                    </p>
                </div>
            </main>
        </div>
    `}function Y(){const e=["@jason_ship","@alice_dev","@sarah_builds","@founder_01","@yield_hunter","@anon_cap","@vector_vc","@protocol_labs","@sol_wizard"],t=[{type:"Contract Settled",status:"Settled",outcome:"Success",color:"emerald-700",flash:"flash-success",weight:4},{type:"Contract Forfeited",status:"Forfeited",outcome:"Failure",color:"[#921818]",flash:"flash-failure",weight:1},{type:"Contract Executed",status:"Locked",outcome:"—",color:"neutral-900",flash:"",weight:3},{type:"Identity Confirmed",status:"Confirmed",outcome:"—",color:"neutral-500",flash:"",weight:2}],n=["2.5x","1.8x","+$7,500","3.1x","+$12,400","1.5x","+$1,200","10.0x","+$500","4.2x"],i=[{ts:"14:02:11",type:"Contract Settled",hash:"0x8a7...2b91",user:"@jason_ship",val:"5,000.00",mult:"2.5x",status:"Settled",outcome:"Success",color:"emerald-700"},{ts:"14:02:05",type:"Identity Confirmed",hash:"0x8a7...2b91",user:"@jason_ship",val:"—",mult:"—",status:"Confirmed",outcome:"—",color:"neutral-500"},{ts:"14:01:44",type:"Contract Forfeited",hash:"0x3c2...9f44",user:"@demo_user",val:"1,200.00",mult:"—",status:"Forfeited",outcome:"Failure",color:"[#921818]"},{ts:"14:00:12",type:"Contract Executed",hash:"0xe11...5a02",user:"@alice_dev",val:"10,000.00",mult:"—",status:"Locked",outcome:"—",color:"neutral-900"},{ts:"13:58:30",type:"Contract Settled",hash:"0xf33...1b99",user:"@sarah_builds",val:"500.00",mult:"+$240",status:"Settled",outcome:"Success",color:"emerald-700"}],s=document.getElementById("ledger-body");if(!s)return;const o=15;function u(r,g){if(!g)return r[Math.floor(Math.random()*r.length)];const v=r.reduce((h,A)=>h+A.weight,0);let C=Math.random()*v;for(const h of r){if(C<h.weight)return h;C-=h.weight}return r[0]}function m(){return"0x"+Math.floor(Math.random()*16777215).toString(16)+"..."+Math.floor(Math.random()*65535).toString(16)}function b(){return(Math.random()*15e3+100).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}function T(){return new Date().toISOString().split("T")[1].split(".")[0]+" UTC"}function R(r,g=!1){const v=document.createElement("tr");v.className=`group hover:bg-neutral-50/50 transition-colors ${g?"animate-new-row "+(r.flash||""):""}`;const C=r.status==="Settled"?"text-emerald-700 font-semibold":"text-neutral-400";return v.innerHTML=`
            <td class="py-3 pr-4 font-mono text-[11px] text-neutral-500 align-top whitespace-nowrap">${r.ts}</td>
            <td class="py-3 px-4 font-mono text-[10px] text-${r.color} font-medium uppercase tracking-wide align-top">${r.type}</td>
            <td class="py-3 px-4 font-mono text-[11px] text-neutral-500 truncate align-top select-all cursor-text">${r.hash}</td>
            <td class="py-3 px-4 font-mono text-[11px] text-neutral-600 align-top cursor-pointer hover:text-neutral-900 transition-colors">${r.user}</td>
            <td class="py-3 px-4 font-mono text-[11px] ${r.type.includes("Settled")||r.type.includes("Forfeited")?"text-"+r.color:"text-neutral-900"} text-right align-top">${r.val}</td>
            <td class="py-3 px-4 font-mono text-[11px] ${C} text-right align-top tracking-tight">${r.mult}</td>
            <td class="py-3 px-4 font-mono text-[10px] text-${r.color} font-semibold text-right uppercase tracking-widest align-top">${r.status}</td>
            <td class="py-3 pl-4 font-mono text-[10px] text-${r.color} ${r.status==="Locked"||r.status==="Confirmed"?"text-neutral-400":"font-semibold"} text-right uppercase tracking-widest align-top">${r.outcome}</td>
        `,v}i.forEach(r=>{const g=t.find(v=>v.status===r.status);g&&(r.flash=g.flash),s.appendChild(R(r))});function B(){const r=u(t,"weight"),g=u(e),v=r.status==="Confirmed"?"—":b();let C="—";r.status==="Settled"&&(C=u(n));const h={ts:T(),type:r.type,hash:m(),user:g,val:v,mult:C,status:r.status,outcome:r.outcome,color:r.color,flash:r.flash},A=R(h,!0);for(s.firstChild?s.insertBefore(A,s.firstChild):s.appendChild(A);s.children.length>o;)s.removeChild(s.lastChild);const a=document.getElementById("global-tvl");if(a){let l=parseInt(a.innerText.replace(/,/g,"").replace(" USD",""));Math.random()>.5?l+=Math.floor(Math.random()*5e3):l-=Math.floor(Math.random()*2e3),a.innerText=l.toLocaleString()+" USD"}}function f(){const r=Math.random()*4e3+2e3;window.ledgerInterval=setTimeout(()=>{document.getElementById("ledger-body")&&(B(),f())},r)}f(),window.lucide&&window.lucide.createIcons()}function Z(){return`
        <style>
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
            
            /* Authority Details Panel */
            .authority-panel {
                display: none;
                border: 1px solid var(--border);
                background: var(--panel);
                border-left: 2px solid var(--accent-gold);
            }
            .authority-panel.visible { display: block; }
            
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
            .no-radius { border-radius: 0 !important; }
            .hold-progress { width: 0%; transition: width 0s linear; }
            .holding .hold-progress { width: 100%; transition: width 3s linear; }
            .section-box { border: 1px solid var(--border); padding: 1.5rem; background: var(--panel); }
            
            /* === METRIC STATUS CARD === */
            .metric-status-card {
                border: 1px solid var(--border);
                background: #ffffff;
                padding: 1.5rem;
            }
            .metric-status-card .card-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 1rem;
                padding-bottom: 0.75rem;
                border-bottom: 1px solid var(--border);
            }
            .metric-status-card .card-title {
                font-family: ui-monospace, monospace;
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.1em;
                color: var(--muted);
                text-transform: uppercase;
            }
            .metric-status-card .card-subtext {
                font-size: 11px;
                color: var(--light);
                margin-top: 4px;
            }
            .metric-status-card .authority-badge {
                font-family: ui-monospace, monospace;
                font-size: 9px;
                letter-spacing: 0.05em;
                color: var(--muted);
                background: #f5f5f5;
                border: 1px solid var(--border);
                padding: 3px 8px;
                text-transform: uppercase;
            }
            .metric-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1.5rem;
                margin-bottom: 1rem;
            }
            .metric-col label {
                display: block;
                font-family: ui-monospace, monospace;
                font-size: 9px;
                font-weight: 600;
                letter-spacing: 0.1em;
                color: var(--light);
                text-transform: uppercase;
                margin-bottom: 6px;
            }
            .metric-col .metric-value {
                font-family: ui-monospace, monospace;
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--ink);
                letter-spacing: -0.02em;
            }
            .metric-col .metric-meta {
                font-size: 10px;
                color: var(--light);
                margin-top: 4px;
            }
            .metric-delta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem 0;
                border-top: 1px solid var(--border);
                border-bottom: 1px solid var(--border);
                margin-bottom: 1rem;
            }
            .metric-delta label {
                font-family: ui-monospace, monospace;
                font-size: 9px;
                font-weight: 600;
                letter-spacing: 0.1em;
                color: var(--light);
                text-transform: uppercase;
            }
            .metric-delta .delta-value {
                font-family: ui-monospace, monospace;
                font-size: 1rem;
                font-weight: 700;
                color: var(--accent-red);
            }
            .metric-progress-container {
                height: 2px;
                background: #e5e5e5;
                position: relative;
                margin-bottom: 0.75rem;
            }
            .metric-progress-fill {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                background: var(--accent-red);
                transition: width 300ms ease;
            }
            .metric-microcopy {
                font-size: 10px;
                color: var(--light);
                line-height: 1.5;
            }
            
            /* Active Step Background Tint */
            .step-content-active { background: var(--step-active-bg); }
        </style>

        <div class="h-[calc(100vh-64px)] flex flex-col bg-white font-sans text-black overflow-hidden relative no-radius">
            
            <!-- Step Header -->
            <header class="step-header shrink-0" data-current-step="1">
                <nav class="step-nav">
                    <div class="step-item active" data-step="1" onclick="window.wizard.goToStep(1)">
                        <span class="step-number">01</span>
                        <span class="step-label">Profile</span>
                        <span class="step-check">✓</span>
                    </div>
                    <div class="step-item" data-step="2" onclick="window.wizard.goToStep(2)">
                        <span class="step-number">02</span>
                        <span class="step-label">Source</span>
                        <span class="step-check">✓</span>
                    </div>
                    <div class="step-item" data-step="3" onclick="window.wizard.goToStep(3)">
                        <span class="step-number">03</span>
                        <span class="step-label">Lock</span>
                        <span class="step-check">✓</span>
                    </div>
                </nav>
                <div class="step-status">S: Ready</div>
            </header>
            
            <!-- Progress Bar -->
            <div class="progress-container">
                <div class="progress-fill" id="progress-fill" style="width: 33%;"></div>
            </div>

            <!-- Main Content Area -->
            <main class="flex-1 relative overflow-y-auto flex flex-col px-6 md:px-12 py-8 md:py-16">
                
                <!-- STEP 1: RISK PROFILE -->
                <section id="step-1" class="max-w-5xl mx-auto w-full flex flex-col h-full">
                    <div class="mb-16">
                        <h1 class="text-display-lg headline-accent">Select Exposure</h1>
                        <p class="text-body-serif max-w-xl mt-6">Choose an enforcement profile. This determines your verification threshold and potential multiplier.</p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        <!-- Steady -->
                        <button class="card-standard p-8 text-left flex flex-col justify-between h-64"
                             onclick="window.wizard.selectRisk('STEADY', this)">
                            <div class="flex justify-between items-start">
                                <span class="text-body-mono text-neutral-500 uppercase">Tier 1</span>
                                <span class="reward-chip">1.5x</span>
                            </div>
                            <div>
                                <h2 class="text-display-md mb-2">Steady</h2>
                                <p class="text-sm text-neutral-500 leading-relaxed">Consistent baseline performance. Low variance expected.</p>
                            </div>
                        </button>

                        <!-- Bold -->
                        <button class="card-standard p-8 text-left flex flex-col justify-between h-64"
                             onclick="window.wizard.selectRisk('BOLD', this)">
                            <div class="flex justify-between items-start">
                                <span class="text-body-mono text-neutral-500 uppercase">Tier 2</span>
                                <span class="reward-chip">2.0x</span>
                            </div>
                            <div>
                                <h2 class="text-display-md mb-2">Bold</h2>
                                <p class="text-sm text-neutral-500 leading-relaxed">Significant deviation from baseline. Requires strict discipline.</p>
                            </div>
                        </button>

                        <!-- All-In -->
                        <button class="card-standard p-8 text-left flex flex-col justify-between h-64"
                             onclick="window.wizard.selectRisk('ALL_IN', this)">
                            <div class="flex justify-between items-start">
                                <span class="text-body-mono text-neutral-500 uppercase">Tier 3</span>
                                <span class="reward-chip">4.0x</span>
                            </div>
                            <div>
                                <h2 class="text-display-md mb-2">All-In</h2>
                                <p class="text-sm text-neutral-500 leading-relaxed">Maximum exposure. Failure results in immediate <span class="text-accent-red">total forfeiture</span>.</p>
                            </div>
                        </button>
                    </div>

                    <div class="flex justify-end">
                         <button id="btn-step-1" class="bg-black text-white text-body-mono uppercase px-8 py-4 hover:bg-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors" disabled onclick="window.wizard.nextStep()">
                            Confirm Profile →
                        </button>
                    </div>
                </section>


                <!-- STEP 2: METRIC SOURCE -->
                <section id="step-2" class="hidden max-w-5xl mx-auto w-full flex flex-col h-full">
                    <div class="mb-16">
                        <h1 class="text-display-lg headline-accent">Select Authority</h1>
                        <p class="text-body-serif max-w-xl mt-6">Designate the external source of truth. The selected authority will be the sole arbiter of the contract outcome.</p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-t border-neutral-100 pt-8">
                        <!-- X (Twitter) -->
                        <button class="card-standard p-8 text-left h-52 flex flex-col justify-between group"
                             onclick="window.wizard.selectSource('TWITTER', this)">
                            <div class="flex justify-between items-start">
                                <span class="text-body-mono text-neutral-400 uppercase">Oracle_01</span>
                                <span class="text-body-mono text-neutral-400 uppercase text-[10px]">Integrity: High</span>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold mb-2">X (Twitter)</h3>
                                <p class="text-legal">Public, immutable follower snapshots.</p>
                            </div>
                        </button>

                        <!-- Stripe -->
                        <button class="card-standard p-8 text-left h-52 flex flex-col justify-between group"
                             onclick="window.wizard.selectSource('STRIPE', this)">
                            <div class="flex justify-between items-start">
                                <span class="text-body-mono text-neutral-400 uppercase">Oracle_02</span>
                                <span class="text-body-mono text-neutral-400 uppercase text-[10px]">Integrity: Proven</span>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold mb-2">Stripe</h3>
                                <p class="text-legal">Verified gross revenue from Stripe Connect.</p>
                            </div>
                        </button>

                        <!-- GitHub (Coming Soon) -->
                        <div class="card-standard card-disabled p-8 text-left h-52 flex flex-col justify-between">
                            <div class="flex justify-between items-start">
                                <span class="text-body-mono text-neutral-400 uppercase">Oracle_03</span>
                                <span class="text-body-mono text-neutral-300 uppercase text-[10px]">Coming Soon</span>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold mb-2 text-neutral-400">GitHub</h3>
                                <p class="text-legal">Commit history from GitHub API.</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Authority Details Panel (Hidden by Default) -->
                    <div id="authority-panel" class="authority-panel p-6 mb-8">
                        <div class="flex justify-between items-start mb-4">
                            <h4 id="panel-title" class="font-medium text-base"></h4>
                            <span id="panel-integrity" class="text-body-mono text-neutral-500 uppercase text-[10px]"></span>
                        </div>
                        <ul class="space-y-2 text-sm text-neutral-600 mb-4">
                            <li><span class="text-neutral-400 mr-2">•</span><strong>Measured:</strong> <span id="panel-measured"></span></li>
                            <li><span class="text-neutral-400 mr-2">•</span><strong>Verified:</strong> <span id="panel-verified"></span></li>
                            <li><span class="text-neutral-400 mr-2">•</span><strong>Fail Cases:</strong> <span id="panel-failcases"></span></li>
                        </ul>
                        <p class="text-xs text-neutral-500">Binding is <span class="text-accent-red font-medium">irreversible</span> after confirmation.</p>
                    </div>
                    
                    <!-- X VERIFICATION PANEL (Shows when X is selected) -->
                    <div id="x-verify-panel" class="border border-neutral-200 bg-white p-6 mb-8" style="display: none;">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="font-medium text-base">Verify X Account</h4>
                            <span id="x-verify-status" class="text-body-mono text-neutral-400 uppercase text-[10px]">Not Verified</span>
                        </div>
                        
                        <!-- Step 1: Enter Username -->
                        <div id="x-verify-step1">
                            <label class="block font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-2">X Username</label>
                            <div class="flex gap-3">
                                <div class="flex-1 flex items-center border border-neutral-200 focus-within:border-neutral-900 transition-colors">
                                    <span class="text-neutral-400 pl-3">@</span>
                                    <input type="text" id="x-username-input" 
                                        class="flex-1 px-2 py-3 text-sm font-mono bg-transparent border-none outline-none" 
                                        placeholder="yourhandle">
                                </div>
                                <button onclick="window.wizard.generateVerifyCode()" id="x-generate-btn"
                                    class="px-4 py-3 bg-neutral-900 text-white text-[11px] font-medium uppercase tracking-wide hover:bg-black transition-colors">
                                    Generate Code
                                </button>
                            </div>
                        </div>
                        
                        <!-- Step 2: Show Code & Verify (Hidden initially) -->
                        <div id="x-verify-step2" class="hidden mt-6">
                            <div class="bg-neutral-50 border border-neutral-200 p-4 mb-4">
                                <label class="block font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-2">Add this code to your X bio</label>
                                <div class="flex items-center justify-between">
                                    <code id="x-verify-code" class="font-mono text-lg font-semibold text-neutral-900 tracking-wide">COL-XXXXXX</code>
                                    <button onclick="window.wizard.copyVerifyCode()" class="text-neutral-400 hover:text-neutral-900 transition-colors">
                                        <i data-lucide="copy" class="w-4 h-4"></i>
                                    </button>
                                </div>
                                <p class="text-xs text-neutral-500 mt-2">The code must be visible in your public bio when you click verify.</p>
                            </div>
                            
                            <div class="flex gap-3">
                                <a id="x-profile-link" href="https://twitter.com/settings/profile" target="_blank" rel="noopener"
                                    class="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-neutral-200 text-neutral-600 text-[11px] font-medium uppercase tracking-wide hover:border-neutral-400 transition-colors">
                                    <i data-lucide="external-link" class="w-3 h-3"></i>
                                    Edit X Bio
                                </a>
                                <button onclick="window.wizard.verifyXAccount()" id="x-verify-btn"
                                    class="flex-1 px-4 py-3 bg-neutral-900 text-white text-[11px] font-medium uppercase tracking-wide hover:bg-black transition-colors">
                                    Verify Account
                                </button>
                            </div>
                        </div>
                        
                        <!-- Verified State (Hidden initially) -->
                        <div id="x-verify-success" class="hidden mt-4">
                            <div class="flex items-center gap-3 p-4 bg-[#E8F4ED] border border-[#1F7A4D]/20">
                                <div class="w-8 h-8 bg-[#1F7A4D] rounded-full flex items-center justify-center">
                                    <i data-lucide="check" class="w-4 h-4 text-white"></i>
                                </div>
                                <div>
                                    <p class="font-sans text-sm font-medium text-[#1F7A4D]">Account Verified</p>
                                    <p id="x-verified-handle" class="font-mono text-[11px] text-neutral-500">@handle • Connected</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Metric Preview (Light - Current only) -->
                    <div id="metric-preview" class="metric-status-card mb-8" style="display: none;">
                        <div class="card-header" style="border-bottom: none; margin-bottom: 0; padding-bottom: 0;">
                            <div>
                                <div class="card-title">Current Signal</div>
                            </div>
                            <span id="preview-authority-badge" class="authority-badge">--</span>
                        </div>
                        <div style="padding-top: 0.75rem;">
                            <div id="preview-current" class="metric-value" style="font-size: 1.5rem;">--</div>
                            <p class="metric-microcopy" style="margin-top: 8px;">This will be snapshotted at execution.</p>
                        </div>
                    </div>
                    
                    <!-- Status Row (Shown when no selection) -->
                    <div id="status-row" class="border-t border-neutral-100 pt-4 mb-16">
                        <p class="text-body-mono text-neutral-400 uppercase">Status: Awaiting selection</p>
                    </div>

                    <div class="flex justify-end pb-40">
                         <button id="btn-step-2" class="bg-black text-white text-body-mono uppercase px-8 py-4 hover:bg-neutral-800 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors" disabled onclick="window.wizard.nextStep()">
                            Bind Authority →
                        </button>
                    </div>
                </section>


                <!-- STEP 3: FINAL LOCK -->
                <section id="step-3" class="hidden max-w-5xl mx-auto w-full flex flex-col h-full">
                    <div class="mb-10">
                        <h1 class="text-display-lg headline-accent">Execute Contract</h1>
                        <p class="text-body-mono text-neutral-500 uppercase mt-6">Ref: <span class="text-black">0x7A...9F</span></p>
                    </div>
                    
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
                        <!-- LEFT: Contract Definition -->
                        <div class="space-y-6">
                            <div class="section-box space-y-4">
                                <div class="flex justify-between border-b border-black/5 pb-2">
                                    <span class="text-body-mono text-neutral-500 uppercase">Authority</span>
                                    <span id="final-oracle" class="font-mono text-sm font-semibold">--</span>
                                </div>
                                <div class="flex justify-between border-b border-black/5 pb-2">
                                    <span class="text-body-mono text-neutral-500 uppercase">Condition</span>
                                    <span class="font-mono text-sm">Target > Baseline + 15%</span>
                                </div>
                                <div class="flex justify-between border-b border-black/5 pb-2">
                                    <span class="text-body-mono text-neutral-500 uppercase">Time Window</span>
                                    <span class="font-mono text-sm">30 Days</span>
                                </div>
                                <div class="flex justify-between border-b border-black/5 pb-2">
                                    <span class="text-body-mono text-neutral-500 uppercase">Payout</span>
                                    <span id="final-mult" class="font-mono text-sm font-semibold text-accent-gold">--</span>
                                </div>
                                <div class="flex justify-between pt-2">
                                    <span class="text-body-mono text-neutral-500 uppercase">Failure Outcome</span>
                                    <span class="font-mono text-sm text-accent-red font-semibold">Forfeiture on failure</span>
                                </div>
                            </div>
                            
                            <!-- Metric Status Card -->
                            <div id="metric-status-card" class="metric-status-card">
                                <div class="card-header">
                                    <div>
                                        <div class="card-title">Metric Status</div>
                                        <div class="card-subtext">Snapshot is taken at execution and becomes your baseline.</div>
                                    </div>
                                    <span id="metric-authority-badge" class="authority-badge">Authority Verified</span>
                                </div>
                                
                                <div class="metric-row">
                                    <div class="metric-col">
                                        <label>Current (Baseline)</label>
                                        <div id="metric-current" class="metric-value">--</div>
                                        <div id="metric-recorded" class="metric-meta">Recorded: --</div>
                                    </div>
                                    <div class="metric-col">
                                        <label>Goal</label>
                                        <div id="metric-goal" class="metric-value">--</div>
                                        <div id="metric-deadline" class="metric-meta">Due in -- days</div>
                                    </div>
                                </div>
                                
                                <div class="metric-delta">
                                    <label>Required</label>
                                    <span id="metric-required" class="delta-value">--</span>
                                </div>
                                
                                <div class="metric-progress-container">
                                    <div id="metric-progress-fill" class="metric-progress-fill" style="width: 0%"></div>
                                </div>
                                
                                <p class="metric-microcopy">Outcome evaluated at deadline.</p>
                                <p id="metric-source-note" class="metric-microcopy" style="margin-top: 6px; font-style: italic;">--</p>
                            </div>
                        </div>

                        <!-- RIGHT: Execution -->
                        <div class="flex flex-col">
                            <!-- Capital Allocation -->
                            <div class="section-box mb-6">
                                <label class="text-body-mono text-neutral-400 mb-4 block uppercase">Capital Allocation</label>
                                <div class="flex items-baseline border-b-2 border-neutral-200 focus-within:border-black transition-colors pb-3">
                                    <span class="text-3xl text-neutral-400 mr-2 font-normal">$</span>
                                    <input type="number" value="5000" class="w-full text-4xl font-medium text-neutral-900 bg-transparent border-none outline-none p-0 placeholder-neutral-200" placeholder="0">
                                </div>
                                <p class="text-legal mt-3">This amount will be <span class="text-accent-red">unavailable</span> until resolution.</p>
                            </div>
                            
                            <!-- Execute Button -->
                            <div class="relative select-none">
                                <button id="btn-execute" class="w-full bg-neutral-900 text-white text-body-mono uppercase py-5 relative overflow-hidden transition-colors group hover:bg-black"
                                    onmousedown="window.wizard.startHold()" 
                                    onmouseup="window.wizard.endHold()" 
                                    onmouseleave="window.wizard.endHold()"
                                    ontouchstart="window.wizard.startHold()"
                                    ontouchend="window.wizard.endHold()">
                                    <div id="hold-bar" class="hold-progress absolute top-0 left-0 h-full bg-white/20 z-0"></div>
                                    <span class="relative z-10 flex items-center justify-center gap-2">
                                        <span id="btn-text">Hold to Execute</span>
                                    </span>
                                </button>
                                <p class="text-legal text-center mt-3">Execution finalizes the contract and records the baseline.</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quote (below grid) -->
                    <div class="border-t border-neutral-100 pt-6 mt-auto">
                        <p class="font-serif italic text-neutral-600 text-base">"This contract will execute exactly as written."</p>
                        <p class="text-legal mt-1">No manual review. <span class="text-accent-red">No overrides.</span></p>
                    </div>
                </section>
                
                <!-- Footer Spacer (extra clearance for global footer) -->
                <div class="h-32"></div>
            </main>
        </div>`}function Q(){let e=1,t=[],n=null,i=null,s=null,o=!1,u=!1,m=null,b=null;const T={TWITTER:{authority:"X",metricType:"FOLLOWERS",baselineValue:3842,currentValue:3842,goalValue:1e4,deadlineUtc:"2026-02-04T00:00:00Z",recordedAtUtc:"2026-01-04T19:43:00Z"},STRIPE:{authority:"STRIPE",metricType:"REVENUE",baselineValue:4224,currentValue:4224,goalValue:1e4,deadlineUtc:"2026-02-04T00:00:00Z",recordedAtUtc:"2026-01-04T19:43:00Z"}};async function R(a){return new Promise(l=>{setTimeout(()=>{l(T[i]||T.TWITTER)},100)})}function B(a){return a.toLocaleString("en-US")}function f(a){return"$"+a.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}function r(a){return new Date(a).toISOString().replace("T"," ").slice(0,19)+" UTC"}function g(a){const c=new Date(a)-new Date;return Math.max(0,Math.ceil(c/(1e3*60*60*24)))}function v(a){const l=a.metricType==="REVENUE",d=l?f:B,c=l?"":" followers",x=Math.max(0,a.goalValue-a.currentValue),L=a.goalValue>a.baselineValue?Math.min(1,Math.max(0,(a.currentValue-a.baselineValue)/(a.goalValue-a.baselineValue))):0,I=document.getElementById("metric-current"),E=document.getElementById("metric-goal"),F=document.getElementById("metric-recorded"),$=document.getElementById("metric-deadline"),O=document.getElementById("metric-required"),U=document.getElementById("metric-progress-fill"),P=document.getElementById("metric-authority-badge"),H=document.getElementById("metric-source-note");I&&(I.textContent=d(a.currentValue)+c),E&&(E.textContent=d(a.goalValue)+c),F&&(F.textContent="Recorded: "+r(a.recordedAtUtc)),$&&($.textContent="Due in "+g(a.deadlineUtc)+" days"),O&&(O.textContent="+"+d(x)+c),U&&(U.style.width=L*100+"%"),a.authority==="X"?(P&&(P.textContent="X Verified"),H&&(H.textContent="Pulled from X (Twitter) API snapshots.")):a.authority==="STRIPE"&&(P&&(P.textContent="Stripe Verified"),H&&(H.textContent="Verified gross revenue via Stripe Connect."))}const C={TWITTER:{title:"Public Signal — X (Twitter)",integrity:"Integrity: High",measured:"Follower count / impressions (public).",verified:"Snapshots taken at execution + at deadline. Public API source-of-truth.",failcases:"Account private/suspended, API unavailable, or verification errors → fail closed."},STRIPE:{title:"Economic Signal — Stripe",integrity:"Integrity: Proven",measured:"Verified revenue (gross or net per contract definition).",verified:"Pulled from your connected Stripe account (proof-of-control required).",failcases:"Disconnected Stripe, missing permissions, Stripe outage → fail closed."}};function h(a,l=!1){const d=document.getElementById("progress-fill");if(d)if(l)d.style.width="100%";else{const c={1:"25%",2:"50%",3:"75%"};d.style.width=c[a]||"0%"}}function A(a){document.querySelectorAll(".step-item").forEach(c=>{const x=parseInt(c.dataset.step);c.classList.remove("active","completed","clickable"),x===a?c.classList.add("active"):t.includes(x)&&c.classList.add("completed","clickable")});const d=document.querySelector(".step-status");if(d){const c={1:"S: Profile",2:"S: Source",3:"S: Lock"};d.textContent=c[a]||"S: Ready"}}window.wizard={setStep:function(a){e=a,document.querySelectorAll('section[id^="step-"]').forEach(d=>d.classList.add("hidden"));const l=document.getElementById("step-"+a);l&&l.classList.remove("hidden"),A(a),h(a)},markCompleted:function(a){t.includes(a)||t.push(a),A(e)},goToStep:function(a){(t.includes(a)||a===e)&&this.setStep(a)},selectRisk:function(a,l){n=a,document.querySelectorAll("#step-1 button").forEach(d=>d.classList.remove("card-selected")),l.classList.add("card-selected"),document.getElementById("btn-step-1").disabled=!1},selectSource:function(a,l){i=a,document.querySelectorAll("#step-2 button").forEach(E=>E.classList.remove("card-selected")),l.classList.add("card-selected");const d=document.getElementById("authority-panel"),c=C[a];c&&(document.getElementById("panel-title").textContent=c.title,document.getElementById("panel-integrity").textContent=c.integrity,document.getElementById("panel-measured").textContent=c.measured,document.getElementById("panel-verified").textContent=c.verified,document.getElementById("panel-failcases").textContent=c.failcases,d.classList.add("visible"),document.getElementById("status-row").classList.add("hidden"));const x=document.getElementById("x-verify-panel");a==="TWITTER"?(x.style.display="block",document.getElementById("btn-step-2").disabled=!u):(x.style.display="none",document.getElementById("btn-step-2").disabled=!1);const L=document.getElementById("metric-preview"),I=T[a];if(L&&I&&(a!=="TWITTER"||u)){L.style.display="block";const E=I.metricType==="REVENUE",F=E?f:B,$=E?"":" followers";document.getElementById("preview-current").textContent=F(I.currentValue)+$,document.getElementById("preview-authority-badge").textContent=a==="TWITTER"?"X":"Stripe"}window.lucide&&window.lucide.createIcons()},nextStep:function(){if(e===1)this.markCompleted(1),this.setStep(2);else if(e===2){this.markCompleted(2),this.setStep(3);let a="1.5x";n==="BOLD"&&(a="2.0x"),n==="ALL_IN"&&(a="4.0x"),document.getElementById("final-mult").textContent=a;const l={TWITTER:"X (Twitter)",STRIPE:"Stripe",GITHUB:"GitHub"};document.getElementById("final-oracle").textContent=l[i]||"Unknown",R().then(d=>{v(d)})}},startHold:function(){if(o)return;document.getElementById("btn-execute").classList.add("holding"),s=setTimeout(()=>{this.completeHold()},2e3)},endHold:function(){if(o)return;document.getElementById("btn-execute").classList.remove("holding"),clearTimeout(s)},completeHold:async function(){o=!0;const a=document.getElementById("btn-execute");document.getElementById("btn-text").textContent="Executing...",a.disabled=!0;try{const l=document.querySelector('#step-3 input[type="number"]'),d=parseFloat((l==null?void 0:l.value)||5e3),c=new Date;c.setDate(c.getDate()+30);const x={platform:i==="TWITTER"?"X":"STRIPE",metricType:i==="TWITTER"?"FOLLOWERS":"REVENUE",condition:{operator:"GTE",threshold:1e4,deadline:c.toISOString()},lockAmountUsdCents:Math.round(d*100),payoutAmountUsdCents:Math.round(d*100)},L=await window.api.createContract(x);console.log("[Contracts] Contract created:",L),this.markCompleted(3),document.getElementById("btn-text").textContent="Contract Executed",a.classList.remove("bg-neutral-900"),a.classList.add("bg-black","cursor-default");const I=document.querySelector(".step-status");I&&(I.textContent="S: Complete"),h(3,!0),setTimeout(()=>{var F;const E=L.contractId||((F=L.contract)==null?void 0:F.id);E?window.router.navigate("/contracts/"+E):window.router.navigate("/my-contracts")},1500)}catch(l){console.error("[Contracts] Create contract error:",l),o=!1,document.getElementById("btn-text").textContent="Hold to Execute",a.disabled=!1,alert("Contract creation failed: "+(l.message||"Unknown error"))}},generateVerifyCode:async function(){var c;const a=document.getElementById("x-username-input"),l=(c=a==null?void 0:a.value)==null?void 0:c.trim(),d=document.getElementById("x-generate-btn");if(!l){alert("Please enter your X username");return}d.disabled=!0,d.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>';try{const x=await window.api.startXVerification(l);console.log("[Contracts] startXVerification result:",x),m=l,b=x.challengeCode||x.code,document.getElementById("x-verify-step1").classList.add("hidden"),document.getElementById("x-verify-step2").classList.remove("hidden"),document.getElementById("x-verify-code").textContent=b,document.getElementById("x-verify-status").textContent="Pending",window.lucide&&window.lucide.createIcons()}catch(x){console.error("[Contracts] startXVerification error:",x),alert("Failed to generate code: "+(x.message||"Unknown error")),d.textContent="Generate Code",d.disabled=!1}},copyVerifyCode:function(){b&&navigator.clipboard.writeText(b).then(()=>{const a=document.querySelector('#x-verify-step2 button[onclick*="copyVerifyCode"]');if(a){const l=a.innerHTML;a.innerHTML='<i data-lucide="check" class="w-4 h-4"></i>',window.lucide&&window.lucide.createIcons(),setTimeout(()=>{a.innerHTML=l,window.lucide&&window.lucide.createIcons()},2e3)}})},verifyXAccount:async function(){const a=document.getElementById("x-verify-btn"),l=a.textContent;a.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>',a.disabled=!0;try{const d=await window.api.verifyX();console.log("[Contracts] X verification result:",d),u=!0,document.getElementById("x-verify-step1").classList.add("hidden"),document.getElementById("x-verify-step2").classList.add("hidden"),document.getElementById("x-verify-success").classList.remove("hidden"),document.getElementById("x-verified-handle").textContent="@"+m+" • Connected",document.getElementById("x-verify-status").textContent="Verified",document.getElementById("x-verify-status").classList.remove("text-neutral-400"),document.getElementById("x-verify-status").classList.add("text-[#1F7A4D]"),document.getElementById("btn-step-2").disabled=!1;const c=document.getElementById("metric-preview"),x=T.TWITTER;c&&x&&(c.style.display="block",document.getElementById("preview-current").textContent=B(x.currentValue)+" followers",document.getElementById("preview-authority-badge").textContent="X"),window.lucide&&window.lucide.createIcons()}catch(d){console.error("[Contracts] X verification error:",d),a.textContent=l,a.disabled=!1;const c=d.message||"Verification failed";c.includes("could not find")||c.includes("not found")?alert('Verification failed: Could not find the code "'+b+'" in your X bio. Please add it and try again.'):alert("Verification failed: "+c)}}},h(1)}function ee(e){const t=(e==null?void 0:e.id)||"4421";return`
        <div class="pb-32 w-full max-w-5xl mx-auto px-6 relative z-10 min-h-screen">
            <div class="flex items-center gap-2 mb-8 font-mono text-[10px] text-neutral-400 uppercase tracking-widest mt-12">
                <button onclick="window.router.navigate('/contracts')" class="hover:text-neutral-900 cursor-pointer transition-colors">Contracts</button>
                <i data-lucide="chevron-right" class="w-3 h-3"></i>
                <span class="text-neutral-900">${t}</span>
            </div>

            <div class="bg-white border border-neutral-200 shadow-sm max-w-3xl mx-auto w-full rounded-sm overflow-hidden">
                <div class="p-8 border-b border-neutral-200">
                    <div class="flex justify-between items-start">
                        <div class="flex flex-col gap-2">
                            <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Contract ID</span>
                            <h1 class="font-mono text-xl tracking-tight text-neutral-900">${t}-8A7B-21C4</h1>
                        </div>
                        <div class="flex flex-col items-end gap-2">
                             <div class="inline-flex items-center px-2 py-1 rounded bg-emerald-50 border border-emerald-100 text-emerald-700">
                                <span class="font-mono text-[10px] font-medium uppercase tracking-widest">Settled</span>
                            </div>
                            <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">2023-10-27 14:32 UTC</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 border-b border-neutral-200">
                    <div class="p-8 border-b md:border-b-0 md:border-r border-neutral-200 flex flex-col gap-6">
                        <h4 class="font-mono text-[10px] font-medium uppercase tracking-widest text-neutral-400">Parties Involved</h4>
                        <div class="space-y-4">
                            <div class="flex flex-col gap-1">
                                <span class="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Principal</span>
                                <span class="font-mono text-[11px] font-medium text-neutral-900">@alex_dev</span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <span class="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Verification Source</span>
                                <span class="font-mono text-[11px] font-medium text-neutral-900">GitHub API</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-8 flex flex-col gap-6 bg-neutral-50/20">
                        <h4 class="font-mono text-[10px] font-medium uppercase tracking-widest text-neutral-400">Capital Block</h4>
                        <div class="space-y-4">
                            <div class="flex flex-col gap-1">
                                <span class="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Total Locked</span>
                                <span class="font-mono text-lg font-medium text-neutral-900">$500.00</span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <span class="font-mono text-[9px] uppercase tracking-widest text-neutral-500">Settlement Outcome</span>
                                <span class="font-mono text-[11px] font-medium text-emerald-700">Funds Returned to Principal</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-8 border-b border-neutral-200">
                    <h4 class="font-mono text-[10px] font-medium uppercase tracking-widest text-neutral-400 mb-4">Condition Terms</h4>
                    <div class="bg-neutral-50 border border-neutral-100 p-4 rounded-sm">
                        <p class="font-sans text-sm text-neutral-900 leading-relaxed">
                            The principal must merge a Pull Request into the <code class="bg-white border border-neutral-200 px-1 py-0.5 rounded text-[11px]">main</code> branch before the deadline.
                        </p>
                    </div>
                </div>

                <div class="p-8 bg-white">
                    <h4 class="font-mono text-[10px] font-medium uppercase tracking-widest text-neutral-400 mb-6">Event Log</h4>
                    <div class="relative pl-2 space-y-8 before:absolute before:left-[4px] before:top-2 before:bottom-2 before:w-px before:bg-neutral-200">
                        <div class="relative pl-6">
                            <div class="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-neutral-300 border-2 border-white"></div>
                            <div class="flex justify-between items-baseline">
                                <span class="font-mono text-[11px] font-medium text-neutral-900 uppercase">Contract Created</span>
                                <span class="font-mono text-[10px] text-neutral-400">2023-10-25 09:00 UTC</span>
                            </div>
                        </div>
                        <div class="relative pl-6">
                            <div class="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-neutral-300 border-2 border-white"></div>
                            <div class="flex justify-between items-baseline">
                                <span class="font-mono text-[11px] font-medium text-neutral-900 uppercase">Funds Locked ($500.00)</span>
                                <span class="font-mono text-[10px] text-neutral-400">2023-10-25 09:05 UTC</span>
                            </div>
                        </div>
                        <div class="relative pl-6">
                            <div class="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white"></div>
                            <div class="flex justify-between items-baseline">
                                <span class="font-mono text-[11px] font-medium text-emerald-700 uppercase">Settled</span>
                                <span class="font-mono text-[10px] text-neutral-400">2023-10-27 14:32 UTC</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-neutral-50 border-t border-neutral-200 px-8 py-6">
                    <div class="flex justify-between items-center">
                        <div class="flex flex-col gap-1">
                            <span class="font-mono text-[9px] uppercase tracking-widest text-neutral-400">Record Hash</span>
                            <span class="font-mono text-[10px] text-neutral-500">0x7f8a92b1c4d5e6f7a8b9c0d1e2f3a4b5</span>
                        </div>
                        <div class="flex items-center gap-2 text-neutral-400">
                            <i data-lucide="lock" class="w-3 h-3"></i>
                            <span class="font-mono text-[9px] uppercase tracking-widest">Immutable</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`}function te(){window.lucide&&window.lucide.createIcons()}function se(){return`
        <div class="pb-32 w-full max-w-5xl mx-auto px-6 relative z-10 min-h-screen">
            <!-- Breadcrumb -->
            <div class="flex items-center gap-2 mb-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest mt-8">
                <span>Collateral</span>
                <span>›</span>
                <span class="text-neutral-900">Identity Record</span>
            </div>

            <!-- Profile Header -->
            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                <div>
                    <h1 class="font-display text-4xl md:text-5xl font-normal text-[#921818] tracking-tight mb-2" id="profile-display-name">Alexander Doe</h1>
                    <div class="flex items-center gap-3">
                        <span class="font-mono text-sm text-neutral-500" id="profile-handle">@alex_dev</span>
                        <span class="text-neutral-300">•</span>
                        <span class="font-mono text-[11px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-sm">0x8a7...b21</span>
                    </div>
                </div>
                <!-- Action Buttons -->
                <div class="flex gap-3">
                    <button class="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 bg-white text-neutral-600 text-[11px] font-medium uppercase tracking-wide hover:border-neutral-400 transition-colors">
                        <i data-lucide="link" class="w-3.5 h-3.5"></i>
                        Copy Record Link
                    </button>
                    <button onclick="window.app.openSettingsModal()" class="flex items-center gap-2 px-4 py-2.5 bg-[#921818] text-white text-[11px] font-medium uppercase tracking-wide hover:bg-[#751212] transition-colors">
                        <i data-lucide="settings" class="w-3.5 h-3.5"></i>
                        Settings
                    </button>
                </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200 border border-neutral-200 mb-10">
                <div class="bg-white p-6">
                    <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">Settlement Rate</span>
                    <span class="font-display text-3xl font-medium text-neutral-900">98.5%</span>
                    <p class="font-mono text-[9px] text-neutral-400 mt-1">Derived from settled vs forfeited contracts</p>
                </div>
                <div class="bg-white p-6">
                    <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">Total Contracts</span>
                    <span class="font-display text-3xl font-medium text-neutral-900">42</span>
                </div>
                <div class="bg-white p-6">
                    <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">TVL (Settled)</span>
                    <span class="font-display text-3xl font-medium text-neutral-900">$12,450</span>
                </div>
                <div class="bg-white p-6">
                    <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">Forfeited</span>
                    <span class="font-display text-3xl font-medium text-[#921818]">1</span>
                </div>
            </div>

            <!-- Tabs -->
            <div class="flex gap-0 border-b border-neutral-200 mb-8 overflow-x-auto">
                <button class="profile-tab px-4 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 border-neutral-900 text-neutral-900 font-medium whitespace-nowrap" data-tab="overview">Overview</button>
                <button class="profile-tab px-4 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 border-transparent text-neutral-400 hover:text-neutral-600 whitespace-nowrap" data-tab="contracts">Active Contracts <span class="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded ml-1">3</span></button>
                <button class="profile-tab px-4 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 border-transparent text-neutral-400 hover:text-neutral-600 whitespace-nowrap" data-tab="history">Settlement History</button>
                <button class="profile-tab px-4 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 border-transparent text-neutral-400 hover:text-neutral-600 whitespace-nowrap" data-tab="sources">Connected Sources</button>
                <button class="profile-tab px-4 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 border-transparent text-neutral-400 hover:text-neutral-600 whitespace-nowrap" data-tab="timeline">Identity Timeline</button>
            </div>

            <!-- Tab Content Container -->
            <div id="tab-content">
                <!-- Overview Tab (default) -->
                <div id="tab-overview" class="tab-panel">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="md:col-span-2 border border-neutral-200 bg-white p-6">
                            <h3 class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-4">Identity Summary</h3>
                            <p class="text-sm text-neutral-600 leading-relaxed">
                                Summary of this identity's historical contract performance. This record aggregates cryptographic proof of executed commitments, settlement rates, and total value locked across all connected verification sources. This account maintains a high settlement standing with minimal forfeiture history.
                            </p>
                        </div>
                        <div class="border border-neutral-200 bg-neutral-50 p-6">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="font-mono text-[10px] text-[#921818] uppercase tracking-widest font-medium">Identity Metadata</h3>
                                <i data-lucide="lock" class="w-3.5 h-3.5 text-neutral-300"></i>
                            </div>
                            <div class="space-y-4">
                                <div>
                                    <span class="font-mono text-[9px] text-neutral-400 uppercase tracking-widest block mb-1">Bio</span>
                                    <p class="text-sm text-neutral-700">Full-stack developer building on-chain accountability tools.</p>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="font-mono text-[9px] text-neutral-400 uppercase tracking-widest">Verified</span>
                                    <span class="flex items-center gap-1.5 text-[#1F7A4D] text-sm font-medium">
                                        <i data-lucide="check-circle" class="w-4 h-4"></i>
                                        True
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Active Contracts Tab -->
                <div id="tab-contracts" class="tab-panel hidden">
                    <div class="border border-neutral-200 bg-white overflow-hidden">
                        <table class="w-full">
                            <thead class="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Contract</th>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Source</th>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Locked</th>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Deadline (UTC)</th>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Status</th>
                                    <th class="text-right py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest"></th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-neutral-100">
                                <tr class="hover:bg-neutral-50">
                                    <td class="py-4 px-4 font-sans text-sm font-medium text-neutral-900">Ship v2.1 to Production</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">GitHub</td>
                                    <td class="py-4 px-4 font-mono text-sm text-neutral-900">$500.00</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">Oct 25, 12:00</td>
                                    <td class="py-4 px-4"><span class="font-mono text-[10px] font-medium text-white bg-[#1F7A4D] px-2 py-1 uppercase tracking-wider">Active</span></td>
                                    <td class="py-4 px-4 text-right"><button class="font-mono text-[11px] text-neutral-400 hover:text-neutral-900">View</button></td>
                                </tr>
                                <tr class="hover:bg-neutral-50">
                                    <td class="py-4 px-4 font-sans text-sm font-medium text-neutral-900">Maintain 99.9% Uptime</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">PingDOM</td>
                                    <td class="py-4 px-4 font-mono text-sm text-neutral-900">$5,000.00</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">Nov 01, 00:00</td>
                                    <td class="py-4 px-4"><span class="font-mono text-[10px] font-medium text-white bg-[#1F7A4D] px-2 py-1 uppercase tracking-wider">Active</span></td>
                                    <td class="py-4 px-4 text-right"><button class="font-mono text-[11px] text-neutral-400 hover:text-neutral-900">View</button></td>
                                </tr>
                                <tr class="hover:bg-neutral-50">
                                    <td class="py-4 px-4 font-sans text-sm font-medium text-neutral-900">Weekly Fitness Goal</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">Strava</td>
                                    <td class="py-4 px-4 font-mono text-sm text-neutral-900">$100.00</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">Oct 27, 08:00</td>
                                    <td class="py-4 px-4"><span class="font-mono text-[10px] font-medium text-neutral-600 bg-neutral-200 px-2 py-1 uppercase tracking-wider">Pending</span></td>
                                    <td class="py-4 px-4 text-right"><button class="font-mono text-[11px] text-neutral-400 hover:text-neutral-900">View</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Settlement History Tab -->
                <div id="tab-history" class="tab-panel hidden">
                    <div class="border border-neutral-200 bg-white overflow-hidden">
                        <table class="w-full">
                            <thead class="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Contract</th>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Source</th>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Value</th>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Settled</th>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Outcome</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-neutral-100">
                                <tr class="hover:bg-neutral-50">
                                    <td class="py-4 px-4 font-sans text-sm font-medium text-neutral-900">Launch MVP by Q3</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">GitHub</td>
                                    <td class="py-4 px-4 font-mono text-sm text-neutral-900">$2,000.00</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">Sep 30, 2024</td>
                                    <td class="py-4 px-4"><span class="font-mono text-[10px] font-medium text-[#1F7A4D]">+$800 RETURNED</span></td>
                                </tr>
                                <tr class="hover:bg-neutral-50">
                                    <td class="py-4 px-4 font-sans text-sm font-medium text-neutral-900">10K Twitter Followers</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">X/Twitter</td>
                                    <td class="py-4 px-4 font-mono text-sm text-neutral-900">$500.00</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">Aug 15, 2024</td>
                                    <td class="py-4 px-4"><span class="font-mono text-[10px] font-medium text-[#921818]">FORFEITED</span></td>
                                </tr>
                                <tr class="hover:bg-neutral-50">
                                    <td class="py-4 px-4 font-sans text-sm font-medium text-neutral-900">$5K MRR Milestone</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">Stripe</td>
                                    <td class="py-4 px-4 font-mono text-sm text-neutral-900">$1,000.00</td>
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">Jul 01, 2024</td>
                                    <td class="py-4 px-4"><span class="font-mono text-[10px] font-medium text-[#1F7A4D]">+$1,500 RETURNED</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Connected Sources Tab -->
                <div id="tab-sources" class="tab-panel hidden">
                    <!-- Alert for new users -->
                    <div id="sources-alert" class="bg-[rgba(161,130,57,0.06)] border border-[#A18239]/30 p-4 mb-6">
                        <p class="font-sans text-sm text-[#A18239] font-medium mb-1">Connect verification sources to create contracts</p>
                        <p class="font-mono text-[10px] text-[#A18239]/70 uppercase tracking-widest">At least one source required for contract execution.</p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- X / Twitter -->
                        <div id="source-twitter" class="border border-neutral-200 bg-white p-6 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 bg-neutral-900 rounded flex items-center justify-center">
                                    <span class="text-white font-bold text-lg">X</span>
                                </div>
                                <div>
                                    <h4 class="font-sans text-sm font-medium text-neutral-900">X / Twitter</h4>
                                    <p class="font-mono text-[11px] text-neutral-400" id="twitter-status">Not connected</p>
                                </div>
                            </div>
                            <button onclick="window.app.connectSource('twitter')" id="twitter-btn" class="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 text-[11px] font-mono uppercase tracking-wide text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-colors">
                                Connect
                            </button>
                        </div>
                        
                        <!-- GitHub -->
                        <div id="source-github" class="border border-neutral-200 bg-white p-6 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 bg-neutral-800 rounded flex items-center justify-center">
                                    <i data-lucide="github" class="w-5 h-5 text-white"></i>
                                </div>
                                <div>
                                    <h4 class="font-sans text-sm font-medium text-neutral-900">GitHub</h4>
                                    <p class="font-mono text-[11px] text-neutral-400" id="github-status">Not connected</p>
                                </div>
                            </div>
                            <button onclick="window.app.connectSource('github')" id="github-btn" class="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 text-[11px] font-mono uppercase tracking-wide text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-colors">
                                Connect
                            </button>
                        </div>
                        
                        <!-- Stripe -->
                        <div id="source-stripe" class="border border-neutral-200 bg-white p-6 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 bg-[#635BFF] rounded flex items-center justify-center">
                                    <span class="text-white font-bold text-sm">S</span>
                                </div>
                                <div>
                                    <h4 class="font-sans text-sm font-medium text-neutral-900">Stripe</h4>
                                    <p class="font-mono text-[11px] text-neutral-400" id="stripe-status">Not connected</p>
                                </div>
                            </div>
                            <button onclick="window.app.connectSource('stripe')" id="stripe-btn" class="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 text-[11px] font-mono uppercase tracking-wide text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-colors">
                                Connect
                            </button>
                        </div>
                        
                        <!-- Add More -->
                        <div class="border border-dashed border-neutral-300 bg-neutral-50 p-6 flex items-center justify-center cursor-pointer hover:border-neutral-400 transition-colors">
                            <div class="flex items-center gap-2 text-neutral-400">
                                <i data-lucide="plus" class="w-4 h-4"></i>
                                <span class="font-mono text-[11px] uppercase tracking-wide">More Sources Coming</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Identity Timeline Tab -->
                <div id="tab-timeline" class="tab-panel hidden">
                    <div class="border border-neutral-200 bg-white p-6">
                        <div class="relative pl-6 space-y-8 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-neutral-200">
                            <div class="relative">
                                <div class="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#1F7A4D] border-2 border-white"></div>
                                <div class="flex justify-between items-baseline mb-1">
                                    <span class="font-mono text-[11px] font-medium text-neutral-900 uppercase">Identity Created</span>
                                    <span class="font-mono text-[10px] text-neutral-400">Jan 15, 2024</span>
                                </div>
                                <p class="text-sm text-neutral-500">Account registered and email verified.</p>
                            </div>
                            <div class="relative">
                                <div class="absolute -left-6 top-1 w-3 h-3 rounded-full bg-neutral-300 border-2 border-white"></div>
                                <div class="flex justify-between items-baseline mb-1">
                                    <span class="font-mono text-[11px] font-medium text-neutral-900 uppercase">X/Twitter Connected</span>
                                    <span class="font-mono text-[10px] text-neutral-400">Jan 16, 2024</span>
                                </div>
                                <p class="text-sm text-neutral-500">Linked @alex_dev for public signal verification.</p>
                            </div>
                            <div class="relative">
                                <div class="absolute -left-6 top-1 w-3 h-3 rounded-full bg-neutral-300 border-2 border-white"></div>
                                <div class="flex justify-between items-baseline mb-1">
                                    <span class="font-mono text-[11px] font-medium text-neutral-900 uppercase">First Contract Executed</span>
                                    <span class="font-mono text-[10px] text-neutral-400">Feb 01, 2024</span>
                                </div>
                                <p class="text-sm text-neutral-500">Locked $500 against shipping MVP milestone.</p>
                            </div>
                            <div class="relative">
                                <div class="absolute -left-6 top-1 w-3 h-3 rounded-full bg-neutral-300 border-2 border-white"></div>
                                <div class="flex justify-between items-baseline mb-1">
                                    <span class="font-mono text-[11px] font-medium text-neutral-900 uppercase">GitHub Connected</span>
                                    <span class="font-mono text-[10px] text-neutral-400">Mar 10, 2024</span>
                                </div>
                                <p class="text-sm text-neutral-500">Linked alex-dev for code verification.</p>
                            </div>
                            <div class="relative">
                                <div class="absolute -left-6 top-1 w-3 h-3 rounded-full bg-neutral-300 border-2 border-white"></div>
                                <div class="flex justify-between items-baseline mb-1">
                                    <span class="font-mono text-[11px] font-medium text-neutral-900 uppercase">Stripe Connected</span>
                                    <span class="font-mono text-[10px] text-neutral-400">Apr 22, 2024</span>
                                </div>
                                <p class="text-sm text-neutral-500">Linked Stripe for revenue verification.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `}function ae(){const e=document.querySelectorAll(".profile-tab"),t=document.querySelectorAll(".tab-panel");e.forEach(n=>{n.addEventListener("click",()=>{const i=n.getAttribute("data-tab");e.forEach(o=>{o.classList.remove("border-neutral-900","text-neutral-900","font-medium"),o.classList.add("border-transparent","text-neutral-400")}),n.classList.remove("border-transparent","text-neutral-400"),n.classList.add("border-neutral-900","text-neutral-900","font-medium"),t.forEach(o=>{o.classList.add("hidden")});const s=document.getElementById("tab-"+i);s&&s.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()})}),window.lucide&&window.lucide.createIcons()}function ne(){return`
        <div class="pb-32 w-full max-w-5xl mx-auto px-6 relative z-10 min-h-screen">
            <!-- Breadcrumb -->
            <div class="flex items-center gap-2 mb-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest mt-8">
                <span>Collateral</span>
                <span>›</span>
                <span class="text-neutral-900">Identity Record</span>
            </div>

            <!-- Profile Header -->
            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                <div>
                    <h1 class="font-display text-4xl md:text-5xl font-normal text-[#921818] tracking-tight mb-2">Alexander Doe</h1>
                    <div class="flex items-center gap-3">
                        <span class="font-mono text-sm text-neutral-500">@alex_dev</span>
                        <span class="text-neutral-300">•</span>
                        <span class="font-mono text-[11px] text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-sm">0x8a7...b21</span>
                    </div>
                </div>
                <!-- Action Buttons -->
                <div class="flex gap-3">
                    <button class="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 bg-white text-neutral-600 text-[11px] font-medium uppercase tracking-wide hover:border-neutral-400 transition-colors">
                        <i data-lucide="link" class="w-3.5 h-3.5"></i>
                        Copy Record Link
                    </button>
                    <button class="flex items-center gap-2 px-4 py-2.5 bg-[#921818] text-white text-[11px] font-medium uppercase tracking-wide hover:bg-[#751212] transition-colors">
                        <i data-lucide="settings" class="w-3.5 h-3.5"></i>
                        Edit Profile
                    </button>
                </div>
            </div>

            <!-- Tabs -->
            <div class="flex gap-0 border-b border-neutral-200 mb-8">
                <button class="contracts-tab px-4 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 border-neutral-900 text-neutral-900 font-medium" data-tab="overview">Overview</button>
                <button class="contracts-tab px-4 py-3 font-mono text-[11px] uppercase tracking-widest border-b-2 border-transparent text-neutral-400 hover:text-neutral-600" data-tab="active">Active Contracts <span class="text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded ml-1">3</span></button>
            </div>

            <!-- Tab Content -->
            <div id="contracts-tab-content">
                <!-- Overview Tab -->
                <div id="contracts-tab-overview" class="contracts-panel">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Active Commitments</h3>
                        <button class="font-mono text-[11px] text-neutral-400 hover:text-neutral-900">View all</button>
                    </div>
                    
                    <!-- Contract Cards -->
                    <div class="space-y-4">
                        <div class="border border-neutral-200 bg-white p-6">
                            <div class="flex justify-between items-start mb-3">
                                <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Expires in 12h</span>
                                <span class="font-mono text-sm text-neutral-900">$500.00 <span class="text-neutral-400">Locked</span></span>
                            </div>
                            <h4 class="font-sans text-lg font-medium text-neutral-900 mb-2">Ship v2.1 to Production</h4>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2 text-neutral-500">
                                    <i data-lucide="git-branch" class="w-4 h-4"></i>
                                    <span class="font-mono text-[11px]">GitHub Integration</span>
                                </div>
                                <button onclick="window.router.navigate('/contracts/4421')" class="font-mono text-[11px] text-neutral-500 hover:text-neutral-900 flex items-center gap-1 uppercase tracking-wide">
                                    View Receipt <i data-lucide="arrow-right" class="w-3 h-3"></i>
                                </button>
                            </div>
                        </div>

                        <div class="border border-neutral-200 bg-white p-6">
                            <div class="flex justify-between items-start mb-3">
                                <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Expires in 7d</span>
                                <span class="font-mono text-sm text-neutral-900">$5,000.00 <span class="text-neutral-400">Locked</span></span>
                            </div>
                            <h4 class="font-sans text-lg font-medium text-neutral-900 mb-2">Maintain 99.9% Uptime</h4>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2 text-neutral-500">
                                    <i data-lucide="activity" class="w-4 h-4"></i>
                                    <span class="font-mono text-[11px]">PingDOM Integration</span>
                                </div>
                                <button onclick="window.router.navigate('/contracts/4422')" class="font-mono text-[11px] text-neutral-500 hover:text-neutral-900 flex items-center gap-1 uppercase tracking-wide">
                                    View Receipt <i data-lucide="arrow-right" class="w-3 h-3"></i>
                                </button>
                            </div>
                        </div>

                        <div class="border border-neutral-200 bg-white p-6">
                            <div class="flex justify-between items-start mb-3">
                                <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Expires in 2d</span>
                                <span class="font-mono text-sm text-neutral-900">$100.00 <span class="text-neutral-400">Locked</span></span>
                            </div>
                            <h4 class="font-sans text-lg font-medium text-neutral-900 mb-2">Weekly Fitness Goal</h4>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2 text-neutral-500">
                                    <i data-lucide="heart" class="w-4 h-4"></i>
                                    <span class="font-mono text-[11px]">Strava Integration</span>
                                </div>
                                <button onclick="window.router.navigate('/contracts/4423')" class="font-mono text-[11px] text-neutral-500 hover:text-neutral-900 flex items-center gap-1 uppercase tracking-wide">
                                    View Receipt <i data-lucide="arrow-right" class="w-3 h-3"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Active Contracts Tab (Table View) -->
                <div id="contracts-tab-active" class="contracts-panel hidden">
                    <div class="border border-neutral-200 bg-white overflow-hidden">
                        <table class="w-full">
                            <thead class="border-b border-neutral-200">
                                <tr>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">ID</th>
                                    <th class="text-left py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Description</th>
                                    <th class="text-right py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Staked</th>
                                    <th class="text-right py-3 px-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Action</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-neutral-100">
                                <tr class="hover:bg-neutral-50">
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">#4421</td>
                                    <td class="py-4 px-4 font-sans text-sm font-medium text-neutral-900">Ship v2.1 to Production</td>
                                    <td class="py-4 px-4 font-mono text-sm text-neutral-900 text-right">$500.00</td>
                                    <td class="py-4 px-4 text-right">
                                        <button onclick="window.router.navigate('/contracts/4421')" class="font-mono text-[11px] text-neutral-400 hover:text-neutral-900 uppercase">View</button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-neutral-50">
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">#4422</td>
                                    <td class="py-4 px-4 font-sans text-sm font-medium text-neutral-900">Maintain 99.9% Uptime</td>
                                    <td class="py-4 px-4 font-mono text-sm text-neutral-900 text-right">$5,000.00</td>
                                    <td class="py-4 px-4 text-right">
                                        <button onclick="window.router.navigate('/contracts/4422')" class="font-mono text-[11px] text-neutral-400 hover:text-neutral-900 uppercase">View</button>
                                    </td>
                                </tr>
                                <tr class="hover:bg-neutral-50">
                                    <td class="py-4 px-4 font-mono text-[11px] text-neutral-500">#4423</td>
                                    <td class="py-4 px-4 font-sans text-sm font-medium text-neutral-900">Weekly Fitness Goal</td>
                                    <td class="py-4 px-4 font-mono text-sm text-neutral-900 text-right">$100.00</td>
                                    <td class="py-4 px-4 text-right">
                                        <button onclick="window.router.navigate('/contracts/4423')" class="font-mono text-[11px] text-neutral-400 hover:text-neutral-900 uppercase">View</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `}function oe(){const e=document.querySelectorAll(".contracts-tab"),t=document.querySelectorAll(".contracts-panel");e.forEach(n=>{n.addEventListener("click",()=>{const i=n.getAttribute("data-tab");e.forEach(o=>{o.classList.remove("border-neutral-900","text-neutral-900","font-medium"),o.classList.add("border-transparent","text-neutral-400")}),n.classList.remove("border-transparent","text-neutral-400"),n.classList.add("border-neutral-900","text-neutral-900","font-medium"),t.forEach(o=>o.classList.add("hidden"));const s=document.getElementById("contracts-tab-"+i);s&&s.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()})}),window.lucide&&window.lucide.createIcons()}function ie(){return`
        <div class="pb-32 w-full max-w-5xl mx-auto px-6 relative z-10 min-h-screen">
            <!-- Page Header -->
            <div class="mt-12 mb-12">
                <h1 class="font-display font-bold text-3xl tracking-tight text-[#0E0E11] uppercase mb-2">Documentation</h1>
                <p class="font-sans text-sm text-neutral-500">Everything you need to know about Collateral.</p>
                <div class="h-px w-full bg-neutral-200 mt-6"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <!-- Sidebar -->
                <nav class="md:col-span-1">
                    <div class="sticky top-24 space-y-6">
                        <div>
                            <h4 class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-3">Getting Started</h4>
                            <ul class="space-y-2">
                                <li><a href="#overview" class="text-sm text-neutral-900 font-medium hover:text-[#921818]">Overview</a></li>
                                <li><a href="#how-it-works" class="text-sm text-neutral-500 hover:text-neutral-900">How It Works</a></li>
                                <li><a href="#create-account" class="text-sm text-neutral-500 hover:text-neutral-900">Create Account</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-3">Contracts</h4>
                            <ul class="space-y-2">
                                <li><a href="#creating-contracts" class="text-sm text-neutral-500 hover:text-neutral-900">Creating Contracts</a></li>
                                <li><a href="#sources" class="text-sm text-neutral-500 hover:text-neutral-900">Verification Sources</a></li>
                                <li><a href="#settlements" class="text-sm text-neutral-500 hover:text-neutral-900">Settlements</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-3">API</h4>
                            <ul class="space-y-2">
                                <li><a href="#endpoints" class="text-sm text-neutral-500 hover:text-neutral-900">Endpoints</a></li>
                                <li><a href="#authentication" class="text-sm text-neutral-500 hover:text-neutral-900">Authentication</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>

                <!-- Content -->
                <div class="md:col-span-3 space-y-12">
                    <section id="overview">
                        <h2 class="font-display font-semibold text-xl text-neutral-900 mb-4">Overview</h2>
                        <p class="text-sm text-neutral-600 leading-relaxed mb-4">
                            Collateral is an enforcement protocol that lets you lock capital against measurable outcomes. 
                            Set a target, stake funds, and get verified results — automatically.
                        </p>
                        <p class="text-sm text-neutral-600 leading-relaxed">
                            When you succeed, your capital is returned plus potential rewards from the pool. 
                            When you fail, your capital is forfeited. No appeals. No exceptions.
                        </p>
                    </section>

                    <section id="how-it-works">
                        <h2 class="font-display font-semibold text-xl text-neutral-900 mb-4">How It Works</h2>
                        <div class="space-y-4">
                            <div class="flex gap-4">
                                <div class="w-8 h-8 bg-neutral-100 rounded flex items-center justify-center font-mono text-sm font-medium text-neutral-600 shrink-0">1</div>
                                <div>
                                    <h4 class="font-medium text-sm text-neutral-900 mb-1">Connect a verification source</h4>
                                    <p class="text-sm text-neutral-500">Link your GitHub, X/Twitter, Stripe, or other supported platform.</p>
                                </div>
                            </div>
                            <div class="flex gap-4">
                                <div class="w-8 h-8 bg-neutral-100 rounded flex items-center justify-center font-mono text-sm font-medium text-neutral-600 shrink-0">2</div>
                                <div>
                                    <h4 class="font-medium text-sm text-neutral-900 mb-1">Define your commitment</h4>
                                    <p class="text-sm text-neutral-500">Set a measurable target with a deadline. Be specific.</p>
                                </div>
                            </div>
                            <div class="flex gap-4">
                                <div class="w-8 h-8 bg-neutral-100 rounded flex items-center justify-center font-mono text-sm font-medium text-neutral-600 shrink-0">3</div>
                                <div>
                                    <h4 class="font-medium text-sm text-neutral-900 mb-1">Lock capital</h4>
                                    <p class="text-sm text-neutral-500">Stake funds that will be held until verification completes.</p>
                                </div>
                            </div>
                            <div class="flex gap-4">
                                <div class="w-8 h-8 bg-neutral-100 rounded flex items-center justify-center font-mono text-sm font-medium text-neutral-600 shrink-0">4</div>
                                <div>
                                    <h4 class="font-medium text-sm text-neutral-900 mb-1">Automatic settlement</h4>
                                    <p class="text-sm text-neutral-500">The system verifies your outcome and settles the contract.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="sources">
                        <h2 class="font-display font-semibold text-xl text-neutral-900 mb-4">Verification Sources</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="border border-neutral-200 p-4 bg-white">
                                <h4 class="font-medium text-sm text-neutral-900 mb-2">X / Twitter</h4>
                                <p class="text-xs text-neutral-500">Track follower growth, engagement, and posting frequency.</p>
                            </div>
                            <div class="border border-neutral-200 p-4 bg-white">
                                <h4 class="font-medium text-sm text-neutral-900 mb-2">GitHub</h4>
                                <p class="text-xs text-neutral-500">Track commits, merges, and repository milestones.</p>
                            </div>
                            <div class="border border-neutral-200 p-4 bg-white">
                                <h4 class="font-medium text-sm text-neutral-900 mb-2">Stripe</h4>
                                <p class="text-xs text-neutral-500">Track revenue, MRR, and transaction milestones.</p>
                            </div>
                            <div class="border border-neutral-200 p-4 bg-white">
                                <h4 class="font-medium text-sm text-neutral-900 mb-2">More Coming</h4>
                                <p class="text-xs text-neutral-500">Strava, Linear, custom webhooks, and more.</p>
                            </div>
                        </div>
                    </section>

                    <section id="settlements">
                        <h2 class="font-display font-semibold text-xl text-neutral-900 mb-4">Settlements</h2>
                        <p class="text-sm text-neutral-600 leading-relaxed mb-4">
                            All settlements are final and recorded on the public ledger. There are no appeals, refunds, or exceptions.
                        </p>
                        <div class="bg-neutral-50 border border-neutral-200 p-4">
                            <p class="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                                External systems decide outcomes. Collateral does not arbitrate.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    `}function re(){window.lucide&&window.lucide.createIcons()}function le(){return`
        <div class="pb-32 w-full max-w-3xl mx-auto px-6 relative z-10 min-h-screen">
            <!-- Page Header -->
            <div class="mt-12 mb-10">
                <h1 class="font-display font-bold text-2xl tracking-tight text-[#0E0E11] uppercase mb-2">Funding & Payouts</h1>
                <p class="font-sans text-sm text-neutral-500">Manage payment methods and view your balance.</p>
                <div class="h-px w-full bg-neutral-200 mt-6"></div>
            </div>

            <!-- Funding Methods Section -->
            <section class="mb-10">
                <h2 class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-4">Funding Methods</h2>
                
                <div class="border border-neutral-200 bg-white">
                    <!-- Card Row -->
                    <div id="funding-card-row" class="p-5 flex items-center justify-between border-b border-neutral-100">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-8 bg-gradient-to-r from-[#635BFF] to-[#8B85FF] rounded flex items-center justify-center">
                                <span class="text-white font-bold text-[10px]">VISA</span>
                            </div>
                            <div>
                                <h4 class="font-sans text-sm font-medium text-neutral-900">Credit / Debit Card (Stripe)</h4>
                                <p class="font-mono text-[11px] text-neutral-400" id="card-status">No card on file</p>
                            </div>
                        </div>
                        <button onclick="window.app.addCard()" id="add-card-btn" class="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 text-[11px] font-mono uppercase tracking-wide text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-colors">
                            Add Card
                        </button>
                    </div>
                    
                    <!-- Info -->
                    <div class="p-4 bg-neutral-50">
                        <p class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Secure payments processed by Stripe</p>
                    </div>
                </div>
            </section>

            <!-- Balance State Section -->
            <section class="mb-10">
                <h2 class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-4">Balance State</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200">
                    <div class="bg-white p-5">
                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">Available Balance</span>
                        <span class="font-display text-2xl font-medium text-neutral-900" id="available-balance">$0.00</span>
                    </div>
                    <div class="bg-white p-5">
                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">Locked in Contracts</span>
                        <span class="font-display text-2xl font-medium text-[#A18239]" id="locked-balance">$0.00</span>
                    </div>
                    <div class="bg-white p-5">
                        <span class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block mb-2">Pending Payout</span>
                        <span class="font-display text-2xl font-medium text-[#1F7A4D]" id="pending-payout">$0.00</span>
                    </div>
                </div>
            </section>

            <!-- Payout Method Section -->
            <section class="mb-10">
                <h2 class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest mb-4">Payout Method</h2>
                
                <div class="border border-neutral-200 bg-white">
                    <div class="p-5 flex items-center justify-between border-b border-neutral-100">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 bg-neutral-100 rounded flex items-center justify-center">
                                <i data-lucide="building-2" class="w-5 h-5 text-neutral-500"></i>
                            </div>
                            <div>
                                <h4 class="font-sans text-sm font-medium text-neutral-900">Default Payout Destination</h4>
                                <p class="font-mono text-[11px] text-neutral-400" id="payout-status">No payout method configured</p>
                            </div>
                        </div>
                        <button onclick="window.app.setupPayout()" id="setup-payout-btn" class="flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 text-[11px] font-mono uppercase tracking-wide text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 transition-colors">
                            Setup
                        </button>
                    </div>
                    
                    <div class="p-4 bg-neutral-50">
                        <p class="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">Bank transfers via Stripe Connect (coming soon)</p>
                    </div>
                </div>
            </section>

            <!-- Important Notice -->
            <div class="bg-neutral-50 border border-neutral-200 p-5">
                <p class="font-mono text-[10px] text-neutral-500 uppercase tracking-widest leading-relaxed">
                    <span class="text-neutral-900 font-medium">Important:</span> Funding methods are used only to lock and release capital. 
                    Verification sources are managed separately in your profile.
                </p>
            </div>
        </div>
    `}function ce(){window.lucide&&window.lucide.createIcons()}function de(){return`
        <style>
            .receipts-page {
                max-width: 900px;
                margin: 0 auto;
                padding: 3rem 1.5rem;
                font-family: ui-sans-serif, system-ui, sans-serif;
                min-height: 70vh;
            }
            
            .receipts-header {
                margin-bottom: 3rem;
            }
            
            .receipts-title {
                font-size: 2rem;
                font-weight: 700;
                letter-spacing: -0.02em;
                color: #0E0E11;
                margin-bottom: 0.5rem;
            }
            
            .receipts-subtitle {
                font-family: ui-monospace, monospace;
                font-size: 11px;
                letter-spacing: 0.05em;
                color: #6B6E76;
            }
            
            .receipts-divider {
                height: 1px;
                background: #E5E5E5;
                margin: 2rem 0;
            }
            
            /* Empty State */
            .receipts-empty {
                padding: 5rem 2rem;
                text-align: center;
                border: 1px solid #D9DBE1;
                background: #FAFAFA;
            }
            
            .receipts-empty-title {
                font-family: ui-monospace, monospace;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: #0E0E11;
                margin-bottom: 1.25rem;
            }
            
            .receipts-empty-text {
                font-family: ui-monospace, monospace;
                font-size: 11px;
                color: #6B6E76;
                line-height: 1.8;
                letter-spacing: 0.02em;
            }
            
            /* Receipt List */
            .receipts-list {
                display: flex;
                flex-direction: column;
                gap: 1px;
                background: #E5E5E5;
                border: 1px solid #E5E5E5;
            }
            
            .receipt-row {
                display: grid;
                grid-template-columns: 2fr 1fr 1fr 1fr;
                gap: 1rem;
                padding: 1rem 1.25rem;
                background: #FFFFFF;
                cursor: pointer;
            }
            
            .receipt-row:hover {
                background: #FAFAFA;
            }
            
            .receipt-row-header {
                background: #FAFAFA;
                cursor: default;
            }
            
            .receipt-row-header:hover {
                background: #FAFAFA;
            }
            
            .receipt-cell {
                font-family: ui-monospace, monospace;
                font-size: 12px;
                color: #0E0E11;
                display: flex;
                align-items: center;
            }
            
            .receipt-cell-header {
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: #6B6E76;
            }
            
            .receipt-cell-id {
                font-size: 11px;
                color: #4D5057;
            }
            
            .receipt-status {
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                padding: 0.25rem 0.5rem;
                display: inline-block;
            }
            
            .receipt-status.active {
                background: #0E0E11;
                color: #FFFFFF;
            }
            
            .receipt-status.success {
                background: #1F7A4D;
                color: #FFFFFF;
            }
            
            .receipt-status.failure {
                background: #8B1E1E;
                color: #FFFFFF;
            }
            
            .receipts-footer {
                text-align: center;
            }
            
            .receipts-footer p {
                font-family: ui-monospace, monospace;
                font-size: 10px;
                letter-spacing: 0.05em;
                color: #9CA0A8;
            }
        </style>
        
        <div class="receipts-page">
            <header class="receipts-header">
                <h1 class="receipts-title">Execution Receipts</h1>
                <p class="receipts-subtitle">Permanent records. Append-only ledger.</p>
            </header>
            
            <div class="receipts-divider"></div>
            
            <div id="receipts-content">
                <!-- Populated by JS -->
            </div>
            
            <div class="receipts-divider"></div>
            
            <footer class="receipts-footer">
                <p>Receipts are generated at contract execution. Records cannot be modified or removed.</p>
            </footer>
        </div>
    `}function pe(){const e=document.getElementById("receipts-content"),t=[];if(t.length===0){e.innerHTML=`
            <div class="receipts-empty">
                <h2 class="receipts-empty-title">No execution records exist for this identity.</h2>
                <p class="receipts-empty-text">
                    Receipts are created when a contract is executed.<br>
                    This ledger contains no entries.
                </p>
            </div>
        `;return}let n=`
        <div class="receipts-list">
            <div class="receipt-row receipt-row-header">
                <div class="receipt-cell receipt-cell-header">Receipt ID</div>
                <div class="receipt-cell receipt-cell-header">Capital</div>
                <div class="receipt-cell receipt-cell-header">Executed</div>
                <div class="receipt-cell receipt-cell-header">Status</div>
            </div>
    `;t.forEach(i=>{const s=i.status==="SETTLED_SUCCESS"?"success":i.status==="SETTLED_FAILURE"?"failure":"active",o=i.status==="SETTLED_SUCCESS"?"Settled":i.status==="SETTLED_FAILURE"?"Forfeited":"Active";n+=`
            <div class="receipt-row" onclick="window.router.navigate('/receipts/${i.id}')">
                <div class="receipt-cell receipt-cell-id">${i.receiptId}</div>
                <div class="receipt-cell">${i.capital}</div>
                <div class="receipt-cell">${i.executedDate}</div>
                <div class="receipt-cell">
                    <span class="receipt-status ${s}">${o}</span>
                </div>
            </div>
        `}),n+="</div>",e.innerHTML=n}function ue(){return`
        <style>
            /* Receipt Page Styles */
            .receipt-page {
                max-width: 900px;
                margin: 0 auto;
                padding: 3rem 1.5rem;
                font-family: ui-sans-serif, system-ui, sans-serif;
            }
            
            .receipt-header {
                border-bottom: 2px solid #0E0E11;
                padding-bottom: 2rem;
                margin-bottom: 2rem;
            }
            
            .receipt-title {
                font-size: 2.5rem;
                font-weight: 700;
                letter-spacing: -0.02em;
                color: #0E0E11;
                margin-bottom: 0.5rem;
            }
            
            .receipt-subtitle {
                font-size: 0.875rem;
                color: #6B6E76;
                max-width: 500px;
            }
            
            .finality-notice {
                font-family: ui-monospace, monospace;
                font-size: 10px;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: #8B1E1E;
                margin-top: 1rem;
            }
            
            .receipt-meta {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
                margin-top: 1.5rem;
                padding: 1rem;
                background: #FAFAFA;
                border: 1px solid #E5E5E5;
            }
            
            .receipt-meta-item {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }
            
            .receipt-meta-label {
                font-family: ui-monospace, monospace;
                font-size: 10px;
                font-weight: 600;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: #6B6E76;
            }
            
            .receipt-meta-value {
                font-family: ui-monospace, monospace;
                font-size: 13px;
                color: #0E0E11;
            }
            
            .receipt-meta-value.hash {
                font-size: 11px;
                color: #4D5057;
            }
            
            .receipt-section {
                margin-bottom: 2rem;
            }
            
            .receipt-section-title {
                font-family: ui-monospace, monospace;
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                color: #0E0E11;
                padding-bottom: 0.75rem;
                border-bottom: 1px solid #E5E5E5;
                margin-bottom: 1rem;
            }
            
            .receipt-table {
                width: 100%;
                border-collapse: collapse;
            }
            
            .receipt-table tr {
                border-bottom: 1px solid #F0F0F0;
            }
            
            .receipt-table tr:last-child {
                border-bottom: none;
            }
            
            .receipt-table td {
                padding: 0.75rem 0;
                font-size: 14px;
            }
            
            .receipt-table td:first-child {
                font-family: ui-monospace, monospace;
                font-size: 11px;
                font-weight: 500;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                color: #6B6E76;
                width: 40%;
            }
            
            .receipt-table td:last-child {
                font-family: ui-monospace, monospace;
                font-size: 13px;
                color: #0E0E11;
                text-align: right;
            }
            
            .receipt-table .value-gold {
                color: #C9A227;
                font-weight: 600;
            }
            
            .receipt-table .value-red {
                color: #8B1E1E;
                font-weight: 600;
            }
            
            .receipt-table tr.capital-row {
                background: #FAFAFA;
                border-top: 1px solid #E5E5E5;
                border-bottom: 1px solid #E5E5E5;
            }
            
            .receipt-table tr.capital-row td:first-child {
                font-weight: 700;
                color: #0E0E11;
            }
            
            .receipt-table tr.capital-row td:last-child {
                font-size: 1rem;
                font-weight: 700;
                color: #0E0E11;
            }
            
            .snapshot-box {
                background: #FAFAFA;
                border: 1px solid #E5E5E5;
                padding: 1.25rem;
            }
            
            .snapshot-source {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                font-family: ui-monospace, monospace;
                font-size: 10px;
                letter-spacing: 0.05em;
                text-transform: uppercase;
                color: #6B6E76;
                background: #FFFFFF;
                border: 1px solid #E5E5E5;
                padding: 0.25rem 0.5rem;
                margin-bottom: 1rem;
            }
            
            .snapshot-value {
                font-family: ui-monospace, monospace;
                font-size: 1.75rem;
                font-weight: 600;
                color: #0E0E11;
                margin-bottom: 0.5rem;
            }
            
            .snapshot-timestamp {
                font-size: 11px;
                color: #6B6E76;
            }
            
            .snapshot-note {
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid #E5E5E5;
                font-size: 11px;
                color: #6B6E76;
                font-style: italic;
            }
            
            .ledger-box {
                background: #0E0E11;
                color: #FFFFFF;
                padding: 1.5rem;
            }
            
            .ledger-row {
                display: flex;
                justify-content: space-between;
                padding: 0.5rem 0;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            
            .ledger-row:last-child {
                border-bottom: none;
            }
            
            .ledger-label {
                font-family: ui-monospace, monospace;
                font-size: 10px;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: rgba(255,255,255,0.5);
            }
            
            .ledger-value {
                font-family: ui-monospace, monospace;
                font-size: 11px;
                color: rgba(255,255,255,0.9);
            }
            
            .ledger-note {
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid rgba(255,255,255,0.1);
                font-size: 10px;
                color: rgba(255,255,255,0.4);
            }
            
            .status-block {
                padding: 1.5rem;
                border: 2px solid #0E0E11;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #FAFAFA;
            }
            
            .status-block.active { border-color: #0E0E11; }
            .status-block.success { border-color: #1F7A4D; }
            .status-block.failure { border-color: #8B1E1E; }
            
            .status-label {
                font-family: ui-monospace, monospace;
                font-size: 14px;
                font-weight: 700;
                letter-spacing: 0.15em;
                text-transform: uppercase;
            }
            
            .status-label.active { color: #0E0E11; }
            .status-label.success { color: #1F7A4D; }
            .status-label.failure { color: #8B1E1E; }
            
            .status-detail {
                font-family: ui-monospace, monospace;
                font-size: 11px;
                color: #6B6E76;
                margin-top: 0.5rem;
                letter-spacing: 0.02em;
            }
            
            .status-timestamp {
                font-family: ui-monospace, monospace;
                font-size: 11px;
                color: #6B6E76;
                text-align: right;
            }
            
            .receipt-footer {
                margin-top: 3rem;
                padding-top: 1.5rem;
                border-top: 1px solid #E5E5E5;
                text-align: center;
            }
            
            .receipt-footer p {
                font-size: 11px;
                color: #6B6E76;
                line-height: 1.6;
            }
            
            .receipt-footer .legal {
                margin-top: 1rem;
                font-size: 10px;
                color: #B0B2B8;
            }
            
            .receipt-actions {
                display: flex;
                gap: 1rem;
                margin-top: 1.5rem;
                justify-content: center;
            }
            
            .receipt-btn {
                font-family: ui-monospace, monospace;
                font-size: 10px;
                font-weight: 500;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                padding: 0.75rem 1.5rem;
                border: 1px solid #D9DBE1;
                background: #FFFFFF;
                color: #4D5057;
                cursor: pointer;
            }
            
            .receipt-btn:hover {
                border-color: #0E0E11;
                color: #0E0E11;
            }
            
            .receipt-not-found {
                max-width: 600px;
                margin: 6rem auto;
                text-align: center;
                padding: 3rem;
                border: 1px solid #E5E5E5;
            }
            
            .receipt-not-found h1 {
                font-family: ui-monospace, monospace;
                font-size: 14px;
                font-weight: 600;
                letter-spacing: 0.15em;
                text-transform: uppercase;
                color: #0E0E11;
                margin-bottom: 1rem;
            }
            
            .receipt-not-found p {
                font-size: 13px;
                color: #6B6E76;
            }
        </style>
        
        <div class="receipt-page" id="receipt-container">
            <!-- Content populated by JS -->
        </div>
    `}function me(e){const t=document.getElementById("receipt-container"),n=e==null?void 0:e.id,s={"RCP-001":{receiptId:"RCP-0x8a72390f1d2b4c5e6f7a8b9cd",contractId:"CTR-0x7A3F9E2B1C4D5E6F7A8B9CD4D1",executionTimestamp:"2026-01-04T19:43:22Z",status:"ACTIVE",terms:{authority:"X (Twitter)",metric:"Followers",baseline:3842,target:1e4,timeWindow:30,capitalLocked:5e3,multiplier:2,failureCondition:"Capital forfeiture"},snapshot:{source:"X API v2",value:3842,unit:"followers",capturedAt:"2026-01-04T19:43:22Z"},ledger:{eventId:"EVT-0x9f3d2a1b4c5e6f7e8",eventType:"CONTRACT_EXECUTED",hashChain:"0xa8b3c9d4e5f67890abcdef12345672a1",prevHash:"0x7c2d1e0f8a9b3c4d5e6f70819b3",appendTimestamp:"2026-01-04T19:43:22.847Z"},deadline:"2026-02-03T19:43:22Z"}}[n];if(!s){t.innerHTML=`
            <div class="receipt-not-found">
                <h1>Record Not Found</h1>
                <p>The requested receipt does not exist or is not accessible.</p>
            </div>
        `;return}function o(f){return f.toLocaleString("en-US")}function u(f){return"$"+f.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}function m(f){return new Date(f).toISOString().replace("T"," ").slice(0,19)+" UTC"}function b(f,r=12,g=3){return f.length<=r+g+3?f:f.slice(0,r)+"..."+f.slice(-g)}const T=s.status==="SETTLED_SUCCESS"?"success":s.status==="SETTLED_FAILURE"?"failure":"active",R=s.status==="SETTLED_SUCCESS"?"SETTLED — SUCCESS":s.status==="SETTLED_FAILURE"?"SETTLED — FAILURE":"ACTIVE",B=s.status==="ACTIVE"?"Settlement will occur automatically at deadline.":s.status==="SETTLED_SUCCESS"?`Target achieved. Payout: ${u(s.terms.capitalLocked*s.terms.multiplier)}`:`Target not achieved. Capital forfeited: ${u(s.terms.capitalLocked)}`;t.innerHTML=`
        <header class="receipt-header">
            <h1 class="receipt-title">Contract Receipt</h1>
            <p class="receipt-subtitle">This document certifies the execution of an immutable performance contract.</p>
            <p class="finality-notice">This record cannot be altered.</p>
            
            <div class="receipt-meta">
                <div class="receipt-meta-item">
                    <span class="receipt-meta-label">Receipt ID</span>
                    <span class="receipt-meta-value hash">${b(s.receiptId)}</span>
                </div>
                <div class="receipt-meta-item">
                    <span class="receipt-meta-label">Contract ID</span>
                    <span class="receipt-meta-value hash">${b(s.contractId)}</span>
                </div>
                <div class="receipt-meta-item">
                    <span class="receipt-meta-label">Execution Timestamp</span>
                    <span class="receipt-meta-value">${m(s.executionTimestamp)}</span>
                </div>
                <div class="receipt-meta-item">
                    <span class="receipt-meta-label">Status</span>
                    <span class="receipt-meta-value">${s.status}</span>
                </div>
            </div>
        </header>
        
        <section class="receipt-section">
            <h2 class="receipt-section-title">Contract Terms</h2>
            <table class="receipt-table">
                <tr><td>Authority</td><td>${s.terms.authority}</td></tr>
                <tr><td>Metric</td><td>${s.terms.metric}</td></tr>
                <tr><td>Baseline Snapshot</td><td>${o(s.terms.baseline)} ${s.snapshot.unit}</td></tr>
                <tr><td>Target</td><td>${o(s.terms.target)} ${s.snapshot.unit}</td></tr>
                <tr><td>Time Window</td><td>${s.terms.timeWindow} days</td></tr>
                <tr class="capital-row"><td>Capital Locked</td><td>${u(s.terms.capitalLocked)}</td></tr>
                <tr><td>Payout Multiplier</td><td class="value-gold">${s.terms.multiplier}×</td></tr>
                <tr><td>Failure Condition</td><td class="value-red">${s.terms.failureCondition}</td></tr>
            </table>
        </section>
        
        <section class="receipt-section">
            <h2 class="receipt-section-title">Verified Baseline Snapshot</h2>
            <div class="snapshot-box">
                <span class="snapshot-source">Pulled from ${s.snapshot.source}</span>
                <div class="snapshot-value">${o(s.snapshot.value)} ${s.snapshot.unit}</div>
                <div class="snapshot-timestamp">Captured: ${m(s.snapshot.capturedAt)}</div>
                <p class="snapshot-note">This value is immutable and used as the baseline for settlement.</p>
            </div>
        </section>
        
        <section class="receipt-section">
            <h2 class="receipt-section-title">Ledger Record</h2>
            <div class="ledger-box">
                <div class="ledger-row">
                    <span class="ledger-label">Ledger Event ID</span>
                    <span class="ledger-value">${b(s.ledger.eventId)}</span>
                </div>
                <div class="ledger-row">
                    <span class="ledger-label">Event Type</span>
                    <span class="ledger-value">CONTRACT_EXECUTED</span>
                </div>
                <div class="ledger-row">
                    <span class="ledger-label">Hash Chain Reference</span>
                    <span class="ledger-value">${b(s.ledger.hashChain)}</span>
                </div>
                <div class="ledger-row">
                    <span class="ledger-label">Previous Event Hash</span>
                    <span class="ledger-value">${b(s.ledger.prevHash)}</span>
                </div>
                <div class="ledger-row">
                    <span class="ledger-label">Append Timestamp</span>
                    <span class="ledger-value">${m(s.ledger.appendTimestamp)}</span>
                </div>
                <p class="ledger-note">This receipt is backed by an append-only ledger. Records cannot be altered or removed.</p>
            </div>
        </section>
        
        <section class="receipt-section">
            <h2 class="receipt-section-title">Contract Status</h2>
            <div class="status-block ${T}">
                <div>
                    <div class="status-label ${T}">${R}</div>
                    <div class="status-detail">${B}</div>
                </div>
                <div class="status-timestamp">Deadline: ${m(s.deadline)}</div>
            </div>
        </section>
        
        <footer class="receipt-footer">
            <p>All contracts settle publicly.<br>Outcomes are permanent.<br>No appeals. No overrides.</p>
            <p class="legal">This receipt may be used for personal records or verification purposes.</p>
            
            <div class="receipt-actions">
                <button class="receipt-btn" onclick="navigator.clipboard.writeText('${s.receiptId}')">
                    Copy Receipt ID
                </button>
            </div>
        </footer>
    `}const w="https://collateral-production.up.railway.app",j="collateral_auth_token",V="collateral_user";function M(){return localStorage.getItem(j)}function xe(e){localStorage.setItem(j,e)}function _(){localStorage.removeItem(j),localStorage.removeItem(V)}function fe(){return!!M()}function be(){const e=localStorage.getItem(V);return e?JSON.parse(e):null}function ge(e){localStorage.setItem(V,JSON.stringify(e))}function S(e=!0){const t={"Content-Type":"application/json"};if(e){const n=M();n&&(t.Authorization=`Bearer ${n}`)}return t}async function y(e){const t=await e.json().catch(()=>({}));if(!e.ok){const n=new Error(t.message||t.error||`HTTP ${e.status}`);throw n.status=e.status,n.code=t.code,n.data=t,n}return t}async function ve(e){var i;console.log("[API] devLogin called with email:",e);const t=await fetch(`${w}/auth/login`,{method:"POST",headers:S(!1),body:JSON.stringify({email:e})}),n=await y(t);return console.log("[API] devLogin response:",n),console.log("[API] accessToken in response:",!!n.accessToken),n.accessToken?(xe(n.accessToken),ge({email:e,userId:(i=n.user)==null?void 0:i.id}),console.log("[API] Token stored! Verifying:",!!M())):console.warn("[API] No accessToken in response!"),n}async function he(){_()}async function we(e){console.log("[API] startXVerification called with username:",e);const t=await fetch(`${w}/v1/connect/x/start`,{method:"POST",headers:S(),body:JSON.stringify({username:e})});return y(t)}async function ye(){const e=S();console.log("[API] verifyX called"),console.log("[API] Auth token present:",!!M());const t=await fetch(`${w}/v1/connect/x/verify`,{method:"POST",headers:e,body:JSON.stringify({})});return y(t)}async function Ee(){const e=await fetch(`${w}/v1/connect/x/status`,{method:"GET",headers:S()});return y(e)}async function ke(e){const t=await fetch(`${w}/v1/contracts`,{method:"POST",headers:S(),body:JSON.stringify(e)});return y(t)}async function Se(){const e=await fetch(`${w}/v1/contracts`,{method:"GET",headers:S()});return y(e)}async function Te(e){const t=await fetch(`${w}/v1/contracts/${e}`,{method:"GET",headers:S()});return y(t)}async function Ce(e){const t=await fetch(`${w}/v1/contracts/${e}/fund`,{method:"POST",headers:S()});return y(t)}async function Ie(e){const t=await fetch(`${w}/v1/contracts/${e}/events`,{method:"GET",headers:S()});return y(t)}async function Le(){const e=await fetch(`${w}/v1/ledger`,{method:"GET",headers:S(!1)});return y(e)}async function Be(){const e=await fetch(`${w}/health`,{method:"GET"});return y(e)}const D={devLogin:ve,logout:he,getAuthToken:M,hasAuthToken:fe,clearAuthToken:_,getStoredUser:be,startXVerification:we,verifyX:ye,getXStatus:Ee,createContract:ke,getContracts:Se,getContract:Te,createFundingIntent:Ce,getLedgerEvents:Ie,getPublicLedger:Le,checkHealth:Be},k=D.getStoredUser();var N;const p={isLoggedIn:D.hasAuthToken(),username:k!=null&&k.email?"@"+k.email.split("@")[0]:null,displayName:((N=k==null?void 0:k.email)==null?void 0:N.split("@")[0])||null,userId:(k==null?void 0:k.userId)||null,connectedSources:{twitter:!1,github:!1,stripe:!1}};window.appState=p;window.api=D;const Ae=[{path:"/overview",render:q,init:K},{path:"/ledger",render:J,init:Y},{path:"/contracts",render:Z,init:Q},{path:"/contracts/:id",render:ee,init:te},{path:"/profile",render:se,init:ae},{path:"/my-contracts",render:ne,init:oe},{path:"/docs",render:ie,init:re},{path:"/funding",render:le,init:ce},{path:"/receipts",render:de,init:pe},{path:"/receipts/:id",render:ue,init:me}],X=new G(Ae);window.router=X;window.app={openAccessModal:function(){const e=document.getElementById("modal-access-backdrop"),t=document.getElementById("modal-access");e.classList.remove("hidden"),t.classList.remove("hidden"),setTimeout(()=>{e.classList.remove("opacity-0"),t.classList.remove("scale-95","opacity-0"),t.classList.add("scale-100","opacity-100")},10)},closeAccessModal:function(){const e=document.getElementById("modal-access-backdrop"),t=document.getElementById("modal-access");e.classList.add("opacity-0"),t.classList.add("scale-95","opacity-0"),t.classList.remove("scale-100","opacity-100"),setTimeout(()=>{e.classList.add("hidden"),t.classList.add("hidden")},300)},handleAuthClick:function(){p.isLoggedIn?window.router.navigate("/profile"):window.app.openAccessModal()},handleInitiate:function(){p.isLoggedIn?window.router.navigate("/contracts"):window.app.openAccessModal()},handleLoginSubmit:async function(){const e=document.getElementById("btn-login-submit"),t=document.getElementById("login-email"),n=(t==null?void 0:t.value)||"demo@collateral.market",i=e.innerText;e.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>',e.disabled=!0;try{const s=await D.devLogin(n);p.isLoggedIn=!0,p.username="@"+n.split("@")[0],p.userId=s.userId,window.app.closeAccessModal(),z()}catch(s){console.error("Login failed:",s),alert("Login failed: "+(s.message||"Unknown error"))}finally{e.innerText=i,e.disabled=!1}},goToCreateIdentity:function(){window.app.closeAccessModal(),setTimeout(()=>{window.app.openCreateModal()},350)},openCreateModal:function(){const e=document.getElementById("modal-create-backdrop"),t=document.getElementById("modal-create");e.classList.remove("hidden"),t.classList.remove("hidden"),setTimeout(()=>{e.classList.remove("opacity-0"),t.classList.remove("scale-95","opacity-0"),t.classList.add("scale-100","opacity-100")},10)},closeCreateModal:function(){const e=document.getElementById("modal-create-backdrop"),t=document.getElementById("modal-create");e.classList.add("opacity-0"),t.classList.add("scale-95","opacity-0"),t.classList.remove("scale-100","opacity-100"),setTimeout(()=>{e.classList.add("hidden"),t.classList.add("hidden")},300)},handleCreateAccount:async function(){const e=document.getElementById("btn-create-submit"),t=document.getElementById("create-email"),n=document.getElementById("create-displayname").value,i=(t==null?void 0:t.value)||n+"@collateral.market",s=e.innerText;e.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>',e.disabled=!0;try{console.log("[App] Creating account with email:",i);const o=await D.devLogin(i);console.log("[App] Account created, token stored:",!!D.getAuthToken()),p.isLoggedIn=!0,p.username="@"+(n||i.split("@")[0]),p.userId=o.userId,window.app.closeCreateModal(),z()}catch(o){console.error("Account creation failed:",o),alert("Account creation failed: "+(o.message||"Unknown error"))}finally{e.innerText=s,e.disabled=!1}},handleSignOut:function(){D.logout(),p.isLoggedIn=!1,p.username=null,p.userId=null,z(),window.router.navigate("/overview")},toggleMenuPersistence:function(e){e.stopPropagation();const t=document.getElementById("user-dropdown-content");t&&t.classList.toggle("!block")},connectSource:function(e){const t=document.getElementById(e+"-btn"),n=document.getElementById(e+"-status");document.getElementById("source-"+e),t&&(t.innerText,t.innerHTML='<div class="w-3 h-3 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin"></div>',t.disabled=!0,setTimeout(()=>{var o,u;p.connectedSources[e]=!0;const i={twitter:"@"+(((o=p.username)==null?void 0:o.replace("@",""))||"user"),github:((u=p.username)==null?void 0:u.replace("@",""))||"user",stripe:"acct_"+Math.random().toString(36).substr(2,6)};if(n.textContent=i[e]+" • Connected",n.classList.remove("text-neutral-400"),n.classList.add("text-neutral-500"),t.outerHTML=`
                <span class="flex items-center gap-1.5 text-[#1F7A4D] text-[11px] font-mono uppercase">
                    <i data-lucide="check-circle" class="w-4 h-4"></i>
                    Verified
                </span>
            `,window.lucide&&window.lucide.createIcons(),Object.values(p.connectedSources).some(m=>m)){const m=document.getElementById("sources-alert");m&&m.classList.add("hidden")}},1500))},openCardModal:function(){const e=document.getElementById("modal-card-backdrop"),t=document.getElementById("modal-card");e.classList.remove("hidden"),t.classList.remove("hidden"),setTimeout(()=>{e.classList.remove("opacity-0"),t.classList.remove("scale-95","opacity-0"),t.classList.add("scale-100","opacity-100")},10),window.lucide&&window.lucide.createIcons()},closeCardModal:function(){const e=document.getElementById("modal-card-backdrop"),t=document.getElementById("modal-card");e.classList.add("opacity-0"),t.classList.add("scale-95","opacity-0"),t.classList.remove("scale-100","opacity-100"),setTimeout(()=>{e.classList.add("hidden"),t.classList.add("hidden"),document.getElementById("card-number").value="",document.getElementById("card-expiry").value="",document.getElementById("card-cvc").value=""},300)},addCard:function(){window.app.openCardModal()},confirmCardSetup:function(){const e=document.getElementById("btn-card-submit"),t=document.getElementById("card-number").value,n=document.getElementById("card-expiry").value,i=document.getElementById("card-cvc").value;if(!t||!n||!i)return;const s=e.innerHTML;e.innerHTML='<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>',e.disabled=!0,setTimeout(()=>{const o=t.replace(/\s/g,"").slice(-4),u=document.getElementById("card-status"),m=document.getElementById("add-card-btn");u&&(u.textContent=`•••• •••• •••• ${o} • Active`,u.classList.remove("text-neutral-400"),u.classList.add("text-neutral-500")),m&&(m.innerHTML="Remove",m.onclick=()=>window.app.removeCard()),p.hasCard=!0,p.cardLast4=o,window.app.closeCardModal(),e.innerHTML=s,e.disabled=!1},1500)},removeCard:function(){const e=document.getElementById("add-card-btn"),t=document.getElementById("card-status");t.textContent="No card on file",t.classList.remove("text-neutral-500"),t.classList.add("text-neutral-400"),e.innerHTML="Add Card",e.onclick=()=>window.app.addCard(),p.hasCard=!1,p.cardLast4=null,e.innerHTML="Add Card",e.onclick=()=>window.app.addCard()},setupPayout:function(){const e=document.getElementById("setup-payout-btn"),t=document.getElementById("payout-status");e&&(e.innerHTML='<div class="w-3 h-3 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin"></div>',e.disabled=!0,setTimeout(()=>{t.textContent="Bank account ••••6789 • Active",t.classList.remove("text-neutral-400"),t.classList.add("text-neutral-500"),e.innerHTML="Update",e.disabled=!1},2e3))},openSettingsModal:function(){const e=document.getElementById("modal-settings-backdrop"),t=document.getElementById("modal-settings");e.classList.remove("hidden"),t.classList.remove("hidden"),setTimeout(()=>{e.classList.remove("opacity-0"),t.classList.remove("scale-95","opacity-0"),t.classList.add("scale-100","opacity-100")},10);const n=document.getElementById("settings-username");n&&p.username&&(n.textContent=p.username),window.app.populateSettingsSources(),window.lucide&&window.lucide.createIcons(),window.app.initSettingsTabs()},closeSettingsModal:function(){const e=document.getElementById("modal-settings-backdrop"),t=document.getElementById("modal-settings");e.classList.add("opacity-0"),t.classList.add("scale-95","opacity-0"),t.classList.remove("scale-100","opacity-100"),setTimeout(()=>{e.classList.add("hidden"),t.classList.add("hidden"),window.app.switchSettingsTab("account")},300)},initSettingsTabs:function(){document.querySelectorAll(".settings-tab").forEach(t=>{t.onclick=()=>{const n=t.getAttribute("data-settings-tab");window.app.switchSettingsTab(n)}})},switchSettingsTab:function(e){const t=document.querySelectorAll(".settings-tab"),n=document.querySelectorAll(".settings-panel");t.forEach(o=>{o.classList.remove("bg-neutral-100","bg-red-50","text-neutral-900"),o.classList.add("text-neutral-500"),o.getAttribute("data-settings-tab")==="danger"&&(o.classList.add("text-[#B91C1C]"),o.classList.remove("text-neutral-500"))});const i=document.querySelector(`[data-settings-tab="${e}"]`);i&&(e==="danger"?i.classList.add("bg-red-50"):(i.classList.add("bg-neutral-100","text-neutral-900"),i.classList.remove("text-neutral-500"))),n.forEach(o=>o.classList.add("hidden"));const s=document.getElementById("settings-panel-"+e);s&&s.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()},populateSettingsSources:function(){var n,i,s;const e=document.getElementById("settings-sources-list");if(!e)return;const t=[{id:"stripe",name:"Stripe",icon:"credit-card",connected:(n=p.connectedSources)==null?void 0:n.stripe},{id:"github",name:"GitHub",icon:"github",connected:(i=p.connectedSources)==null?void 0:i.github},{id:"twitter",name:"X (Twitter)",icon:"twitter",connected:(s=p.connectedSources)==null?void 0:s.twitter}];e.innerHTML=t.map(o=>`
            <div class="border border-neutral-200 p-4 rounded-[2px] flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-neutral-100 rounded flex items-center justify-center">
                        <i data-lucide="${o.icon}" class="w-5 h-5 text-neutral-500"></i>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-neutral-900">${o.name}</p>
                        <p class="font-mono text-[10px] ${o.connected?"text-[#1F7A4D]":"text-neutral-400"} flex items-center gap-1">
                            ${o.connected?'<span class="w-1.5 h-1.5 bg-[#1F7A4D] rounded-full"></span> CONNECTED':"• DISCONNECTED"}
                        </p>
                    </div>
                </div>
                <button onclick="window.app.${o.connected?"disconnect":"connect"}Source('${o.id}')" class="px-3 py-1.5 border border-neutral-200 text-[11px] font-mono uppercase tracking-wide text-neutral-600 hover:border-neutral-400 transition-colors">
                    ${o.connected?"Disconnect":"Connect"}
                </button>
            </div>
        `).join(""),window.lucide&&window.lucide.createIcons()},disconnectSource:function(e){p.connectedSources[e]=!1,window.app.populateSettingsSources()}};function z(){const e=document.getElementById("btn-auth"),t=document.getElementById("user-menu");p.isLoggedIn&&e&&t?(e.classList.add("hidden"),t.classList.remove("hidden"),document.getElementById("menu-username").innerText=p.username):e&&t&&(e.classList.remove("hidden"),t.classList.add("hidden"))}const Fe=["/contracts","/my-contracts","/profile","/funding"];X.onRouteChange=function(e,t){if(Fe.some(o=>t===o||t.startsWith(o+"/"))&&!p.isLoggedIn){window.app.openAccessModal(),window.location.hash="/overview";return}const i=document.getElementById("header-mount");i.innerHTML=W(t);const s=document.getElementById("app");s.innerHTML=e.render(e.params),e.init&&setTimeout(()=>e.init(),0),window.lucide&&setTimeout(()=>window.lucide.createIcons(),10),z()};window.location.hash||(window.location.hash="/overview");
