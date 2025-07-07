import { forwardRef, useImperativeHandle } from "react";
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
  ({ formProps, columns }, ref) => {
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
     * 处理表单那些内容需要展示
     */
    const showFormContent = () => {
      return (
        <>
          <Form {...formProps} form={form}>
            {columns.map((field) => (
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                valuePropName={field.type === "switch" ? "checked" : "value"}
                rules={field?.rules ?? []}
              >
                {renderFormField(field)}
              </Form.Item>
            ))}

            <Form.Item >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button onClick={() => form.resetFields()}>reset</Button>
            </Form.Item>
          </Form>
        </>
      );
    };

    /**
     * 暴露方法
     */
    useImperativeHandle(ref, () => ({
      //设置默认值
      setDefaultValues: (data: any) => {
        form.setFieldsValue(data);
      },
    }));
    return <div>{showFormContent()}</div>;
  }
);

export default AFrom;
