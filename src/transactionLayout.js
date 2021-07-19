function getSquareTranspose(eles, cy) {
    // count = eles.length;
    let count = eles.length;
    let curSide = 0;
    let curArrDim = 2;
    let arrDim = Math.ceil(Math.sqrt(count));
    let isSquare = arrDim == Math.sqrt(count);

    let arr = [];
    for (let i = 0; i < arrDim + 1; i++) arr.push([]);

    let eleIndex = 0;
    for (let i = 0; eleIndex < count; i++) {
        let stuff = '';
        console.log(i);
        for (let j = 0; j < arrDim; j++) {
            if (
                i != 0 &&
                count - eleIndex - 1 != 0 &&
                (count - eleIndex) % (arrDim - 1) == 0 &&
                !isSquare &&
                j + 1 == arrDim
            ) {
                // i++;
                continue;
            } else if (eleIndex < count) {
                arr[i][j] = eles[eleIndex];
                stuff += eles[eleIndex].id() + '. ';
                eleIndex++;
            }
        }
        console.log(stuff);
    }
    console.table(arr);

    for (let i = 0; i < count; i++) {
        if (i == 0 || i == 1) {
            eles[i] = arr[0][i];
            console.log(0, i);

            // console.log(eles[i].id());
        } else if (curSide % 2 == 0) {
            // insert Bottom
            for (let j = 0; i < count && j < curArrDim; i++ && j++) {
                // console.log(curSide);
                // arr[curSide / 2 + 1].push(eles[i]);
                if (arr[curSide / 2 + 1][j] != undefined) {
                    eles[i] = arr[curSide / 2 + 1][j];
                    console.log(curSide / 2 + 1 + ' ' + j, eles[i].id());
                } else {
                    i--;
                }
            }
            i--;
            curSide++;
        } else {
            // insert left
            for (let j = 0; i < count && j < curArrDim; i++ && j++) {
                // arr[j].push(eles[i]);
                console.log(i, count, j, curArrDim);
                if ((eles[i] = arr[j][curArrDim] != undefined)) eles[i] = arr[j][curArrDim];
                else i--;
                console.log(j + ' ' + curArrDim, eles[i].id());
            }
            i--;
            curSide++;
            curArrDim++;
        }
        // console.table(arr);
    }
    // console.table(arr);
    console.log('adsf');
    eles.forEach((ele) => console.log(ele.id()));
    console.log('adsf');
    return eles;
}

function getBadSquareTranspose(eles) {
    // count = eles.length;
    let count = eles.length;
    let curSide = 0;
    let curArrDim = 2;
    let arrDim = Math.sqrt(count);

    let arr = [];
    for (let i = 0; i < arrDim; i++) arr.push([]);

    for (let i = 0; i < count; i++) {
        if (i == 0 || i == 1) arr[Math.floor(i / arrDim)].push(eles[i]);
        else if (curSide % 2 == 0) {
            // insert Bottom
            for (let j = 0; i < count && j < curArrDim; i++ && j++) {
                console.log(curSide);
                arr[curSide / 2 + 1].push(eles[i]);
            }
            i--;
            curSide++;
        } else {
            // insert left
            for (let j = 0; i < count && j < curArrDim; i++ && j++) {
                arr[j].push(eles[i]);
            }
            i--;
            curSide++;
            curArrDim++;
        }
        // console.table(arr);
    }
    // console.table(arr);
    let eleIndex = 0;

    arr.forEach((subArr) => {
        subArr.forEach((ele) => {
            eles[eleIndex] = ele;
            eleIndex++;
        });
    });
    return eles;
}
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

function getCol(matrix, col) {
    var column = [];
    for (var i = 0; i < matrix.length; i++) {
        if (matrix[i][col] != undefined) column.push(matrix[i][col].id());
    }
    return column;
}

