import { useState, forwardRef, useImperativeHandle } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Radio,
  Checkbox,
  message,
  Space,
  Col,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type {
  CrudProps,
  FieldSchema,
  CrudExposeMethods,
} from "../../types";

const CrudComponent = forwardRef<CrudExposeMethods, CrudProps>(
  (
    {
      schema,
      primaryKey = "id",
      title,
      showAddButton = true,
      addButtonText = "新增",
      listData = [],
      loading,
      pagination,
      onSearch,
      onAdd,
      onUpdate,
      onDelete,
    },
    ref
  ) => {
    const [form] = Form.useForm();
    const [searchForm] = Form.useForm();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<any | null>(null);
    const handleSubmit = async () => {
      const values = await form.validateFields();
      try {
        if (editingRecord) {
          await onUpdate(values);
          message.success("更新成功");
        } else {
          await onAdd(values);
          message.success("新增成功");
        }
        setModalOpen(false);
        form.resetFields();
        setEditingRecord(null);
      } catch (e) {
        console.error(e);
        message.error("操作失败");
      }
    };

    const handleDelete = async (record: any) => {
      await onDelete([record[primaryKey]]);
      message.success("删除成功");
    };
    const editRecord = (record: any) => {
      setEditingRecord(record);
      form.setFieldsValue(record);
      setModalOpen(true);
    };

    const renderFormField = (field: FieldSchema, forSearch = false) => {
      const baseProps = forSearch ? field.search : field.form;
      const commonProps = {
        ...field.props,
        placeholder: baseProps?.placeholder || `请输入${field.label}`,
      };

      switch (field.type) {
        case "input":
          return <Input {...commonProps} />;
        case "select":
          return (
            <Select {...commonProps}>
              {field.options?.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
          );
        case "radio":
          return (
            <Radio.Group {...commonProps}>
              {field.options?.map((opt) => (
                <Radio key={opt.value} value={opt.value}>
                  {opt.label}
                </Radio>
              ))}
            </Radio.Group>
          );
        case "checkbox":
          return <Checkbox.Group options={field.options} {...commonProps} />;
        case "switch":
          return <Switch {...field.props} />;
        default:
          return <Input {...commonProps} />;
      }
    };
    /**
     * 生成table需要的columns
     */
    const columns: ColumnsType<any> = schema
      .filter((s) => s.table?.show)
      .map((s) => {
        if (s.table?.isActionColumn) {
          return {
            title: s.label,
            key: "actions",
            render: (_: any, record: any) => {
              const { table } = s;
              if (table?.render) return table.render(record);
              return (
                <Space>
                  {table?.showEdit && (
                    <a onClick={() => editRecord(record)}>
                      <Button type={table?.editButtonType || "primary"}>
                        编辑
                      </Button>
                    </a>
                  )}
                  {table?.showDelete && (
                    <a onClick={() => handleDelete(record)}>
                      <Button color={table?.deleteButtonColor || "danger"}>
                        删除
                      </Button>
                    </a>
                  )}
                </Space>
              );
            },
          };
        } else if (s.type === "switch") {
          return {
            title: s.label,
            dataIndex: s.name,
            key: s.name,
            render: (record: any) => {
              return <Switch checked={record} disabled />;
            },
          };
        }
        return {
          title: s.label,
          dataIndex: s.name,
          key: s.name,
        };
      });
    /**
     * 处理搜索，调用父组件传递的方法，把内容传递出去
     */
    const handleSearch = async () => {
      const values = await searchForm.validateFields();
      console.log(" 搜索条件：values", values);
      onSearch(values);
    };

    /**
     * 暴露方法
     */

    useImperativeHandle(ref, () => ({
      //新增
      openCreateModal: () => {
        form.resetFields();
        setEditingRecord(null);
        setModalOpen(true);
      },
      //编辑
      openEditModal: (record) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setModalOpen(true);
      },
      //设置默认搜索
      setDefaultSearch: (data: any) => {
        searchForm.setFieldsValue(data);
      },
    }));

    return (
      <div className="p-15">
        <h2 style={{ marginBottom: 16 }}> {title}</h2>

        {/* 搜索区域 */}
        <Form
          layout="inline"
          form={searchForm}
          onFinish={handleSearch}
          style={{ marginBottom: 16, width: "100%" }}
        >
          {schema
            .filter((f) => f.search?.show)
            .map((field) => (
              <Col span={field.search?.span || 4} key={field.name}>
                <Form.Item name={field.name} label={field.label}>
                  {renderFormField(field, true)}
                </Form.Item>
              </Col>
            ))}
          <Col span={6}>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ marginTop: 4 }}>
                搜索
              </Button>

              <Button
                style={{ marginLeft: 10 }}
                onClick={() => searchForm.resetFields()}
              >
                重置
              </Button>
            </Form.Item>
          </Col>
        </Form>

        {/* 表格上方操作按钮 */}
        <div>
          {showAddButton && (
            <Button
              type="primary"
              onClick={() => setModalOpen(true)}
              style={{ marginBottom: 16 }}
            >
              {addButtonText}
            </Button>
          )}
        </div>

        {/* 表格 */}
        <Table
          columns={columns}
          dataSource={listData}
          rowKey={primaryKey}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            pageSizeOptions: ["10", "20", "50", "100"],
            onChange: pagination.handlePageChange,
            onShowSizeChange: pagination.handleSizeChange,
          }}
        />

        {/* 弹窗表单 */}
        <Modal
          open={modalOpen}
          title={editingRecord ? `${title} 编辑` : `${title} 新增`}
          onCancel={() => {
            setModalOpen(false);
            form.resetFields();
            setEditingRecord(null);
          }}
          onOk={handleSubmit}
        >
          <Form layout="vertical" form={form}>
            {schema
              .filter((f) => f.form?.show)
              .map((field) => (
                <Form.Item
                  key={field.name}
                  name={field.name}
                  label={field.label}
                  valuePropName={field.type === "switch" ? "checked" : "value"}
                  rules={
                    field.form?.required
                      ? [{ required: true, message: `请输入${field.label}` }]
                      : []
                  }
                >
                  {renderFormField(field)}
                </Form.Item>
              ))}
          </Form>
        </Modal>
      </div>
    );
  }
);

export default CrudComponent;
