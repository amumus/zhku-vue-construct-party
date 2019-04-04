<template>
  <div class="edit_container">
    <!--基本信息-->
    <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
      <el-form-item label="标题" prop="title">
        <el-input v-model="addForm.title" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="图片" prop="image">
        <el-input v-model="addForm.image" auto-complete="off" style="display: none"></el-input>
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
      <el-form-item label="作者" prop="author">
        <el-input v-model="addForm.author" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>

    <!--  新增时输入 -->
    <span class="demonstration">文章内容</span>
    <div  style="width: 90%;margin: 0 50px;">
      <quill-editor
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
      @change="onEditorChange($event)"
     >
    </quill-editor>
    </div>
    <div>
      <el-button type="primary" @click="addSubmit">提交</el-button>
    </div>
  </div>
</template>
<script>
  import util from '../../common/js/util'
  import qs from 'qs';
  import {quillEditor, Quill} from 'vue-quill-editor' //调用编辑器
  import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'

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
        //form表单
        addFormRules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' }
          ],
          // image:[
          //   { required: true, message: '请选择图片', trigger: 'blur' }
          // ],
          author:[
            { required: true, message: '请输入作者', trigger: 'blur' }
          ],
        },
        //上传图片
        fileList: [],
        addForm: {
          title: '',
          image:'',
          author:'',
          content:'',
          state:1
        },


        //富文本
        content: ``,
        str: '',
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
      onEditorReady(editor) { // 准备编辑器

      },
      onEditorBlur(){}, // 失去焦点事件
      onEditorFocus(){}, // 获得焦点事件
      onEditorChange(){}, // 内容改变事件
      // 转码
      escapeStringHTML(str) {
        str = str.replace(/&lt;/g,'<');
        str = str.replace(/&gt;/g,'>');
        return str;
      },
      addSubmit(){
        let that = this;
        //提交
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            this.$confirm('确认提交吗？', '提示', {}).then(() => {
              // this.addLoading = true;
              //NProgress.start();
              // console.log("点击了提交")
              // let para = Object.assign({}, this.addForm);
              // console.log(this.addForm)
              // console.log(para)
              // addNews(para).then((res) => {
              //   this.addLoading = false;
              //   //NProgress.done();
              //   this.$message({
              //     message: '提交成功',
              //     type: 'success'
              //   });
              //   // this.$refs['addForm'].resetFields();
              //   // this.addFormVisible = false;
              //   console.log(res)
              // });
              that.addForm.content = that.content;
              console.log(that.addForm)
              that.$axios.post('/news/addNews', that.addForm).then(successResponse => {
                console.log('================')
                console.log(successResponse)
                // this.responseResult = JSON.stringify(successResponse.data)
                if (successResponse.data.status == 1) {
                  // this.$router.replace({path: '/index'})
                  alert("插入成功")
                  that.$router.replace({path: '/newsList'})
                }else{
                  alert("新增文章失败");
                }
              })
                .catch(failResponse => {
                });
            });
          }
        });

      },
    //上传图片
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handleSuccess(file) {
        console.log("上传完毕")
        console.log(file);
        this.addForm.image = file.url;
      },
      // handleExceed(files, fileList) {
      //   this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      // },
      // beforeRemove(file, fileList) {
      //   return this.$confirm(`确定移除 ${ file.name }？`);
      // }
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill;
      },
    },
    mounted() {
      let content = '';  // 请求后台返回的内容字符串
      this.str = this.escapeStringHTML(content);
    }
  }
</script>
