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
