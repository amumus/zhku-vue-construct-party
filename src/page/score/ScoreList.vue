<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名、学号、用户名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
        <el-form-item>

        </el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
      <el-table-column prop="identityCode" label="学号" width="120" sortable>
      </el-table-column>
			<el-table-column prop="name" label="姓名" width="120" sortable>
			</el-table-column>
			<el-table-column prop="college" label="学院" width="100" sortable>
			</el-table-column>
			<el-table-column prop="major" label="专业" width="120" sortable>
			</el-table-column>
			<el-table-column prop="score" label="积分" min-width="100" sortable>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="5" :total="count" style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import { getUserScoreList } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
        count: 0,
        pageNum: 5,
        pageStart:0,
				listLoading: false,
				sels: [],//列表选中列
        collegeOption:[],//计算科学学院
        majorOption:[],//专业信息与计算科学
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.pageStart = val-1;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
          pageNum: this.pageNum,
          pageStart:this.pageStart,
          keyword: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
        getUserScoreList(para).then((res) => {
				  console.log(res)
					this.count = res.data.data.count;
					this.users = res.data.data.list;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},

		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style>

</style>
