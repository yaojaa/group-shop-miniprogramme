const app = getApp()
const util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodslist: [],
        cpage:1,
        totalpage:1,
        loading:false,
        pagesize:30,
        total:'--'

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {


        this.getGoodlist()


    },
    getGoodlist(){
                this.setData({
                    loading:true
                })
                wx.showLoading()

        return new Promise((reslove,reject)=>{

             wx.request({
                    url: 'https://www.daohangwa.com/api/seller/get_goods_list',
                    data: {
                        token: app.globalData.token,
                        cpage:this.data.cpage
                    },
                    success: (res) => {
                        var resdata =[]
                        if (res.data.code == 0) {
                            
                            if(this.data.cpage<=1){
                               resdata = res.data.data.goodslist
                            }else{
                               resdata = this.data.goodslist.concat(res.data.data.goodslist)
                            }
                            this.setData({
                                goodslist: resdata,
                                totalpage:res.data.data.page.totalpage
                            })
                            reslove(resdata)
                        }else{
                            reject(res.data.msg)
                        }
                        wx.hideLoading()
                        this.setData({
                            loading:false
                        })
                    },
                    fail:(err)=>{
                        reject(err)
                        this.setData({
                            loading:false
                        })
                        wx.hideLoading()
                    }
                })

        })
    },
    editPage(e) {
        let url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: '../publish/publish?goods_id=' + url,
        })
    },
    detailPage(e) {
        let url = e.currentTarget.dataset.url
        let name = e.currentTarget.dataset.name
        let delivery_method = e.currentTarget.dataset.delivery_method

        wx.navigateTo({
            url: '../ordermanage/list?goods_id=' + url + '&goods_name=' + name + '&delivery_method=' + delivery_method,
        })
    },
    formSubmit: function(e) {
        util.formSubmitCollectFormId.call(this, e)
    },
    new_btn: function() {
        wx.navigateTo({
            url: '../publish/publish'
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

   /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.cpage && !this.data.loading) {

            this.setData({
                cpage: this.data.cpage + 1,  //每次触发上拉事件，把requestPageNum+1
            })

            if(this.data.cpage>this.data.totalpage){
                return 
            }


             this.getGoodlist().then(()=>{
               // 隐藏导航栏加载框
                wx.hideNavigationBarLoading();
                // 停止下拉动作
                wx.stopPullDownRefresh();
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})