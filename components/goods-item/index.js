import { $wuxGallery } from '../../wux/index'
const util = require('../../utils/util.js')
import Dialog from '../../vant/dialog/dialog';
const app = getApp()


Component({
    externalClasses: ['custom-class'],
    properties: {
        item: {
            type: Object,
            //wait、process、finish、error
            value: ''
        }
    },
    options: {},
    relations: {

    },
    data: {
      is_recommend:1,
      expires: '',
        urls: [
           
        ]
    },
    lifetimes: {
      attached: function() {

        console.log('this.properties.item.is_recommend',this.properties.item.is_recommend)
        // 在组件实例进入页面节点树时执行
        this.setData({
          is_recommend:this.properties.item.is_recommend,
          expires: this.properties.item.goods_expires
        })
      },
      detached: function() {
        // 在组件实例被从页面节点树移除时执行
      }
   },


  observers: {
    'item': function(data) {
      // 在 rate被设置时，执行这个函数
      //this.updataRate()
          this.setData({
          is_recommend:data.is_recommend,
          expires: data._expires
        })


    }
    },
    methods: {

     addListen(e){
      util.sellerListner()
     }, 

     /*下拉菜单*/
     moreAction(e){

      this.goods_id = e.currentTarget.dataset.id

        wx.showActionSheet({
          itemList: ['在主页隐藏', '在主页显示', '上架','下架','删除'],
          success :(res)=>{

            console.log(res)

            if(res.tapIndex == 0){

              this.switchInSite(0)

            }else if(res.tapIndex ==1){

              this.switchInSite(1)

            }
             else if(res.tapIndex ==2){

              this.goodsUp(1)

            }

             else if(res.tapIndex ==3){

              this.goodsDown(1)

            }

            else if(res.tapIndex == 4){
              // 立即结束
              this.delGoods()

            }

          },
          fail (res) {
            console.log(res.errMsg)
          }
        })
    },

     goodsUp(){

        Dialog.confirm({
          title: '确定要上架此商品吗？',
          asyncClose: true,
          context:this
        })
        .then(() => {
          this.goodsUpDown(1);
          Dialog.close();
        })
        .catch(() => {
          Dialog.close();
        })

      },


     goodsDown(){

        Dialog.confirm({
          title: '确定要下架此商品吗？',
          asyncClose: true,
          context:this
        })
        .then(() => {
          console.log('结束')
          this.goodsUpDown(2);
          Dialog.close();
        })
        .catch(() => {
          console.log('取消')
          Dialog.close();
        })

      },


    //切换个人主页显示
    switchInSite(status){
      wx.showLoading()
        util.wx.post("/api/seller/goods_change_recommend",{
            goods_id:this.goods_id,
            is_recommend:status  
        }).then(res=>{

         wx.hideLoading()


          if(res.data.code == 200){


             const tips = status==0?'主页已隐藏':'主页已显示'
                
                wx.showToast({
                    title:tips,
                    icon:'none'
                })

                this.setData({
                  is_recommend:status
                })

                //父组件接收
                // this.triggerEvent('recommend',{goods_id:this.goods_id,status})

          }else{
              

          }

           },res=>{
            wx.hideLoading()

            wx.showToast({
                    title:'设置失败请稍后重试',
                    icon:'none'
                })
           })
    },

      goodsOver(){

        Dialog.confirm({
          title: '确定要立即结束吗？',
          asyncClose: true,
          context:this
        })
        .then(() => {
          console.log('结束')
          this.goodsOverGet();
          Dialog.close();
        })
        .catch(() => {
          console.log('取消')
          Dialog.close();
        })



      },

      //上下架
      goodsUpDown(s){


        util.wx.post("/api/seller/goods_change_on_sale",{
            goods_id: this.goods_id,
            is_on_sale: s
        }).then(res=>{

        })

      },


      goodsOverGet(){
        wx.showLoading()

        util.wx.post("/api/seller/goods_change_endtime",{
            goods_id: this.goods_id,
            end_time: util.formatTime(new Date()), 
        }).then(res=>{
          console.log(res)

          wx.hideLoading()

          if(res.data.code == 200){

            wx.showToast({
                title:'修改成功',
                icon:'none'
            })

            this.setData({
              expires: 3
            })

          }else{
            wx.showToast({
                title:res.data.msg,
                icon:'none'
            })
          }

        })
      },


       upDownGoods(e){

        const status = e.currentTarget.dataset.status
        const goods_id = e.currentTarget.dataset.id



        const status_txt = status==1?'下架' :'上架'

        const tips_txt = status==1?'下架后将停止活动' :'上架后将出现在你的个人主页和可能被推荐到首页'

        Dialog.confirm({
          title: '确定要'+status_txt+'吗？',
          message: tips_txt,
          asyncClose: true,
          context:this
        })
          .then(() => {
            const _status = status==1 ? 2 : 1
            this.changeOnSale(goods_id, _status)
          })
          .catch(() => {
            Dialog.close();
          });

        },
      //调转到编辑页
      editPage(e) {
        let url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: '../publish/publish?goods_id=' + url,
        })
    },

    changeOnSale(goods_id,status){

        util.wx.post("/api/seller/goods_change_on_sale",{
            goods_id,
            is_on_sale:status  
        }).then(res=>{
            if(res.data.code==200){
                Dialog.close()
            }else{
                 Dialog.close()
                wx.showToast({
                    title:res.data.msg,
                    icon:'none'
                })
            }
        })
    },

    editPrice(e){
            //供应商 产品ID和商家产品id
        

        let link_goods = e.currentTarget.dataset.link_goods
        let goods_id = e.currentTarget.dataset.goods_id


        

        if(link_goods[1] && link_goods[1].store_id !== app.globalData.userInfo.store_id) {

           wx.navigateTo({
                          url: '../help-sale-up/index?is_modify=true&goods_id='+goods_id
                      })

        }

        if(link_goods[0]!==null){

         wx.navigateTo({
            url: '../goods-up/index?is_modify=true&supid=' + link_goods[0].goods_id+'&sellid='+goods_id
        })


        }

   



       

    },


    gofans(e){

          let id = e.currentTarget.dataset.id
          let name = e.currentTarget.dataset.name

        wx.navigateTo({
            url: '../fans/index?id=' + id+'&name='+name
        })


    },

    managePage(e){
     
  let id = e.currentTarget.dataset.id
  let delivery_method = e.currentTarget.dataset.delivery_method
  let goods_name = e.currentTarget.dataset.name
  let store_id = app.globalData.userInfo.store.store_id

  

        wx.navigateTo({
            url: '../ordermanage/list?goods_id=' + id + '&goods_name=' + goods_name + '&delivery_method=' + delivery_method+'&store_id='+store_id,
        })
    },
    //删除商品
    delGoods(e){
        //api/seller/goods_del

        wx.showModal({
            title:'确定要删除该商品吗？',
            content:'删除后不可恢复',
            success:(res)=>{
                if(res.confirm){
                    util.wx.post('/api/seller/goods_del',{
                        goods_id:this.goods_id
                    }).then(res=>{
                        if(res.data.code == 200){
                            wx.showToast({
                                title:'删除成功',
                                icon:'none' 
                            })

                            this.triggerEvent('remove',this.goods_id)


                        }else{
                             wx.showToast({
                                title:res.data.msg,
                                icon:'none' 
                            })
                        }
                    })
                }

            }
        })

    }
    },
    ready() {
    }
})