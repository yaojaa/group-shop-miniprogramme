const util = require('../../utils/util')


const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tab:0,
        data_list: [],
        customerVisible:false,
        customerList:[],
        cpage: 1

    },
    handleTab(e){
        console.log(e)
        this.setData({
            tab:e.detail.index
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getCouponList()

        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    toCreate(){
      wx.navigateTo({
        url:'../coupon-creat/index'
      })
    },

    getCouponList(){
      wx.showLoading()
        util.wx.get('/api/redpacket/get_list_by_store',{
          page:this.data.cpage,
          pagesize:8
        }).then(res=>{
                wx.hideLoading()

          if(res.data.code == 200){


            const data = this.data.data_list.concat(res.data.data.order_list)

            this.setData({
              data_list:data,
              totalpage: res.data.data.page.totalpage
            })
            console.log(res)
          }
        })
    },
    /*发送红包给指定客户*/
    sendToUser(){
        util.wx.post('/api/redpacket/alloc_redpacket',{
            user_ids:this.data.user_ids,
            redpacket_id:this.data.redpacket_id

        }).then(res=>{

          if(res.data.code == 200){

            wx.showModal({

         title: '发送成功',

         content: '红包已发送到客人账户',
         showCancel: false,//是否显示取消按钮
         cancelText:"否",//默认是“取消”
         confirmText:"我知道了",//默认是“确定”
         confirmColor: 'green',//确定文字的颜色
         success: function (res) {
        
         },
         fail: function (res) { },//接口调用失败的回调函数
         complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
      })


          }


        })
        
    },
    showCustomer(e){
      console.log(e)
      this.data.redpacket_id = e.target.dataset.redpacket_id
      this.data.user_ids = e.target.dataset.user_ids.map(item=>{
        return item.user_id
      })
      this.setData({
        customerVisible:true
      })

     this.getCustomers()

    },

     /**
     * 滑动到底部
     */
    scrolltolower() {

        // }
        ++this.data.cpage;

        if (this.data.cpage <= this.totalpage) {
            this.getCustomers(); //重新调用请求获取下一页数据
        } else {
            this.data.cpage = this.totalpage;
        }
    },

     /**
     * 选择顾客
     */
    checkboxUserChange(e) {
            this.data.user_ids = e.detail.value
             console.log(this.data.user_ids)

    },
    getRedpacketUser(){
       util.wx.get('/api/seller/get_redpacket_user_list', data).then((res) => {


       })

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
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        this.getCouponList(this.data.sortstr).then(() => {
            // 隐藏导航栏加载框
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (this.data.cpage && !this.data.loading) {
            this.setData({
                cpage: this.data.cpage + 1, //每次触发上拉事件，把requestPageNum+1
            })
            if (this.data.cpage-1 >= this.data.totalpage) {
                return
            }
            this.getCouponList()
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(e) {

      const title = e.target.dataset.title
      const id = e.target.id
      console.log('/pages/coupon-receive/index?id=' +id)

      wx.navigateTo({
        url:'/pages/coupon-receive/index?id=' +id
      })

        return {
          title: title,
          imageUrl: 'https://static.kaixinmatuan.cn/d41d8cd98f00b204e9800998ecf8427e202105251406484983.jpg',
          path:
            '/pages/coupon-receive/index?id=' +id
        };

    }

})