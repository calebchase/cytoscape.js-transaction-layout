fs = require('fs');

let shortSum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
let longSum =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sapien ante, tristique nec.';

let personImages = [
    'm1.png',
    'm2.png',
    'm3.png',
    'm4.png',
    'm5.png',
    'm6.png',
    'm7.png',
    'm8.png',
    'f1.png',
    'f2.png',
    'f3.png',
    'f4.png',
    'f5.png',
    'f6.png',
    'f7.png',
    'f8.png',
    'f9.png',
];
let weights = [2, 4];

let names = [
    { f: 'Bobby', l: 'Nelson' },
    { f: 'Larry', l: 'Cooper' },
    { f: 'Howard', l: 'Rivera' },
    { f: 'Ernest', l: 'Baker' },
    { f: 'Manny', l: 'Otto' },
    { f: 'Zack', l: 'Haven' },
    { f: 'Archie', l: 'Ramirez' },
    { f: 'Darryl', l: 'Hammond' },

    { f: 'Cynthia', l: 'Bowen' },
    { f: 'Mable', l: 'Drake' },
    { f: 'Ada', l: 'Nichols' },
    { f: 'Philis', l: 'Lyn' },
    { f: 'Lisa', l: 'Everlee' },
    { f: 'Breana', l: 'Alyse' },
    { f: 'Jan', l: 'King' },
    { f: 'Cathy', l: 'Ingram' },
    { f: 'Kellie', l: 'Maldonado' },
];

let options = {
    personCount: names.length,
    personInteractionPercent: 0.07,
    transactionRange: [10, 15],
};

let eles = [];

function scale(n) {
    if (n > 20) return n;
    if (Math.random() > 0.7) return scale(n * 1.5);
    return n;
}

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
    transactionCount = Math.floor(scale(transactionCount));

    for (let k = 0; k < transactionCount; k++) {
        eles.push({
            group: 'nodes',
            data: {
                id: `${i}:${j}:${k}`,
                type: 'transaction',
                weight: getRandomIntInRange(weights),
            },
        });

        eles.push({
            group: 'edges',
            data: {
                type: 't',
                source: `${i}`,
                target: `${i}:${j}:${k}`,
            },
        });

        eles.push({
            group: 'edges',
            data: {
                type: 't',
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
        data: {
            id: `${i}`,
            type: 'person',
            image: personImages[i],
            shortSum: shortSum,
            longSum: longSum,
            shortName: names[i].l,
            longName: names[i].f + ' ' + names[i].l,
        },
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
