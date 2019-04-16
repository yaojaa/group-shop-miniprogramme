import Notify from '../../vant/notify/notify'
import Dialog from '../../vant/dialog/dialog';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        fileList: [],
        problemModal: false,
        problemValue: '',
        problemTitle:'',
        goodsNumber:'2',
        tkType:'1'
    },
    handleProblemModal() {
        this.setData({
            problemModal: !this.data.problemModal
        });
    },
    changeProblem(event){
        console.log(event)
        this.setData({
            problemValue: event.target.dataset.name,
            problemTitle:event.target.dataset.title,
            problemModal:false
        });
    },
    changeGoodsNumber(event){
        this.setData({
            goodsNumber:event.detail
        });
    },
    changeTkType(event){
        this.setData({
            tkType:event.detail
        });
    },
    submit() {
        Notify({
            text: '保存成功',
            duration: 1000,
            selector: '#custom-selector',
            backgroundColor: '#39b54a'
        })
    },
    onChange(e) {
        console.log('onChange', e)
        const { file } = e.detail
        if (file.status === 'uploading') {
            wx.showLoading()
        } else if (file.status === 'done') {

        }
    },
    onSuccess(e) {
        console.log('onSuccess', e)
    },
    onFail(e) {
        console.log('onFail', e)
    },
    onComplete(e) {
        console.log('onComplete', e)
        wx.hideLoading()
    },
    onPreview(e) {
        console.log('onPreview', e)
        const { file, fileList } = e.detail
        wx.previewImage({
            current: file.url,
            urls: fileList.map((n) => n.url),
        })
    },
    onRemove(e) {
        console.log('onRemove', e)
        const { file, fileList } = e.detail
        Dialog.confirm({
            message: '确定要删除这张图片？'
        }).then(() => {
            this.setData({
                fileList: fileList.filter((n) => n.uid !== file.uid),
            })
        }).catch(() => {
            // on cancel
        });
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