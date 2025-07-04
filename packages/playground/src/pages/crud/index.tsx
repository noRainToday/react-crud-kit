import { CrudComponent } from "react-crud-kit";

import React, { useEffect, useState, useRef, useCallback } from "react";
import type {
  CrudExposeMethods,
  IBasePagination,
  ICrudOption,
} from "react-crud-kit";
import { Button, Space, Modal, Input } from "antd";
import {
  getActiveList,
  editActive,
  addActive,
  removeActive,
  getActiveDetail,
} from "@/api/crud";

const TestCrud: React.FC = () => {
  const tableOption: ICrudOption = {
    title: "活动",
    showSearch: true,
    searchSpan: 6,
    selection: true,
    checkOrRadio: "checkbox",
    searchButtonText: "全部搜索",
    columns: [
      {
        label: "竞赛标题",
        name: "title",
        type: "input",
        form: {
          rules: [
            {
              required: true,
              message: "请输入竞赛标题",
            },
          ],
        },
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

        form: {
          rules: [
            {
              required: true,
              message: "请输入开始时间",
            },
          ],
        },
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
        form: {
          rules: [
            {
              required: true,
              message: "请输入结束时间",
            },
          ],
        },
        table: { show: true },
        search: { show: true },
      },
      {
        label: "活动详情",
        name: "content",
        type: "input",
        form: {
          rules: [
            {
              required: true,
              message: "请输入活动详情",
            },
          ],
        },
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
        form: {
          // rules: [
          //   {
          //     required: true,
          //     message: "请上传活动海报图片",
          //   },
          // ],
        },
        table: {
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
        form: {
          // rules: [
          //   {
          //     required: true,
          //     message: "请上传活动文件",
          //   },
          // ],
        },
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
            label: "未开始",
            value: 0,
          },
          {
            label: "进行中",
            value: 1,
          },
          {
            label: "已结束",
            value: 2,
          },
        ],
        form: {
          rules: [
            {
              required: true,
              message: "请选择活动状态",
            },
          ],
        },
        table: { show: true },
        search: { show: true },
      },
      {
        label: "参加人数",
        name: "number",
        type: "input",
        form: {
          addDisplay: false,
          viewDisplay: false,
          render: (props: any) => {
            console.log("props", props);
            return <Input {...props}></Input>;
          },
          rules: [
            {
              required: true,
              message: "请输入参加人数",
            },
          ],
        },
        table: { show: true },
        search: { show: false },
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

  const fetchActiveList = useCallback(
    (data?: any) => {
      setLoading(true);
      getActiveList({
        current: pagination.current,
        size: pagination.pageSize,
        ...data,
      })
        .then((res) => {
          setListData(res.records || []);
          setPagination((prev) => ({
            ...prev,
            total: res.total,
          }));
        })
        .catch((error) => {
          console.error("获取活动列表失败:", error);
          // 可以添加错误提示
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [pagination.current, pagination.pageSize]
  );
  const onSearch = (data: any) => {
    console.log("查询用户列表", data);
    fetchActiveList(data);
  };
  const addUser = (data: any) => {
    console.log("添加用户", data);
    //构造上传信息
    // const info = {
    //   ...data,
    //   fileList: data.fileList.map((item: any) => {
    //     return {
    //       name: item.name,
    //       url: item.url,
    //     };
    //   }),
    //   pic: data.pic[0].url,
    // };
    addActive(data).then((res) => {
      if (res.code === 200) {
        fetchActiveList();
      }
    });
  };
  const updateUser = (data: any) => {
    console.log("更新用户", data, listData);
    const info = {
      ...data,
      fileList: data.fileList.map((item: any) => {
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
  const deleteUsers = (ids: string[]) => {
    console.log("删除用户", ids);
    Modal.confirm({
      content: "是否删除已选内容",
      onOk: () => {
        removeActive({ id: ids }).then((res) => {
          if (res.code === 200) {
            fetchActiveList();
          }
        });
      },
    });
  };

  useEffect(() => {
    fetchActiveList();
  }, [fetchActiveList]);

  /**
   * 自定义操作按钮
   */
  const customAction = (record: any) => {
    return (
      <Space>
        <div
          onClick={async () => {
            const res = await getActiveDetail({ id: record.id });
            console.log(res, "res");
            crudRef.current?.openViewModal(res.data);
          }}
        >
          <Button color="primary">查看</Button>
        </div>
        <div
          onClick={async () => {
            const res = await getActiveDetail({ id: record.id });
            crudRef.current?.openEditModal(res.data);
          }}
        >
          <Button type="primary">编辑</Button>
        </div>

        <div onClick={() => deleteUsers([record.id])}>
          <Button color="danger">删除</Button>
        </div>
      </Space>
    );
  };

  const customTopAction = () => {
    return (
      <Space>
        <div
          onClick={async () => {
            console.log("topAction");
          }}
        >
          <Button color="primary">查看</Button>
        </div>
      </Space>
    );
  };

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
        customAction={customAction}
        customTopAction={customTopAction}
      ></CrudComponent>
    </div>
  );
};
export default TestCrud;
