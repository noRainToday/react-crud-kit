import React from "react";
import { RouterProvider } from "react-router";
import router from "./router";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import "dayjs/locale/zh-cn";

const App: React.FC = () => {
  return (
    <>
      <ConfigProvider locale={zhCN}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </>
  );
};

export default App;
