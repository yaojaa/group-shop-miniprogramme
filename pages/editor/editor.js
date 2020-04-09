const util = require('../../utils/util')

Page({
  data: {
    formats: {},
    editorContent: null,
    placeholder: '请输入文字编辑',
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
  blur() {
    this.editorCtx.blur()
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
  removeFormat() {
    this.editorCtx.removeFormat()
  },

  // 清除并返回
  clearGoBack() {
    let _this = this;
    wx.showModal({
      content: '编辑内容还没保存，返回会清空内容！',
      success (res) {
        if (res.confirm) {
            _this.clear();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 保存并返回
  saveGoBack() {
    this.editorCtx.getContents({
        success: res=>{
            let imgs = res.html.match(/img/g) || [];
            let isEmptyEditor = res.text.replace(/\n/g,'').length == 0 && !/img/g.test(res.html);
            let data = {
                editorContent: res,
                isEmptyEditor: isEmptyEditor
            };
            if(res.text.replace(/\n/g,'').length == 0 && imgs.length > 0){
                data.editorContent.text = '已上传'+ imgs.length +'个图片';
            }
            util.setParentData(data)
        }
    })


  },
  insertImage() {
    const that = this
    util.uploadPicture({
        success: res=>{
            wx.hideLoading()
            console.log('img',res)
            this.editorCtx.insertImage({
              src: res,
              data: {
                id: 'abcd',
                role: 'god'
              },
              width: '100%',
              success: function () {
                console.log('insert image success')
              }
            })

        },
        progressState: res=>{
            if(res){
                wx.showLoading()

            }
        }
    })
  }
})
