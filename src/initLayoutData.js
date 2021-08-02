function getTransactions(person, cy) {
    let data = {
        transactions: [],
        size: 0,
        targetSet: new Set(),
        transactionsTo: {},
        removed: cy.collection(),
        compoundEles: cy.collection(),
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

export default function initLayoutData() {
    this.cy.nodes(this.options.parentSelector).forEach((node) => {
        this.persons[node.id()] = getTransactions(node, this.cy);
    });

    for (let person in this.persons) {
        this.collapseTransactions(person);
    }
    this.runForceLayout();

    for (let person in this.persons) {
        this.collapseTransactions(person, false, true);
    }

    this.options.forceLayoutOptions.animate = true;
    this.runForceLayout();
}
