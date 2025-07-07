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
  Rate,
  TreeSelect,
  ColorPicker,
  InputNumber,
  Slider,
  TimePicker,
  Col,
} from "antd";
import UploadPicture from "@/components/upload/UploadPicture";
import UploadFileList from "@/components/upload/UploadFileList";
import DatePicker from "@/components/form/ADatePicker";
import type { ColumnsType } from "antd/es/table";
import type {
  ICrudProps,
  FieldSchema,
  CrudExposeMethods,
  IOption,
} from "@/types";
import { ModelStatus } from "@/const";
import styles from "./index.module.css";

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
      customAction = null,
      customTopAction = null,
    },
    ref
  ) => {
    const [form] = Form.useForm();
    const [searchForm] = Form.useForm();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [editingRecord, setEditingRecord] = useState<any | null>(null);
    const [modelStatus, setModelStatus] = useState(ModelStatus.VIEW);

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

    const renderFormField = (field: FieldSchema, forSearch = false) => {
      const baseProps = forSearch ? field.search : field.form;
      const commonProps = {
        ...field.props,
        disabled: modelStatus === ModelStatus.VIEW && !forSearch,
        placeholder: baseProps?.placeholder || `请输入${field.label}`,
      };
      //判断是否自定义
      if (field.form?.render) {
        console.log(field.form.render);
        return field.form.render(commonProps);
      }

      switch (field.type) {
        case "input":
          return <Input {...commonProps} />;
        case "rate":
          return <Rate {...commonProps} />;
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
        case "treeSelect": {
          return <TreeSelect {...commonProps} />;
        }
        case "colorPicker": {
          return <ColorPicker {...commonProps} />;
        }
        case "inputNumber": {
          return <InputNumber {...commonProps} />;
        }
        case "slider": {
          return <Slider {...commonProps} />;
        }
        case "timePicker": {
          return <TimePicker {...commonProps} />;
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
     * 生成新增按钮 + 批量删除按钮
     */

    const generateAddAndBatchDeleteButton = () => {
      const {
        showAddButton = true,
        showBatchDeleteButton = true,
        addButtonText = "新增",
        batchDeleteButtonText = "批量删除",
      } = option;
      return (
        <div className={styles.topAction}>
          {showAddButton && (
            <Button type="primary" onClick={handleAdd}>
              {addButtonText}
            </Button>
          )}

          {showBatchDeleteButton && (
            <Button
              color="danger"
              variant="solid"
              onClick={() => onDelete(selectedRowKeys)}
            >
              {batchDeleteButtonText}
            </Button>
          )}

          {customTopAction && customTopAction()}
        </div>
      );
    };

    /**
     * 生成默认的操作按钮
     */
    const generateOperationColumn = (_: any, record: any) => {
      const {
        showEditButton = true,
        showDeleteButton = true,
        showViewButton = true,
        editButtonText = "编辑",
        deleteButtonText = "删除",
        viewButtonText = "查看",
      } = option || {};
      return (
        <Space>
          {showViewButton && (
            <Button type="primary" onClick={() => handleView(record)}>
              {viewButtonText}
            </Button>
          )}
          {showEditButton && (
            <Button type="primary" onClick={() => handleEdit(record)}>
              {editButtonText}
            </Button>
          )}
          {showDeleteButton && (
            <Button
              color="danger"
              type="default"
              variant="solid"
              onClick={() => handleDelete(record)}
            >
              {deleteButtonText}
            </Button>
          )}
          {customAction?.(record)}
        </Space>
      );
    };

    /**
     * 转换radio select checkbox 文字内容
     */

    const generateCheckboxText = (
      value: string[] | number[],
      options: IOption[]
    ) => {
      if (Array.isArray(value)) {
        return value.map((v) => {
          const option = options.find((opt) => opt.value === v);
          return option?.label;
        });
      } else {
        return value;
      }
    };

    const generateRadioText = (value: string, options: IOption[]) => {
      const option = options.find((opt) => opt.value === value);
      return option?.label;
    };
    /**
     * 生成table需要的columns
     */

    const generateColumns = (): ColumnsType<any> => {
      const columns: ColumnsType<any> = option.columns
        ?.filter(({ table }) => table?.show)
        .map((s) => {
          const { name, label, type, options, dataType, width, table = {} } = s;

          const commonProps = {
            title: label,
            key: name,
            dataIndex: name,
            width,
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

            // case type === "rate":
            //   return {
            //     ...commonProps,
            //     render: (value: any) => <Rate allowHalf disabled defaultValue={value}></Rate>,
            //   };

            case type === "switch":
              return {
                ...commonProps,
                render: (value: any) => <Switch checked={value} disabled />,
              };

            case type === "checkbox":
              return {
                ...commonProps,
                render: (value: any) => {
                  let arr = generateCheckboxText(value, options!);
                  if (Array.isArray(arr)) {
                    return arr?.join(" | ");
                  }
                  return arr;
                },
              };
            case type === "radio":
              return {
                ...commonProps,
                render: (value: any) => {
                  return generateRadioText(value, options!);
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
              return {
                ...commonProps,
                render: (value: any) => value,
              };
          }
        });

      columns.push({
        title: "操作",
        key: "actions",
        dataIndex: "action",
        render: (_, record) => {
          return generateOperationColumn(_, record);
        },
      });
      return columns;
    };

    /**
     * 处理表单那些内容需要展示
     */
    const showFormContent = () => {
      const { columns, formProps } = option;
      const currentColumns = columns.filter((f) => {
        const {
          addDisplay = true,
          editDisplay = true,
          viewDisplay = true,
        } = f.form || {};
        if (modelStatus == ModelStatus.ADD) {
          return addDisplay;
        } else if (modelStatus == ModelStatus.EDIT) {
          return editDisplay;
        } else if (modelStatus == ModelStatus.VIEW) {
          return viewDisplay;
        }
      });

      return (
        <>
          <Form {...formProps} form={form}>
            {currentColumns.map((field) => (
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                valuePropName={field.type === "switch" ? "checked" : "value"}
                rules={field.form?.rules ?? []}
              >
                {renderFormField(field, false)}
              </Form.Item>
            ))}
          </Form>
        </>
      );
    };

    /**
     * 处理搜索，调用父组件传递的方法，把内容传递出去
     */
    const handleSearch = async () => {
      const values = await searchForm.validateFields();
      console.log(" 搜索条件：values", values);
      onSearch(values);
    };

    /**
     * 渲染搜索表单
     */
    const generateSearchForm = () => {
      if (!option?.showSearch) return null;
      const {
        searchButtonText = "搜索",
        showSearchButton = true,
        resetButtonText = "重置",
        showResetButton = true,
      } = option;
      const columns = option.columns?.filter((f) => f.search?.show);

      const colItem = columns.map((field) => (
        <Col
          span={field.search?.span ?? option.searchSpan ?? 4}
          key={field.name}
        >
          <Form.Item name={field.name} label={field.label}>
            {renderFormField(field, true)}
          </Form.Item>
        </Col>
      ));

      let operate = (
        <Col span={option?.searchSpan ?? 4}>
          <Form.Item>
            {showSearchButton && (
              <Button type="primary" htmlType="submit" style={{ marginTop: 4 }}>
                {searchButtonText}
              </Button>
            )}

            {showResetButton && (
              <Button
                style={{ marginLeft: 10 }}
                onClick={() => {
                  searchForm.resetFields();
                  handleSearch();
                }}
              >
                {resetButtonText}
              </Button>
            )}
          </Form.Item>
        </Col>
      );

      return (
        <Form
          layout="inline"
          form={searchForm}
          onFinish={handleSearch}
          style={{ marginBottom: 16, width: "100%" }}
        >
          {colItem}
          {operate}
        </Form>
      );
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

    const handleEdit = (record: any) => {
      setModelStatus(ModelStatus.EDIT);
      setEditingRecord(record);
      form.setFieldsValue(record);
      setModalOpen(true);
    };

    const handleAdd = () => {
      setModelStatus(ModelStatus.ADD);
      form.resetFields();
      setEditingRecord(null);
      setModalOpen(true);
    };

    const handleView = (record: any) => {
      console.log("record", record);
      setModelStatus(ModelStatus.VIEW);
      // setEditingRecord(record);
      form.setFieldsValue(record);
      setModalOpen(true);
    };

    const handleDelete = async (record: any) => {
      await onDelete([record[primaryKey]]);
    };

    /**
     * 暴露方法
     */

    useImperativeHandle(ref, () => ({
      //新增
      openCreateModal: () => {
        handleAdd();
      },
      //编辑
      openEditModal: (record) => {
        handleEdit(record);
      },
      // 查看
      openViewModal: (record) => {
        handleView(record);
      },
      //设置默认搜索
      setDefaultSearch: (data: any) => {
        searchForm.setFieldsValue(data);
      },
    }));

    return (
      <div className="p-15">
        {/* 搜索区域 */}
        {generateSearchForm()}

        {/* 表格上方操作按钮 */}
        {generateAddAndBatchDeleteButton()}

        {/* 表格 */}
        <Table
          bordered={option.bordered || true}
          columns={generateColumns()}
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
          {showFormContent()}
        </Modal>
      </div>
    );
  }
);

export default CrudComponent;
