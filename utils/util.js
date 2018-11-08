const qiniuUploader = require("./qiniuUploader");
import Card from '../palette/card';
const app = getApp();

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


//input双向绑定 注意context

const inputDuplex = function(e) {
      let context = this
      let name = e.currentTarget.dataset.key;
      let nameMap = {}
      nameMap[name] = e.detail.value
      context.setData(nameMap)
}
//上传图片封装
const uploadPicture = function(option){

  let options = Object.assign({
    count:9, //选择图片数量
    max:5,  //每次最大上传数量
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    progressState:function(){},
    successData:function(){}//上传成功回调
  },option)

   wx.chooseImage({
      count: 5, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success:  (res)=> {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var files = res.tempFilePaths
        var filePath = res.tempFilePaths

        if(files.length>options.max){
          wx.showToast({
            title:'请不要多于5张',
            icon:'none'
          })
        }

        options.progressState(true)

        files.forEach((filePath,index,ary)=>{

            qiniuUploader.upload(filePath, (rslt) => {
              console.log(rslt)
                 options.successData(rslt.imageURL)
                 //最后一张上传完成时，不显示loading
                if(index === ary.length-1){
                   options.progressState(false)
                }
           })

        })
    }
    })

}

// 计算两个经纬度之间的距离
const distance =  (la1, lo1, la2, lo2) => {
  var La1 = la1 * Math.PI / 180.0;
  var La2 = la2 * Math.PI / 180.0;
  var La3 = La1 - La2;
  var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
  s = s * 6378.137; //地球半径
  s = Math.round(s * 10000) / 10000;
  console.log("计算结果",s)
  return s
}

//绘制分享图片
const get_painter_data_and_draw = function(goods_id,isBuyPage){

  let cardConfig ={
    headsImgArr:[]
  } 

 //获取人
 var getUserList = function(goods_id,cb){
  wx.request({
      url: 'https://www.daohangwa.com/api/goods/get_buyusers_by_goodsid',
      method:'post',
      data: {
        token: app.globalData.token,
        goods_id: goods_id
      },
      success: (res) => {
        if (res.data.code == 0) {
          res.data.data.lists.forEach(e => {
            cardConfig.headsImgArr.push(e.user.head_pic)
          })
         let  painterData = new Card().palette(cardConfig)
              cb(painterData)
          }
      }
    })

 }
  //获取内容Storage _card_data
      try {
        var _card_data = wx.getStorageSync('_card_data') || false
        if (_card_data & !isBuyPage ) {

          cardConfig = Object.assign(cardConfig,_card_data)

                 getUserList(goods_id,(res)=>{
                   this.setData({
                       painterData:res,
                       goods_id:goods_id
                     })
                 })
        
        }else{

           wx.request({
            url: 'https://www.daohangwa.com/api/goods/get_goods_info',
            data: {
                token :app.globalData.token,
                goods_id: goods_id
            },
            success: (res) => {
             if (res.data.code == 0) {

                /**** 生成分享卡片配置 ***/
          // const reg2=/([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g

          let _content = res.data.data.goods.goods_content
             // _content =_content.replace(reg2,"").replace(/\n/g," ")
             _content =_content.replace(/\n/g," ")

          let cardLocalData={
            headImg:res.data.data.seller_user.head_pic,
            userName:res.data.data.seller_user.nickname,
            date:formatTime(new Date(res.data.data.goods.sell_end_time*1000)),
            content:_content
          }

          Object.assign(cardConfig,cardLocalData)




         getUserList(goods_id,(res)=>{
          console.log(this)
               this.setData({
                   painterData:res,
                   goods_id:goods_id
                 })
             })
                }
              }
          })


        }
      } catch (e) {

          console.log('获取缓存出错')
           
        
      }  



  


}

//获取分享图片
const getShareImg = (goods_id, _this) => {
  wx.request({
    method: "post",
    url: 'https://www.daohangwa.com/api/goods/set_goods_shareimg',
    data: {
      goods_id: goods_id
    },
    success: (res) => {

      console.log('获取分享图片',res.data.data.shareimg)

      if (res.data.code == 0) {
        _this.setData({
          imagePath: res.data.data.shareimg
        })

      }

    }
  })
}

//收集formID
 const formSubmitCollectFormId=function (e) {
  console.log('全局收集formid',this)
  
  wx.request({
    method: "post",
    url: 'https://www.daohangwa.com/api/common/gather_formid',
    data: {
      form_id: e.detail.formId,
      token:app.globalData.token
    },
    success: (res) => {
    }
  })

  if(e.currentTarget.dataset.fn){

    console.log(this)
      //执行原跳转事件
      this[e.currentTarget.dataset.fn](e);
  }

}


 /**
 * 下载保存一个文件
 */



module.exports = {
  formatTime,
  inputDuplex,
  uploadPicture,
  distance,
  get_painter_data_and_draw,
  getShareImg,
  formSubmitCollectFormId
}
