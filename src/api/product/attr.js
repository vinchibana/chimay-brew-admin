import request from "@/utils/request";

export const reqCat1 = () =>
  request({ url: "/admin/product/getCategory1", method: "get" });

export const reqCat2 = (category1Id) =>
  request({ url: `/admin/product/getCategory2/${category1Id}`, method: "get" });

export const reqCat3 = (category2Id) =>
  request({ url: `/admin/product/getCategory3/${category2Id}`, method: "get" });

export const reqAttrList = (category1Id, category2Id, category3Id) =>
  request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: "get",
  });

export const reqAddAttr = (attrData) =>
  request({
    url: "/admin/product/saveAttrInfo",
    method: "post",
    data: attrData,
  });
