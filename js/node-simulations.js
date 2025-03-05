// ---------------------------------------------------------
// Node and Item Metadata Here
// ---------------------------------------------------------

var nodeData = {
    ironOreSmelter: {
        type: 'processor',
        name: 'Iron Ore Smelter',
        price: 8_000,
        input: 'itemIronOre',
        output: 'itemIronIngot',
        tex_static: './assets/Gen&Furnace1.png',
        tex_active: './assets/Gen&Furnace2.png',
        timeMin: 100,
        timeMax: 250
    },
    ironFactory: {
        type: 'processor',
        name: 'Iron Factory',
        price: 5_000,
        input: 'itemIronIngot',
        output: 'itemProcessedIron',
        tex_static: './assets/Factory&Mine0.png',
        tex_active: './assets/Factory&Mine0.png',
        timeMin: 100,
        timeMax: 250
    },
}

var supplierData = {
    rawSteelCo: {
        name: 'Raw Steel & Co.',
        interval: 500,
        output: 'itemIronOre',
        tex_static: './assets/Factory&Mine0.png',
        tex_active: './assets/Factory&Mine0.png',
        timeMin: 100,
        timeMax: 250
    },
    koloniSugar: {
        name: 'Koloni Sugar Inc.',
        interval: 500,
        output: 'itemSugar',
        tex_static: './assets/Factory&Mine0.png',
        tex_active: './assets/Factory&Mine0.png',
        timeMin: 100,
        timeMax: 250
    },
    manaraOilCo: {
        name: 'Manara Oil & Co.',
        interval: 500,
        output: 'itemCrudeOil',
        tex_static: './assets/Factory&Mine0.png',
        tex_active: './assets/Factory&Mine0.png',
        timeMin: 100,
        timeMax: 250
    }
}

var itemData = {
    itemIronOre: {
        name: 'Iron Ore',
        price: 10
    },
    itemIronIngot: {
        name: 'Iron Ingot',
        price: 15
    },
    itemProcessedIron: {
        name: 'Processed Iron',
        price: 20
    },
    itemSugar: {
        name: 'Sugar',
        price: 25
    },
    itemCrudeOil: {
        name: 'Crude Oil',
        price: 70
    }
}

// ---------------------------------------------------------
// SIMULATION FUNCTIONS
// ---------------------------------------------------------

// add nodes to marketplace
Object.keys(nodeData).forEach((nodeKey) => {
    let nodePurchaseButton = document.createElement('button');
    let currentNodeData = nodeData[nodeKey];
    nodePurchaseButton.innerHTML = `
        <b>${currentNodeData.name}</b> <br>
        <span>$${currentNodeData.price.toLocaleString()}</span>
    `;
    document.getElementById("store").appendChild(nodePurchaseButton);

    nodePurchaseButton.onclick = function () {
        if (currentNodeData.price > stats['money']) return;
        stats['money'] -= currentNodeData.price

        const id = editor.addNode('Node', 2, 1, 300, 100, 'node', {}, '<b>Node</b>');
        editor.updateNodeDataFromId(id, { name: currentNodeData.name, type: nodeKey, class: 'node' });
        nodeSimulation(id, nodeKey);
    }
})

// add suppliers to marketplace
Object.keys(supplierData).forEach((nodeKey) => {
    let nodePurchaseButton = document.createElement('button');
    let currentNodeData = supplierData[nodeKey];
    nodePurchaseButton.innerHTML = `
        <b>${currentNodeData.name}</b> <br>
        <span>$${itemData[currentNodeData.output].price.toLocaleString()}/${currentNodeData.interval}ms</span>
    `;
    document.getElementById("suppliers").appendChild(nodePurchaseButton);

    nodePurchaseButton.onclick = function () {
        const id = editor.addNode('SupplierNode', 0, 1, 300, 100, 'Suppliernode', {}, '<b>SupplierNode</b>');
        editor.updateNodeDataFromId(id, { name: currentNodeData.name, type: nodeKey, class: 'supplier' });
        supplierSimulation(id, nodeKey);
    }
})

// loop for general nodes
function nodeSimulation(nodeID, nodeDataID) {
    async function loopFunction() {
        // get node data & set element
        var thisNode = editor.getNodeFromId(nodeID);
        var powerLevel = (!power[thisNode.id]) ? 0 : (power[thisNode.id])
        var stocksPending = (!pending[thisNode.id]) ? 0 : (pending[thisNode.id])
        var currentNodeData = nodeData[nodeDataID]
        var nodeElem = document.querySelector('#node-' + thisNode.id + ' .drawflow_content_node')
        var newString = `<b>${currentNodeData.name}</b>
                         <br>
                         <i class="fa-solid fa-bolt"></i> ${powerLevel}
                         <i class="fa-solid fa-dolly"></i> ${stocksPending.length | 0}`;
        nodeElem.innerHTML = newString;
        nodeElem.parentNode.style.backgroundImage = `url('${currentNodeData.tex_static}')`
        thisNode.html = newString;

        // simulate node
        for (let i = 0; i < thisNode.outputs.output_1.connections.length; i++) {
            if (powerLevel > 0 && stocksPending.length > 0) {
                let element = thisNode.outputs.output_1.connections[i];

                nodeElem.parentNode.style.backgroundImage = `url('${currentNodeData.tex_static}')`
                await new Promise(resolve => setTimeout(resolve, RANDBETWEEN(currentNodeData.timeMin, currentNodeData.timeMax)));
                nodeElem.parentNode.style.backgroundImage = `url('${currentNodeData.tex_active}')`

                if (pending[thisNode.id][0][0] == currentNodeData.input) {
                    power[thisNode.id] -= 1
                    pending[thisNode.id].shift()
                    if (!pending[element.node]) pending[element.node] = [];
                    pending[element.node].push([currentNodeData.output]);
                } else {
                    stats["botched"] += 1
                    power[thisNode.id] -= 1
                    pending[thisNode.id].shift()
                }
            }
        }

        setTimeout(loopFunction, 500);
    }
    loopFunction();
}

