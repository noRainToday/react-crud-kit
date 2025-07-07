import React from "react";
import { Row, Col } from "antd";

import { UploadPicture, UploadFileList } from "react-crud-kit";
const Upload: React.FC = () => {
  return (
    <>
      <Row>
        <Col span={12}>
          图片上传
          <UploadPicture />
        </Col>

        <Col span={12}>
          文件上传
          <UploadFileList multiple={true} />
        </Col>
      </Row>
    </>
  );
};

export default Upload;
