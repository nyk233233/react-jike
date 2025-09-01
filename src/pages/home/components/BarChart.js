//柱状图组件
import * as echarts from "echarts";
import { useEffect, useRef } from "react";
//1.把功能代码都放到这个组件中
//2.把可变的部分抽象成prop函数
const BarChart = ({ title }) => {
  const chartRef = useRef(null);
  useEffect(() => {
    //保证dom可用再进行图标的渲染
    //1.获取渲染图表的dom节点
    // const chartDom = document.getElementById("main");
    const chartDom = chartRef.current;
    //2.图标初始化生成图标实例对象
    const myChart = echarts.init(chartDom);

    //3.准备图标参数
    const option = {
      title: {
        text: title,
      },
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: "bar",
        },
      ],
    };
    // 4.使用图标参数完成图标渲染
    option && myChart.setOption(option);
  }, []); //useEffectb保证渲染完毕再执行

  return (
    <div>
      <div ref={chartRef} style={{ width: "500px", height: "400px" }}></div>
    </div>
  );
};
export default BarChart;
