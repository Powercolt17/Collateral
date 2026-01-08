export function StatusBar() {
    return (
        <div className="fixed bottom-0 w-full bg-neutral-50 border-t border-neutral-200 py-2 px-6 flex justify-between items-center z-40 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            <div className="flex items-center gap-4">
                <span className="text-neutral-900 font-medium">System Status</span>
                <span className="flex items-center gap-1.5 text-brand-green">
                    <span className="w-1.5 h-1.5 bg-brand-green rounded-full"></span>
                    Operational
                </span>
            </div>
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 text-neutral-400">
                All contracts settle publicly. Outcomes are permanent.
            </div>
            <div className="flex items-center gap-4">
                <span className="hover:text-neutral-900 cursor-pointer transition-colors">Docs</span>
            </div>
        </div>
    );
}
