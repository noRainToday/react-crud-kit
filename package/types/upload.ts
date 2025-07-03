import type { UploadFile, UploadProps } from 'antd';

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

/**
 * 文件上传配置
 */
export interface IFileUpload {
  action: string; //上传的url '/api/blade-resource/oss/endpoint/put-file-attach'
  accept?: string | string[];
  multiple?: boolean; //多个上传
  maxCount?: number; //最大数量
  propsHttp?: IPropsHttp;
  headers?: Record<string, string>; //上传的header
}

/**
 * 图片上传组件属性
 */
export interface UploadPictureProps {
  action: string;
  value?: any[];
  onChange?: (val: UploadFile[]) => void;
  onUploadSuccess?: (val: UploadFile[]) => void;
  propsHttp: IPropsHttp;
  headers?: Record<string, string>;
  multiple?: boolean;
  maxCount?: number;
}


/**
 * 文件列表上传组件属性
 */
export interface UploadFileListProps {
  action: string;
  value?: any[];
  onChange?: (val: UploadFile[]) => void;
  onUploadSuccess?: (val: UploadFile[]) => void;
  propsHttp: IPropsHttp;
  headers?: Record<string, string>;
  multiple?: boolean;
  maxCount?: number;
}

/**
 * 上传字段类型
 */
export type UploadFieldType = "uploadPicture" | "uploadFile";