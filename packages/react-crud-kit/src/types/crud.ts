import type { IFileUpload } from "./upload";
import type { IRuleItem, IOption, FieldType, DataType } from "./base";
import type { FormProps } from "antd";



//表格多选/单选
export type CheckOrRadioType = "checkbox" | "radio";
//crud 操作配置
export interface ICrudOption {
  title?: string;
  bordered?: boolean;
  showSearch?: boolean;
  searchSpan?: number;
  tableHeight?: number,

  showAddButton?: boolean;
  addButtonText?: string;

  showEditButton?: boolean;
  editButtonText?: string;

  showDeleteButton?: boolean;
  deleteButtonText?: string;

  showViewButton?: boolean;
  viewButtonText?: string;

  showBatchDeleteButton?: boolean;
  batchDeleteButtonText?: string;

  searchButtonText?: string;
  showSearchButton?: boolean;

  resetButtonText?: string;
  showResetButton?: boolean;

  selection?: boolean;
  checkOrRadio?: CheckOrRadioType;

  formProps?: FormProps;
  columns: FieldSchema[];
}

//字段配置
export interface FieldSchema {
  type: FieldType;
  name: string;
  label: string;
  dataType?: DataType;
  options?: IOption[];
  searchSpan?: number;
  span?: number;
  fileUpload?: IFileUpload;
  props?: Record<string, any>; //需要传递到子组件的
  width?: number | string;
  table?: ITable;
  form?: IForm;
  search?: ISearch;
}
//table 配置
export interface ITable {
  width?: number | string;
  isActionColumn?: boolean;
  show?: boolean;
  showEdit?: boolean;
  editButtonType?: "primary" | "link";
  showDelete?: boolean;
  deleteButtonColor?: "danger" | "volcano" | "orange";
  render?: (_: any, record: any) => React.ReactNode;
}
//表单配置
export interface IForm {
  addDisplay?: boolean;
  editDisplay?: boolean;
  viewDisplay?: boolean;
  placeholder?: string;
  rules?: IRuleItem[];
  render?: (props: any) => React.ReactNode;
}

//搜索配置
export interface ISearch {
  show?: boolean;
  placeholder?: string;
  span?: number;
}
//传入crud组件的props
export interface ICrudProps {
  option: ICrudOption;
  primaryKey?: string;
  listData: any[];
  loading: boolean;
  onSearch: (data: any) => void;
  onAdd: (data: any) => void;
  onUpdate: (data: any) => void;
  onDelete: (data: any) => void;
  customAction?: (record: any) => React.ReactNode;
  customTopAction?: () => React.ReactNode;
  pagination: IBasePagination;
}
//crud组件导出的方法
export interface CrudExposeMethods {
  openCreateModal: () => void;
  openEditModal: (record: any) => void;
  openViewModal: (record: any) => void;
}
//分页与分页处理函数
export interface IBasePagination {
  current: number;
  pageSize: number;
  total: number;
  handlePageChange: (current: number, pageSize: number) => void;
  handleSizeChange: (current: number, pageSize: number) => void;
}
