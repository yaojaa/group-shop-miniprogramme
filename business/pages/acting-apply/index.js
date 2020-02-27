const util = require('../../../utils/util')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: true,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
 
        this.supplier_id = options.id || ''

        if(this.supplier_id){
            this.getinfo()
        }else{
            wx.showToast({
                title:'URL缺少id参数'
            })
        }

    },

    getinfo(){
        util.wx.get('/api/seller/get_supplier_detail?supplier_id='+this.supplier_id).then(res=>{


        })
    },

    reg(){

        util.wx.post('/api/seller/apply_agent',{
            supplier_id:'',
            apply_remark:''
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

    }
})