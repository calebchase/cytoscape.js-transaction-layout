import squareUpNodes from './squareUpNodes';

function getNodeCenterPos(a, b) {
    let aPos = a.position();
    let bPos = b.position();

    return {
        x: (aPos.x + bPos.x) / 2,
        y: (aPos.y + bPos.y) / 2,
    };
}

function compoundTransactions(id) {
    let removedEdges = this.cy.remove(
        this.cy.nodes(`#${id}`).connectedEdges(`[source = "${id}"][type != "compoundEdge"]`)
    );
    let targetWidthPair = {};

    removedEdges.forEach((edge) => {
        targetWidthPair[edge.target().id()] = edge.style('width');
    });

    let compoundNodes = [];
    let compoundEles = this.cy.collection();

    this.persons[id].targetSet.forEach((target) => {
        let col = cy.collection();
        let colCount = 0;

        let parentNode = this.cy.add([
            {
                group: 'nodes',
                data: {
                    type: 'cpn',
                },
            },
        ]);

        let newCompEdges = this.cy.add([
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

        newCompEdges.forEach((edge) => {
            edge.style({
                width: targetWidthPair[target.id()],
                'arrow-scale': 1,
            });
        });

        compoundNodes.push(parentNode);
        compoundEles = compoundEles.union(parentNode);

        let center = getNodeCenterPos(this.cy.getElementById(id), target);

        let curParentPos = parentNode.position();
        this.persons[id].compoundEles = compoundEles;

        parentNode.shift({ x: center.x - curParentPos.x, y: center.y - curParentPos.y });

        this.persons[id].transactionsTo[target.id()].forEach((transaction) => {
            colCount++;
            col.merge(transaction);
            transaction._private.data['parent'] = parentNode.id();
            cy.add(transaction);
        });

        squareUpNodes.call(this, col, colCount, this.cy);

        this.curParentPos = parentNode.position();
        parentNode.shift({ x: center.x - curParentPos.x, y: center.y - curParentPos.y });
    });
}

function updateEdgeWidth(id) {
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
            width: this.options.edgeWidthFunc(count),
        });

        this.persons[id].removed = this.persons[id].removed.union(removed);
    });
}

export default function collapseTransactions(id, run, initCol) {
    if (this.persons[id].removed.length == 0) {
        updateEdgeWidth.call(this, id);
        this.cy.remove(this.persons[id].compoundEles);
    } else {
        compoundTransactions.call(this, id, initCol);
        this.persons[id].removed = this.cy.collection();
    }
    if (run) this.runForceLayout();
}
