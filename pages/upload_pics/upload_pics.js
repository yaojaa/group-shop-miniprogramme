// pages/upload_pics.js
const util = require('../../utils/util.js')

console.log(util)

Page({

    /**
     * 页面的初始数据
     */
    data: {

        content_imgs: [],
        content_video:'' ,
        type: 'photo' //上传文件的类型 图片或者视频 photo || video 

    },
    //添加介绍图片
    addPicture: function() {

        util.uploadPicture({
            type: this.data.type,
            successData: (result) => {

                if (this.data.type == 'video') {
                    console.log('video uploaded',result)
                    this.setData({
                        content_video:result
                    })

                } else {

                    this.data.content_imgs = this.data.content_imgs.concat([result])

                    this.setData({
                        content_imgs: this.data.content_imgs
                    })


                }

                wx.showToast({
                    title:'上传成功',
                    icon:'none'
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
        var arr = this.data.content_imgs
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];

        this.setData({
            content_imgs: arr
        })


    },
    toUp(e) {
        let index = e.currentTarget.dataset.index
        if (index != 0) {
            this.swapArray(index, index - 1);
        }

    },

    toDown(e) {
        let index = e.currentTarget.dataset.index
        if (index != this.data.content_imgs.length - 1) {
            this.swapArray(index, index + 1);
        } else {

        }

    },
    onBack() {
        //设置副页面的已上传图片数量icon
        if(this.data.content_imgs.length){
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上一个页面
        // 直接调用上一个页面的setData()方法，把数据存到上一个页面中去
        prevPage.setData({
          content_imgs: this.data.content_imgs
        })
}

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];  //上一个页面

        console.log(prevPage.data.content_imgs)

        this.setData({
            type: options.type || 'photo',
            title: options.type == 'video' ? '上传小视频' : '上传图文介绍',
            content_imgs:prevPage.data.content_imgs
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
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})