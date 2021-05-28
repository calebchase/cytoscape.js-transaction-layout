fs = require('fs');

let options = {
    personCount: 10,
    personInteractionPercent: 0.2,
    transactionRange: [4, 10],
};

let eles = [];

function getRandomIntInRange(range) {
    let a = range[0],
        b = range[1];
    return Math.floor(Math.random() * (b - a + 1)) + b;
}

function doCreateTransactions(options) {
    if (Math.random() < options.personInteractionPercent) return true;
    return false;
}

function createTransactions(eles, options, i, j) {
    let transactionCount = getRandomIntInRange(options.transactionRange);

    for (let k = 0; k < transactionCount; k++) {
        eles.push({
            group: 'nodes',
            data: { id: `${i}:${j}:${k}`, type: 'transaction' },
        });

        eles.push({
            group: 'edges',
            data: {
                source: `${i}`,
                target: `${i}:${j}:${k}`,
            },
        });

        eles.push({
            group: 'edges',
            data: {
                source: `${i}:${j}:${k}`,
                target: `${j}`,
            },
        });
    }
    return eles;
}

function createNode(eles, i) {
    eles.push({
        group: 'nodes',
        data: { id: `${i}`, type: 'person' },
    });

    return eles;
}

for (let i = 0; i < options.personCount; i++) {
    eles = createNode(eles, i);

    for (let j = 0; j < options.personCount; j++) {
        if (i == j) continue;

        if (doCreateTransactions(options)) {
            eles = createTransactions(eles, options, i, j);
        }
    }
}

fs.writeFile(`../example/src/testData.txt`, JSON.stringify(eles), function (err) {
    if (err) return console.log(err);
});
