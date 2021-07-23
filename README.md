cytoscape-transaction-layout
Description
Trilayer is a specialized layout for graphs with a small set of parent nodes and a large set of children nodes. The children nodes are categorized into two types and are able to have multiple parents.

Dependencies
cytoscape: ^3.16.3
Usage instructions
Download the library:

via npm: npm install cytoscape-transaction-layout
via direct download in the repository
ES import:

import cytoscape from 'cytoscape';
import { register as transactionLayout } from 'cytoscape-transaction-layout';

cytoscape.use(cytoscape-trilayer);
CommonJS:

let cytoscape = require('cytoscape');
let layout = require('transactionLayout');

cytoscape.use(layout);

API
Specify an options object with name: 'transactionLayout' to run the layout. All other fields are optional. An example with the default options follows:

let options = {
  name: 'transactionLayout',
  forceLayoutOptions: {
    // Required options for fcose layout
    name: 'fcose',
    quality: 'proof',
    // Remaining options can be set to any value
  },
  callBackCollapse: (compoundNode) => {},
  callBackExpand: (compoundNode) => {}
};

cy.layout(options).run();

