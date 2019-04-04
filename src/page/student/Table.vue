<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名、学号、学院、专业"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
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
			<el-table-column prop="email" label="邮箱" width="100" sortable>
			</el-table-column>
			<el-table-column prop="college" label="学院" width="100" sortable>
			</el-table-column>
			<el-table-column prop="major" label="专业" width="120" sortable>
			</el-table-column>
			<el-table-column prop="phone" label="手机号" min-width="180" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="5" :total="count" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
        <el-form-item prop="id">
          <el-input v-model="editForm.id" auto-complete="off" style="display: none"></el-input>
        </el-form-item>
        <el-form-item label="学号" prop="identityCode">
          <el-input v-model="editForm.identityCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editForm.password" auto-complete="off"></el-input>
        </el-form-item>
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="昵称" prop="userName">
          <el-input v-model="editForm.userName" auto-complete="off"></el-input>
        </el-form-item>
				<el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
				</el-form-item>
        <el-form-item label="政治面貌" prop="email">
          <el-select v-model="editForm.politicalStatus" placeholder="请选择">
            <el-option
              v-for="item in politicalStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
				<el-form-item label="学院" prop="college">
					<el-input v-model="editForm.college"></el-input>
				</el-form-item>
				<el-form-item label="专业" prop="major">
          <el-input v-model="editForm.major"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="phone">
					<el-input type="phone" v-model="editForm.phone"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="editFormRules" ref="addForm">
        <el-form-item></el-form-item>
        <el-form-item label="学号" prop="identityCode">
          <el-input v-model="addForm.identityCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="userName">
          <el-input v-model="addForm.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="政治面貌" prop="email">
          <el-select v-model="addForm.politicalStatus" placeholder="请选择">
            <el-option
              v-for="item in politicalStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学院" prop="college">
          <el-input v-model="addForm.college"></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="addForm.major"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input type="phone" v-model="addForm.phone"></el-input>
        </el-form-item>
      </el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

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

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入真实姓名', trigger: 'blur' }
					],
          identityCode:[
            { required: true, message: '请输入学号', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          userName:[
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          email:[
            { required: true, message: '请输入邮箱', trigger: 'blur' }
          ],
          phone:[
            { required: true, message: '请输入手机号', trigger: 'blur' }
          ],
          college:[
            { required: true, message: '请输入学院', trigger: 'blur' }
          ],
          major:[
            { required: true, message: '请输入专业', trigger: 'blur' }
          ],
          // politicalStatus:[
          //   { required: true, message: '请输入', trigger: 'blur' }
          // ]
				},
				//编辑界面数据
				editForm: {
          id:'',
          identityCode: '',
          password:'',
          name: '',
          userName:'',
          politicalStatus:'',
					email: '',
          college: '',
					major: '',
					phone: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
          identityCode: '',
          password:'',
          name: '',
          userName:'',
          politicalStatus:'',
          email: '',
          college: '',
          major: '',
          phone: ''
        },
        //政治面貌
        politicalStatus: [{
          value: '党员',
          label: '党员'
        }, {
          value: '预备党员',
          label: '预备党员'
        }, {
          value: '团员',
          label: '团员'
        }, {
          value: '群众',
          label: '群众'
        }],

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
				getUserListPage(para).then((res) => {
				  console.log(res)
					this.count = res.data.data.count;
					this.users = res.data.data.data;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				console.log(this.addFormVisible)
        console.log("点击了")
				this.addForm= {
          identityCode: '',
            password:'',
            name: '',
            userName:'',
            politicalStatus:'',
            email: '',
            college: '',
            major: '',
            phone: ''
        };
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
                addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style>

</style>
