# 使用案例

```tsx
import { CrudComponent } from "react-crud-kit";

import React, { useEffect, useState, useRef } from "react";
import type {
  CrudExposeMethods,
  IBasePagination,
  ICrudOption,
} from "react-crud-kit";
import { Button, Space, Modal } from "antd";
import {
  getActiveList, //获取list接口
  editActive, //编辑接口
  addActive, //新增接口
  removeActive, //删除/批量删除接口
  getActiveDetail, // 获取详情接口
} from "@/api/research";

const TestCrud: React.FC = () => {
  const tableOption: ICrudOption = {
    title: "活动",
    bordered: true,
    showAddButton: true,
    addButtonText: "新增",
    showBatchDeleteButton: true,
    batchDeleteButtonText: "批量删除",
    showEditButton: true,
    showDeleteButton: true,
    showSearch: true,
    searchSpan: 6,
    selection: true,
    checkOrRadio: "checkbox",
    columns: [
      {
        label: "竞赛标题",
        name: "title",
        type: "input",
        form: { show: true, required: true },
        table: { show: true },
        search: { show: true },
      },
      {
        label: "开始时间",
        name: "startTime",
        type: "datePicker",
        props: {
          valueFormat: "YYYY-MM-DD HH:mm:ss",
          format: "YYYY-MM-DD HH:mm:ss",
          showTime: true,
          style: { width: "100%" },
        },

        form: { show: true, required: true },
        table: { show: true },
        search: { show: true },
      },
      {
        label: "结束时间",
        name: "endTime",
        type: "datePicker",
        props: {
          valueFormat: "YYYY-MM-DD HH:mm:ss",
          format: "YYYY-MM-DD HH:mm:ss",
          showTime: true,
          style: { width: "100%" },
        },
        form: { show: true, required: true },
        table: { show: true },
        search: { show: true },
      },
      {
        label: "活动详情",
        name: "content",
        type: "input",
        form: { show: true, required: true },
        table: { show: true },
        search: { show: false },
      },
      {
        label: "活动海报图片",
        name: "pic",
        type: "uploadPicture",
        fileUpload: {
          multiple: false,
          maxCount: 5,
          headers: {
            "Blade-Auth": "bearer " + localStorage.getItem("token"),
            Authorization: "Basic c2FiZXI6c2FiZXJfc2VjcmV0",
          },
          propsHttp: {
            res: "data",
            url: "link",
            name: "originalName",
          },
          action: "/api/blade-resource/oss/endpoint/put-file-attach",
        },

        form: { show: true, required: true },
        table: {
          show: true,
          render: (text: string) => {
            return (
              <img
                src={text}
                alt=""
                style={{ width: "50px", height: "50px" }}
              />
            );
          },
        },
      },
      {
        type: "uploadFile",
        name: "fileList",
        label: "活动文件",
        dataType: "array",
        fileUpload: {
          multiple: true,
          maxCount: 5,
          headers: {
            "Blade-Auth": "bearer " + localStorage.getItem("token"),
            Authorization: "Basic c2FiZXI6c2FiZXJfc2VjcmV0",
          },
          propsHttp: {
            res: "data",
            url: "link",
            name: "originalName",
          },
          action: "/api/blade-resource/oss/endpoint/put-file-attach",
        },

        form: { show: true, required: true },
        table: {
          show: false,
          render: (picList: any[]) => {
            return (
              <>
                {picList?.length > 0 &&
                  picList.map((item, index) => {
                    return (
                      <div key={index}>
                        <a href={item.url} target="_blank">
                          {item.name || item.originalName}
                        </a>
                      </div>
                    );
                  })}
              </>
            );
          },
        },
      },
      {
        label: "活动状态",
        name: "status",
        type: "select",
        options: [
          {
            label: "进行中",
            value: 1,
          },
          {
            label: "已结束",
            value: 2,
          },
        ],
        form: { show: false, required: true },
        table: { show: true },
        search: { show: true },
      },
      {
        label: "参加人数",
        name: "number",
        type: "datePicker",
        form: { show: false, required: true },
        table: { show: true },
        search: { show: false },
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
          render: (_, record: any) => {
            return (
              <Space>
                <div
                  onClick={async () => {
                    const res = await getActiveDetail({ id: record.id });
                    crudRef.current?.openEditModal(res);
                  }}
                >
                  <Button type="primary">编辑</Button>
                </div>
                <div onClick={() => deleteUsers([record.id])}>
                  <Button color="danger">删除</Button>
                </div>
              </Space>
            );
          },
        },
      },
    ],
  };

  const crudRef = useRef<CrudExposeMethods>(null);
  const [pagination, setPagination] = useState<IBasePagination>({
    current: 1,
    pageSize: 2,
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

  const fetchActiveList = (data?: any) => {
    setLoading(true);
    getActiveList({
      current: pagination.current,
      size: pagination.pageSize,
      ...data,
    }).then((res) => {
      setListData(res.records || []);
      setPagination({
        ...pagination,
        total: res.total,
      });
      setLoading(false);
    });
  };
  const onSearch = (data: any) => {
    console.log("查询用户列表", data);
    fetchActiveList(data);
  };
  const addUser = (data: any) => {
    console.log("添加用户", data);
    //构造上传信息
    const info = {
      ...data,
      fileList: data.fileList.map((item) => {
        return {
          name: item.name,
          url: item.url,
        };
      }),
      pic: data.pic[0].url,
    };
    addActive(info).then((res) => {
      if (res.code === 200) {
        fetchActiveList();
      }
    });
  };
  const updateUser = (data: any) => {
    console.log("更新用户", data, listData);
    const info = {
      ...data,
      fileList: data.fileList.map((item) => {
        return {
          name: item.name,
          url: item.url,
        };
      }),
      pic: data.pic[0].url,
    };
    editActive(info).then((res) => {
      if (res.code === 200) {
        fetchActiveList();
      }
    });
  };
  const deleteUsers = (ids: number[]) => {
    console.log("删除用户", ids);
    Modal.confirm({
      content: "是否删除已选内容",
      onOk: () => {
        removeActive({ ids: ids.join(",") }).then((res) => {
          if (res.code === 200) {
            fetchActiveList();
          }
        });
      },
    });
  };

  useEffect(() => {
    fetchActiveList();
  }, [pagination.current, pagination.pageSize]);

  return (
    <div>
      <CrudComponent
        pagination={pagination}
        ref={crudRef}
        listData={listData}
        loading={loading}
        option={tableOption}
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
