<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.keyword" placeholder="新闻标题或作者"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="getNews">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table :data="news" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column type="index" width="60">
      </el-table-column>
      <el-table-column prop="title" label="标题" width="240" sortable>
      </el-table-column>
      <el-table-column prop="image" label="图片" width="240" sortable>
        <template slot-scope="scope">
          <img :src="scope.row.image" style="height: 60px"/>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="作者" width="100" sortable>
      </el-table-column>
      <el-table-column prop="created" label="发布时间" width="120" sortable>
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
        <el-form-item prop="newsContentId">
          <el-input v-model="editForm.newsContentId" auto-complete="off" style="display: none"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="editForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="editForm.author" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-input v-model="editForm.image" auto-complete="off" style="display: none"></el-input>
          <el-upload
            class="upload-demo"
            action="portal/uploadImage"
            :limit="1"
            :file-list="fileList"
            :on-success="handleSuccess"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
          </el-upload>
        </el-form-item>
        <!--  新增时输入 -->
        <el-form-item label="文章内容" prop="image">
          <div>
            <quill-editor
              v-model="editForm.content"
              ref="myQuillEditor"
              :options="editorOption"
            >
            </quill-editor>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>

  </section>
</template>

<script>
  import util from '../../common/js/util'
  //import NProgress from 'nprogress'
  import { getNewsList,editNews ,removeNews ,batchRemoveNews,getNewsDetail} from '../../api/api';

  import {quillEditor, Quill} from 'vue-quill-editor' //调用编辑器
  import {container, ImageExtend, QuillWatch } from 'quill-image-extend-module'

  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';

  Quill.register('modules/ImageExtend', ImageExtend)

  export default {
    components: {
      quillEditor
    },
    data() {
      return {
        filters:{
          keyword:''
        },
        news: [],
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
          ]
        },
        //编辑界面数据
        editForm: {
          id:'',
          newsContentId: '',
          title:'',
          image: '',
          author:'',
          state:1,
          content: ''
        },
        //上传图片
        fileList: [],
        editorOption: {
          modules: {
            ImageExtend: {
              loading: true,
              name: 'img',
              action: "portal/uploadImage2",
              response: (res) => {
                console.log(res)
                console.log(res.url)
                return res.url
              }
            },
            toolbar: {
              container: container,
              handlers: {
                'image': function () {
                  QuillWatch.emit(this.quill.id)
                }
              }
            }
          }
        },
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.pageStart = val-1;
        this.getNews();
      },
      //获取文章列表
      getNews() {
        let para = {
          pageNum: this.pageNum,
          pageStart:this.pageStart,
          keyword: this.filters.keyword
        };
        this.listLoading = true;
        getNewsList(para).then((res) => {
          console.log(res)
          this.count = res.data.data.count;
          this.news = res.data.data.data;
          this.listLoading = false;
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
          removeNews(para).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getNews();
          });
        }).catch(() => {

        });
      },
      //显示编辑界面
      handleEdit: function (index, row) {
        let that = this;
        this.editForm = Object.assign({}, row);
        let form = {
          id:this.editForm.id
        }
        let para = Object.assign({},form);
        getNewsDetail(para).then((res) => {
          // this.editForm.content =
          console.log(res)
          that.editForm.content = res.data.data.newsContent.content;
          that.editForm.newsContentId = res.data.data.newsContent.id;
          // console.log(this.editForm)
          that.fileList=[];
          that.fileList.push({name: '', url: that.editForm.image});
          that.editFormVisible = true;
        });

      },
      //显示新增界面
      handleAdd: function () {
        this.$router.replace({path: '/newsList'})
      },
      //编辑
      editSubmit: function () {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              this.editLoading = true;
              //NProgress.start();
              let para = Object.assign({}, this.editForm);
              editNews(para).then((res) => {
                this.editLoading = false;
                //NProgress.done();
                this.$message({
                  message: '提交成功',
                  type: 'success'
                });
                this.$refs['editForm'].resetFields();
                this.editFormVisible = false;
                this.getNews();
              });
            });
          }
        });
      },
      // 转码
      escapeStringHTML(str) {
        str = str.replace(/&lt;/g,'<');
        str = str.replace(/&gt;/g,'>');
        return str;
      },
      handleSuccess(file) {
        console.log("上传完毕")
        console.log(file);
        this.editForm.image = file.url;
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
          batchRemoveNews(para).then((res) => {
            this.listLoading = false;
            //NProgress.done();
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getNews();
          });
        }).catch(() => {

        });
      }
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill;
      },
    },
    mounted() {
      this.getNews();
    }
  }

</script>

<style>

</style>
