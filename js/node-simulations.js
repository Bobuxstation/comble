function distributorLoop(nodeID) {
    async function loopFunction() {
        var distributorNode = editor.getNodeFromId(nodeID);
        var distributorElem = document.querySelector('#node-' + distributorNode.id + ' .drawflow_content_node')

        distributorElem.parentNode.style.backgroundImage = `url('./assets/Factory&Mine1.png')`
        let newString = `<b>Materials Distributor</b>
                         ${distributorNode.data.name}`;
        document.querySelector('#node-' + distributorNode.id + ' .drawflow_content_node').innerHTML = newString;
        distributorNode.html = newString;

        for (let i = 0; i < distributorNode.outputs.output_1.connections.length; i++) {
            if (money > 0) {
                let element = distributorNode.outputs.output_1.connections[i];
                await new Promise(resolve => setTimeout(resolve, RANDBETWEEN(100, 500)));
                if (editor.getNodeFromId(element.node).class != 'smelter') return;

                if (!pending[element.node]) pending[element.node] = [];
                pending[element.node].push(['test']);

                money -= 1
            };
        }

        setTimeout(loopFunction, 500);
    }
    loopFunction();
}

function generatorLoop(nodeID) {
    async function loopFunction() {
        var generatorNode = editor.getNodeFromId(nodeID);
        var generatorElem = document.querySelector('#node-' + generatorNode.id + ' .drawflow_content_node')

        generatorElem.parentNode.style.backgroundImage = `url('./assets/Gen&Furnace0.png')`

        for (let i = 0; i < generatorNode.outputs.output_1.connections.length; i++) {
            let element = generatorNode.outputs.output_1.connections[i];
            await new Promise(resolve => setTimeout(resolve, RANDBETWEEN(100, 500)));

            if (!power[element.node]) power[element.node] = 0;
            power[element.node] += 1;
        }

        setTimeout(loopFunction, 500);
    }
    loopFunction();
}

function smelterLoop(nodeID) {
    async function loopFunction() {
        var smelterNode = editor.getNodeFromId(nodeID);
        var powerLevel = (!power[smelterNode.id]) ? 0 : (power[smelterNode.id])
        var stocksPending = (!pending[smelterNode.id]) ? 0 : (pending[smelterNode.id])
        var smelterElem = document.querySelector('#node-' + smelterNode.id + ' .drawflow_content_node')

        let newString = `<b>Smelter</b>
                         <br>
                         <i class="fa-solid fa-bolt"></i> ${powerLevel}
                         <i class="fa-solid fa-dolly"></i> ${stocksPending.length | 0}`;
        smelterElem.innerHTML = newString;
        smelterElem.parentNode.style.backgroundImage = `url('./assets/Gen&Furnace1.png')`
        smelterNode.html = newString;

        for (let i = 0; i < smelterNode.outputs.output_1.connections.length; i++) {
            if (powerLevel > 0 && stocksPending.length > 0) {
                let element = smelterNode.outputs.output_1.connections[i];    
                smelterElem.parentNode.style.backgroundImage = `url('./assets/Gen&Furnace2.png')`
                await new Promise(resolve => setTimeout(resolve, RANDBETWEEN(100, 500)));
                smelterElem.parentNode.style.backgroundImage = `url('./assets/Gen&Furnace1.png')`
                if (editor.getNodeFromId(element.node).class != 'factory') return;

                if (!pending[element.node]) pending[element.node] = [];
                pending[element.node].push(['test']);

                power[smelterNode.id] -= 1
                pending[smelterNode.id].shift()
            }
        }

        setTimeout(loopFunction, 500);
    }
    loopFunction();
}

function factoryLoop(nodeID) {
    async function loopFunction() {
        var factoryNode = editor.getNodeFromId(nodeID);
        var powerLevel = (!power[factoryNode.id]) ? 0 : (power[factoryNode.id])
        var stocksPending = (!pending[factoryNode.id]) ? 0 : (pending[factoryNode.id])
        var factoryElem = document.querySelector('#node-' + factoryNode.id + ' .drawflow_content_node')

        factoryElem.parentNode.style.backgroundImage = `url('./assets/Factory&Mine0.png')`
        let newString = `<b>Factory</b>
                         <br>
                         <i class="fa-solid fa-bolt"></i> ${powerLevel}
                         <i class="fa-solid fa-dolly"></i> ${stocksPending.length | 0}`;
        document.querySelector('#node-' + factoryNode.id + ' .drawflow_content_node').innerHTML = newString;
        factoryNode.html = newString;

        for (let i = 0; i < factoryNode.outputs.output_1.connections.length; i++) {
            if (powerLevel > 0 && stocksPending.length > 0) {
                let element = factoryNode.outputs.output_1.connections[i];
                await new Promise(resolve => setTimeout(resolve, RANDBETWEEN(100, 500)));
                if (editor.getNodeFromId(element.node).class != 'seller') return;

                if (!pending[element.node]) pending[element.node] = [];
                pending[element.node].push(['test']);

                power[factoryNode.id] -= 1
                pending[factoryNode.id].shift()
            };
        }

        setTimeout(loopFunction, 500);
    }
    loopFunction();
}

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
                let element = sellerNode.inputs.input_1.connections[i];
                await new Promise(resolve => setTimeout(resolve, RANDBETWEEN(100, 500)));
                if (editor.getNodeFromId(element.node).class != 'factory') return;

                pending[sellerNode.id].shift()
                money += 10

                if (!stats['sold']) stats['sold'] = 0;
                stats['sold'] += 10;
            };
        }

        setTimeout(loopFunction, 500);
    }
    loopFunction();
}