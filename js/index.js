// initialize game
var doSaveGame = true
var pending = {}
var power = {}
var stats = { 'sold': 0, 'botched': 0, 'money': 100000 }

// Initialize the editor
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
}

// save the chart
function saveChart() {
    if (!doSaveGame) return;
    const chartData = editor.export();
    localStorage.setItem('drawflowChart', JSON.stringify(chartData));
    localStorage.setItem('stats', JSON.stringify(stats));
    localStorage.setItem('pending', JSON.stringify(pending));
    localStorage.setItem('power', JSON.stringify(power));
}

async function simulateProcessing(nodeType, nodeID) {
    if (nodeType == "seller") {
        sellerLoop(nodeID)
    } else if (nodeType == "generator") {
        generatorLoop(nodeID)
    } else if (nodeType == "node") {
        const fromNodeData = editor.getNodeFromId(nodeID);
        nodeSimulation(nodeID, fromNodeData.data.type)
    } else if (nodeType == "Suppliernode") {
        const fromNodeData = editor.getNodeFromId(nodeID);
        supplierSimulation(nodeID, fromNodeData.data.type)
    }
}

function RANDBETWEEN(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function createFloatingText(text, x, y, color) {
    const floatingText = document.createElement("div");
    floatingText.className = "floating-text";
    floatingText.textContent = text;
    document.body.appendChild(floatingText);

    const randomXOffset = (Math.random() - 0.5) * 60;
    const randomYOffset = (Math.random() - 0.5) * 20;
    const randomScale = 0.8 + Math.random() * 0.4;

    floatingText.style.left = `${x + randomXOffset}px`;
    floatingText.style.top = `${y + randomYOffset}px`;
    floatingText.style.transform = `scale(${randomScale})`;
    floatingText.style.color = color;

    setTimeout(() => {
        floatingText.remove();
    }, 1500);
}

editor.on('nodeRemoved', function (id) {
    power[id] = null
    pending[id] = null
});

// Money counter loop
setInterval(function () {
    try {
        const moneyspan = document.getElementById("moneymeter")
        moneyspan.innerText = `$${stats['money'].toLocaleString()}`

        const soldspan = document.getElementById("soldmeter")
        soldspan.innerText = `$${stats['sold'].toLocaleString() || 0}`

        const itemsBotchedspan = document.getElementById("botchedmeter")
        itemsBotchedspan.innerText = `${stats['botched'].toLocaleString() || 0}`
    } catch (error) { }
})

function tab(mode) {
    var i;
    var was = {};
    var x = document.getElementsByClassName("float");
    for (i = 0; i < x.length; i++) {
        was[x[i].id] = x[i].style.display;
        x[i].style.display = "none";
    }

    if (mode != false) {
        var elem = document.getElementById(mode);
        if (was[mode] == "block") {
            elem.style.display = "none";
        } else if (was[mode] == "none") {
            elem.style.display = "block";
        }
    }
}

tab(false)