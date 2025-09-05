import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link, useSearchParams } from "react-router-dom";
import "./index.scss";

import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { createArticleAPI, getArticleById } from "@/apis/article";
import { useChannel } from "@/hooks/useChannel";

const { Option } = Select;

const Publish = () => {
  //获取频道列表
  const { channelList } = useChannel();

  //提交表单
  const onFinish = (formValue) => {
    console.log(formValue);
    //校验imageType封面模式与imageList实际图数是否数量相等
    if (imageList.length !== imageType)
      return message.warning("封面模式与实际图数不匹配");
    const { title, content, channel_id } = formValue;
    //1.按照接口文档格式处理收集到的表单数据
    const reqData = {
      title,
      content,
      cover: {
        type: imageType, //当前封面模式
        images: imageList.map((item) => item.response.data.url), //图片列表
      },
      channel_id,
    };
    //2.调用接口提交
    createArticleAPI(reqData);
  };

  //上传回调
  const [imageList, setImageList] = useState([]);
  const onChange = (value) => {
    console.log("正在上传中", value);
    setImageList(value.fileList);
  };
  //切换图片封面类型
  const [imageType, setImageType] = useState(0);
  const onTypeChange = (e) => {
    console.log("切换封面了", e.target.value);
    setImageType(e.target.value);
  };

  //回填数据
  const [searchParams] = useSearchParams();
  const articleId = searchParams.get("id");
  //获取实例
  const [form] = Form.useForm();
  console.log(articleId);
  useEffect(() => {
    //1.通过id获取数据
    async function getArticleDetail() {
      const res = await getArticleById(articleId);

      //setfieldsvalue传参是对象，setfieldvalue传参是属性名和对应value值，前者能传一堆值，后者只能传一组值
      // form.setFieldsValue(res.data);但是当前写法无法回填封面
      //数据结构的问题，set方法要直接传{type ： 3}
      form.setFieldsValue({
        ...res.data, //这里两步，展开后添加新type，最后输出的还是一个整体
        type: res.data.cover.type,
      });
      //回填图片列表
      setImageType(res.data.cover.type);
      //显示图片({url:url})
      setImageList(
        res.data.cover.images.map((url) => {
          return { url };
        })
      );
    }
    //只有有id时才能调用此函数回填
    if (articleId) {
      //2.调用实例方法，完成回填
      getArticleDetail();
    }
  }, [articleId, form]);
  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb
            items={[
              { title: <Link to={"/"}>首页</Link> },
              { title: `${articleId ? "编辑" : "发布"}文章` },
            ]}
          />
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 0 }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入文章标题" }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: "请选择文章频道" }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channelList.map((item) => (
                <Option key={item.id} value={item.name}>
                  {/* value属性这里，用户选哪个就会把id属性存下来 */}
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>

            {/* listType:决定选择文件框外观样式 */}
            {/* showUploadList：控制显示上传列表。showUploadList默认为true，其实不用在这里指定 */}
            {imageType > 0 && (
              <Upload
                listType="picture-card"
                showUploadList
                action={"http://geek.itheima.net/v1_0/upload"}
                // action={"http://127.0.0.1:4523/mock/7035781/v1_0/upload"}
                name="image"
                onChange={onChange}
                maxCount={imageType}
                fileList={imageList} //图片回填需要此处绑定
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>

          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: "请输入文章内容" }]}
          >
            {/* 富文本编辑器 */}
            <ReactQuill
              className="publish-quill"
              //在其他第三方组件中修改样式也是这个道理，先找到对应的盒子名称，然后加一个自己的类名
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Publish;
