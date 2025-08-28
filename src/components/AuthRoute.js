//封装高阶组件
//核心逻辑：有token正常跳转 无token 取登录
import { getToken } from "@/utils";
import { Navigate } from "react-router-dom";
export function AuthRoute({ children }) {
  //组件children属性接收
  const token = getToken();
  if (token) {
    return <>{children}</>; //幽灵标签，只当做一个最外层包裹标签，实际并不会渲染
  } else {
    return <Navigate to={"/login"} replace />; //Navigate来自rrd的重定向组件，replace是“不要之前的“原则
  }
}
