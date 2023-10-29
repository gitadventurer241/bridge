import React from "react";
import { Table as AntTable } from "antd";
import type { ColumnsType } from "antd/es/table";

interface TableProps {
  columns: ColumnsType<any>;
  data: any[];
}

const Table: React.FC<TableProps> = ({ columns, data }) => (
  <AntTable columns={columns} dataSource={data} />
);

export default Table;
