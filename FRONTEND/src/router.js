// Simple hash-based router
class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentRoute = null;

        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    navigate(path) {
        window.location.hash = path;
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || '/overview';

        // Check for exact match first
        let route = this.routes.find(r => r.path === hash);

        // Check for parameterized routes (e.g., /contracts/:id)
        if (!route) {
            for (const r of this.routes) {
                if (r.path.includes(':')) {
                    const pattern = r.path.replace(/:(\w+)/g, '([^/]+)');
                    const regex = new RegExp(`^${pattern}$`);
                    const match = hash.match(regex);
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

        this.currentRoute = hash;

        if (this.onRouteChange) {
            this.onRouteChange(route, hash);
        }
    }

    getCurrentPath() {
        return this.currentRoute || '/overview';
    }
}

export { Router };
