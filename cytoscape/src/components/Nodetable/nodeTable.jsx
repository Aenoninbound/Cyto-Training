import React from 'react';
import { Table } from 'antd';

const NodeDetailsTable = ({ nodes, cyRef }) => {
  const dataSource = nodes.map((node) => {
    const connectedNodes = cyRef.current.edges()
      .filter((edge) => edge.source().id() === node.id())
      .map((edge) => edge.target().id());

    return {
      key: node.id(),
      id: node.id(),
      label: node.data("label"),
      connectedTo: connectedNodes.join(", "),
    };
  });

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Label',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'Connected',
      dataIndex: 'connectedTo',
      key: 'connectedTo',
    },
  ];

  return (
    <div className="absolute z-10 p-4 mt-10 bg-white ">
      <h2>Node Details Table</h2>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default NodeDetailsTable;
