const util = require('../../utils/util')
import Dialog from '../../vant/dialog/dialog';

const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: false,
        showLoginbtn:false,
        textareaVal: '',
        submit: false
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

        console.log(options)


         //如果是扫二维码进来 带scene
        if (typeof options.scene !== 'undefined') {
            var scene = decodeURIComponent(options.scene)
            options = this.url2json(scene)
           
        } 


        if(options.goods_id){

          this.goods_id = options.goods_id

          
        }




 
        this.data.store_id = options.store_id || ''

        if(this.data.store_id){
            this.getinfo()
        }else{
            wx.showToast({
                title:'URL缺少id参数'
            })
        }

    },

    getinfo(){
      wx.showLoading()
        util.wx.get('/api/store/get_store_homepage?store_id='+this.data.store_id).then(res=>{

                wx.hideLoading()

                if(res.data.code == 200){
                   this.setData({
                    info:res.data.data
                })

                }

        })
    },

    actSubmit(e){

        console.log(e)
        if(this.data.loading) return

        

        this.setData({
          submit: false,
          loading: true
        })


        util.wx.post('/api/helper/apply_store_helper',{
            store_id  : this.data.store_id
        })
        .then(res=>{

          if(res.data.code ==200){

                Dialog.alert({
                title: '申请成功',
                message: '已自动通过'
                }).then(() => {
                  //如果是从商品邀请进来的
                  if(this.goods_id){
                    wx.redirectTo({
                      url:`/pages/goods/goods?goods_id=${this.goods_id}&help_sale=true`
                    })

                  //从邀请码进来的
                  }else{

                        wx.switchTab({
                      url:'/pages/supplier-list/index'
                     })

                  }

              
              })

          } else if(res.data.code == 20001 || res.data.code == -2000){


                    wx.showModal({
                    title:'您还没有创建主页',
                    content:'请先免费创建主页',
                    confirmText:'好的马上',
                    showCancel: false,
                    success:(res)=>{

                     wx.redirectTo({
                      url:'/pages/create-home/index'
                     })
                     
                    }
                  })

                }

          else{


            Dialog.alert({
                title: '温馨提示',
                message: res.data.msg
                })


          }

          
           
            this.setData({
              loading:false
            })
            wx.hideLoading()

        })



      //   util.wx.post('/api/seller/apply_agent',{
      //       supplier_id:this.supplier_id,
      //       apply_remark:e.detail.value.apply_remark
      //   }).then(res=>{

         
      //       console.log('111',res)
      //      Dialog.alert({
      //         title: '申请成功',
      //         message: res.data.msg
      //       }).then(() => {

      //           wx.redirectTo({
      //               url:'/pages/home/index'
      //              })
      //       })
      //   },res=>{
      //       console.log('222',res)

      //         wx.showToast({
      //    title: res.data.msg,//提示文字
      //    duration:3000,
      //    icon:'none'
      //    //显示时长
      // })


      //   })
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
          this.setData({
            showLoginbtn:false
          })
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
      url2json : function(string, overwrite) {
    var obj = {},
        pairs = string.split('&'),
        d = decodeURIComponent,
        name, value;

    pairs.forEach((item, i) => {
        var pair = item.split('=');
        name = d(pair[0]);
        value = d(pair[1]);
        obj[name] = value;

    })
    console.log('url2json',obj)
    return obj;
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