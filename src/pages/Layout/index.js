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
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUserInfo, fetchUserInfo } from "@/store/modules/user";
const { Header, Sider } = Layout;

const items = [
  {
    label: "首页",
    key: "/home",
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

  //触发个人用户信息
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);
  //异步操作处理 ： fetchUserInfo() 是一个异步action创建函数，它返回一个函数而不是普通action对象
  //中间件支持 ：通过dispatch调用异步action，使得Redux可以借助中间件（如Redux Toolkit内置的thunk中间件）处理异步逻辑

  //退出登录确认回调
  const onConfirm = () => {
    console.log("确认退出");
    dispatch(clearUserInfo());
    navigate("/login");
  };

  const name = useSelector((state) => state.user.userInfo.name); //useSelector从redux中获取数据
  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{name}</span>
          <span className="user-logout">
            <Popconfirm
              title="是否确认退出？"
              okText="退出"
              cancelText="取消"
              onConfirm={onConfirm}
            >
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
