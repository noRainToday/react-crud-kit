# 使用案例
```tsx
import { CrudComponent } from "react-crud-kit";
import React, { useEffect, useState, useRef } from "react";
import type {
  FieldSchema,
  CrudExposeMethods,
  IBasePagination,
} from "react-crud-kit";
import { Button, Space } from "antd";

const TestCrud: React.FC = () => {
  const userSchema: FieldSchema[] = [
    {
      type: "input",
      name: "username",
      label: "用户名",
      form: { show: true, required: true },
      table: { show: true },
      search: { show: true },
    },
    {
      type: "select",
      name: "gender",
      label: "性别",
      options: [
        { label: "男", value: "male" },
        { label: "女", value: "female" },
      ],
      form: { show: true, required: true },
      table: { show: true },
      search: { show: true, span: 6 },
    },
    {
      type: "switch",
      name: "active",
      label: "启用状态",
      form: { show: true },
      table: { show: true },
      search: { show: true },
    },
    {
      type: "custom",
      name: "actions",
      label: "操作",
      table: {
        show: true,
        isActionColumn: true,
        showEdit: true,
        showDelete: true,
        editButtonType: "primary",
        deleteButtonColor: "danger",
        render: (record: any) => {
          return (
            <Space>
              <a
                onClick={() => {
                  crudRef.current?.openEditModal(record);
                }}
              >
                <Button type="primary">编辑</Button>
              </a>
              <a onClick={() => handleDelete(record)}>
                <Button color="danger">删除</Button>
              </a>
            </Space>
          );
        },
      },
    },
  ];

  const handleDelete = (record: any) => {
    console.log("object", record);
  };

  const crudRef = useRef<CrudExposeMethods>(null);
  const [pagination, setPagination] = useState<IBasePagination>({
    current: 1,
    pageSize: 10,
    total: 0,
    handlePageChange: (current: number, pageSize: number) => {
      setPagination({
        ...pagination,
        current,
        pageSize,
      });
    },
    handleSizeChange: (current: number, pageSize: number) => {
      setPagination({
        ...pagination,
        current,
        pageSize,
      });
    },
  });
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState<any[]>([]);
  const fetchUserList = () => {
    setLoading(true);
    setTimeout(() => {
      // 模拟网络请求
      setListData([
        {
          username: "张三",
          gender: "male",
          active: true,
          id: 1,
        },
        {
          username: "张三2",
          gender: "female",
          active: false,
          id: 2,
        },
      ]);

      setLoading(false);
    }, 2000);
  };
  const onSearch = (data: any) => {
    console.log("查询用户列表", data);
    fetchUserList();
  };
  const addUser = (data: any) => {
    console.log("添加用户", data);
  };
  const updateUser = (data: any) => {
    console.log("更新用户", data);
  };
  const deleteUsers = (ids: number[]) => {
    console.log("删除用户", ids);
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  return (
    <div>
      <CrudComponent
        title="用户管理"
        pagination={pagination}
        ref={crudRef}
        listData={listData}
        loading={loading}
        schema={userSchema}
        onSearch={onSearch}
        onAdd={addUser}
        onUpdate={updateUser}
        onDelete={deleteUsers}
      ></CrudComponent>
    </div>
  );
};
export default TestCrud;


```

