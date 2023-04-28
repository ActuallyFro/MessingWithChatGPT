document.addEventListener('DOMContentLoaded', () => {
        const graphForm = document.getElementById('graph-form');
        const nodesContainer = document.getElementById('nodes-container');
        const edgesContainer = document.getElementById('edges-container');
        const livePreview = document.getElementById('live-preview');
    
        const addNodeButton = document.getElementById('add-node');
        const addEdgeButton = document.getElementById('add-edge');
        const importGraphMLButton = document.getElementById('import-graphml');
        const exportGraphMLButton = document.getElementById('export-graphml');
    
        let nodeIdCounter = 0;
        let edgeIdCounter = 0;
    
        addNodeButton.addEventListener('click', () => {
            const newNode = document.createElement('div');
            newNode.classList.add('node');
            newNode.innerHTML = `
                <label for="node-id-${nodeIdCounter}">Node ID: </label>
                <input type="text" id="node-id-${nodeIdCounter}" value="n${nodeIdCounter}" required>
                <button type="button" class="remove-node">Remove Node</button>
            `;
            newNode.querySelector('.remove-node').addEventListener('click', () => {
                newNode.remove();
                updateLivePreview();
            });
            nodesContainer.appendChild(newNode);
            nodeIdCounter++;
            updateLivePreview();
        });
    
        addEdgeButton.addEventListener('click', () => {
            const newEdge = document.createElement('div');
            newEdge.classList.add('edge');
            newEdge.innerHTML = `
                <label for="edge-id-${edgeIdCounter}">Edge ID: </label>
                <input type="text" id="edge-id-${edgeIdCounter}" value="e${edgeIdCounter}" required>
                <label for="edge-source-${edgeIdCounter}">Source: </label>
                <input type="text" id="edge-source-${edgeIdCounter}" required>
                <label for="edge-target-${edgeIdCounter}">Target: </label>
                <input type="text" id="edge-target-${edgeIdCounter}" required>
                <button type="button" class="remove-edge">Remove Edge</button>
            `;
            newEdge.querySelector('.remove-edge').addEventListener('click', () => {
                newEdge.remove();
                updateLivePreview();
            });
            edgesContainer.appendChild(newEdge);
            edgeIdCounter++;
            updateLivePreview();
        });
    
        importGraphMLButton.addEventListener('click', () => {
            // Implement GraphML import functionality here
        });
    
        exportGraphMLButton.addEventListener('click', () => {
            // Implement GraphML export functionality here
        });
    
        graphForm.addEventListener('input', () => {
            updateLivePreview();
        });
    
        function updateLivePreview() {
            const edgeDefault = document.getElementById('edgedefault').value;
    
            const nodes = Array.from(nodesContainer.querySelectorAll('.node')).map(node => {
                return {
                    id: node.querySelector('input[type="text"]').value
                };
            });
    
            const edges = Array.from(edgesContainer.querySelectorAll('.edge')).map(edge => {
                return {
                    id: edge.querySelector('input[type="text"]:nth-child(2)').value,
                    source: edge.querySelector('input[type="text"]:nth-child(4)').value,
                    target: edge.querySelector('input[type="text"]:nth-child(6)').value,
                };
            });
    
            const graphML =`
            <?xml version="1.0" encoding="UTF-8"?>
            <graphml xmlns="http://graphml.graphdrawing.org/xmlns"
                xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://graphml.graphdrawing.org/xmlns
                http://graphml.graphdrawing.org/xmlns/1.0/graphml.xsd">
              <graph id="G" edgedefault="${edgeDefault}">
                ${nodes.map(node => `<node id="${node.id}" />`).join('\n    ')}
                ${edges.map(edge => `<edge id="${edge.id}" source="${edge.source}" target="${edge.target}" />`).join('\n    ')}
              </graph>
            </graphml>
                    `;
            
                    livePreview.textContent = graphML.trim();
                }
            });
            