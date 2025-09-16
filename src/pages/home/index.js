// Home 页面：以“图片为主的卡片栅格 + 点击后浮层预览（大图 + 文本内容）”
// 说明：
// 1) 卡片区使用 CSS Grid 自适应布局；
// 2) 点击任意卡片，打开 Modal 居中浮层；
// 3) 浮层左侧为黑底承载的大图（contain防裁切），右侧为标题与正文；
// 4) 数据改为通过简易接口获取列表与详情。

import { useEffect, useState } from "react";
import { Card, Image, Modal, Typography } from "antd"; // 使用 antd 提供的卡片、图片、模态框与排版组件
import { getHomeCards, getHomeCardDetail } from "@/apis/home";

const { Title, Paragraph, Text } = Typography; // antd 排版组件，标题/段落/文本

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
  // 列表数据 & 详情弹层状态
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  // 初始化获取卡片列表
  useEffect(() => {
    async function fetchList() {
      try {
        const res = await getHomeCards();
        // 期望返回 { data: [...] }
        setItems(res.data || []);
      } catch (err) {
        console.error("获取首页卡片列表失败", err);
      }
    }
    fetchList();
  }, []);

  // 打开弹层：先显示基本信息，再请求详情补齐 content / cover
  const onOpen = async (item) => {
    // 1. 先设置初始状态 - 显示基础卡片信息和打开弹层
    setActive(item);
    setOpen(true);

    try {
      // 2. 请求详情数据
      const res = await getHomeCardDetail(item.id);
      const data = res?.data;

      if (data) {
        // 3. 从详情数据中提取第一张图片
        const firstImage = data.cover?.images?.[0];

        // 4. 更新当前激活的卡片详情
        // - 使用函数式更新确保基于最新状态
        // - 合并原有数据和新详情数据
        // - 如果有新图片则更新图片地址
        setActive((prev) => {
          const merged = { ...prev, ...data };
          if (firstImage) merged.src = firstImage;
          return merged;
        });

        // 5. 如果有新图片，同步更新列表中对应卡片的图片
        if (firstImage) {
          setItems((prev) =>
            prev.map((it) =>
              // 找到匹配ID的卡片，更新其图片地址
              // 如果当前遍历的卡片ID等于目标卡片ID
              // 则返回一个新对象,包含原卡片所有属性(...it)并更新src为新图片地址
              // 否则返回原卡片对象不做修改
              it.id === item.id ? { ...it, src: firstImage } : it
            )
          );
        }
      }
    } catch (err) {
      // 6. 错误处理
      console.error("获取卡片详情失败", err);
    }
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
                {item.desc}
              </Paragraph>
            </div>
          </Card>
        ))}
      </div>

      {/* 弹层：左侧大图（灰底承载），右侧文本内容 */}
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
            {/* 左侧：灰底包裹，图片使用 contain 保证完整显示且不被裁切 */}
            <div
              style={{
                background: "rgba(247, 247, 247)",
                display: "flex",
                justifyContent: "center",
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
              {/* content 支持 HTML（例如 <p>...） */}
              {active.content ? (
                <div
                  style={{
                    whiteSpace: "normal",
                    lineHeight: "1.8",
                    fontSize: "14px",
                    wordBreak: "break-word",
                  }}
                  dangerouslySetInnerHTML={{ __html: active.content }}
                />
              ) : (
                <Paragraph
                  style={{
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.8",
                    fontSize: "14px",
                  }}
                >
                  正在加载详情...
                </Paragraph>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Home;