// loop for general nodes
function supplierSimulation(nodeID, nodeDataID) {
    async function loopFunction() {
        // get node data & set element
        var thisNode = editor.getNodeFromId(nodeID);
        var currentNodeData = supplierData[nodeDataID]
        var nodeElem = document.querySelector('#node-' + thisNode.id + ' .drawflow_content_node')
        var newString = `<b>${currentNodeData.name}</b>
                         <br>
                         Supplies: ${itemData[currentNodeData.output].name}`;
        nodeElem.innerHTML = newString;
        nodeElem.parentNode.style.backgroundImage = `url('${currentNodeData.tex_static}')`
        thisNode.html = newString;

        // simulate node
        for (let i = 0; i < thisNode.outputs.output_1.connections.length; i++) {
            const itemPrice = itemData[currentNodeData.output].price
            const rect = nodeElem.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top;
            const element = thisNode.outputs.output_1.connections[i];

            nodeElem.parentNode.style.backgroundImage = `url('${currentNodeData.tex_static}')`
            await new Promise(resolve => setTimeout(resolve, RANDBETWEEN(currentNodeData.timeMin, currentNodeData.timeMax)));
            nodeElem.parentNode.style.backgroundImage = `url('${currentNodeData.tex_active}')`
            createFloatingText(`-$${itemPrice}`, x, y, 'red');

            stats['money'] -= itemPrice
            if (!pending[element.node]) pending[element.node] = [];
            pending[element.node].push([currentNodeData.output]);
        }

        setTimeout(loopFunction, 500);
    }
    loopFunction();
}

// loop for generator
function generatorLoop(nodeID) {
    async function loopFunction() {
        var generatorNode = editor.getNodeFromId(nodeID);
        var generatorElem = document.querySelector('#node-' + generatorNode.id + ' .drawflow_content_node')
        generatorElem.parentNode.style.backgroundImage = `url('./assets/Gen&Furnace0.png')`

        for (let i = 0; i < generatorNode.outputs.output_1.connections.length; i++) {
            let element = generatorNode.outputs.output_1.connections[i];
            await new Promise(resolve => setTimeout(resolve, 100));

            if (!power[element.node]) power[element.node] = 0;
            power[element.node] += 1;
        }

        setTimeout(loopFunction, 500);
    }
    loopFunction();
}

// loop for seller
function sellerLoop(nodeID) {
    async function loopFunction() {
        var sellerNode = editor.getNodeFromId(nodeID);
        var stocksPending = (!pending[sellerNode.id]) ? 0 : (pending[sellerNode.id])
        var sellerElem = document.querySelector('#node-' + sellerNode.id + ' .drawflow_content_node')

        sellerElem.parentNode.style.backgroundImage = `url('./assets/Factory&Mine0.png')`
        let newString = `<b>Seller</b>
                         <br>
                         <i class="fa-solid fa-dolly"></i> ${stocksPending.length | 0}`;
        document.querySelector('#node-' + sellerNode.id + ' .drawflow_content_node').innerHTML = newString;
        sellerNode.html = newString;

        for (let i = 0; i < sellerNode.inputs.input_1.connections.length; i++) {
            if (stocksPending.length > 0) {
                const itemPrice = itemData[pending[sellerNode.id][0]].price
                const rect = sellerElem.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top;
                await new Promise(resolve => setTimeout(resolve, 100));
                createFloatingText(`+$${itemPrice}`, x, y, 'green');

                pending[sellerNode.id].shift()
                stats['money'] += itemPrice
                stats['sold'] += itemPrice;
            };
        }

        setTimeout(loopFunction, 500);
    }
    loopFunction();
}

// ---------------------------------------------------------
// HARDCODED NODES
// ---------------------------------------------------------

// add Seller node
function addSellerNode() {
    if (15000 > stats['money']) return;
    stats['money'] -= 15000

    const id = editor.addNode('Seller', 1, 0, 700, 100, 'seller', {}, '<b>Seller</b>');
    editor.updateNodeDataFromId(id, { name: 'Seller', type: 'distributor' });
    sellerLoop(id)
}

// add Generator node
function addGeneratorNode() {
    if (10000 > stats['money']) return;
    stats['money'] -= 10000

    const id = editor.addNode('Seller', 0, 1, 700, 100, 'generator', {}, '<b>Generator</b>');
    editor.updateNodeDataFromId(id, { name: 'Generator', type: 'generator' });
    generatorLoop(id)
}