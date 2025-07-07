import type { DatePickerProps } from "antd/lib";




  // 表单字段类型
export type FieldType =
  | "input"
  | "select"
  | "radio"
  | "datePicker"
  | "checkbox"
  | "switch"
  | "custom"
  | "uploadPicture"
  | "uploadFile"
  | "treeSelect"
  | "rate"
  | "inputNumber"
  | "slider"
  | "timePicker"
  | "colorPicker";

/**
 * 数据类型
 */
export type DataType = "string" | "number" | "boolean" | "array" | "object";


/**
 * 自定义日期选择器属性
 */
export interface ADatePickerProps
  extends Omit<DatePickerProps, "value" | "onChange"> {
  value?: string;
  valueFormat?: string;
  onChange?: (val?: string) => void;
}

/**
 * 表单字段配置
 */
export interface FormFieldConfig {
  show?: boolean;
  required?: boolean;
  placeholder?: string;
  defaultValue?: any;
}

/**
 * 搜索字段配置
 */
export interface SearchFieldConfig {
  show?: boolean;
  placeholder?: string;
  span?: number;
}

/**
 * 内容校验
 */
export interface IRuleItem {
  required?: boolean;
  message?: string;
  trigger?: "blur" | "change";
}


/**
 * 树组件
 */
export interface ITreeProps {
  treeData?: any[];
  value?: string[];
  onChange?: (newValue: string[]) => void;
  treeCheckable?: boolean;
  placeholder?: string;
  showParent?: boolean;
}


export interface IOption {
  label: string;
  value: any;
}
