import { request } from "@/utils";
export function getChannelAPI() {
  return request({
    url: "/channels",
    method: "GET",
  });
}
export function createArticleAPI(data) {
  return request({
    url: "/mp/articles?draft=fales",
    method: "POST",
    data,
  });
}

//获取文章列表
export function getArticleListAPI(params) {
  return request({
    url: "/mp/articles",
    method: "Get",
    params,
  });
}

//删除文章
export function delArticleAPI(id) {
  return request({
    url: `mp/articles/${id}`, //es6模版字符串
    method: "DELETE",
  });
}
//获取文章详情
export function getArticleById(id) {
  return request({
    url: `/mp/articles/${id}`,
  });
}
