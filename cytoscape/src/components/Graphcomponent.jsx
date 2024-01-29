// GraphComponent.js
import React, { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import { useAddNodeMutation, client } from "../utilities/graphOperations"; // Update the correct path
import NodeDetailsTable from "./Nodetable/nodeTable";
const GraphComponent = () => {
  const cyRef = useRef(null);
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [newEdgeLabel, setNewEdgeLabel] = useState("");
  const [selectedSourceNodeId, setSelectedSourceNodeId] = useState("");
  const [selectedNodeProperties, setSelectedNodeProperties] = useState(null);
  const [showNodeDetails, setShowNodeDetails] = useState(false);
  const [addNode, { loading, error }] = useAddNodeMutation();
  
  useEffect(() => {
    // Initialize Cytoscape
    const cy = cytoscape({
      container: document.getElementById("cy"),
      elements: [
        { data: { id: "a", label: "Node A" } },
        { data: { id: "b", label: "Node B" } },
        { data: { id: "c", label: "Node C" } },
        { data: { id: "ab", source: "a", target: "b", label: "connectsTo" } },
        { data: { id: "bc", source: "b", target: "c", label: "connectsTo" } },
      ],
      style: [
        {
          selector: "node",
          style: {
            "background-color": "white",
            label: "data(label)",
            color: "white", // Set label color for nodes
          },
        },
        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#ccc",
            "target-arrow-color": "#ccc",
            "target-arrow-shape": "triangle",
            label: "data(label)",
            color: "white", // Set label color for edges
          },
        },
      ],
      layout: { name: "grid" },
    });

    // Store cy instance in the ref for future use
    cyRef.current = cy;

    // Set up event listener for node click
    cy.on("tap", "node", function (event) {
      const node = event.target;
      const nodeId = node.id();
      const nodePosition = node.position();
      const nodeDate = new Date(); // You can customize this based on your requirements

      // Set the selected node properties for rendering
      setSelectedNodeProperties({
        nodeId: nodeId,
        nodePosition: nodePosition,
        nodeDate: nodeDate.toISOString(), // Convert to a string for display
      });
    });
    // Cleanup on component unmount
    return () => {
      cy.destroy();
    };
  }, []); // Empty dependency array ensures this effect runs once on mount

  const addNodeHandler = () => {
    addNode({ variables: { label: newNodeLabel } })
      .then((response) => {
        const newNode = response.data.addNode;
        const cy = cyRef.current;

        // Add a new node connected to the selected source node or the last created node
        cy.add([
          {
            data: {
              id: newNode.id,
              label: newNode.label,
            },
          },
          {
            data: {
              id: `newEdge${cy.edges().length}`,
              source: selectedSourceNodeId || cy.nodes().last().id(),
              target: newNode.id,
              label: newEdgeLabel || "connectsTo",
            },
          },
        ]);

        // Refresh the layout to accommodate the new node
      })
      .catch((error) => {
        console.error("Error adding node:", error);
      });
  };

  const nodeOptions = cyRef.current
    ? cyRef.current.nodes().map((node) => ({
        id: node.id(),
        label: node.data("label"),
      }))
    : [];

  return (
    <>
      <body className="bg-black">
        <div className="absolute z-10 font-semibold bg-white w-80">
          {selectedNodeProperties && (
            <div>
              <h3>Selected Node Properties:</h3>
              <p>Node ID: {selectedNodeProperties.nodeId}</p>
              <p>
                Position: {JSON.stringify(selectedNodeProperties.nodePosition)}
              </p>
              <p>Date: {selectedNodeProperties.nodeDate}</p>
            </div>
          )}
          <label>
            New Node Label:
            <input
              type="text"
              value={newNodeLabel}
              onChange={(e) => setNewNodeLabel(e.target.value)}
            />
          </label>
          <label>
            New Edge Label:
            <input
              type="text"
              value={newEdgeLabel}
              onChange={(e) => setNewEdgeLabel(e.target.value)}
            />
          </label>
          <label>
            Select Source Node:
            <select
              value={selectedSourceNodeId}
              onChange={(e) => setSelectedSourceNodeId(e.target.value)}
            >
              <option value="">Select Node</option>
              {nodeOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button className="bg-red-700" onClick={addNodeHandler}>
            Add New Node
          </button>
          <button
            className="bg-blue-700"
            onClick={() => setShowNodeDetails(!showNodeDetails)}
          >
            {showNodeDetails ? "Hide Node Details" : "Show Node Details"}
          </button>
        {showNodeDetails && (
        <NodeDetailsTable nodes={cyRef.current.nodes()} cyRef={cyRef} />
      )}
        </div>

        <div
          className=""
          id="cy"
          style={{ width: "100%", height: "3000px" }}
        ></div>
      </body>
    </>
  );
};
export default GraphComponent;
