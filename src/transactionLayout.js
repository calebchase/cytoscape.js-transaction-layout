function getTransactions(person, cy) {
    let data = {
        transactions: [],
        size: 0,
        targetSet: new Set(),
        transactionsTo: {},
        removed: cy.collection(),
    };

    person.connectedEdges(`[source = "${person.id()}"]`)?.forEach((edge) => {
        let transaction = edge.target();
        let target = transaction?.connectedEdges(`[source = "${transaction.id()}"]`).target();

        data.transactions.push(transaction);
        data.targetSet.add(target);

        if (data.transactionsTo[target.id()] == undefined) {
            data.transactionsTo[target.id()] = [];
            data.transactionsTo[target.id()].push(transaction);
        } else {
            data.transactionsTo[target.id()].push(transaction);
        }
    });

    return data;
}

function appendConstraint(baseData, newData) {
    newData.forEach((data) => {
        baseData.push(data);
    });
    return newData;
}

function squareUpNodes(eles, count, forceLayout, center) {
    let dim = Math.ceil(Math.sqrt(count));
    let verticalConstraints = [];
    let horizontalConstraints = [];
    let eleIndex = 0;
    let constraint = [];

    eles = eles.filter('node');
    let initIndex = eles[0].position();
    let offset = 100;

    for (let i = 0; i < dim; i++) {
        let horiConst = [];

        for (let j = 0; j < dim && eleIndex < count; j++) {
            eles[eleIndex].position({ x: initIndex.x + offset * i, y: initIndex.y + offset * j });
            constraint.push({
                nodeId: eles[eleIndex].id(),
                position: eles[eleIndex].position(),
            });
            horiConst.push(eles[eleIndex].id());
            eleIndex++;
        }
        horizontalConstraints.push(horiConst);
    }
    // appendConstraint(forceLayout.options.alignmentConstraint.horizontal, horizontalConstraints);

    eleIndex = 0;
    for (let i = 0; i < dim; i++) {
        let vertConst = [];
        for (let j = 0; j < dim; j++) {
            eleIndex++;
            if (horizontalConstraints[j][i] != undefined)
                vertConst.push(horizontalConstraints[j][i]);
        }
        verticalConstraints.push(vertConst);
    }

    let relA = [];
    let relB = [];
    for (let i = 0; i < dim; i++) {
        let vertConst = [];
        for (let j = 0; j < dim; j++) {
            eleIndex++;
            if (
                horizontalConstraints[i][j] != undefined &&
                horizontalConstraints[i][j + 1] != undefined
            )
                relA.push({
                    left: horizontalConstraints[i][j],
                    right: horizontalConstraints[i][j + 1],
                    gap: 100,
                });

            if (
                i + 1 < dim &&
                horizontalConstraints[i][j] != undefined &&
                horizontalConstraints[i + 1][j] != undefined
            )
                relB.push({
                    top: horizontalConstraints[i][j],
                    bottom: horizontalConstraints[i + 1][j],
                    gap: 100,
                });
        }
    }
    return constraint;
    // appendConstraint(forceLayout.options.relativePlacementConstraint, relA);
    // appendConstraint(forceLayout.options.relativePlacementConstraint, relB);
    // appendConstraint(forceLayout.options.alignmentConstraint.vertical, verticalConstraints);
}

function getNodeCenterPos(a, b) {
    let aPos = a.position();
    let bPos = b.position();

    return {
        x: (aPos.x + bPos.x) / 2,
        y: (aPos.y + bPos.y) / 2,
    };
}

class transactionLayout {
    constructor(cy, options) {
        this.cy = cy;
        this.options = options;
    }

    initData() {
        this.persons = {};

        this.cy.nodes().forEach((node) => {
            if (node.data('type') == 'person') {
                this.persons[node.id()] = getTransactions(node, this.cy);
            }
        });

        for (let person in this.persons) {
            this.collapseTransactions(person);
        }
    }

