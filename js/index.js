// initialize the editor
var doSaveGame = true
var pending = {}
var power = {}
var stats = {'sold': 0}
var money = 100000

const editor = new Drawflow(document.getElementById('drawflow'));
editor.curvature = 0;
editor.reroute_curvature_start_end = 0;
editor.reroute_curvature = 0;
editor.createCurvature = function (start_pos_x, start_pos_y, end_pos_x, end_pos_y, curvature_value) { var center_x = ((end_pos_x - start_pos_x) / 2) + start_pos_x; return ' M ' + start_pos_x + ' ' + start_pos_y + ' L ' + center_x + ' ' + start_pos_y + ' L ' + center_x + ' ' + end_pos_y + ' L ' + end_pos_x + ' ' + end_pos_y; }
editor.start();
window.addEventListener('beforeunload', saveChart);
window.addEventListener('load', loadChart);

// Load the chart from local storage
function loadChart() {
    const chartData = localStorage.getItem('drawflowChart');
    const statsData = localStorage.getItem('stats');
    const pendingData = localStorage.getItem('pending');
    const powerData = localStorage.getItem('power');
    const moneyData = localStorage.getItem('money');

    if (chartData) {
        editor.import(JSON.parse(chartData));
        const nodes = editor.drawflow.drawflow.Home.data;
        const nodeIDs = Object.keys(nodes).map(id => parseInt(id));
        nodeIDs.forEach(function (node, index) {
            node = editor.getNodeFromId(node)
            simulateProcessing(node.class, node.id)
        });
        console.log('Chart loaded!');
    } else {
        console.log('No saved chart found.');
    }

    if (statsData) {
        stats = JSON.parse(statsData);
        console.log('Stats loaded!');
    } else {
        console.log('No saved stats found.');
    }

    if (pendingData) {
        pending = JSON.parse(pendingData);
        console.log('Progress loaded!');
    } else {
        console.log('No saved progress found.');
    }

    if (powerData) {
        power = JSON.parse(powerData);
        console.log('Power data loaded!');
    } else {
        console.log('No saved power data found.');
    }

    if (moneyData) {
        money = parseInt(moneyData);
        console.log('Money loaded!');
    } else {
        console.log('No saved money found.');
    }
}

// save the chart
function saveChart() {
    if (!doSaveGame) return;
    const chartData = editor.export();
    localStorage.setItem('drawflowChart', JSON.stringify(chartData));
    localStorage.setItem('stats', JSON.stringify(stats));
    localStorage.setItem('pending', JSON.stringify(pending));
    localStorage.setItem('power', JSON.stringify(power));
    localStorage.setItem('money', money);
    console.log('Chart saved!');
}

async function simulateProcessing(nodeType, nodeID) {
    const fromNodeData = editor.getNodeFromId(nodeID);

    if (fromNodeData.class == 'seller') {
        sellerLoop(fromNodeData.id)
    } else if (fromNodeData.class == 'smelter') {
        smelterLoop(fromNodeData.id)
    } if (fromNodeData.class == "distributor") {
        distributorLoop(fromNodeData.id)
    } if (fromNodeData.class == "factory") {
        factoryLoop(fromNodeData.id)
    } if (fromNodeData.class == "generator") {
        generatorLoop(fromNodeData.id)
    }
}

function RANDBETWEEN(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

editor.on('nodeRemoved', function (id) {
    console.log('Node removed:', id);
    power[id] = null
    pending[id] = null
});

editor.on('connectionCreated', function (connection) {
    console.log('Connection created:', connection);
    const { output_id: fromNode, input_id: toNode } = connection;
    console.log(fromNode, toNode)
});

editor.on('connectionRemoved', function (connection) {
    console.log('Connection removed:', connection);
});

// Money counter loop
setInterval(function () {
    try {
        const moneyspan = document.getElementById("moneymeter")
        moneyspan.innerText = `$${money.toLocaleString()}`


        const soldspan = document.getElementById("soldmeter")
        soldspan.innerText = `$${stats['sold'].toLocaleString() || 0}`
    } catch (error) {}
})