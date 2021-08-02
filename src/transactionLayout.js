import initLayoutData from './initLayoutData';
import collapseTransactions from './collapseTransactions';
import toggleCompoundNode from './toggleCompoundNode';

class transactionLayout {
    constructor(cy, options) {
        this.cy = cy;
        this.options = options;
        this.removedTransactions = {};
        this.persons = {};
    }

    initData() {
        initLayoutData.call(this);
    }

    collapseTransactions(id, run, initCol) {
        collapseTransactions.call(this, id, run, initCol);
    }

    toggleCompoundNode(node) {
        toggleCompoundNode.call(this, node);
    }

    runForceLayout(options) {
        for (const key in options) {
            this.options.forceLayoutOptions[key] = options[key];
        }
        this.cy.layout(this.options.forceLayoutOptions).run();
    }
}

function Layout(options) {
    let defaults = {
        edgeWidthFunc: (transactionCount) => {
            return transactionCount;
        },
        transactionsCompareTo: (nodeA, nodeB) => {
            return nodeA.data('weight') - nodeB.data('weight');
        },
        parentSelector: '[type = "person"]',
        transactionSelector: '[type = "transaction"]',
        forceLayoutOptions: {
            name: 'fcose',
            quality: 'proof',
            animate: false,
        },
    };
    this.cy = options.cy;
    this.options = { ...defaults, ...options };
    this.options.forceLayoutOptions = {
        ...defaults.forceLayoutOptions,
        ...options.forceLayoutOptions,
    };
}

Layout.prototype.run = function () {
    let layout = new transactionLayout(this.cy, this.options);

    this.runForceLayout = (options) => layout.runForceLayout(options);
    this.toggleCompoundNode = (node) => layout.toggleCompoundNode(node);

    layout.initData();
    layout.runForceLayout();
};

export { Layout };
