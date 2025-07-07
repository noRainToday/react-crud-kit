import { forwardRef, useImperativeHandle, useMemo } from "react";
import {
  Form,
  Input,
  Select,
  Switch,
  Radio,
  Checkbox,
  Rate,
  TreeSelect,
  ColorPicker,
  InputNumber,
  Slider,
  TimePicker,
  Button,
  Col,
  Row,
} from "antd";
import UploadPicture from "@/components/upload/UploadPicture";
import UploadFileList from "@/components/upload/UploadFileList";
import DatePicker from "@/components/form/ADatePicker";
import type {
  IFormOption,
  FormFieldSchema,
  FormExposeMethods,
} from "@/types/form";

const AFrom = forwardRef<FormExposeMethods, IFormOption>(
  ({ formProps, menuConfig, columns }, ref) => {
    const [form] = Form.useForm();

    const renderFormField = (field: FormFieldSchema) => {
      const commonProps = {
        ...field.props,
      };
      //判断是否自定义
      if (field?.render) {
        return field.render(commonProps);
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
          return <Switch {...commonProps} />;
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
        case "uploadPicture":
          return renderUpload(field, "picture");
        case "uploadFile":
          return renderUpload(field, "file");
        default:
          return <Input {...commonProps} />;
      }
    };

    /**
     * 处理按钮
     */
    const generateMenuBtn = () => {
      const {
        menuBtn = true,
        submitBtn = true,
        submitText = "提交",
        resetBtn = true,
        resetText = "重置",
        position = "right",
      } = menuConfig ?? {};

      if (menuBtn) {
        return (
          <Form.Item style={{ textAlign: position, marginBottom: 16 }}>
            {submitBtn && (
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: 16 }}
              >
                {submitText}
              </Button>
            )}
            {resetBtn && (
              <Button onClick={() => form.resetFields()}>{resetText}</Button>
            )}
          </Form.Item>
        );
      }
    };

    /**
     * 文件上传
     */

    const renderUpload = (field: FormFieldSchema, type: "picture" | "file") => {
      const {
        action = "",
        propsHttp = { res: "data", url: "url", name: "name" },
        headers,
        multiple = false,
        maxCount = 2,
      } = field.fileUpload!;

      const UploadComponent =
        type === "picture" ? UploadPicture : UploadFileList;

      return (
        <UploadComponent
          action={action}
          propsHttp={propsHttp}
          headers={headers}
          multiple={multiple}
          maxCount={maxCount}
          onUploadSuccess={(fileData) => {
            form.setFieldsValue({ [field.name]: fileData });
          }}
        />
      );
    };

    /**
     * 处理表单那些内容需要展示
     */
    const formFields = useMemo(() => {
      return (
        <Row gutter={24}>
          {columns.map((field) => (
            <Col span={field.span ?? 12} key={field.name}>
              <Form.Item
                name={field.name}
                label={field.label}
                valuePropName={field.type === "switch" ? "checked" : "value"}
                rules={field?.rules ?? []}
              >
                {renderFormField(field)}
              </Form.Item>
            </Col>
          ))}
        </Row>
      );
    }, [columns]);

    /**
     * 暴露方法
     */
    useImperativeHandle(ref, () => ({
      //设置默认值
      setDefaultValues: (data: any) => {
        form.setFieldsValue(data);
      },
      getValues: () => form.getFieldsValue(),
      validate: () => form.validateFields(),
      resetFields: () => form.resetFields(),
    }));
    return (
      <div>
        <Form
          {...formProps}
          form={form}
          onFinish={(values) => {
            formProps?.onFinish?.(values); // 执行原有
          }}
        >
          {formFields}

          {generateMenuBtn()}
        </Form>
      </div>
    );
  }
);

export default AFrom;
