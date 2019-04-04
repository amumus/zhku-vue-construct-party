<template>
 <div>
    <input type="file" @clike="selectFile(file)"/>
   <button @click="submitFile">上传</button>

 </div>
</template>

<script>
  import TcVod from 'vod-js-sdk-v6'
  import axios from 'axios'
  export default {
    name: "add-video",
    data() {
      return {
        url:'',
        ugcUploadSign:'',
        file:'',
        tcVod:'',
        fileList: []
      };
    },
    mounted(){
    },
    methods: {
      selectFile(file){
        console.log(file)
      },
      submitFile(){
        console.log("上传")
      }
    }
  }

</script>

<style scoped>

</style>
