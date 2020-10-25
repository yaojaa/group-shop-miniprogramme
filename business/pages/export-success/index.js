// pages/paySuccess/index.js
const app = getApp()
const util = require('../../../utils/util')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        link: 'http://www.kaixinmatuan.cn/upload/seller/order_excel/order_report_1_202010202141067085635639.xls'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.data.goods_id = options.goods_id



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


    },
    getGoodsInfo() {

        wx.showLoading()

        util.wx.get('/api/goods/get_goods_detail', {
                goods_id: this.data.goods_id
            })
            .then(res => {

                this.setData({
                    info: res.data.data.goods
                })

            wx.hideLoading()


            })
    },
    // addListener:util.userListner,
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        return {
            title: this.data.info.goods_name,
            imageUrl:this.data.info.goods_cover,
            path: '/pages/goods/goods?goods_id=' + this.data.goods_id
        }
    },
    formSubmit: function (e) {
        util.formSubmitCollectFormId.call(this, e)
    },
    addListener: function () {
        wx.requestSubscribeMessage({
            tmplIds: ['17y_mLplxTn0resiR34oUsJMZu2E2W6i0x2YIRZgvZ4', 'Wu_vie78kgoRr8y90IAsxoEn87BJ3nDrEBLP0MK6208'],
            success(res) {}
        })
    }
})