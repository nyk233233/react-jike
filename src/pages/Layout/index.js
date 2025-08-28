// //测试token是否成功注入

// import { useEffect } from "react";
// import { request } from "@/utils";

// const Layout = () => {
//   useEffect(() => {
//     request.get("/user/profile");
//   }, []);
//   return <div>this is layout</div>;
// };
// export default Layout;

import { Layout, Menu, Popconfirm } from "antd";
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./index.scss";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Sider } = Layout;

const items = [
  {
    label: "首页",
    key: "/",
    icon: <HomeOutlined />,
  },
  {
    label: "文章管理",
    key: "/article",
    icon: <DiffOutlined />,
  },
  {
    label: "创建文章",
    key: "/publish",
    icon: <EditOutlined />,
  },
];

const GeekLayout = () => {
  const navigate = useNavigate();
  const onMenuClick = (route) => {
    console.log("菜单点击", route);
    const path = route.key;
    navigate(path);
  };

  //反向高亮
  const location = useLocation();
  console.log(location.pathname);
  const selectedkey = location.pathname;

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">柴柴老师</span>
          <span className="user-logout">
            <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消">
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            // defaultSelectedKeys={["1"]}默认选中
            selectedKeys={selectedkey}
            onClick={onMenuClick}
            // ant design 的 api 文档中有说明onClick 的“类型”列有说明，是一个对象，里面有 key 字段
            items={items}
            style={{ height: "100%", borderRight: 0 }}
          ></Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  );
};
export default GeekLayout;
