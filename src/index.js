import { Layout } from './transactionLayout.js';

function register(cytoscape) {
    if (!cytoscape) {
        console.warn('Attempt to register cytoscape-layoutB with invalid cytoscape instance!');
        return;
    }
    cytoscape('layout', 'transaction', Layout);
}

// auto-register if there is global cytoscape (i.e. window.cytoscape)
if (typeof cytoscape !== 'undefined') {
    register(cytoscape);
}

export { register };
