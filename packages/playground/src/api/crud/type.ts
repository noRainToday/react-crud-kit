export interface ISaveBase<T = any> {
  code: number;
  data: T | null;
  msg: string;
  success: boolean;
}

export interface Page<T> {
  current: number; // 当前页
  size: number; // 每页条数
  total: number; // 总条数
  page: number;
  records?: T[]; // 当前页数据
  data?: T[]; // 当前页数据
}
export interface FileItem {
  url: string;
  name: string;
  size?: number;
  type?: string;
  id?: string;
  createTime?: string;
}
export type ActiveListResponse = Page<ActiveDetail>;

export type ActiveDetailResponse = ActiveDetail;

export interface ActiveDetail {
  content: string;
  endTime: string;
  fileList?: FileItem[];
  flag: number;
  id: string;
  isDeleted: number;
  number: number;
  pic: string;
  startTime: string;
  status: number;
  title: string;
  score: number;
  treeId: string;
  sex: number;
  hobby: number[];
  isSwitch: boolean;
}
