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
  Space,
  Col,
} from "antd";
import UploadPicture from "../UploadPicture";
import UploadFileList from "../UploadFileList";
import DatePicker from "../ADatePicker";
import type { ColumnsType } from "antd/es/table";
import type { ICrudProps, FieldSchema, CrudExposeMethods } from "../../types";

const CrudComponent = forwardRef<CrudExposeMethods, ICrudProps>(
  (
    {
      option,
      primaryKey = "id",
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
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [editingRecord, setEditingRecord] = useState<any | null>(null);
    const handleSubmit = async () => {
      const values = await form.validateFields();
      try {
        if (editingRecord) {
          await onUpdate({
            ...values,
            [primaryKey]: editingRecord[primaryKey],
          });
        } else {
          await onAdd(values);
        }
        setModalOpen(false);
        form.resetFields();
        setEditingRecord(null);
      } catch (e) {
        console.error(e);
      }
    };

    const handleDelete = async (record: any) => {
      await onDelete([record[primaryKey]]);
    };
    const editRecord = (record: any) => {
      console.log("record", record);
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
        case "datePicker": {
          return <DatePicker {...commonProps} />;
        }
        case "uploadPicture": {
          const {
            action = "",
            propsHttp = {
              res: "data",
              url: "url",
              name: "name",
            },
            headers,
            multiple = false,
            maxCount = 2,
          } = field.fileUpload!;
          return (
            <UploadPicture
              action={action}
              propsHttp={propsHttp}
              headers={headers}
              multiple={multiple}
              maxCount={maxCount}
              onUploadSuccess={(fileData) => {
                form.setFieldsValue({
                  [field.name]: fileData,
                });
              }}
            />
          );
        }
        case "uploadFile": {
          const {
            action = "",
            propsHttp = {
              res: "data",
              url: "url",
              name: "name",
            },
            headers,
            multiple = false,
            maxCount = 2,
          } = field.fileUpload!;
          return (
            <UploadFileList
              action={action}
              propsHttp={propsHttp}
              headers={headers}
              multiple={multiple}
              maxCount={maxCount}
              onUploadSuccess={(fileData) => {
                form.setFieldsValue({
                  [field.name]: fileData,
                });
              }}
            />
          );
        }
        default:
          return <Input {...commonProps} />;
      }
    };
    /**
     * 生成table需要的columns
     */
    const columns: ColumnsType<any> = option.columns
      ?.filter(({ table }) => table?.show)
      .map((s) => {
        const { name, label, type, options, dataType, table = {} } = s;

        const commonProps = {
          title: label,
          key: name,
          dataIndex: name,
        };

        switch (true) {
          case !!table.render:
            return {
              ...commonProps,
              render: table.render,
            };

          case type === "select":
            return {
              ...commonProps,
              render: (value: any) => (
                <Select options={options} value={value} disabled />
              ),
            };

          case type === "switch":
            return {
              ...commonProps,
              render: (value: any) => <Switch checked={value} disabled />,
            };

          case table.isActionColumn:
            return {
              title: label,
              key: "actions",
              render: (_: any, record: any) => {
                if (table.render) return table.render(_, record);
                return (
                  <Space>
                    {table.showEdit && (
                      <Button
                        type={table.editButtonType || "primary"}
                        onClick={() => editRecord(record)}
                      >
                        编辑
                      </Button>
                    )}
                    {table.showDelete && (
                      <Button
                        color={table.deleteButtonColor || "default"}
                        type="default"
                        onClick={() => handleDelete(record)}
                      >
                        删除
                      </Button>
                    )}
                  </Space>
                );
              },
            };

          case dataType === "array" || dataType === "object":
            console.warn(
              `${label} 返回对象类型数据,如果需要正确展示请自行编写render函数`
            );
            return {
              ...commonProps,
              render: (value: any) => JSON.stringify(value),
            };

          default:
            return commonProps;
        }
      });

    /**
     * 处理搜索，调用父组件传递的方法，把内容传递出去
     */
    const handleSearch = async () => {
      const values = await searchForm.validateFields();
      console.log(" 搜索条件：values", values);
      onSearch(values);
    };
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
      console.log("selectedRowKeys changed: ", newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
      type: option.checkOrRadio,
      selectedRowKeys,
      onChange: onSelectChange,
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
        {/* 搜索区域 */}
        {option?.showSearch && (
          <Form
            layout="inline"
            form={searchForm}
            onFinish={handleSearch}
            style={{ marginBottom: 16, width: "100%" }}
          >
            {option.columns
              ?.filter((f) => f.search?.show)
              .map((field) => (
                <Col
                  span={field.search?.span ?? option.searchSpan ?? 4}
                  key={field.name}
                >
                  <Form.Item name={field.name} label={field.label}>
                    {renderFormField(field, true)}
                  </Form.Item>
                </Col>
              ))}
            <Col span={option?.searchSpan ?? 4}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginTop: 4 }}
                >
                  搜索
                </Button>

                <Button
                  style={{ marginLeft: 10 }}
                  onClick={() => {
                    searchForm.resetFields();
                    handleSearch();
                  }}
                >
                  重置
                </Button>
              </Form.Item>
            </Col>
          </Form>
        )}

        {/* 表格上方操作按钮 */}
        <div>
          {option.showAddButton && (
            <Button
              type="primary"
              onClick={() => setModalOpen(true)}
              style={{ marginBottom: 16 }}
            >
              {option?.addButtonText || "新增"}
            </Button>
          )}

          {option.showBatchDeleteButton && (
            <Button
              color="danger"
              variant="solid"
              onClick={() => onDelete(selectedRowKeys)}
              style={{ marginBottom: 16, marginLeft: 16 }}
            >
              {option?.batchDeleteButtonText || "批量删除"}
            </Button>
          )}
        </div>

        {/* 表格 */}
        <Table
          bordered={option.bordered || true}
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
            pageSizeOptions: ["2", "3", "10", "20"],
            onChange: pagination.handlePageChange,
            onShowSizeChange: pagination.handleSizeChange,
          }}
          rowSelection={option?.selection ? rowSelection : undefined}
        />

        {/* 弹窗表单 */}
        <Modal
          width={800}
          open={modalOpen}
          title={editingRecord ? `编辑` : `新增`}
          onCancel={() => {
            setModalOpen(false);
            form.resetFields();
            setEditingRecord(null);
          }}
          onOk={handleSubmit}
        >
          <Form layout="vertical" form={form}>
            {option?.columns
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
