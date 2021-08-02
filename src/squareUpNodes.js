import getInverseList from './getInverseList';

function insertElesInverseList(cy, eles) {
    cy.remove(eles);
    eles = getInverseList(eles);
    cy.add(eles);
}

export default function squareUpNodes(eles, count, cy) {
    let dim = Math.ceil(Math.sqrt(count));
    let initIndex = eles[0].position();
    let offset = 100;
    let posArray = [];

    let compareTo = this.options.transactionsCompareTo;
    eles = eles.filter('node').sort(function (a, b) {
        return compareTo(a, b);
    });

    insertElesInverseList(cy, eles);

    for (let i = 0; i < count; i++) {
        if (i % dim == 0) {
            posArray.push([]);
        }
        posArray[Math.floor(i / dim)].push(eles[i]);
    }

    let relPlacement = [];
    for (let i = 0; i < posArray.length - 1; i++) {
        for (let j = 0; j < posArray.length - 1; j++) {
            posArray[i][j].position({
                x: initIndex.x + offset * i,
                y: initIndex.y + offset * j,
            });

            if (posArray[i][j + 1] != undefined) {
                relPlacement.push({
                    left: posArray[i][j].id(),
                    right: posArray[i][j + 1].id(),
                });
            }

            if (posArray[i + 1][j] != undefined)
                relPlacement.push({
                    top: posArray[i][j].id(),
                    bottom: posArray[i + 1][j].id(),
                });
        }
    }
}
