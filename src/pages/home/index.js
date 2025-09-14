// Home 页面：以“图片为主的卡片栅格 + 点击后浮层预览（大图 + 文本内容）”
// 说明：
// 1) 卡片区使用 CSS Grid 自适应布局；
// 2) 点击任意卡片，打开 Modal 居中浮层；
// 3) 浮层左侧为黑底承载的大图（contain防裁切），右侧为标题与正文；
// 4) 目前数据为本地静态数组 items，后续可替换为接口数据。

import { useState } from "react";
import { Card, Image, Modal, Typography } from "antd"; // 使用 antd 提供的卡片、图片、模态框与排版组件

// 静态图片资源（可替换为你的真实图片或接口返回的 URL）
import img1 from "@/assets/login2.jpg";
import img2 from "@/assets/login3.jpg";
import img3 from "@/assets/chart.png";
import img4 from "@/assets/图层 1.png";
import img5 from "@/assets/图层 2.png";
import img6 from "@/assets/图层 3.png";

const { Title, Paragraph, Text } = Typography; // antd 排版组件，标题/段落/文本

// 数据源：每个 item 代表一个图片卡片
// - id: 唯一标识
// - src: 图片地址
// - title: 标题（卡片标题、弹层标题）
// - desc: 卡片上的简短描述（两行省略）
// - content: 弹层右侧的正文内容
const items = [
  {
    id: 1,
    src: img1,
    title: "今日日常记录",
    desc: "街角遇见的一抹温柔光影。",
    content:
      "今天散步时看到的角落，光线刚好，想起很多美好的瞬间，随手记录下来。色彩和构图都很简单，但很治愈。",
  },
  {
    id: 2,
    src: img2,
    title: "随手拍的色彩",
    desc: "低饱和的小清新。",
    content:
      "随手拍的一张，整体偏低饱和，主色调很舒服。分享给同好，也欢迎在评论区讨论调色思路。",
  },
  {
    id: 3,
    src: img3,
    title: "可视化草图",
    desc: "关于数据小实验的初稿。",
    content:
      "这是一个关于数据小实验的可视化草图，后续会继续优化配色与对比度，欢迎提出建议。",
  },
  {
    id: 4,
    src: img4,
    title: "色块练习 01",
    desc: "用形状和色彩讲故事。",
    content: "尝试用最简单的形状与色块表达情绪，干净、利落，构图留白也很重要。",
  },
  {
    id: 5,
    src: img5,
    title: "色块练习 02",
    desc: "留白与层次的节奏。",
    content: "继续探索不同的留白比例和层次对画面节奏的影响，找更耐看的平衡点。",
  },
  {
    id: 6,
    src: img6,
    title: "色块练习 03",
    desc: "线条与块面的配合。",
    content:
      "线条与块面之间的关系，配色稍微更大胆一点，增加了一点点冲突与张力。",
  },
];

// 栅格容器样式：
// - repeat(auto-fill, minmax(220px, 1fr)) 使其在不同屏幕宽度下自适应列数；
// - gap 控制栅格间距；padding 外边距；alignItems 对齐行为。
const gridStyle = {
  display: "grid",
  // repeat(auto-fill, minmax(220px, 1fr)) 解析:
  // 1. repeat() 函数用于创建重复的网格轨道
  // 2. auto-fill 自动填充，会根据容器宽度自动计算可以容纳多少个列
  // 3. minmax(220px, 1fr) 设置每列的宽度范围:
  //    - 最小宽度 220px
  //    - 最大宽度 1fr (均分剩余空间)
  gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
  gap: 16,
  padding: "16px 20px",
  alignItems: "start",
};

// 卡片外观：圆角 + 轻阴影；overflow: hidden 让封面图随卡片圆角裁切
const cardStyle = {
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  // 设置鼠标悬停时的光标样式为手型，提示用户该元素可点击
  cursor: "pointer",
};

// 封面图：固定高度 220，objectFit: cover 以裁切方式铺满卡片宽度
const coverStyle = {
  width: "100%",
  height: 300,
  // cover: 图片会被缩放以填充元素的内容框。如果图片的宽高比与内容框不匹配，图片会被裁剪以适应
  objectFit: "cover",
  display: "block",
};

// Home 页面主体组件
const Home = () => {
  // open: 控制 Modal 是否可见；active: 当前点击的卡片数据
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  // 打开弹层：记录当前 item，并显示 Modal
  const onOpen = (item) => {
    setActive(item);
    setOpen(true);
  };

  // 关闭弹层
  const onClose = () => {
    setOpen(false);
  };

  return (
    <div>
      {/* 图片卡片栅格区 */}
      <div style={gridStyle}>
        {items.map((item) => (
          <Card
            key={item.id}
            hoverable // antd hover 态样式
            // 设置卡片是否有边框，false表示无边框
            bordered={false}
            style={cardStyle}
            // Card 封面使用 antd Image，preview=false 关闭内置预览（改用自定义 Modal）
            cover={
              <Image
                alt={item.title}
                src={item.src}
                // preview={false} 关闭 antd Image 组件的预览功能,因为我们使用自定义的 Modal 来预览
                preview={false}
                style={coverStyle}
              />
            }
            onClick={() => onOpen(item)} // 点击整卡打开弹层
          >
            {/* 卡片文字区域：标题 + 两行省略的描述 */}
            <div style={{ padding: "8px 12px 12px" }}>
              <Text strong>{item.title}</Text>
              <Paragraph
                type="secondary" // 设置文字为次要文本颜色(灰色)
                style={{ margin: "6px 0 0" }} // 设置上外边距为6px
                ellipsis={{ rows: 2 }} // 设置文本超过2行时显示省略号
              >
                {/* 显示每个卡片的简短描述文本，来自items数组中每个对象的desc属性 */}
                {item.desc}
              </Paragraph>
            </div>
          </Card>
        ))}
      </div>

      {/* 弹层：左侧大图（黑底承载），右侧文本内容 */}
      <Modal
        open={open}
        onCancel={onClose}
        footer={null} // 去掉底部按钮区
        centered // 居中显示
        width={1100} // 弹层宽度，按需可调
        styles={{ body: { padding: 0 } }} // v5 支持的内联样式写法，这里把 body 内边距清零
      >
        {active && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.3fr 1fr", // 左图右文的比例
              height: "90vh", // 使用视口高度单位，随页面大小自适应
              minHeight: "500px", // 设置最小高度下限，避免过小
              maxHeight: "700px", // 设置最大高度上限，避免过大
            }}
          >
            {/* 左侧：黑底包裹，图片使用 contain 保证完整显示且不被裁切 */}
            <div
              style={{
                background: "rgba(247, 247, 247)",
                display: "flex",
                // justifyContent: "center" - 控制子元素在主轴(水平)方向上居中对齐
                justifyContent: "center",
                // alignItems: "center" - 控制子元素在交叉轴(垂直)方向上居中对齐
                alignItems: "center",
              }}
            >
              <Image
                alt={active.title}
                src={active.src}
                preview={false}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </div>

            {/* 右侧：标题 + 正文，可滚动 */}
            <div style={{ padding: 20, maxHeight: "70vh", overflow: "auto" }}>
              <Title level={4} style={{ marginTop: 0 }}>
                {active.title}
              </Title>
              {/* 使用 whiteSpace: pre-wrap 保留文本中的换行和空格，实现多行文本的自然展示效果 */}
              <Paragraph
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.8",
                  fontSize: "14px",
                }}
              >
                {active.content}
              </Paragraph>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Home;
