//和用户相关的状态管理
import { createSlice } from "@reduxjs/toolkit";
import { request } from "@/utils";
// useStore 是通过 createSlice 创建的对象，用于管理用户相关的状态。
// createSlice 会自动生成 action 创建函数和 reducer 函数，方便进行状态管理。
// 借助 useStore 可以方便地获取状态修改的 action 和处理状态更新的 reducer。
const useStore = createSlice({
  name: "user",
  //数据状态
  //1. Redux的token本质上存储在内存中的状态对象里
  initialState: {
    token: localStorage.getItem("token_key") || "",
  },
  //同步修改方法
  // reducers 对象用于定义同步修改状态的方法
  reducers: {
    // setToken 是一个 reducer 函数，用于修改状态中的 token 值
    // state 表示当前的状态对象，action 是一个包含 type 和 payload 的对象
    // action.payload 是调用该 action 时传递的数据
    setToken(state, action) {
      // 将 action.payload 的值赋给 state.token，从而更新状态中的 token 值
      // action.payload 由调用 setToken action 创建函数时传入，通常在组件中调用 setToken 时定义该值
      state.token = action.payload;
      //localstorage也存一份
      localStorage.setItem("token_key", action.payload);
    },
  },
});
//解构出actionCreater
// 从 useStore 的 actions 对象中解构出 setToken action 创建函数，该函数用于创建修改 token 的 action
const { setToken } = useStore.actions;

// 原代码存在错误，useStore.reducers 是错误的访问方式，应该使用 useStore.reducer 获取 reducer 函数
// 获取用户状态管理的 reducer 函数，该函数用于处理 state 的更新逻辑
const userReducer = useStore.reducer;
//userReducer是连接切片定义与 store 注册D:\前端代码\react项目\react-jike\src\store\index.js的桥梁
//它提取了用户模块的 reducer 函数，使其能够被注册到 Redux store 中，负责管理用户相关的状态（如 token）。

//异步方法 完成登录获取token

// loginForm 通常由登录页面的表单组件收集用户输入的账号、密码等登录信息后传入。
// 其用处是作为请求体数据，发送到服务器的登录接口（/authorizations），
// 以验证用户身份，若验证通过则获取登录凭证 token。
const fetchLogin = (loginForm) => {
  return async (dispatch) => {
    //1.发送异步请求,账号存在则返回token，不存在注册后并自动登录同时返回token
    const res = await request.post("/authorizations", loginForm);
    //2.提交同步action进行token的存入
    dispatch(setToken(res.data.token));
    // 当调用 dispatch(setToken(res.data.token)) 时，发生以下步骤：

    //1. setToken(res.data.token) 生成一个 action 对象： { type: 'user/setToken', payload: res.data.token }
    //2. dispatch 将这个 action 发送给 Redux store
    //3. store 调用 userReducer 处理这个 action
    //4. userReducer 中的 setToken 函数执行，将 state.token 更新为 action.payload （即服务器返回的 token）
  };
};

// 导出 setToken action 创建函数，方便在其他地方调用以触发状态更新
export { fetchLogin, setToken };

// 默认导出用户状态管理的 reducer 函数，用于在 store 中注册
export default userReducer;
