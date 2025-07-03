export type FieldType =
  | "input"
  | "select"
  | "radio"
  | "datePicker"
  | "checkbox"
  | "switch"
  | "custom"
  | "uploadPicture"
  | "uploadFile";

/**
 * 配置上传文件后返回字段的映射
 * 如果返回对象不是data包裹的，需要配置res字段
 * 如果返回的链接不是url的，需要配置url字段
 * 如果返回的文件名不是name的，需要配置name字段
 */
export interface IPropsHttp {
  res: string;
  url: string;
  name: string;
}
export interface IFileUpload {
  action: string; //上传的url '/api/blade-resource/oss/endpoint/put-file-attach'
  accept?: string | string[];
  multiple?: boolean; //多个上传
  maxCount?: number; //最大数量
  propsHttp?: IPropsHttp;
  headers?: Record<string, string>; //上传的header
}

export type CheckOrRadioType = "checkbox" | "radio";

export type DataType = "string" | "number" | "boolean" | "array" | "object";

export const DataTypeEnum = {
  String: "string",
  Number: "number",
  Array: "array",
  Object: "object",
  Boolean: "boolean",
};

export interface ICrudOption {
  title?: string;
  bordered?: boolean;
  showSearch?: boolean;
  searchSpan?: number;
  showAddButton?: boolean;
  addButtonText?: string;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  showBatchDeleteButton?: boolean;
  batchDeleteButtonText?: string;
  selection?: boolean;
  checkOrRadio?: CheckOrRadioType;
  columns: FieldSchema[];
}

export interface FieldSchema {
  type: FieldType;
  name: string;
  label: string;
  dataType?: DataType;
  options?: { label: string; value: any }[];
  props?: Record<string, any>; //需要传递到子组件的
  searchSpan?: number;
  fileUpload?: IFileUpload;
  table?: {
    show?: boolean;
    width?: number | string;
    isActionColumn?: boolean;
    showEdit?: boolean;
    editButtonType?: "primary" | "link";
    showDelete?: boolean;
    deleteButtonColor?: "danger" | "volcano" | "orange";
    render?: (_, record: any) => React.ReactNode;
  };
  form?: {
    show?: boolean;
    required?: boolean;
    placeholder?: string;
    defaultValue?: any;
  };
  search?: {
    show?: boolean;
    placeholder?: string;
    span?: number;
  };
}

export interface ICrudProps {
  option: ICrudOption;
  primaryKey?: string;
  title?: string;
  addButtonText?: string;
  listData: any[];
  loading: boolean;
  onSearch: (data: any) => void;
  onAdd: (data: any) => void;
  onUpdate: (data: any) => void;
  onDelete: (data: any) => void;
  pagination: IBasePagination;
}

export interface CrudExposeMethods {
  openCreateModal: () => void;
  openEditModal: (record: any) => void;
}

export interface IBasePagination {
  current: number;
  pageSize: number;
  total: number;
  handlePageChange: (current: number, pageSize: number) => void;
  handleSizeChange: (current: number, pageSize: number) => void;
}
