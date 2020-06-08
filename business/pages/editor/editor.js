const util = require('../../../utils/util')
const app = getApp()
Page({
  data: {
    formats: {},
    editorContent: null,
    placeholder: '请输入文字或插入图片开始编辑吧，注意：使用了图文编辑器，普通的文字介绍+详情图片就会不显示',
    editorHeight: '100%',
    keyboardHeight: 0,
    isIOS: false,
    style: 'height: 300px'
  },
  onLoad() {
    let _this = this;

    wx.getStorage({
      key: 'editorContent',
      success (res) {
        _this.data.editorContent = res.data;
        wx.setStorage({
          key:"editorContent",
          data: null
        })
      }
    })

    const platform = app.globalData.systemInfo.platform
    const isIOS = platform === 'ios'
    this.setData({ isIOS})


    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {

      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      this.timer = setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    })

  },

  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const { windowHeight, platform } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.data.editorHeight = editorHeight;
    this.setData({ 
        style: 'height:' + editorHeight + 'px', 
        keyboardHeight
    })

  },

  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
      console.log(that.data)
      if(that.data.editorContent){
          that.editorCtx.setContents({
            html: that.data.editorContent.html,
            delta: that.data.editorContent.delta
          })
      }
    }).exec()
  },
  onBlur() {
    this.setData({
        style: ''
    })
  },
  onFocus(){
    this.setData({
        style: 'height:' + this.data.editorHeight + 'px'
    })
    this.editorCtx.scrollIntoView();
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({ formats })
  },
  clear() {
    let _this = this;
    this.editorCtx.clear({
      success: function (res) {
        _this.saveGoBack();
      }
    })
  },

  // 清除并返回
  clearGoBack() {
    let _this = this;
    this.getEditorContent(data => {
      if(data.isEmptyEditor){ // 空
        util.setParentData(data)
        return;
      }
      wx.showModal({
        title: '温馨提示',
        content: '切换为简单模式，这里编辑的内容会丢失。',
        success (res) {
          if (res.confirm) {
              _this.clear();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    })
  },
  // 保存并返回
  saveGoBack() {
    this.getEditorContent(data => {
      util.setParentData(data)
    })
  },

  getEditorContent(fn){
    this.editorCtx.getContents({
        success: res=>{
            let imgs = res.html.match(/<img/g) || [];
            let isEmptyEditor = res.text.replace(/\n/g,'').length == 0 && !/<img/g.test(res.html);
            let data = {
                editorContent: res,
                isEmptyEditor: isEmptyEditor
            };
            if(res.text.replace(/\n/g,'').length == 0 && imgs.length > 0){
                data.editorContent.text = '已上传'+ imgs.length +'个图片';
            }
            fn(data)
            // util.setParentData(data)
        }
    })
  },

  insertVideo() {
    const that = this;
    let vw = 'auto', vh = 'auto';
    wx.chooseVideo({
      sourceType: ['album','camera'],
      maxDuration: 60,
      compressed: true,
      camera: 'back',
      success(res) {
        wx.showLoading()

        that.getEditorContent(data => {
          if(data.isEmptyEditor){
            that.editorCtx.insertText({
              text:'\n'
            })
          }
        });
        util.uploadFile({filePath: res.tempFilePath}).then(res => {
          if(res.code == 200){
            let videoImg = 'https://static.kaixinmatuan.cn/video-cover.jpg';
            that.editorCtx.insertImage({
              src: videoImg,
              width: '100%',
              alt: res.data.file_url,
              extClass: 'editorCONTENTVIDEO',
              success: function () {
                wx.hideLoading()
                setTimeout(()=>{
                    that.editorCtx.scrollIntoView();
                },500)
              }
            })



            console.log(res.data.file_url)
          }
        })

      }
    })
  },
  insertImage() {
    const that = this
    util.uploadPicture({
        success: res=>{
            wx.hideLoading()
            this.editorCtx.insertImage({
              src: res,
              width: '100%',
              extClass: 'editorCONTENTimg',
              success: function () {
                setTimeout(()=>{
                    that.editorCtx.scrollIntoView();
                },500)
              }
            })

        },
        progressState: res=>{
            if(res){
                wx.showLoading()
            }
        }
    })
  },
  onUnload(){
    if(this.timer){
      clearTimeout(this.timer)
    }

   //取消监听
   wx.onKeyboardHeightChange(() =>{})    
   console.log(this.timer,wx.onKeyboardHeightChang)
  }
})
