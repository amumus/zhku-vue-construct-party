<template>
  <section class="chart-container">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="filters">
          <el-form-item>
            <el-select v-model="filters.college" clearable  @change="doGetMajorList(filters.college)" placeholder="请选择学院">
              <el-option
                v-for="item in collegeList"
                :key="item.value"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="filters.major" clearable  placeholder="请选择专业">
              <el-option
                v-for="item in majorList"
                :key="item.value"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item>-->
            <!--<el-button type="primary" v-on:click="getScore">查询</el-button>-->
          <!--</el-form-item>-->
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div id="chartColumn" style="width:100%; height:400px;"></div>
      </el-col>
      <el-col :span="12">
        <div id="chartPie" style="width:100%; height:400px;"></div>
      </el-col>
      <!--<el-col :span="12">-->
        <!--<div id="chartBar" style="width:100%; height:400px;"></div>-->
      <!--</el-col>-->
      <!--<el-col :span="12">-->
        <!--<div id="chartLine" style="width:100%; height:400px;"></div>-->
      <!--</el-col>-->

      <!--<el-col :span="12">-->
        <!--<a href="http://echarts.baidu.com/examples.html" target="_blank" style="float: right;">more>></a>-->
      <!--</el-col>-->
    </el-row>
  </section>
</template>

<script>
  import echarts from 'echarts'
  import ElRow from "element-ui/packages/row/src/row";
  import { getCollegeList,getMajorList,getTop10Student,getScorePercentList} from '../../api/api';

  export default {
    components: {ElRow},
    data() {
      return {
        filters: {
          college:'',
          major:''
        },
        collegeList:[],
        majorList:[],
        chartColumn: null,
        chartBar: null,
        // chartLine: null,
        chartPie: null,
        //top10
        top10ScoreList:[],
        top10NameList:[],

        scorePercentList:[]
      }
    },
    methods: {
      drawColumnChart() {
        this.chartColumn = echarts.init(document.getElementById('chartColumn'));
        let para = {
          college: this.filters.college,
          major: this.filters.major
        }
        let that = this;
        getTop10Student(para).then((res)=>{
          that.top10ScoreList = res.data.data.scoreList;
          that.top10NameList = res.data.data.nameList;
          that.chartColumn.setOption({
            title: { text: '积分前十' },
            tooltip: {},
            xAxis: {
              data: that.top10NameList,
              axisLabel: {
                interval: 0,    //强制文字产生间隔
                rotate: 45,     //文字逆时针旋转45°
                textStyle: {    //文字样式
                  color: "black",
                  fontSize: 16,
                  fontFamily: 'Microsoft YaHei'
                }
              }
            },
            yAxis: {},
            series: [{
              name: '积分',
              type: 'bar',
              data: that.top10ScoreList
            }]
          });
        })
      },
      // drawBarChart() {
      //   this.chartBar = echarts.init(document.getElementById('chartBar'));
      //   this.chartBar.setOption({
      //     title: {
      //       text: '前五专业排名',
      //       subtext: '总积分排名'
      //     },
      //     tooltip: {
      //       trigger: 'axis',
      //       axisPointer: {
      //         type: 'shadow'
      //       }
      //     },
      //     legend: {
      //       data: ['前五专业']
      //     },
      //     grid: {
      //       left: '3%',
      //       right: '4%',
      //       bottom: '3%',
      //       containLabel: true
      //     },
      //     xAxis: {
      //       type: 'value',
      //       boundaryGap: [0, 0.01]
      //     },
      //     yAxis: {
      //       type: 'category',
      //       data: []
      //     },
      //     series: [
      //       {
      //         name: '总积分',
      //         type: 'bar',
      //         data: []
      //       }
      //     ]
      //   });
      // },
      // drawLineChart() {
      //   this.chartLine = echarts.init(document.getElementById('chartLine'));
      //   this.chartLine.setOption({
      //     title: {
      //       text: 'Line Chart'
      //     },
      //     tooltip: {
      //       trigger: 'axis'
      //     },
      //     legend: {
      //       data: ['邮件营销', '联盟广告', '搜索引擎']
      //     },
      //     grid: {
      //       left: '3%',
      //       right: '4%',
      //       bottom: '3%',
      //       containLabel: true
      //     },
      //     xAxis: {
      //       type: 'category',
      //       boundaryGap: false,
      //       data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      //     },
      //     yAxis: {
      //       type: 'value'
      //     },
      //     series: [
      //       {
      //         name: '邮件营销',
      //         type: 'line',
      //         stack: '总量',
      //         data: [120, 132, 101, 134, 90, 230, 210]
      //       },
      //       {
      //         name: '联盟广告',
      //         type: 'line',
      //         stack: '总量',
      //         data: [220, 182, 191, 234, 290, 330, 310]
      //       },
      //       {
      //         name: '搜索引擎',
      //         type: 'line',
      //         stack: '总量',
      //         data: [820, 932, 901, 934, 1290, 1330, 1320]
      //       }
      //     ]
      //   });
      // },
      drawPieChart() {
        let that = this;
        this.chartPie = echarts.init(document.getElementById('chartPie'));
        let para = {
          college: this.filters.college,
          major: this.filters.major
        }
        getScorePercentList(para).then((res)=>{
          that.chartPie.setOption({
            title: {
              text: '积分比例图',
              subtext: '各项积分比例',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
              orient: 'vertical',
              left: 'left',
              data: ['登录积分', '学习文章时长积分', '学习视频时长积分', '学习文章数积分', '学习视频数积分','评论积分']
            },
            series: [
              {
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data:res.data.data,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          });
        })

      },
      drawCharts() {
        this.drawColumnChart()
        // this.drawBarChart()
        // this.drawLineChart()
        this.drawPieChart()
      },
      doGetCollegeList:function () {
        let that = this;
        getCollegeList().then((res)=>{
          console.log(res);
          that.collegeList = res.data.data;
        })

      },
      doGetMajorList:function(){
        let that = this;
        let para = {
          college: this.filters.college
        }
        getMajorList(para).then((res)=>{
          console.log(res);
          that.majorList = res.data.data;
        })
        this.filters.major = null;
      },
      getScore:function () {
        console.log('haha')
      }
    },
    mounted: function () {
      this.drawCharts();
      this.doGetCollegeList();
      this.doGetMajorList()
    },
    updated: function () {
      this.drawCharts()
    }
  }
</script>

<style scoped>
  .chart-container {
    width: 100%;
    float: left;
  }
  /*.chart div {
      height: 400px;
      float: left;
  }*/
  .el-col {
    padding: 30px 20px;
  }
</style>
