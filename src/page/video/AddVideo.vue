<template>
  <div class="edit_container">
    <!--基本信息-->
    <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
      <el-form-item label="标题" prop="name">
        <el-input v-model="addForm.name" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item label="图片" prop="img">
        <el-input v-model="addForm.img" auto-complete="off" style="display: none"></el-input>
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
      <el-form-item label="视频" prop="url" >
        <el-input v-model="addForm.url" auto-complete="off" style="display: none"></el-input>
        <!--<el-upload-->
          <!--class="upload-demo"-->
          <!--action="portal/uploadVideo"-->
          <!--:limit="1"-->
          <!--:file-list="videoList"-->
          <!--:on-success="handleUploadVideoSuccess"-->
          <!--list-type="picture">-->
          <!--<el-button size="small" type="primary">点击上传</el-button>-->
          <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>-->
        <!--</el-upload>-->
        <el-upload class="avatar-uploader el-upload--text" action="portal/uploadVideo" v-if="!loading"
                   :show-file-list="false" :on-success="handleUploadVideoSuccess"
                   :before-upload="beforeUploadVideo">
          <video v-if="addForm.url !='' && videoFlag == true" :src="addForm.url" class="avatar" controls="controls">您的浏览器不支持视频播放</video>
          <i v-else-if="addForm.url =='' && videoFlag == false" class="el-icon-plus avatar-uploader-icon" style="border: 1px solid #888888;padding: 40px;"></i>
          <!--<el-progress v-if="videoFlag == true" type="circle" :percentage="videoUploadPercent" style="margin-top:30px;"></el-progress>-->
        </el-upload>
        <el-table
          v-loading="loading"
          style="width: 100%" v-else>
        </el-table>
      </el-form-item>

      <el-form-item label="作者" prop="author">
        <el-input v-model="addForm.author" auto-complete="off"></el-input>
      </el-form-item>
      <!--1是新闻联播，2是校园生活，3是人物，4是文化，5是理论-->
      <el-form-item label="视频类型" prop="type">
        <el-select v-model="addForm.videoType" placeholder="请选择">
          <el-option
            v-for="item in videoType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <!--  新增时输入 -->
    <span class="demonstration">视频描述</span>
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
          name: [
            { required: true, message: '请输入标题', trigger: 'blur' }
          ],
          img:[
            { required: true, message: '请选择图片', trigger: 'blur' }
          ],
          url:[
            { required: true, message: '请选择视频', trigger: 'blur' }
          ],
          author:[
            { required: true, message: '请输入作者', trigger: 'blur' }
          ],
          videoType:[
            { required: true, message: '请选择视频类型', trigger: 'blur' }
          ],
        },
        //上传图片
        videoFlag:false,
        loading:false,
        fileList: [],
        videoList:[],
        addForm: {
          name: '',
          img:'',
          author:'',
          content:'',
          url:'',
          videoType:''
        },
        //视频类型
        videoType: [{
          value: 1,
          label: '新闻联播'
        }, {
          value: 2,
          label: '校园生活'
        }, {
          value: 3,
          label: '人物'
        }, {
          value: 4,
          label: '文化'
        }, {
          value: 5,
          label: '理论'
        }
        ],

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
              that.$axios.post('/video/addVideo', that.addForm).then(successResponse => {
                console.log('================')
                console.log(successResponse)
                // this.responseResult = JSON.stringify(successResponse.data)
                if (successResponse.data.status == 1) {
                  // this.$router.replace({path: '/index'})
                  alert("插入成功")
                  that.$router.replace({path: '/videoList'})
                }else{
                  alert("新增视频失败");
                }
              })
                .catch(failResponse => {
                });
            });
          }
        });

      },
      //上传图片
      handleSuccess(file) {
        console.log("上传完毕")
        console.log(file);
        this.addForm.img = file.url;
      },
      beforeUploadVideo(file){
        this.loading = true;
      },
      handleUploadVideoSuccess(file){
        console.log("上传视频完毕")
        console.log(file);
        this.addForm.url = file;
        this.videoFlag =true;
        this.loading = false;
      }
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
