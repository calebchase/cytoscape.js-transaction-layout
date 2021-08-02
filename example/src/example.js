import cytoscape from 'cytoscape';
import fcose from 'cytoscape-fcose';
import cxtmenu from 'cytoscape-cxtmenu';
import { register as htmlnode } from 'cytoscape-html-node';
import { register as transactionLayout } from './../../src';
import exampleData from './testData.txt';

cytoscape.use(fcose);
cytoscape.use(transactionLayout);
cytoscape.use(cxtmenu);
cytoscape.use(htmlnode);

document.addEventListener('DOMContentLoaded', function () {
    var cy = (window.cy = cytoscape({
        container: document.getElementById('cy'),
        autounselectify: 'true',
        style: [
            {
                selector: 'node',
                css: {
                    content: ' ',
                },
                style: {
                    content: '',
                    'background-color': 'lightgrey',
                    shape: 'round-rectangle',
                    width: 100,
                    height: 100,
                },
            },
            {
                selector: 'edge',
                style: {
                    'curve-style': 'bezier',
                    'target-arrow-shape': 'triangle',
                    'arrow-scale': 2,
                    width: 5,
                },
            },
            {
                selector: '.htmlNodeBaseStyle',
                style: {
                    'background-color': 'lightgrey',
                },
            },
            {
                selector: '.htmlNodeAltStyle',
                style: {
                    'background-color': 'blue',
                },
            },
            {
                selector: '.transaction',
                style: {
                    label: 'data(id)',
                    'background-image': 'https://pic.onlinewebfonts.com/svg/img_262195.png',
                    'background-fit': 'contain',
                    'background-color': 'lightgreen',
                },
            },
        ],
        elements: {
            nodes: [],
            edges: [],
        },
    }));

    cy.add(JSON.parse(exampleData));

    const htmlnode = cy.htmlnode();
    htmlnode.createHtmlNode(cytoscape, cy, {
        test: {
            query: '[type = "cpn"]',
            nodeStyle: {
                base: 'htmlNodeBaseStyle',
                alt: 'htmlNodeAltStyle',
            },
            template: [
                {
                    zoomRange: [0.001, 1000],

                    template: {
                        html: `
                        <div id="htmlLabel:#{data.id}" style="width: 70px;text-align:center;font-size:60"class="">
                            <div style="background-color:lightblue">#{data.w1}<\div>
                            <div style="background-color:lightpink">#{data.w2}<\div>
                            <div style="background-color:lightgreen">#{data.w3}<\div>
                        </div>
                        `,
                        cssClass: '',
                    },
                },
            ],
        },
        person: {
            query: "[type = 'person']",
            nodeStyle: {
                base: 'htmlNodeBaseStyle',
                alt: 'htmlNodeAltStyle',
            },
            template: [
                {
                    zoomRange: [0.1, 0.5],

                    template: {
                        html: `<div id="htmlLabel:#{data.id}" class="">
                        <div class=" largeFont">#{data.longName}</div>
                        <img src="./images/#{data.image}" loading="lazy">
                        </div>`,
                        cssClass: 'htmlPerson',
                    },
                },
                {
                    zoomRange: [0.5, 1.5],
                    template: {
                        html: `<div id="htmlLabel:#{data.id}" class="cardField">
                        <div class="cardField">
                        <i class="material-icons iconHeight">person</i>
                        <span class="">#{data.shortName}</span>
                        </div>
                        <img src="./images/#{data.image}" loading="lazy">

                        <div class="">#{data.shortSum}</div>
                        </div>`,
                        cssClass: 'htmlPerson',
                    },
                },
                {
                    zoomRange: [1.5, 100],
                    template: {
                        html: `<div id="htmlLabel:#{data.id}" class="cardField">
                        <div class="cardField">
                        <i class="material-icons iconHeight smallFont">person</i>
                        <span class="smallFont">#{data.longName}</span>
                        </div>
                        <img src="./images/#{data.image}" loading="lazy">
                        <div class="smallFont">#{data.longSum}</div>
                        </div>`,
                        cssClass: 'htmlPerson',
                    },
                },
            ],
        },
    });

    cy.nodes().forEach(function (ele) {
        if (ele.data('type') == 'person') ele.addClass('person');
        else ele.addClass('transaction');
    });

    let layoutTrans = cy.layout({
        name: 'transaction',

        onCollapseCompoundNode: (compoundNode) => {
            document.getElementById('htmlLabel:' + compoundNode.data('id')).style.display = 'block';

            compoundNode.connectedEdges().forEach((edge) => {
                edge.data('collapsed', true);
            });
        },
        onExpandCompoundNode: (compoundNode) => {
            document.getElementById('htmlLabel:' + compoundNode.data('id')).style.display = 'none';

            compoundNode.connectedEdges().forEach((edge) => {
                edge.data('collapsed', false);
            });
        },

        edgeWidthFunc: (transactionCount) => {
            return transactionCount * 1.5;
        },

        transactionsCompareTo: (a, b) => {
            return a.data('weight') - b.data('weight');
        },

        parentSelector: '[type = "person"]',
        transactionSelector: '[type = "transaction"]',

        forceLayoutOptions: {
            name: 'fcose',
            quality: 'proof',
            animationDuration: 300,
            animate: false,
            numIter: 50000,
            sampleSize: 50,

            nodeRepulsion: () => {
                return 300000;
            },

            gravityRangeCompound: 100.5,
            gravityCompound: 100.0,

            idealEdgeLength: (edge) => {
                if (edge.data('collapsed') == true) return 30000 / 55;
                return 30000 / 80;
            },

            edgeElasticity: () => 0.75,

            nodeSeparation: 4000,
        },
    });

    layoutTrans.run();

    cy.cxtmenu({
        selector: 'core',

        commands: [
            {
                content: 'Force Layout',
                select: function () {
                    layoutTrans.runForceLayout({
                        randomize: false,
                        fit: false,
                    });
                },
            },
        ],
    });

    cy.on('tap', 'node[type != "person"]', (event) => {
        layoutTrans.toggleCompoundNode(event.target);
        layoutTrans.runForceLayout({
            randomize: false,
            fit: false,
        });
    });

    cy.nodes('[type = "transaction"]').forEach((transaction) => {
        let parentNode = transaction.parent();
        if (transaction.data('weight') == 4) transaction.style('background-color', 'lightblue');
        else if (transaction.data('weight') == 5)
            transaction.style('background-color', 'lightpink');

        if (transaction.data('weight') == 4)
            parentNode.data('w1', (parentNode.data('w1') || 0) + 1);
        else if (transaction.data('weight') == 5)
            parentNode.data('w2', (parentNode.data('w2') || 0) + 1);
        else if (transaction.data('weight') == 6)
            parentNode.data('w3', (parentNode.data('w3') || 0) + 1);
    });

    setTimeout(function () {
        cy.nodes('[type = "cpn"]').forEach((node) => {
            document.getElementById('htmlLabel:' + node.data('id')).style.display = 'none';
        });
    }, 100);
});
