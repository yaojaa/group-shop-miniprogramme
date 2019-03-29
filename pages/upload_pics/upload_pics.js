// pages/upload_pics.js
const util = require('../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {

        content_imgs: []

    },
    //添加介绍图片
    addPicture: function() {

        util.uploadPicture({
            successData: (result) => {
                this.data.content_imgs = this.data.content_imgs.concat([result])

                this.setData({
                    content_imgs: this.data.content_imgs
                })

            },
            progressState: (s) => {
                this.setData({
                    pictureProgress: s
                })

            }
        })
    },
    removePictrue(e) {

        let index = e.currentTarget.dataset.index

        this.data.content_imgs.splice(index, 1)
        this.setData({
            'content_imgs': this.data.content_imgs
        })

    },
     swapArray(index1, index2) {
        var arr =this.data.content_imgs
       arr[index1] = arr.splice(index2, 1, arr[index1])[0];

       this.setData({
        content_imgs:arr
       })
        

     },
    toUp(e){
      let index = e.currentTarget.dataset.index
        if(index!= 0){
       this.swapArray(index, index-1);
      }

    },

    toDown(e){
      let index = e.currentTarget.dataset.index
         if(index!= this.data.content_imgs.length-1){
           this.swapArray(index, index+1);
       }else{

       }

    },
    onBack(){


        console.log('返回啦。。。')


    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})