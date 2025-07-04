import type {
  ISaveBase,
  ActiveListResponse,
  ActiveDetailResponse,
} from "./type";
import { testDataList } from "./data";
const getActiveList = (params: any): Promise<ActiveListResponse> => {
  console.log(params);
  return new Promise((resolve) => {
    resolve({
      records: testDataList,
      total: testDataList.length,
      current: 1,
      page: 1,
      size: 10,
    });
  });
};

const editActive = (params: ActiveDetailResponse): Promise<ISaveBase> => {
  console.log(params);
  const num = testDataList.findIndex((i) => i.id === params.id);
  testDataList[num] = params;
  return new Promise((resolve) => {
    resolve({
      code: 200,
      data: {},
      msg: "编辑成功",
      success: true,
    });
  });
};

const addActive = (params: ActiveDetailResponse): Promise<ISaveBase> => {
  console.log(params);
  testDataList.push({
    ...params,
    id: new Date().getTime() + "",
  });
  return new Promise((resolve) => {
    resolve({
      code: 200,
      data: {},
      msg: "新增成功",
      success: true,
    });
  });
};

const removeActive = (params: {
  id: string | string[];
}): Promise<ISaveBase> => {
  const { id } = params;
  if (Array.isArray(id)) {
    id.forEach((ids) => {
      testDataList.splice(
        testDataList.findIndex((i) => i.id === ids),
        1
      );
    });
  } else {
    testDataList.splice(
      testDataList.findIndex((i) => i.id === id),
      1
    );
  }
  console.log(params);
  return new Promise((resolve) => {
    resolve({
      code: 200,
      data: {},
      msg: "删除成功",
      success: true,
    });
  });
};

const getActiveDetail = (params: {
  id: string;
}): Promise<ISaveBase<ActiveDetailResponse>> => {
  const { id } = params;
  const list = testDataList.filter((i) => i.id === id);
  return new Promise((resolve) => {
    resolve({
      code: 200,
      data: list[0],
      msg: "获取成功",
      success: true,
    });
  });
};

export { getActiveList, editActive, addActive, removeActive, getActiveDetail };
