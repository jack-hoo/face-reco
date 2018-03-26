<template>
  <div>
    <div class="video">
      <video id="video" height="200" width="145"></video>

    </div>
    <div class="snap">
      <canvas id="canvas"></canvas>
    </div>
    <div class="msg"  v-if="showSnap">
      <h3>结果  [0,100]</h3>
      <p v-for="result in results">userId==={{result.user_id}},准确率:{{result.confidence}}</p>
      <h3>误识率 [0,100]</h3>
      <p>1e-5(十万分之一):{{thresholds['1e-5']}}</p>
      <p>1e-4(万分之一):{{thresholds['1e-4']}}</p>
      <p>1e-3(千分之一):{{thresholds['1e-3']}}</p>
      <p>{{thresholds}}</p>
    </div>
    <div class="tools">
      <mu-raised-button label="人脸录入" @click="faceIn" class="demo-raised-button" primary/>
      <mu-raised-button label="人脸识别" class="demo-raised-button" @click="recoImg" secondary/>
    </div>
    <mu-dialog :open="bind" title="绑定用户" @close="closeBind">
      <mu-text-field label="请输入用户ID" v-model="userId"
                     type="text"/>
      <mu-flat-button slot="actions" primary @click="closeBind" label="取消"/>
      <mu-flat-button slot="actions" primary @click="bindUserId" label="确定"/>
    </mu-dialog>
    <mu-dialog :open="dialog" title="提示" @close="close">
      {{noticeContent}}
      <mu-flat-button slot="actions" primary @click="close" label="确定"/>
    </mu-dialog>
  </div>
</template>

<script>
  import {aliFaceIn, bindUser, faceIn, search} from "../api/api";
  // import MuDialog from "muse-ui/src/dialog/dialog";

  export default {
    // components: {MuDialog},
    name: "face",
    data() {
      return {
        showSnap:false,
        userId:'',
        bind: false,
        reco: '',
        noticeContent: '',
        dialog: false,
        video: null,
        width: 0,
        height: 0,
        faceToken: '',
        img: '',
        thresholds:{
          1e-5:'',
          1e-4:'',
          1e-3:''
        },
        results:[],
        imgg: 'data:image/png;base64,joiajvojoaifevalkjoeaijfoijfao' +
        'fjiefoiwajfojoewjoijhkjhkjhkjhlkjoijoijojoijoi' +
        'joijoijoijoijoijoijojjjlkjljoijojoijoijoijojojoi'
      }
    },
    methods: {
      closeBind() {
        this.bind = false
      },
      recoImg() {
        this.serch()
      },
      close() {
        this.dialog = false
      },
      serch() {
        this.screenShot()
        let base64 = {
          face: this.img
        }
        search(base64).then(res => {
          if (res.data.status === 403) {
            this.noticeContent = res.data.msg
            this.dialog = true
            this.clearShot()
          }
          if (res.data.status === 200) {
            this.clearShot()
            this.results = res.data.results
            this.thresholds = res.data.thresholds
            this.showSnap = true
          }
        }).catch(error => {
          console.log(error)
        })
      },
      bindUserId() {
        let params = {
          face_token:this.faceToken,
          user_id: this.userId
        }
        bindUser(params).then(res => {
            if(res.data.status === 200) {
              this.bind = false
              this.noticeContent = res.data.msg
              this.dialog = true

            }
        }).catch(error => {
          alert(error)
          console.log(error)
        })
      },
      faceIn() {
        this.screenShot()
        let base64 = {
          face: this.img
        }
        //alert(this.img)
        //face++接口
        faceIn(base64).then(res =>{
          if (res.data.status === 403) {
            this.noticeContent = res.data.msg
            this.dialog = true
            this.clearShot()
          }
          if (res.data.status === 200) {
            this.faceToken = res.data.face_token
            this.bind = true
            this.clearShot()
          }
        })
        //阿里云接口
        /*aliFaceIn(base64).then(res => {
          //alert(res.data)
          /!*if (res.data.status === 403) {
            this.noticeContent = res.data.msg
            this.dialog = true
            this.clearShot()
          }
          if (res.data.status === 200) {
            this.faceToken = res.data.face_token
            this.bind = true
            this.clearShot()
          }*!/
        }).catch(error => {
          console.log(error)
        })*/
      },
      screenShot() {
        this.video = document.getElementById("video")
        this.width = this.video.width
        this.height = this.video.height

        var canvas = document.getElementById("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        var ctx = canvas.getContext('2d');
        // alert(this.width)
        ctx.drawImage(this.video, 0, 0, this.width, this.width);
        var url = canvas.toDataURL('image/png');
        this.img = url
      },
      clearShot() {
        var canvas = document.getElementById("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, this.width, this.height)
      },
      liveVide() {
        var URL = window.URL || window.webkitURL;   // 获取到window.URL对象
        navigator.getUserMedia = navigator.getUserMedia
          || navigator.webkitGetUserMedia
          || navigator.mozGetUserMedia;

        navigator.getUserMedia({
          video: true
        }, function (stream) {
          this.video = document.getElementById("video")
          this.width = this.video.width
          this.height = this.video.height

          this.video.src = URL.createObjectURL(stream)
          this.video.play();   // 播放
          //点击截图
          /*document.getElementById("snap").addEventListener('click', function() {
            ctx.drawImage(video, 0, 0, width, height);
            var url = canvas.toDataURL('image/png');
            document.getElementById('download').href = url;
          });*/
        }, function (error) {
          alert(error.name)
          console.log(error.name || error);
        });
      }
    },
    mounted() {
      this.liveVide()
    }
  }
</script>

<style scoped>
  .msg {
    margin: 8px;
  }
  .snap {
    /*height: 300px;*/
    width: 100%;
    text-align: center;
    margin-top: 20px;
  }

  .video {
    height: 200px;
    width: 100%;
    background: #000;
    text-align: center;
  }

  .jietu {
    width: 100%;
    height: 200px;
  }

  .tools {
    position: fixed;
    bottom: 0px;
    width: 100%;
    display: flex;
  }

  .demo-raised-button {

    width: 50%;
  }
</style>
