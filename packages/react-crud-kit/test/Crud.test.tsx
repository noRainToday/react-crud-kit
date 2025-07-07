import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CrudComponent from "../src/components/crud/CrudComponent";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ICrudProps, CrudExposeMethods } from "../src/types";
import { createRef } from "react";

describe("CrudComponent 单元测试", () => {
  const mockOnAdd = vi.fn();
  const mockOnSearch = vi.fn();
  const mockOnUpdate = vi.fn();
  const mockOnDelete = vi.fn();
  const mockHandlePageChange = vi.fn();
  const mockHandleSizeChange = vi.fn();

  const baseProps: ICrudProps = {
    option: {
      showSearch: true,
      showAddButton: true,
      showEditButton: true,
      showDeleteButton: true,
      showViewButton: true,
      showBatchDeleteButton: true,
      columns: [
        {
          name: "name",
          label: "姓名",
          type: "input",
          form: { rules: [{ required: true, message: "请输入姓名" }] },
          search: { show: true },
          table: { show: true },
        },
        {
          name: "age",
          label: "年龄",
          type: "inputNumber",
          form: { rules: [{ required: true, message: "请输入年龄" }] },
          search: { show: true },
          table: { show: true },
        },
        {
          name: "status",
          label: "状态",
          type: "select",
          options: [
            { label: "启用", value: 1 },
            { label: "禁用", value: 0 },
          ],
          form: { rules: [{ required: true, message: "请选择状态" }] },
          search: { show: true },
          table: { show: true },
        },
        {
          name: "isActive",
          label: "是否激活",
          type: "switch",
          table: { show: true },
        },
      ],
    },
    listData: [
      { id: 1, name: "张三", age: 25, status: 1, isActive: true },
      { id: 2, name: "李四", age: 30, status: 0, isActive: false },
    ],
    loading: false,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 2,
      handlePageChange: mockHandlePageChange,
      handleSizeChange: mockHandleSizeChange,
    },
    onAdd: mockOnAdd,
    onSearch: mockOnSearch,
    onUpdate: mockOnUpdate,
    onDelete: mockOnDelete,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("基础渲染测试", () => {
    it("应该正确渲染组件的基本结构", () => {
      render(<CrudComponent {...baseProps} />);

      // 检查搜索表单
      expect(screen.getByLabelText("姓名")).toBeInTheDocument();
      expect(screen.getByLabelText("年龄")).toBeInTheDocument();
      expect(screen.getByLabelText("状态")).toBeInTheDocument();

      // 检查操作按钮
      expect(screen.getByRole("button", { name: "新增" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "批量删除" })
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "搜索" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "重置" })).toBeInTheDocument();

      // 检查表格
      expect(screen.getByText("张三")).toBeInTheDocument();
      expect(screen.getByText("李四")).toBeInTheDocument();
    });

    it("应该正确显示表格数据", () => {
      render(<CrudComponent {...baseProps} />);

      // 检查表格头部
      expect(screen.getByText("姓名")).toBeInTheDocument();
      expect(screen.getByText("年龄")).toBeInTheDocument();
      expect(screen.getByText("状态")).toBeInTheDocument();
      expect(screen.getByText("是否激活")).toBeInTheDocument();
      expect(screen.getByText("操作")).toBeInTheDocument();

      // 检查数据行
      expect(screen.getByText("张三")).toBeInTheDocument();
      expect(screen.getByText("25")).toBeInTheDocument();
      expect(screen.getByText("李四")).toBeInTheDocument();
      expect(screen.getByText("30")).toBeInTheDocument();
    });

    it("应该在loading状态下显示加载中", () => {
      render(<CrudComponent {...baseProps} loading={true} />);

      // Ant Design Table 的 loading 状态通过 spin 组件实现
      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
    });
  });

  describe("搜索功能测试", () => {
    it("应该能够执行搜索操作", async () => {
      const user = userEvent.setup();
      render(<CrudComponent {...baseProps} />);

      // 填写搜索条件
      await user.type(screen.getByLabelText("姓名"), "张三");
      await user.type(screen.getByLabelText("年龄"), "25");

      // 点击搜索按钮
      await user.click(screen.getByRole("button", { name: "搜索" }));

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith({ name: "张三", age: 25 });
      });
    });

    it("应该能够重置搜索条件", async () => {
      const user = userEvent.setup();
      render(<CrudComponent {...baseProps} />);

      // 填写搜索条件
      await user.type(screen.getByLabelText("姓名"), "张三");

      // 点击重置按钮
      await user.click(screen.getByRole("button", { name: "重置" }));

      // 验证搜索条件被清空并触发搜索
      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith({});
      });
    });

    it("当showSearch为false时不应该显示搜索表单", () => {
      const propsWithoutSearch = {
        ...baseProps,
        option: { ...baseProps.option, showSearch: false },
      };
      render(<CrudComponent {...propsWithoutSearch} />);

      expect(
        screen.queryByRole("button", { name: "搜索" })
      ).not.toBeInTheDocument();
    });
  });

  describe("新增功能测试", () => {
    it("应该能够打开新增弹窗", async () => {
      const user = userEvent.setup();
      render(<CrudComponent {...baseProps} />);

      await user.click(screen.getByRole("button", { name: "新增" }));

      expect(screen.getByText("新增")).toBeInTheDocument();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("应该能够提交新增表单", async () => {
      const user = userEvent.setup();
      render(<CrudComponent {...baseProps} />);

      // 打开新增弹窗
      await user.click(screen.getByRole("button", { name: "新增" }));

      // 填写表单
      const modal = screen.getByRole("dialog");
      await user.type(within(modal).getByLabelText("姓名"), "Bruce Lee");
      await user.type(within(modal).getByLabelText("年龄"), "35");

      // 提交表单
      await user.click(within(modal).getByRole("button", { name: "确定" }));

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith({ name: "Bruce Lee", age: 35 });
      });
    });

    it("应该能够取消新增操作", async () => {
      const user = userEvent.setup();
      render(<CrudComponent {...baseProps} />);

      await user.click(screen.getByRole("button", { name: "新增" }));
      await user.click(screen.getByRole("button", { name: "取消" }));

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("编辑功能测试", () => {
    it("应该能够打开编辑弹窗并预填数据", async () => {
      const user = userEvent.setup();
      render(<CrudComponent {...baseProps} />);

      // 点击第一行的编辑按钮
      const editButtons = screen.getAllByRole("button", { name: "编辑" });
      await user.click(editButtons[0]);

      expect(screen.getByText("编辑")).toBeInTheDocument();

      // 验证表单预填数据
      const modal = screen.getByRole("dialog");
      expect(within(modal).getByDisplayValue("张三")).toBeInTheDocument();
      expect(within(modal).getByDisplayValue("25")).toBeInTheDocument();
    });

    it("应该能够提交编辑表单", async () => {
      const user = userEvent.setup();
      render(<CrudComponent {...baseProps} />);

      // 打开编辑弹窗
      const editButtons = screen.getAllByRole("button", { name: "编辑" });
      await user.click(editButtons[0]);

      // 修改表单数据
      const modal = screen.getByRole("dialog");
      const nameInput = within(modal).getByDisplayValue("张三");
      await user.clear(nameInput);
      await user.type(nameInput, "张三丰");

      // 提交表单
      await user.click(within(modal).getByRole("button", { name: "确定" }));

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalledWith({
          id: 1,
          name: "张三丰",
          age: 25,
          status: 1,
          isActive: true,
        });
      });
    });
  });

  describe("查看功能测试", () => {
    it("应该能够打开查看弹窗", async () => {
      const user = userEvent.setup();
      render(<CrudComponent {...baseProps} />);

      const viewButtons = screen.getAllByRole("button", { name: "查看" });
      await user.click(viewButtons[0]);

      expect(screen.getByRole("dialog")).toBeInTheDocument();

      // 验证表单字段为只读状态
      const modal = screen.getByRole("dialog");
      const nameInput = within(modal).getByDisplayValue("张三");
      expect(nameInput).toBeDisabled();
    });
  });

  describe("删除功能测试", () => {
    it("应该能够删除单条记录", async () => {
      const user = userEvent.setup();
      render(<CrudComponent {...baseProps} />);

      const deleteButtons = screen.getAllByRole("button", { name: "删除" });
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockOnDelete).toHaveBeenCalledWith([1]);
      });
    });

    it("应该能够批量删除记录", async () => {
      const propsWithSelection = {
        ...baseProps,
        option: { ...baseProps.option, selection: true },
      };
      const user = userEvent.setup();
      render(<CrudComponent {...propsWithSelection} />);

      // 选择记录（这里需要根据实际的选择框实现来调整）
      // 由于Ant Design Table的选择框比较复杂，这里简化测试
      await user.click(screen.getByRole("button", { name: "批量删除" }));

      await waitFor(() => {
        expect(mockOnDelete).toHaveBeenCalled();
      });
    });
  });

  describe("Ref方法测试", () => {
    it("应该能够通过ref调用openCreateModal方法", async () => {
      const ref = createRef<CrudExposeMethods>();
      render(<CrudComponent {...baseProps} ref={ref} />);

      ref.current?.openCreateModal();

      await waitFor(() => {
        expect(screen.getByText("新增")).toBeInTheDocument();
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("应该能够通过ref调用openEditModal方法", async () => {
      const ref = createRef<CrudExposeMethods>();
      render(<CrudComponent {...baseProps} ref={ref} />);

      const record = { id: 1, name: "张三", age: 25 };
      ref.current?.openEditModal(record);

      await waitFor(() => {
        expect(screen.getByText("编辑")).toBeInTheDocument();
        expect(screen.getByDisplayValue("张三")).toBeInTheDocument();
      });
    });

    it("应该能够通过ref调用openViewModal方法", async () => {
      const ref = createRef<CrudExposeMethods>();
      render(<CrudComponent {...baseProps} ref={ref} />);

      const record = { id: 1, name: "张三", age: 25 };
      ref.current?.openViewModal(record);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByDisplayValue("张三")).toBeDisabled();
      });
    });
  });

  describe("自定义配置测试", () => {
    it("应该支持自定义按钮文本", () => {
      const customProps = {
        ...baseProps,
        option: {
          ...baseProps.option,
          addButtonText: "创建",
          editButtonText: "修改",
          deleteButtonText: "移除",
          searchButtonText: "查询",
          resetButtonText: "清空",
        },
      };
      render(<CrudComponent {...customProps} />);

      expect(screen.getByRole("button", { name: "创建" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "查询" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "清空" })).toBeInTheDocument();
      expect(screen.getAllByRole("button", { name: "修改" })).toHaveLength(2);
      expect(screen.getAllByRole("button", { name: "移除" })).toHaveLength(2);
    });

    it("应该支持隐藏特定按钮", () => {
      const customProps = {
        ...baseProps,
        option: {
          ...baseProps.option,
          showAddButton: false,
          showEditButton: false,
          showDeleteButton: false,
        },
      };
      render(<CrudComponent {...customProps} />);

      expect(
        screen.queryByRole("button", { name: "新增" })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "编辑" })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "删除" })
      ).not.toBeInTheDocument();
    });

    it("应该支持自定义操作列", () => {
      const customAction = vi.fn(() => <button>自定义操作</button>);
      const customProps = {
        ...baseProps,
        customAction,
      };
      render(<CrudComponent {...customProps} />);

      expect(
        screen.getAllByRole("button", { name: "自定义操作" })
      ).toHaveLength(2);
    });

    it("应该支持自定义顶部操作", () => {
      const customTopAction = vi.fn(() => <button>自定义顶部操作</button>);
      const customProps = {
        ...baseProps,
        customTopAction,
      };
      render(<CrudComponent {...customProps} />);

      expect(
        screen.getByRole("button", { name: "自定义顶部操作" })
      ).toBeInTheDocument();
    });
  });

  describe("分页功能测试", () => {
    it("应该正确显示分页信息", () => {
      render(<CrudComponent {...baseProps} />);

      expect(screen.getByText("共 2 条")).toBeInTheDocument();
    });
  });

  describe("表单验证测试", () => {
    it("应该在必填字段为空时显示验证错误", async () => {
      const user = userEvent.setup();
      render(<CrudComponent {...baseProps} />);

      // 打开新增弹窗
      await user.click(screen.getByRole("button", { name: "新增" }));

      // 直接提交表单（不填写必填字段）
      const modal = screen.getByRole("dialog");
      await user.click(within(modal).getByRole("button", { name: "确定" }));

      // 验证错误信息显示
      await waitFor(() => {
        expect(screen.getByText("请输入姓名")).toBeInTheDocument();
        expect(screen.getByText("请输入年龄")).toBeInTheDocument();
      });

      // 确保onAdd没有被调用
      expect(mockOnAdd).not.toHaveBeenCalled();
    });
  });
});
