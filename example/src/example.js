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
        forceLayoutOptions: {
            name: 'fcose',
            quality: 'proof',
            animate: false,
            numIter: 25000,

            nodeRepulsion: (node) => 2500000,

            idealEdgeLength: (edge) => {
                let count = edge.data('count');
                return 30000 / (count != undefined ? 20 : 45);
            },
            edgeElasticity: (edge) => 10.75,
            nodeSeparation: 3000,
            // gravityRangeCompound: 10000,
            // gravityCompound: 10000.0,
        },
    });
    layoutTrans.run();

    cy.cxtmenu({
        selector: 'core',

        commands: [
            {
                content: 'Force Layout',
                select: function (ele) {
                    layoutTrans.runForceLayout();
                },
            },
        ],
    });

    cy.cxtmenu({
        selector: 'node',

        commands: [
            {
                content: 'Compound',
                select: function (ele) {
                    layoutTrans.compoundTransactions(ele.id());
                },
            },
            {
                content: 'Toggle Collapse',
                select: function (ele) {
                    layoutTrans.collapseTransactions(ele.id());
                },
            },
        ],
    });
});
