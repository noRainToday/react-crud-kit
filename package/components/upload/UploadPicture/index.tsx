import React, { useEffect, useState, useId } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import type { UploadPictureProps } from "../../../types";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const beforeUpload = (file: FileType) => {
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("图片必须小于 2MB!");
  }
  return isLt2M;
};

const UploadPic: React.FC<UploadPictureProps> = ({
  action,
  value,
  onChange,
  onUploadSuccess,
  propsHttp,
  headers,
  multiple = true,
  maxCount = 5,
}) => {
  const [loading, setLoading] = useState(false);
  const id = useId();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    console.log("value", value);
    if (typeof value === "string") {
      setFileList([
        {
          uid: id,
          url: value,
          name: value,
        },
      ]);
    } else {
      setFileList(value || []);
    }
  }, [value]);

  const handleChange: UploadProps["onChange"] = ({ file, fileList }) => {
    if (file.status === "uploading") {
      setLoading(true);
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
      setLoading(false);
    } else if (file.status === "removed") {
      // 删除的场景
      const updatedList = fileList.filter((f) => f.uid !== file.uid);
      setFileList(updatedList);
      onChange?.(updatedList);
      setLoading(false);
    } else if (file.status === "error") {
      message.error(`${file.name} 上传失败`);
      setLoading(false);
    } else {
      // 其他情况，统一更新 fileList
      setFileList(fileList);
      onChange?.(fileList);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
    </button>
  );

  return (
    <Upload
      name="file"
      listType="picture-card"
      className="avatar-uploader"
      fileList={fileList}
      action={action}
      beforeUpload={beforeUpload}
      headers={headers}
      onChange={handleChange}
      showUploadList={true}
    >
      {fileList.length < (multiple ? maxCount : 1) ? uploadButton : null}
    </Upload>
  );
};

export default UploadPic;
