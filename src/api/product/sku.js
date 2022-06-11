import request from "@/utils/request";

export const reqSkuList = (page, limit) =>
  request({ url: `/admin/product/list/${page}/${limit}`, method: "get" });

export const reqOnSale = (skuId) =>
  request({ url: `/admin/product/onSale/${skuId}`, method: "get" });

export const reqCancelSale = (skuId) =>
  request({ url: `/admin/product/cancelSale/${skuId}`, method: "get" });

export const reqSkuById = (skuId) =>
  request({ url: `/admin/product/getSkuById/${skuId}`, method: "get" });
