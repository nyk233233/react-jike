// Home 页面简易接口（临时本地模拟版）
// 设计目标：
// - 列表接口：返回用于格栅卡片的简短信息（id、src、title、desc）
// - 详情接口：根据 id 返回正文内容（content）以及可选的扩展字段
// - 与真实后端对齐的推荐路径：
//   GET /home/cards            -> { data: Array<{ id, src, title, desc }> }
//   GET /home/cards/:id        -> { data: { id, content, title?, src?, desc? } }
//
// 说明：当前先用本地静态数据模拟，后续后端具备时只需把 Promise.resolve 换成真实 request 调用即可：
//   import { request } from "@/utils";
//   export function getHomeCards() {
//     return request({ url: "/home/cards", method: "GET" });
//   }
//   export function getHomeCardDetail(id) {
//     return request({ url: `/home/cards/${id}`, method: "GET" });
//   }

// 使用与原页面相同的本地图片资源
import img1 from "@/assets/login2.jpg";
import img2 from "@/assets/login3.jpg";
import img3 from "@/assets/chart.png";
import img4 from "@/assets/图层 1.png";
import img5 from "@/assets/图层 2.png";
import img6 from "@/assets/图层 3.png";

const LIST = [
  { id: 1, src: img1, title: "今日日常记录", desc: "街角遇见的一抹温柔光影。" },
  { id: 2, src: img2, title: "随手拍的色彩", desc: "低饱和的小清新。" },
  { id: 3, src: img3, title: "可视化草图", desc: "关于数据小实验的初稿。" },
  { id: 4, src: img4, title: "色块练习 01", desc: "用形状和色彩讲故事。" },
  { id: 5, src: img5, title: "色块练习 02", desc: "留白与层次的节奏。" },
  { id: 6, src: img6, title: "色块练习 03", desc: "线条与块面的配合。" },
];

const DETAIL = {
  1: {
    id: 1,
    content:
      "今天散步时看到的角落，光线刚好，想起很多美好的瞬间，随手记录下来。色彩和构图都很简单，但很治愈。",
  },
  2: {
    id: 2,
    content:
      "随手拍的一张，整体偏低饱和，主色调很舒服。分享给同好，也欢迎在评论区讨论调色思路。",
  },
  3: {
    id: 3,
    content:
      "这是一个关于数据小实验的可视化草图，后续会继续优化配色与对比度，欢迎提出建议。",
  },
  4: {
    id: 4,
    content: "尝试用最简单的形状与色块表达情绪，干净、利落，构图留白也很重要。",
  },
  5: {
    id: 5,
    content: "继续探索不同的留白比例和层次对画面节奏的影响，找更耐看的平衡点。",
  },
  6: {
    id: 6,
    content:
      "线条与块面之间的关系，配色稍微更大胆一点，增加了一点点冲突与张力。",
  },
};

export function getHomeCards() {
  // 模拟网络请求延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: LIST });
    }, 150);
  });
}

export function getHomeCardDetail(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 从DETAIL对象中根据id获取对应的详情数据，如果没有找到则返回一个包含默认内容的对象
      const data = DETAIL[id] || { id, content: "暂无详情" };
      // resolve是Promise的内置方法,用于返回成功结果
      // 而request是发送HTTP请求的方法,会真实调用后端API
      // 这里用resolve模拟API响应的数据结构
      resolve({ data });
    }, 150);
  });
}
