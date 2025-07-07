import React from "react";
import { AForm } from "react-crud-kit";
import { positionEnum } from "react-crud-kit";
import type { IFormOption } from "react-crud-kit";
const Upload: React.FC = () => {
  const baseConfig: IFormOption = {
    menuConfig: {
      position: positionEnum.center,
    },
    formProps: {
      layout: "vertical",
      initialValues: {
        title: "123",
      },
      onFinish: (values) => {
        console.log(values);
      },
    },
    columns: [
      {
        label: "input输入框",
        name: "title",
        type: "input",
        width: 120,
        span: 24,
      },
      {
        label: "树形组件",
        name: "treeId",
        type: "treeSelect",
        width: 120,
        props: {
          treeData: [
            {
              title: "Node1",
              value: "0-0",
              key: "0-0",
              children: [
                {
                  title: "Child Node1",
                  value: "0-0-0",
                  key: "0-0-0",
                },
              ],
            },
            {
              title: "Node2",
              value: "0-1",
              key: "0-1",
              children: [
                {
                  title: "Child Node3",
                  value: "0-1-0",
                  key: "0-1-0",
                },
                {
                  title: "Child Node4",
                  value: "0-1-1",
                  key: "0-1-1",
                },
                {
                  title: "Child Node5",
                  value: "0-1-2",
                  key: "0-1-2",
                },
              ],
            },
          ],
          treeCheckable: true,
          placeholder: "请选择树形内容",
          allowClear: true,
          maxCount: 1,
        },
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
      },
      {
        label: "详情",
        name: "content",
        type: "input",
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
      },
      {
        label: "select选择",
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
      },
      {
        label: "inputNumber数字框",
        name: "number",
        type: "inputNumber",
        props: {
          style: { width: "100%" },
        },
      },
      {
        label: "性别",
        name: "sex",
        type: "radio",
        options: [
          {
            label: "男",
            value: 1,
          },
          {
            label: "女",
            value: 2,
          },
        ],
      },
      {
        label: "爱好",
        name: "hobby",
        type: "checkbox",
        width: 200,
        options: [
          {
            label: "篮球",
            value: 1,
          },
          {
            label: "足球",
            value: 2,
          },
          {
            label: "乒乓球",
            value: 3,
          },
        ],
      },
      {
        label: "switch开关",
        name: "isSwitch",
        type: "switch",
      },
      {
        label: "colorPicker",
        name: "colorPicker",
        type: "colorPicker",
      },
      {
        label: "rate",
        name: "rate",
        type: "rate",
      },
      {
        label: "slider",
        name: "slider",
        type: "slider",
      },
      {
        label: "timePicker",
        name: "timePicker",
        type: "timePicker",
        props: {
          status: "error",
        },
      },
    ],
  };
  return <AForm {...baseConfig} />;
};

export default Upload;
