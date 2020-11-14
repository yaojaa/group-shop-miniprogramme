import Notify from '../../vant/notify/notify'
import Dialog from '../../vant/dialog/dialog';
const util = require('../../utils/util')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        fileList: [],
        problemModal: false,
        problemValue: 2,
        problemTitle:'计划有变，不想要了',
        goodsNumber:'2',
        tkType:'1',
        order_detail:{},
        explain:'',
        refund_fee:''
    },
    setExplain(e){
        this.data.explain = e.detail
    },

     setRefund_fee(e){
        this.data.refund_fee = e.detail
    },

    getOrderdetail(){
        util.wx.get('/api/user/get_order_detail?order_id='+this.order_id)
        .then(res=>{
            this.setData({
                order_detail:res.data.data,
                refund_fee:res.data.data.pay_price
            })
        })
    },
    refund(){

          wx.showModal({
            content: '您确定要申请退款吗？',
            success :(res)=> {
              if (res.confirm) {
               　this.refundIt()
              }
            }
          })
    },

    refundIt(){
        wx.showLoading()
        util.wx.post('/api/user/order_refund_apply',{
              order_id:    this.order_id,
              refund_fee:  this.data.refund_fee,
              reason :    this.data.problemTitle,
              explain:this.data.explain
        }).then(res=>{

        if(res.data.code ==200){
        wx.hideLoading()

        wx.redirectTo({
            url:'../refundment-detail/index?id='+res.data.data+'&order_id='+this.order_id
        })}
        else{

            wx.hideLoading()
            wx.showToast({
                title:res.data.msg,
                icon:'none'
            })
        }

        })
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

        if(options.order_id){
            this.order_id = options.order_id
            this.getOrderdetail()
        }


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