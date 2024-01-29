// GraphComponent.js
import React, { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import { Button } from "antd";
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
        { data: { id: "ab", source: "a", target: "b" } },
        { data: { id: "bc", source: "b", target: "c" } },
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
        cy.layout({ name: "grid" }).run();
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
        <div className="fixed z-10 mt-3 ml-3 font-semibold bg-white rounded-lg w-80">
          <form class="bg-white shadow-md rounded p-5">
            {selectedNodeProperties && (
              <div className="block mb-2 text-sm font-bold text-black">
                <h3 className="">Selected Node Properties</h3>
                <p>Node ID: {selectedNodeProperties.nodeId}</p>
                <p>
                  Position: {""}x:{" "}
                  {selectedNodeProperties.nodePosition.x.toFixed(2)}, y:{" "}
                  {selectedNodeProperties.nodePosition.y.toFixed(2)}
                  {""}
                </p>
                <p>Date: {selectedNodeProperties.nodeDate}</p>
              </div>
            )}
            <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-500" />
            <label className="block mb-2 text-sm font-bold text-black">
              Node Label:
              <input
                className="w-full px-3 py-2 leading-tight text-black border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                type="text"
                value={newNodeLabel}
                onChange={(e) => setNewNodeLabel(e.target.value)}
              />
            </label>
            <label className="block mb-2 text-sm font-bold text-black">
              Edge Label:
              <input
                className="w-full px-3 py-2 leading-tight text-black border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
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
            <Button className="bg-red-700" onClick={addNodeHandler}>
              Add New Node
            </Button>
            <Button 
              className="bg-blue-700"
              onClick={() => setShowNodeDetails(!showNodeDetails)}
            >
              {showNodeDetails ? "Hide Node Details" : "Show Node Details"}
            </Button>
            
            <div className="">

              {showNodeDetails && (
                <NodeDetailsTable nodes={cyRef.current.nodes()} cyRef={cyRef} />
              )}
            </div>
          </form>
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
