import React, { useEffect, useState, useId } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import type { IPropsHttp } from "../../types";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
import { isObject } from "../../tools";

const { Dragger } = Upload;
const beforeUpload = (file: FileType) => {
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("图片必须小于 2MB!");
  }
  return isLt2M;
};

interface UploadPicProps {
  action: string;
  value?: any[];
  onChange?: (val: UploadFile[]) => void;
  onUploadSuccess?: (val: UploadFile[]) => void;
  propsHttp: IPropsHttp;
  headers?: Record<string, string>;
  multiple?: boolean;
  maxCount?: number;
}

const UploadPic: React.FC<UploadPicProps> = ({
  action,
  value,
  onChange,
  onUploadSuccess,
  propsHttp,
  headers,
  multiple = true,
  maxCount = 5,
}) => {
  const id = useId();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    console.log("value", value);
    if (typeof value === "string") {
      console.warn("传入的内容为string类型,最好能构造为数组对象");
      setFileList([
        {
          uid: id,
          url: value,
          name: value,
        },
      ]);
    } else if (Array.isArray(value)) {
      setFileList(value || []);
    } else if (isObject(value)) {
      console.warn("传入的内容为对象类型,最好能构造为数组对象");
      setFileList([value]);
    } else {
      setFileList([]);
    }
  }, [value]);

  const handleChange: UploadProps["onChange"] = ({ file, fileList }) => {
    if (file.status === "uploading") {
      setFileList(fileList);
      return;
    }

    if (file.status === "done") {
      const resData = file.response?.[propsHttp.res];
      if (resData) {
        const newFile: UploadFile = {
          uid: file.uid,
          status: "done",
          name: resData[propsHttp.name],
          url: resData[propsHttp.url],
        };

        // 替换当前 fileList 中的该项
        const updatedFileList = fileList.map((f) =>
          f.uid === file.uid ? newFile : f
        );

        setFileList(updatedFileList);
        onChange?.(updatedFileList);
        onUploadSuccess?.(updatedFileList);
      } else {
        message.error("上传失败：返回格式不正确");
      }
    } else if (file.status === "removed") {
      // 删除的场景
      const updatedList = fileList.filter((f) => f.uid !== file.uid);
      setFileList(updatedList);
      onChange?.(updatedList);
    } else if (file.status === "error") {
      message.error(`${file.name} 上传失败`);
    } else {
      // 其他情况，统一更新 fileList
      setFileList(fileList);
      onChange?.(fileList);
    }
  };

  // const uploadButton = (
  //   <button style={{ border: 0, background: "none" }} type="button">
  //     {loading ? <LoadingOutlined /> : <PlusOutlined />}
  //   </button>
  // );

  return (
    <Dragger
      name="file"
      fileList={fileList}
      action={action}
      beforeUpload={beforeUpload}
      headers={headers}
      onChange={handleChange}
      showUploadList={true}
      multiple={multiple}
      maxCount={maxCount}
    >
      <div>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或者拖拽上传文件</p>
      </div>
    </Dragger>
  );
};

export default UploadPic;
