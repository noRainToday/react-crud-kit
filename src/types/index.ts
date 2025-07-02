export type FieldType =
  | "input"
  | "select"
  | "radio"
  | "checkbox"
  | "switch"
  | "custom";

export interface FieldSchema {
  type: FieldType;
  name: string;
  label: string;
  options?: { label: string; value: any }[];
  props?: Record<string, any>;
  searchSpan?: number;
  table?: {
    show?: boolean;
    width?: number | string;
    isActionColumn?: boolean;
    showEdit?: boolean;
    editButtonType?: "primary" | "link";
    showDelete?: boolean;
    deleteButtonColor?: "danger" | "volcano" | "orange";
    render?: (record: any) => React.ReactNode;
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

export interface CrudProps {
  schema: FieldSchema[];
  primaryKey?: string;
  title?: string;
  showAddButton?: boolean;
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
