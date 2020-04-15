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
  },
  onChange(e) {
    const { file } = e.detail
    if (file.status === 'uploading') {
      wx.showLoading()
    }
  },
  onComplete(e) {
    wx.hideLoading()
    let data = JSON.parse(e.detail.data)
    if (data.code == 0) {
      this.data.fileList.push(data.data)
      this.setData({
        fileList: this.data.fileList,
      })
    }
  },
  onPreview(e) {
    const { file, fileList } = e.detail
    wx.previewImage({
      current: file.url,
      urls: fileList.map((n) => n.url),
    })
  },
  onRemove(e) {
    const { file, fileList } = e.detail

    Dialog.confirm({
      message: '确定要删除这张图片？',
    })
      .then(() => {
        this.setData({
          fileList: this.data.fileList.filter(
            (n) => n.file_name !== file.file_name
          ),
        })
      })
      .catch(() => {
        // on cancel
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      order: options.id || '',
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
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
})
