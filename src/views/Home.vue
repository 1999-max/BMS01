<template>
  <el-row>
    <el-col :span="8">
      <el-card>
        <div class="user">
          <!-- 这里有左右，flex布局 -->
          <img src="../assets/images/xlz.jpg" alt="无法获取图片资源">
          <!-- <img src="../assets/images/user.png" alt="无法获取图片资源"> -->
          <div class="userinfo">
            <p class="name">Admin</p>
            <p class="access">小琳子</P>
          </div>
        </div>
        <div class="login-info">
          <p>上次登录时间：<span>2022-10-19</span></p>
          <p>上次登录地点：<span>福建福州</span></p>
        </div>
      </el-card>
      <el-card class="tableData">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column v-for="(val, key) in tableLabel" :prop="key" :label="val"></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16">
      <!-- 右上 -->
      <div class="num">
        <el-card v-for="item in countData" :key="item.name" class="num-card"
          :body-style="{ display: 'flex', padding: 0 }">
          <i class="icon" :class="`el-icon-${item.icon}`" :style="{ background: item.color }"></i>
          <div class="detail">
            <P class="price">￥{{ item.value }}</P>
            <p class="dec">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <!-- 右中下 -->
      <el-card style="height:280px" class="lineChart">
        <!-- 折线图,必须给宽高 -->
        <div ref="echarts1" style="height: 280px;"></div>
      </el-card>
      <div class="graph">
        <!-- flex布局分左右 -->
        <el-card style="height:260px;width: 49%">
          <div ref="echarts2" style="height: 260px;"></div>
        </el-card>
        <el-card style="height:260px;width: 48%">
          <div ref="echarts3" style="height: 240px;"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { getData } from '../api/index'
import * as echarts from 'echarts'

export default {
  data() {
    return {
      tableData: [],
      tableLabel: {
        name: '商品',
        todayBuy: '今日购买',
        monthBuy: '本月购买',
        totalBuy: '总购买'
      },
      countData: [
        {
          name: "今日支付订单",
          value: 1234,
          icon: "success",
          color: "#2ec7c9",
        },
        {
          name: "今日收藏订单",
          value: 210,
          icon: "star-on",
          color: "#ffb980",
        },
        {
          name: "今日未支付订单",
          value: 1234,
          icon: "s-goods",
          color: "#5ab1ef",
        },
        {
          name: "本月支付订单",
          value: 1234,
          icon: "success",
          color: "#2ec7c9",
        },
        {
          name: "本月收藏订单",
          value: 210,
          icon: "star-on",
          color: "#ffb980",
        },
        {
          name: "本月未支付订单",
          value: 1234,
          icon: "s-goods",
          color: "#5ab1ef",
        },
      ],

    }
  },
  mounted() {
    getData().then(({ data }) => {
      const { tableData } = data.data;
      this.tableData = tableData;

      // 初始化echarts实例，折线图
      const echarts1 = echarts.init(this.$refs.echarts1);
      // 指定图表的配置项和数据
      var echarts1Options = {};
      // 处理xAxis数据,orderData是多个对象组成的数组,orderData.data[0]是对象，返回键值
      const { orderData, userData, videoData } = data.data;
      const xAxis = Object.keys(orderData.data[0]);
      const xAxisData = {
        data: xAxis
      };
      echarts1Options.xAxis = xAxisData;
      echarts1Options.yAxis = {}; //必须写，不然报错
      // 图例
      echarts1Options.legend = xAxisData;
      // 当前值
      echarts1Options.series = [];
      xAxis.forEach(key => {
        echarts1Options.series.push({
          name: key, //苹果...
          data: orderData.data.map(item => item[key]),
          type: 'line', // 折线图
        })
      })//forEach
      // 根据配置显示图表
      echarts1.setOption(echarts1Options);

      // 柱状图
      const echarts2 = echarts.init(this.$refs.echarts2);
      var echarts2Options = {
        legend: {
          // 图例文字颜色
          textStyle: {
            color: "#333",
          },
        },
        grid: {
          left: "20%",
        },
        // 提示框
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category", // 类目轴
          data: userData.map(item => item.data),
          axisLine: {
            lineStyle: {
              color: "#17b3a3",
            },
          },
          axisLabel: {
            interval: 0,
            color: "#333",
          },
        },
        yAxis: [
          {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#17b3a3",
              },
            },
          },
        ],
        color: ["#2ec7c9", "#b6a2de"],
        // 2个柱，所以2个对象
        series: [
          {
            name: '新增用户',
            data: userData.map(item => item.new),
            type: 'bar'
          },
          {
            name: '活跃用户',
            data: userData.map(item => item.active),
            type: 'bar'
          }
        ],
      }//ecarts2Options
      echarts2.setOption(echarts2Options);

      // 饼状图
      const echarts3 = echarts.init(this.$refs.echarts3);
      var echarts3Options = {
        tooltip: {
          trigger: "item",
        },
        color: [
          "#0f78f4",
          "#dd536b",
          "#9462e5",
          "#a6a6a6",
          "#e1bb22",
          "#39c362",
          "#3ed1cf",
        ],
        series: [
          {
            data: videoData,
            type: 'pie'
          }
        ],
      }
      echarts3.setOption(echarts3Options);

    })//getData
  }//mpunted
}

</script>

<style lang="less" scoped>
.user {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: center;

  img {
    margin-right: 40px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }

  .userinfo {
    .name {
      font-size: 33px;
      margin-bottom: 10px;
      line-height: 20px;
    }

    .access {
      line-height: 20px;
      color: #999999;
      font-size: 14px;
    }
  }
}

.login-info {
  p {
    margin: 0;
    padding: 0;
    text-align: left;
    line-height: 28px;
    font-size: 14px;
    color: #999999;

    span {
      color: #666666;
      margin-left: 15px;
    }
  }
}

.tableData {
  line-height: 10px;
  margin-top: 20px;
  height: 440px;
}

.num {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-left: 10px;

  .num-card {
    width: 32%;
    line-height: 20px;
    margin-bottom: 10px;

    .icon {
      width: 80px;
      height: 80px;
      font-size: 30px;
      text-align: center;
      line-height: 80px;
      color: #fff;
    }

    .detail {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 10px;

      .price {
        font-size: 30px;
        margin-bottom: 10px;
        height: 30px;
        line-height: 30px;
      }

      .dec {
        font-size: 14px;
        color: #999;
        text-align: center;
      }
    }
  }
}

.lineChart {
  margin-left: 10px;
}

.graph {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  margin-left: 10px;
}
</style>