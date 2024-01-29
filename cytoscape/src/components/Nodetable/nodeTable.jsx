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

  const pageSize = 5; // Set the number of items per page

  const paginationConfig = {
    pageSize: pageSize,
    showSizeChanger: false,
  };

  return (
    <>
    <hr class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-500" />
    <div className="z-10 p-4 bg-white rounded-md">
      <h2>Node Details Table</h2>
      <Table dataSource={dataSource} columns={columns} pagination={paginationConfig} />
    </div>
    </>
  );
};

export default NodeDetailsTable;
