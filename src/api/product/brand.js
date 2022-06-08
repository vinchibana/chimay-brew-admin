import request from "@/utils/request";

export const reqBrandList = (page, limit) =>
  request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: "get",
  });

export const reqAddOrModifyBrand = (brand) => {
  if (brand.id) {
    return request({
      url: "/admin/product/baseTrademark/update",
      method: "put",
      data: brand,
    });
  } else {
    return request({
      url: "/admin/product/baseTrademark/save",
      method: "post",
      data: brand,
    });
  }
};

export const reqDeleteBrand = (id) =>
  request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: "delete"
  });
