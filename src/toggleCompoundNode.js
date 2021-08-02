export default function toggleCompoundNode(node) {
    let compoundNode = node;
    if (node.isChild()) compoundNode = node.parent();

    let removed = this.cy.remove(compoundNode.children());

    if (removed == 0) {
        let center = {};
        center.x = node.position('x');
        center.y = node.position('y');

        this.cy.add(this.removedTransactions[node.id()]);

        let curParentPos = node.position();

        node.shift({ x: center.x - curParentPos.x, y: center.y - curParentPos.y });

        this.options.onExpandCompoundNode(compoundNode);
    } else {
        this.removedTransactions[compoundNode.id()] = removed;
        this.options.onCollapseCompoundNode(compoundNode);
    }
}
