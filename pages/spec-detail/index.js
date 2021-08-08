import Dialog from '../../vant/dialog/dialog'
const util = require('../../utils/util')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    order: '',
    fileList: [],
    url: util.config.apiUrl,
    disabled: false,
    content: '',
    info: {},
    autoFocus:false
  },
  onChange(e) {
    const {
      file
    } = e.detail
    if (file.status === 'uploading') {
      wx.showLoading()
    }
  },
  onComplete(e) {
    console.log(e)


    wx.hideLoading()

    if (!e.detail.statusCode == 200) {
      return wx.showToast({
        title: '上传失败请重试'
      })
    }


    let data = JSON.parse(e.detail.data)
    let img = {}
    if (data.code == 200) {
      img.url = data.data.file_url
      this.data.fileList.push(img)
      this.setData({
        fileList: this.data.fileList,
      })
    }
  },
  onPreview(e) {
    const {
      file,
      fileList
    } = e.detail
    wx.previewImage({
      current: file.url,
      urls: fileList.map((n) => n.url),
    })
  },
  onRemove(e) {
    const {
      file
    } = e.detail
    Dialog.confirm({
        message: '确定要删除这张图片？',
      })
      .then(() => {
        this.setData({
          fileList: this.data.fileList.filter((n) => n.url !== file.url),
        })
      })
      .catch(() => {
        // on cancel
      })
  },
  setValue(e) {
    console.log(11,e)
    this.setData({
      'info.spec_desc': e.detail.value,
    })
  },
  setName(e) {
    this.setData({
      'info.spec_name': e.detail.value,
    })
  },
  submit() {
    let {
      index,
      spec_name,
      spec_pic,
      spec_desc
    } = this.data.info
    spec_pic = this.data.fileList.map((item) => item.url)
    util.setParentData({
      ['spec[' + index + '].spec_name']: spec_name,
      ['spec[' + index + '].spec_pic']: spec_pic,
      ['spec[' + index + '].spec_desc']: spec_desc,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const eventChannle = this.getOpenerEventChannel()
    eventChannle.on('spceDetail', (res) => {
      console.log(res)
      this.data.fileList = res.spec_pic.map((item) => {
        return {
          url: item
        }
      })
      this.setData({
        fileList: this.data.fileList,
        autoFocus:res.isFocus,
        info: res,
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      autoFocus:false
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  inputDuplex: util.inputDuplex
})