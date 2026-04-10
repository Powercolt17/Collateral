// Clean URL router using History API (no hash)
class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentRoute = null;

        window.addEventListener('popstate', () => this.handleRoute());

        // Handle initial load
        window.addEventListener('load', () => {
            // If someone arrives with a hash URL, redirect to clean URL
            if (window.location.hash && window.location.hash.startsWith('#/')) {
                const cleanPath = window.location.hash.slice(1);
                window.history.replaceState(null, '', cleanPath);
            }
            this.handleRoute();
        });
    }

    navigate(path) {
        window.history.pushState(null, '', path);
        this.handleRoute();
    }

    handleRoute() {
        const raw = window.location.pathname || '/overview';

        // Strip query string before matching routes
        const pathname = raw.split('?')[0];

        // Default root to /overview
        if (pathname === '/') {
            window.history.replaceState(null, '', '/overview');
            this.handleRoute();
            return;
        }

        // Check for exact match first
        let route = this.routes.find(r => r.path === pathname);

        // Check for parameterized routes (e.g., /contracts/:id)
        if (!route) {
            for (const r of this.routes) {
                if (r.path.includes(':')) {
                    const pattern = r.path.replace(/:(\w+)/g, '([^/]+)');
                    const regex = new RegExp(`^${pattern}$`);
                    const match = pathname.match(regex);
                    if (match) {
                        route = { ...r, params: { id: match[1] } };
                        break;
                    }
                }
            }
        }

        if (!route) {
            // Default to overview
            this.navigate('/overview');
            return;
        }

        this.currentRoute = pathname;
        window.scrollTo(0, 0);

        if (this.onRouteChange) {
            this.onRouteChange(route, pathname);
        }
    }

    getCurrentPath() {
        return this.currentRoute || '/overview';
    }
}

export { Router };
