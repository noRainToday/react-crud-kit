import { createBrowserRouter } from "react-router";
import LayoutDefault from "@/layout";
const router = createBrowserRouter([
  {
    path: "/",
    Component: LayoutDefault,
    children: [
      {
        path: "/",
        lazy: async () => {
          const Component = await import("@/pages/crud");
          return {
            Component: Component.default,
          };
        },
      },
      {
        path: "/UploadFile",
        lazy: async () => {
          const Component = await import("@/pages/uploadFile");
          return {
            Component: Component.default,
          };
        },
      },
      {
        path: "/form",
        lazy: async () => {
          const Component = await import("@/pages/form");
          return {
            Component: Component.default,
          };
        },
      },
    ],
  },
  {
    path: "/404",
    lazy: async () => {
      const Component = await import("@/pages/noFound");
      return {
        Component: Component.default,
      };
    },
  },
]);

export default router;
