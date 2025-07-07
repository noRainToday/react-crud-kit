import type { DataType, FieldType, IOption, IRuleItem } from "./base";
import type { IFileUpload } from "./upload";
import type { FormProps } from "antd";

//crud 操作配置
export interface IFormOption {
  formProps?: FormProps;
  menuConfig?: IMenuBtn;
  columns: FormFieldSchema[];
}

export interface IMenuBtn {
  menuBtn?: boolean;
  submitBtn?: boolean;
  submitText?: string;
  resetBtn?: boolean;
  resetText?: string;
}
//字段配置
export interface FormFieldSchema {
  type: FieldType;
  name: string;
  label: string;
  dataType?: DataType;
  options?: IOption[];
  searchSpan?: number;
  fileUpload?: IFileUpload;
  props?: Record<string, any>; //需要传递到子组件的
  width?: number | string;
  rules?: IRuleItem[];
  render?: (props: any) => React.ReactNode;
}

export interface FormExposeMethods {
  setDefaultValues: (values: Record<string, any>) => void;
}
