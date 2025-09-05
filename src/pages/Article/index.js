import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  DatePicker,
  Select,
  Popconfirm,
} from "antd";
//引入汉化包，时间选择器选择中文
import locale from "antd/es/date-picker/locale/zh_CN";

// 导入资源
import { Table, Tag, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import img404 from "@/assets/error.png";
import { useChannel } from "@/hooks/useChannel";
import { useEffect, useState } from "react";
import { delArticleAPI, getArticleListAPI } from "@/apis/article";

const { Option } = Select;
const { RangePicker } = DatePicker;

const Article = () => {
  const navigate = useNavigate();
  const { channelList } = useChannel();
  //定义枚举状态----如果适配的状态有多个用枚举渲染
  const status = {
    1: <Tag color="warning">待审核</Tag>,
    2: <Tag color="success">审核通过</Tag>,
  };
  const columns = [
    {
      title: "封面",
      dataIndex: "cover",
      width: 120,
      render: (cover) => {
        return (
          <img src={cover.images[0] || img404} width={80} height={60} alt="" />
        );
      },
    },
    {
      title: "标题",
      dataIndex: "title",
      width: 220,
    },
    {
      title: "状态",
      dataIndex: "status",
      //data-后端返回的状态status 根据它做条件渲染
      //data === 1 => 待审核，2待审核
      render: (data) => status[data],
    },
    {
      title: "发布时间",
      dataIndex: "pubdate",
    },
    {
      title: "阅读数",
      dataIndex: "read_count",
    },
    {
      title: "评论数",
      dataIndex: "comment_count",
    },
    {
      title: "点赞数",
      dataIndex: "like_count",
    },
    {
      title: "操作",
      render: (data) => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => navigate(`/publish?id=${data.id}`)} //这里为啥用箭头函数引导navigate？
            />
            <Popconfirm
              title="删除文章"
              description="确认要删除当前文章吗"
              onConfirm={() => onConfirm(data)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // 注意：之前的静态测试数据已删除，现在使用API获取的动态数据
  //筛选功能
  //1.准备参数
  const [reqData, setReqData] = useState({
    status: "",
    channel_id: "",
    begin_pubdate: "",
    end_pubdate: "",
    page: 1,
    per_page: 4,
  });
  //4.获取文章列表+x渲染table逻辑重复复用
  //reqData依赖项发生变化，重复执行副作用函数
  const [list, setList] = useState([]); //初始值传一个数组保证结果是数组
  const [count, setCount] = useState(0);
  useEffect(() => {
    async function getList() {
      const res = await getArticleListAPI(reqData);
      setList(res.data.results);
      setCount(res.data.total_count);
    }
    getList();
  }, [reqData]);

  //2.获取筛选数据
  const onFinish = (formValue) => {
    console.log(formValue);
    //3.把表单数据收集放到参数中
    setReqData({
      ...reqData,
      channel_id: formValue.channel_id,
      status: formValue.status,
      begin_pubdate: formValue.date[0].format("YYYY-MM-DD"), //format('YYYY-MM-DD')格式化为字符串，
      end_pubdate: formValue.date[1].format("YYYY-MM-DD"),
    });
    //4.重新拉取文章列表
  };
  //分页
  const onPageChange = (page) => {
    console.log(page);
    //修改参数依赖项，印发数据的重新获取列表渲染
    //你能分页是因为一次性拿到了所有数据，但是这里要做的是一次只请求那一页的数据
    setReqData({
      ...reqData,
      page, //展开后给一个新page
    });
  };

  //删除
  const onConfirm = async (data) => {
    console.log("删除点了");
    await delArticleAPI(data.id);
    setReqData({
      //调用setReqData时，虽然reqData本身并没有改变，但是React会发现新生成的对象与之前的对象不同，因此会触发组件重渲染和useEffect钩子的执行
      ...reqData,
    });
  };
  //最好页码重置一下，不然如果当前页只有一条数据，删除掉后就没有数据了，再查询当前页就查询不到数据了
  //如果删除的是最后一页并且只有一条数据，page需要减1
  return (
    <div>
      <Card
        title={
          <Breadcrumb
            items={[
              { title: <Link to={"/"}>首页</Link> },
              { title: "文章列表" },
            ]}
          />
        }
        style={{ marginBottom: 20 }}
      >
        <Form initialValues={{ status: "" }} onFinish={onFinish}>
          {/* onFinish拿数据 */}
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={""}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={2}>审核通过</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              defaultValue="lucy"
              style={{ width: 120 }}
            >
              {channelList.map((item) => (
                <Option keu={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 40 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 表格区域 */}
      <Card title={`根据筛选条件共查询到 ${count} 条结果：`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={list}
          pagination={{
            //分页展示：页数=总数/每页条数。（点击分页拿到当前的页数）
            total: count,
            pageSize: reqData.per_page,
            onChange: onPageChange,
          }}
        />
      </Card>
    </div>
  );
};

export default Article;