    compoundTrnasactions(id, query) {
        this.cy.remove(this.cy.nodes(`#${id}`).connectedEdges(`[source = "${id}"]`));
        let compoundNodes = [];

        this.persons[id].targetSet.forEach((target) => {
            let col = cy.collection();
            let colCount = 0;

            let parentNode = this.cy.add([
                {
                    group: 'nodes',
                    data: { cw: true },
                },
            ]);

            this.cy.add([
                {
                    group: 'edges',
                    data: {
                        source: `${id}`,
                        target: `${parentNode.id()}`,
                    },
                },
                {
                    group: 'edges',
                    data: {
                        source: `${parentNode.id()}`,
                        target: `${target?.id()}`,
                    },
                },
            ]);

            compoundNodes.push(parentNode);
            let center = getNodeCenterPos(this.cy.getElementById(id), target);

            let curParentPos = parentNode.position();
            id;

            parentNode.shift({ x: center.x - curParentPos.x, y: center.y - curParentPos.y });
        });

        let i = 0;
        this.persons[id].targetSet.forEach((target) => {
            let col = cy.collection();
            let colCount = 0;
            let parentNode = compoundNodes[i];

            let center = {};
            center.x = parentNode.position().x;
            center.y = parentNode.position().y;

            this.persons[id].transactionsTo[target.id()].forEach((transaction) => {
                colCount++;
                col.merge(transaction);

                transaction.data('parent', parentNode.id());
                transaction.data('compound', true);
                transaction._private.data['parent'] = parentNode.id();

                cy.add(transaction);
            });
            squareUpNodes(col, colCount, this.options.forceLayout, center);

            let curParentPos = parentNode.position();

            parentNode.shift({ x: center.x - curParentPos.x, y: center.y - curParentPos.y });
            i++;
        });
        this.runForceLayout();
    }

    collapse(id) {
        this.persons[id].targetSet.forEach((target) => {
            let count = 0;
            let removed = this.cy.collection();

            this.persons[id].transactionsTo[target.id()].forEach((transaction) => {
                removed = removed.union(this.cy.remove(transaction));
                count++;
            });

            let newEdge = this.cy.add([
                {
                    group: 'edges',
                    data: {
                        source: `${id}`,
                        target: `${target.id()}`,
                    },
                },
            ]);

            newEdge.style({
                width: count * 1.5,
                label: `${count}`,
                'font-size': 70,
                'arrow-scale': 1,
                'text-background-color': 'white',
                'text-background-opacity': 1,
                'control-point-step-size': 250,
            });

            newEdge.data({
                count: count,
            });

            this.persons[id].removed = this.persons[id].removed.union(removed);
            // this.persons[id].targetSet.delete(target);
        });
    }

    expandTransactions(id, query) {
        this.cy.remove(this.cy.nodes(`#${id}`).connectedEdges(`[source = "${id}"]`));
        this.cy.add(this.persons[id].removed);
    }

    collapseTransactions(id, query) {
        if (this.persons[id].removed.length == 0) {
            this.collapse(id);
        } else {
            this.expandTransactions(id);
            this.persons[id].removed = this.cy.collection();
            this.runForceLayout();
        }
    }

    runForceLayout() {
        this.cy.layout(this.options.forceLayoutOptions).run();

        if (this.options.forceLayoutOptions.fixedNodeConstraint == undefined) {
            let constraints = [];

            this.cy.nodes().forEach((node) => {
                if (node.data('type') == 'person') {
                    constraints.push({
                        nodeId: node.id(),
                        position: node.position(),
                    });
                }
            });
            this.options.forceLayoutOptions.randomize = false;
            // this.options.forceLayoutOptions.fixedNodeConstraint = constraints;
        }
    }
}

function Layout(options) {
    let defaults = {};

    this.cy = options.cy;
    this.options = { ...defaults, ...options };
}

Layout.prototype.run = function () {
    let layout = new transactionLayout(this.cy, this.options);
    layout.initData();
    layout.runForceLayout();

    this.runForceLayout = () => layout.runForceLayout();
    this.collapseTransactions = (id) => layout.collapseTransactions(id);
    this.compoundTransactions = (id) => layout.compoundTrnasactions(id);
};

export { Layout };
