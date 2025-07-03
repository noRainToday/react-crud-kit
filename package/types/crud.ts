import type { DataType } from './form';
import type { IFileUpload } from './upload';

// 组合字段类型
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

export type CheckOrRadioType = "checkbox" | "radio";

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
    render?: (_:any, record: any) => React.ReactNode;
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