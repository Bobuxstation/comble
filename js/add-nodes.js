// Function to add Miner node
function addDistributorNode(name) {
    const id = editor.addNode('Distributor', 0, 1, 100, 100, 'distributor', {}, '<b>Distributor</b>');
    editor.updateNodeDataFromId(id, { name: name, type: 'producer' });
    distributorLoop(id)
}

// Function to add Smelter node
function addSmelterNode() {
    if (8000 > money) return;
    money -= 8000
    
    const id = editor.addNode('Smelter', 2, 1, 300, 100, 'smelter', {}, '<b>Smelter</b>');
    editor.updateNodeDataFromId(id, { name: 'Smelter', type: 'processor' });
    smelterLoop(id)
}

// Function to add Factory node
function addFactoryNode() {
    if (5000 > money) return;
    money -= 5000
    
    const id = editor.addNode('Factory', 2, 1, 500, 100, 'factory', {}, '<b>Factory</b>');
    editor.updateNodeDataFromId(id, { name: 'Factory', type: 'manufacturer' });
    factoryLoop(id)
}

// Function to add Seller node
function addSellerNode() {
    if (15000 > money) return;
    money -= 15000
    
    const id = editor.addNode('Seller', 1, 0, 700, 100, 'seller', {}, '<b>Seller</b>');
    editor.updateNodeDataFromId(id, { name: 'Seller', type: 'distributor' });
    sellerLoop(id)
}

// Function to add Generator node
function addGeneratorNode() {
    if (10000 > money) return;
    money -= 10000
    
    const id = editor.addNode('Seller', 0, 1, 700, 100, 'generator', {}, '<b>Generator</b>');
    editor.updateNodeDataFromId(id, { name: 'Generator', type: 'generator' });
    generatorLoop(id)
}