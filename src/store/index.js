//进行组合redux子模块并导出store实例
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./modules/user";
export default configureStore({
  //简化Store配置：自动组合多个slice reducers（如当前项目的userReducer）
  reducer: {
    user: userReducer,
    //当组件通过 useSelector 获取状态时，需要通过 state.user.token 访问具体值
    //状态隔离：所有用户相关的状态数据（如token）都存储在 state.user 对象下
    
  },
});