function squareUpNodes(eles, count, cy) {
    let dim = Math.ceil(Math.sqrt(count));
    let initIndex = eles[0].position();
    let offset = 110;
    let eleIndex = 0;
    let verConstraint = [];
    let horConstraint = [];
    eles = eles.filter('node').sort(function (a, b) {
        return a.data('weight') - b.data('weight');
    });
    cy.remove(eles);

    eles = getSquareTranspose(eles);
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    // eles.forEach((ele) => console.log(ele.data('weight')));

    eles.forEach((id) => console.log(id.id()));
    cy.add(eles);

    let posArray = [];

    for (let i = 0; i < count; i++) {
        if (i % dim == 0) {
            posArray.push([]);
        }
        posArray[Math.floor(i / dim)].push(eles[i]);
    }

    for (let i = 0; i < posArray.length - 1; i++) {
        verConstraint.push(posArray[i].map((x) => x.id()));
        for (let j = 0; j < posArray.length; j++) {}
    }

    for (let i = 0; i < posArray.length; i++) {
        for (let j = 0; j < posArray[i].length; j++) {
            horConstraint.push(getCol(posArray, j));
        }
        break;
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

    for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim && eleIndex < count; j++) {
            // eles[eleIndex].position({ x: initIndex.x + offset * i, y: initIndex.y + offset * j });
            if (eles[eleIndex].data('weight') == 4)
                eles[eleIndex].style('background-color', 'lightblue');
            if (eles[eleIndex].data('weight') == 5)
                eles[eleIndex].style('background-color', 'lightpink');
            eleIndex++;
        }
    }

    return {
        rel: relPlacement,
        ver: verConstraint,
        hor: horConstraint,
    };

    return relPlacement;
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
        this.removedTransactions = {};
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
        this.runForceLayout();
        for (let person in this.persons) {
            this.collapseTransactions(person, false, true);
        }
        this.options.forceLayoutOptions.animate = true;
        this.runForceLayout();
    }

    compoundTrnasactions(id, initCol, query) {
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
            if (
                (initCol && this.persons[id].transactionsTo[target.id()].length < 100) ||
                !initCol
            ) {
                let col = cy.collection();
                let colCount = 0;

                let parentNode = this.cy.add([
                    {
                        group: 'nodes',
                        data: {
                            cw: true,
                            type: 'cpn',
                            w1: 1,
                            w2: 0,
                            w3: 0,
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
                    if (transaction.data('weight') == 4)
                        parentNode.data('w1', parentNode.data('w1') + 1);
                    else if (transaction.data('weight') == 5)
                        parentNode.data('w2', parentNode.data('w2') + 1);
                    else if (transaction.data('weight') == 6)
                        parentNode.data('w3', parentNode.data('w3') + 1);
                    else console.error('err');
                    transaction._private.data['parent'] = parentNode.id();

                    cy.add(transaction);
                });

                let nodeConst = squareUpNodes(col, colCount, this.cy);

                // this.options.forceLayoutOptions.relativePlacementConstraint = nodeConst.rel;
                // if (this.options.forceLayoutOptions.alignmentConstraint == undefined) {
                //     this.options.forceLayoutOptions.alignmentConstraint = {};

                //     this.options.forceLayoutOptions.alignmentConstraint.vertical = [];
                //     this.options.forceLayoutOptions.alignmentConstraint.horizontal = [];
                // }
                // this.options.forceLayoutOptions.alignmentConstraint.vertical =
                //     this.options.forceLayoutOptions.alignmentConstraint.vertical.concat(
                //         nodeConst.ver
                //     );
                // this.options.forceLayoutOptions.alignmentConstraint.horizontal =
                //     this.options.forceLayoutOptions.alignmentConstraint.horizontal.concat(
                //         nodeConst.hor
                //     );

                this.curParentPos = parentNode.position();
                parentNode.shift({ x: center.x - curParentPos.x, y: center.y - curParentPos.y });
            } else {
                removedEdges.forEach((edge) => {
                    if (edge.target().id() == target.id()) this.cy.add(edge);
                });
            }
        });
    }

    collapse(id) {
        this.persons[id].targetSet.forEach((target) => {
            let count = 0;
            let removed = this.cy.collection();

            this.persons[id].transactionsTo[target.id()].forEach((transaction) => {
                removed = removed.union(this.cy.remove(transaction));
                count++;
            });

            // let parentNode = this.cy.add([
            //     {
            //         group: 'nodes',
            //         data: { cw: true },
            //     },
            // ]);

            // let newCompEdges = this.cy.add([
            //     {
            //         group: 'edges',
            //         data: {
            //             source: `${id}`,
            //             target: `${parentNode.id()}`,
            //             type: 'compoundEdge',
            //         },
            //     },
            //     {
            //         group: 'edges',
            //         data: {
            //             source: `${parentNode.id()}`,
            //             target: `${target?.id()}`,
            //             type: 'compoundEdge',
            //         },
            //     },
            // ]);

            let newEdge = this.cy.add([
                {
                    group: 'edges',
                    data: {
                        source: `${id}`,
                        target: `${target.id()}`,
                        type: 'long',
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
        });
    }

    expandTransactions(id, query) {
        this.cy.remove(this.cy.nodes(`#${id}`).connectedEdges(`[source = "${id}"]`));
        this.cy.add(this.persons[id].removed);
    }

    collapseTransactions(id, run, initCol) {
        if (this.persons[id].removed.length == 0) {
            this.collapse(id);
            this.cy.remove(this.persons[id].compoundEles);
        } else {
            this.compoundTrnasactions(id, initCol);
            this.persons[id].removed = this.cy.collection();
        }
        if (run) this.runForceLayout();
    }

    collapseCompoundNode(node) {
        let compoundNode = node.parent();
        let removed = this.cy.remove(compoundNode.children());

        if (removed == 0) {
            this.cy.add(this.removedTransactions[node.id()]);

            node.style({
                label: ' ',
            });
            document.getElementById('htmlLabel:' + node.data('id')).style.display = 'none';
            node.connectedEdges().forEach((edge) => edge.data('col', false));
        } else {
            this.removedTransactions[compoundNode.id()] = removed;
            compoundNode.connectedEdges().forEach((edge) => edge.data('col', true));
            compoundNode.style({
                'text-halign': 'center',
                'text-valign': 'center',
                'font-size': 100,
            });
            document.getElementById('htmlLabel:' + compoundNode.data('id')).style.display = 'block';
        }
        this.runForceLayout();
    }

    runForceLayout() {
        this.cy.layout(this.options.forceLayoutOptions).run();

        if (this.options.forceLayoutOptions.fixedNodeConstraint == undefined) {
            // let constraints = [];

            // this.cy.nodes().forEach((node) => {
            //     if (node.data('type') == 'person') {
            //         constraints.push({
            //             nodeId: node.id(),
            //             position: node.position(),
            //         });
            //     }
            // });
            this.options.forceLayoutOptions.randomize = false;
            this.options.forceLayoutOptions.fit = false;
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
    this.runForceLayout = () => layout.runForceLayout();
    this.collapseTransactions = (id, run) => layout.collapseTransactions(id, true, false);
    this.compoundTransactions = (id) => layout.compoundTrnasactions(id);
    this.collapseCompoundNode = (node) => layout.collapseCompoundNode(node);

    layout.initData();
    layout.runForceLayout();
};

export { Layout };
