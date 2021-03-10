// pages/paySuccess/index.js
const app = getApp()
const util = require('../../utils/util')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        link: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.link = options.path
        this.setData({
          link: options.path
        })
    },


    goback() {

        wx.redirectTo({
            url: '../home/index'
        })

    },
    copylink(){

        wx.setClipboardData({
          data: this.data.link,
          success (res) {

          }
        }  )

    },
    preview() {
      wx.showLoading()
  //下载文件，生成临时地址
        wx.downloadFile({
            url: this.data.link,
            success(res) {
                // 打开文档
               wx.hideLoading()
                wx.openDocument({
                    filePath: res.tempFilePath,
                    fileType:'xls',
                    success: function() {
                        wx.hideLoading()
                        wx.removeSavedFile({
                            filePath: res.tempFilePath
                        })
                    }
                });
            }
        })


    }
})