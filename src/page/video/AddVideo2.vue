<template>
  <el-upload
    class="upload-demo"
    ref="upload"
    :action="uploadVideoUrl"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :file-list="fileList"
    :auto-upload="false">
    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
    <div slot="tip" class="el-upload__tip">只能上传视频文件</div>
  </el-upload>
</template>

<script>
  import TcVod from 'vod-js-sdk-v6'
  import axios from 'axios'
    export default {
      name: "add-video",
      data() {
        return {
          ugcUploadSign:'',
          file:'',
          tcVod:'',
          fileList: []
        };
      },
      mounted(){

      },
      methods: {
        /**
         * 计算签名。
         **/
        getSignature() {
          let that = this;
          return axios.post(this.uploadVideoUrl+'/ugc-upload/', JSON.stringify({
            "Action": "GetUgcUploadSign"
          })).then(function (response) {
            that.ugcUploadSign =  response.data.data.sign;
            that.tcVod = new TcVod.default({
              getSignature: that.ugcUploadSign
            })
          })
        },
        submitUpload() {
          // this.$refs.upload.submit();
          var self = this;
          var videoFile = this.file;
          var uploader = this.tcVod.upload({
            videoFile: videoFile,
          })
          uploader.on('video_progress', function (info) {
            uploaderInfo.progress = info.percent;
          })
          uploader.on('video_upload', function (info) {
            uploaderInfo.isVideoUploadSuccess = true;
          })
          console.log(uploader, 'uploader')
          var uploaderInfo = {
            videoInfo: uploader.videoInfo,
            isVideoUploadSuccess: false,
            isVideoUploadCancel: false,
            progress: 0,
            fileId: '',
            videoUrl: '',
            cancel: function() {
              uploaderInfo.isVideoUploadCancel = true;
              uploader.cancel()
            },
          }
          this.uploaderInfos.push(uploaderInfo)
          uploader.done().then(function(doneResult) {
            console.log('doneResult', doneResult)
            uploaderInfo.fileId = doneResult.fileId;
            return getAntiLeechUrl(doneResult.video.url);
          }).then(function (videoUrl) {
            uploaderInfo.videoUrl = videoUrl
            self.$refs.vExample.reset();
          })
        },
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        handlePreview(file) {
          console.log('aaaa')
          console.log(this.uploadVideoUrl);
          this.getSignature();
          this.file = file;
          console.log(file);
        }
      }
    }
</script>

<style scoped>

</style>
