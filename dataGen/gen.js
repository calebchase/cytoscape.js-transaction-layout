fs = require('fs');

const peopleCount = 7;
const transactionCount = 50;

const transactionMonthRange = 10;

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

let eles = [];

for (let i = 0; i < transactionCount; i++) {
    let peopleInteraction = [];
    while (peopleInteraction.length < 2) {
        let r = Math.floor(Math.random() * peopleCount);
        if (peopleInteraction.indexOf(r) === -1) peopleInteraction.push(r);
    }

    let randomIds = [peopleInteraction[0] + Math.random(), peopleInteraction[1] + Math.random()];

    eles.push({
        group: 'nodes',
        data: { id: randomIds[0].toString(), name: peopleInteraction[0].toString() },
    });

    eles.push({
        group: 'nodes',
        data: { id: randomIds[1].toString(), name: peopleInteraction[1].toString() },
    });

    eles.push({
        group: 'edges',
        data: {
            source: randomIds[0].toString(),
            target: randomIds[1].toString(),
        },
    });
}

fs.writeFile(`../example/src/testData.txt`, JSON.stringify(eles), function (err) {
    if (err) return console.log(err);
});
