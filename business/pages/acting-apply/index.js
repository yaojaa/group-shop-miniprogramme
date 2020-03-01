const util = require('../../../utils/util')

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: true,
        showLoginbtn:false

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        if(app.globalData.userInfo){

        }else{
            this.setData({
                showLoginbtn:true
            })

            wx.showToast({
                title:'请先授权登陆',
                icon:'none'
            })

        }



 
        this.supplier_id = options.supplier_id || ''

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
                this.setData({
                    info:res.data.data
                })

        })
    },

    actSubmit(e){

        console.log(e)

        if(!e.detail.value.apply_remark){
            return wx.showToast({
                title:'请填写申请信息'
            })
        }


        util.wx.post('/api/seller/apply_agent',{
            supplier_id:this.supplier_id,
            apply_remark:e.detail.value.apply_remark
        }).then(res=>{

           wx.showToast({
             title: res.data.msg,//提示文字
             duration:3000,
             icon:'none'
             //显示时长
          })

           wx.redirectTo({
            url:'/pages/home/index'
           })




        },res=>{

              wx.showToast({
         title: res.data.msg,//提示文字
         duration:3000,
         icon:'none'
         //显示时长
      })


        })
    },

     /***点击授权按钮***/
  getUserInfoEvt: function (e) {


    console.log(e)

    wx.showLoading()

    if(e.detail.errMsg.indexOf('fail') >= 0){

       wx.showToast({
         title: '请允许授权',//提示文字
         duration:2000,
         icon:'none'
         //显示时长
      })

       
       return
     }

    app.getOpenId().then(openid=>{

          app.openid = openid;

          app.login_third(e.detail).then((res)=>{ 
          console.group('登陆成功:',res)
          wx.hideLoading()




                      
                    })
    .catch( e => console.log(e) )



    })



  },

  checkIsGroup(res){

    if(res.data.data){

    }else{
        wx.showToast(
        {
            title:'请先注册团长资料',
            icon:'none'
        })

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

    }
})