const qiniuUploader = require("./qiniuUploader");
import Card from '../palette/card';
import shareCard from '../palette/shareCard';
import shareCard2 from '../palette/shareCard2';
import shareCard3 from '../palette/shareCard3'; // 供应商海报
const app = getApp();



const config = {
     // apiUrl: 'https://www.kaixinmatuan.cn'
    apiUrl: 'https://dev.kaixinmatuan.cn'

}

const formatTime = date => {
    var date = new Date(date);
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const fmtDate  = obj => {
    var date = new Date(obj);
    var y = 1900 + date.getYear();
    var m = "0" + (date.getMonth() + 1);
    var d = "0" + date.getDate();
    return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}


const isMoney = val =>{

     var reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
     if(!reg.test(val)){
            return false
        }else{
            return true
        }
    }



const countTime = (nowDate, endDate) => {

    //获取当前时间  
    var now = new Date(nowDate).getTime();
    //设置截止时间  
    var endDate = new Date(endDate);
    var end = endDate.getTime();


    //时间差  
    var leftTime = end - now;
    //定义变量 d,h,m,s保存倒计时的时间  
    var d, h, m, s;
    var str = ''
    if (leftTime >= 0) {
        d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
        h = Math.floor(leftTime / 1000 / 60 / 60 % 24);
        m = Math.floor(leftTime / 1000 / 60 % 60);
        s = Math.floor(leftTime / 1000 % 60);

        //将倒计时赋值到div中  
        str += d + "天";
        str += h + "时";
        str += m + "分";
        str += s + "秒";
        console.log(str)
        return str

    } else {
        return str += '已经结束'
    }

}

//防止多次重复点击  （函数节流）
const throttle = function (fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }

  let _lastTime = null
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.call(this,arguments)
      _lastTime = _nowTime
    }
  }
}


//input双向绑定 注意context

const inputDuplex = function(e) {
    console.log(e)
    let context = this
    let name = e.currentTarget.dataset.key;
    let nameMap = {}

    var value = ''

    if(typeof e.detail !=='object'){
        value = e.detail
    }else{
        value=e.detail.value
    }

    nameMap[name] = value
    context.setData(nameMap)
}


const uploadFile = function(opt) {

    console.log('上传方法 app.globalData.token', app.globalData.token)

    return new Promise((reslove, reject) => {
        wx.uploadFile({
            url: config.apiUrl + '/api/seller/upload',
            filePath: opt.filePath,
            name: 'file',
            header: {
                "Content-Type": "multipart/form-data",
                "Authorization": app.globalData.token
            },
            success: function(res) {

                if (typeof res.data == 'string') {
                    res = JSON.parse(res.data)
                }
                console.log('res.data.data', res)
                if(res.code == 200){
                  reslove(res)
              }else{
                reject(res)
              }

            },
            fail: function(e) {

                reject(e)

            }
        })
    })



}



//上传图片封装
const uploadPicture = function(option) {

    let options = Object.assign({
        count: 9, //选择图片数量
        max: 9, //每次最大上传数量
        sizeType: ['original'] // 可以指定是原图还是压缩图，默认二者都有

    }, option)


    const successHandle = function(res) {

        var files = res.tempFilePaths
        var imgCount = 0
        options.progressState(true)

        console.log('图片选择好了',true)

        files.forEach((filePath, i) => {

            uploadFile({
                    filePath: filePath
                }).then(res => {
                    console.log('一张图片成功', res)
                    console.log('res.data.file_url', res.data.file_url)

                    if (res.code == 200) {
                        imgCount++

                        options.success(res.data.file_url)

                    } else {

                        wx.showToast({
                            title: res.msg,
                            icon: 'success'
                        })
                    }

                    if (imgCount === files.length - 1) {
                        options.progressState(false)
                    }

                },(res)=>{
                    if(res.code == -100 || res.code == -99){
                        console.log('没有登录')
                    }
                })
                .catch((err) => {
                    wx.showToast({
                        title: JSON.stringify(err),
                        icon: 'success'
                    })
                    options.progressState(false)

                })

        })



    }



    wx.chooseImage(Object.assign(option, {
        success: successHandle
    }))







}

// 计算两个经纬度之间的距离
const distance = (la1, lo1, la2, lo2) => {
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137; //地球半径
    s = Math.round(s * 10000) / 10000;
    console.log("计算结果", s)
    return s
}

//绘制分享图片
// const get_painter_data_and_draw = function(goods_id, isBuyPage) {

//     let cardConfig = {
//         headsImgArr: []
//     }

//     //获取人
//     var getUserList = function(goods_id, cb) {
//         wx.request({
//             url: 'https://www.daohangwa.com/api/goods/get_buyusers_by_goodsid',
//             method: 'post',
//             data: {
//                 token: app.globalData.token,
//                 goods_id: goods_id
//             },
//             success: (res) => {
//                 if (res.data.code == 0) {
//                     cardConfig.buyCount = res.data.data.lists.length
//                     let data = res.data.data.lists.slice(0, 9)
//                     data.forEach(e => {
//                         cardConfig.headsImgArr.push(e.user.head_pic)
//                     })

//                     let painterData = new Card().palette(cardConfig)
//                     cb(painterData)
//                 }
//             }
//         })

//     }
//     //获取内容Storage _card_data
//     try {
//         var _card_data = wx.getStorageSync('_card_data') || false
//         if (_card_data & !isBuyPage) {

//             cardConfig = Object.assign(cardConfig, _card_data)

//             getUserList(goods_id, (res) => {
//                 this.setData({
//                     painterData: res,
//                     goods_id: goods_id
//                 })
//             })

//         } else {

//             wx.request({
//                 url: 'https://www.daohangwa.com/api/goods/get_goods_info',
//                 data: {
//                     token: app.globalData.token,
//                     goods_id: goods_id
//                 },
//                 success: (res) => {
//                     if (res.data.code == 0) {

//                         /**** 生成分享卡片配置 ***/
//                         // const reg2=/([\u00A9\u00AE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665-\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70-\uDD71\uDD7E-\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01-\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50-\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96-\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF])|(\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F-\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95-\uDD96\uDDA4-\uDDA5\uDDA8\uDDB1-\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB-\uDEEC\uDEF0\uDEF3-\uDEF6])|(\uD83E[\uDD10-\uDD1E\uDD20-\uDD27\uDD30\uDD33-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4B\uDD50-\uDD5E\uDD80-\uDD91\uDDC0])/g

//                         let _content = res.data.data.goods.goods_content
//                         // _content =_content.replace(reg2,"").replace(/\n/g," ")
//                         _content = _content.replace(/\n/g, " ")

//                         console.log('countTime', countTime(res.header.Date, new Date(res.data.data.goods.sell_end_time * 1000)))

//                         let cardLocalData = {
//                             headImg: res.data.data.seller_user.head_pic,
//                             userName: res.data.data.seller_user.nickname,
//                             date: countTime(res.header.Date, new Date(res.data.data.goods.sell_end_time * 1000)),
//                             content: _content,
//                             cover: res.data.data.goods.local_cover
//                         }

//                         Object.assign(cardConfig, cardLocalData)




//                         getUserList(goods_id, (res) => {
//                             this.setData({
//                                 painterData: res,
//                                 goods_id: goods_id
//                             })
//                         })
//                     }
//                 }
//             })


//         }
//     } catch (e) {

//         console.log('获取缓存出错')


//     }

// }

//获取分享图片
// const getShareImg = (goods_id, _this) => {
//     wx.request({
//         method: "post",
//         url: 'https://www.daohangwa.com/api/goods/set_goods_shareimg',
//         data: {
//             goods_id: goods_id
//         },
//         success: (res) => {
//             if (res.data.code == 0) {
//                 _this.setData({
//                     imagePath: res.data.data.shareimg
//                 })

//             }

//         }
//     })
// }




//收集formID
const formSubmitCollectFormId = function(e) {
    console.log('全局收集formid', e)

    if(!!app.globalData.userInfo){
    WX.post('/api/common/gather_formid',{
        form_id: e.detail.formId
    }).then(res=>{
        console.log(res)
    }).catch(e=>{
        console.log(e)
    })

}

    const fn = e.currentTarget.dataset.fn || e.detail.target.dataset.fn
    console.log('fn',fn)
    if ( this[fn]) {
        //执行原跳转事件
        this[fn](e);
    }

}


/**
 * 获取用户的地理位置 并解析出省市区 ，注意接口调用次数
 */

const getUserloaction = function(callback) {

    console.log('getUserloaction',getUserloaction)
    //onload 获取地理位置
    return new Promise((reslove, reject) => {
    console.log('wx.getLocation')

        wx.getLocation({
            type: 'wgs84',
            success: function(res) {
                var latitude = res.latitude
                var longitude = res.longitude
                console.log('wx.getLocation',latitude)
                if(callback){
                    callback(res)
                }
                // var speed = res.speed
                // var accuracy = res.accuracy
                wx.request({
                    url: 'https://apis.map.qq.com/ws/geocoder/v1/?key=FKRBZ-RK4WU-5XMV4-B44DB-D4LOH-G3F73&get_poi=1',
                    data: {
                        location: latitude + ',' + longitude
                    },
                    method: 'get',
                    success: (res) => {
                console.log('apis.map.qq.com',res)



                        reslove(Object.assign({}, res.data.result.address_component, { latitude, longitude }))
                    },
                    fail: (err) => {
                      console.log('apis.map.qq.com fail',err)

                    }

                })
            },
            complete:(e)=>{
                console.log('complete',e)
            },
            fail: (err) => {

                console.log('wx.getLocation',err)

                reject(err)
            }
        })

    })

}

const WX = {}
/**封装request请求**/
const request = (url, data, method) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.apiUrl + url,
            data: data,
            method: method,
            header: {
                'content-type': 'application/json',
                'Authorization': app.globalData.token
            },
            success: function(res) { //服务器返回数据
               
               console.log('success',url,res.data.code)

                if (res.data.code == '-99' || res.data.code == '-100') {
                    console.log('应该调到等路')
                     wx.clearStorageSync() 
                     app.redirectToLogin()

                } else { //返回错误提示信息
                    resolve(res)
                }
            },
            fail: function(e) {
                reject('网络出错' + e)
            }
        })
    })
}

/**封装GET请求**/
WX.get = (url, data) => {
    return request(url, data, 'get')
}

/**封装POST请求**/
WX.post = (url, data) => {
    return request(url, data, 'POST')
}



/***生成小程序码**
 ***返回小程序码图片路径**/
const getQrcode = (o) => {
    return new Promise((resolve, reject) => {
        WX.post("/api/common/get_xcx_qrcode", { scene: o.scene, page: o.page, width: o.width || 430 })
            .then((res) => {
                console.log(res, res.code)
                if (res.data.code == 0) {
                    resolve(res.data.data.qrcode_url)
                } else {
                    reject(res.msg)
                }
            })
    })
}

/**抛物线公式**/

const bezier = function(pots, amount) {
    var pot;
    var lines;
    var ret = [];
    var points;
    for (var i = 0; i <= amount; i++) {
        points = pots.slice(0);
        lines = [];
        while (pot = points.shift()) {
            if (points.length) {
                lines.push(pointLine([pot, points[0]], i / amount));
            } else if (lines.length > 1) {
                points = lines;
                lines = [];
            } else {
                break;
            }
        }
        ret.push(lines[0]);
    }

    function pointLine(points, rate) {
        var pointA, pointB, pointDistance, xDistance, yDistance, tan, radian, tmpPointDistance;
        var ret = [];
        pointA = points[0]; //点击
        pointB = points[1]; //中间
        xDistance = pointB.x - pointA.x;
        yDistance = pointB.y - pointA.y;
        pointDistance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 1 / 2);
        tan = yDistance / xDistance;
        radian = Math.atan(tan);
        tmpPointDistance = pointDistance * rate;
        ret = {
            x: pointA.x + tmpPointDistance * Math.cos(radian),
            y: pointA.y + tmpPointDistance * Math.sin(radian)
        };
        return ret;
    }
    return {
        'bezier_points': ret
    };
}

//绘制分享朋友圈图片
function drawShareFriends(_this, res, buyuser, from) {
    var config = _this.data.shareCardConfig;
    var height = 0;
    var goods = res.goods;

    console.log(res, buyuser)

    let goods_content = goods.goods_content ? goods.goods_content.split(/[\r\n↵]/g) : [];
    config.content.des = [];
    //分段
    [goods.goods_name].concat(goods_content).forEach((e, i) => {
        config.content.des.push({ txt: e });
    })
    // 规格最小值
    // config.spec_price = parseFloat(goods.goods_spec[0].spec_price);
    // goods.goods_spec.forEach((e,i)=>{
    //     if(parseFloat(e.spec_price) < config.spec_price){
    //         config.spec_price = parseFloat(e.spec_price)
    //     }
    // })
    // 规格
    config.spec = goods.goods_spec;

    // 购买头像
    config.buyuser = buyuser;

    // 商品最大值和最小值
    config.price_max = goods.price_max;
    config.price_min = goods.price_min;

    //内容赋值获取高度
    _this.setData({
        shareCardConfig: _this.data.shareCardConfig
    }, () => {

        config.content.lineHeight = config.content.lineHeight || 56;
        config.content.fontSize = config.content.fontSize || 34;
        config.headImg.src = goods.user.headimg;
        config.userName = goods.user.nickname;
        // config.goodsImg.src = res[1].data.images[0];
        config.goodsImg.src = goods.goods_cover;

        //获取文本高度 绘制图片
        wx.createSelectorQuery().selectAll('.des-content').boundingClientRect().exec(rects => {
            rects = rects[0];
            let dpr = (config.width - config.content.margin * 2) / rects[0].width;

            rects.forEach((e, i) => {
                config.content.des[i].width = Math.ceil(e.width);
                config.content.des[i].lines = Math.ceil(e.height / config.content.lineHeight * dpr);
                config.content.des[i].height = config.content.des[i].lines * config.content.lineHeight;
                height += config.content.des[i].height;

                config.height = height;
            })
            console.log(config);
            if(from == 'businessGoods'){
                config.qrcode.src = goods.qrcode;
                _this.setData({
                    template: new shareCard3().palette(config),
                });
            }else{
                config.qrcode.src = goods.xcx_qrcode;
                _this.setData({
                    template: new shareCard().palette(config),
                    template2: new shareCard2().palette(config),
                });
            }

        })

    });
}

//播放背景音乐
const playSound = function(url) {
    console.log(url)
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = url
    console.log(innerAudioContext)
    innerAudioContext.onPlay(() => {
        console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        console.log(res.errCode)
    })

}

const url2json = function(string, overwrite) {
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
}

//上一页赋值
const setParentData = function(data) {

    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
    // 直接调用上一个页面的setData()方法，把数据存到上一个页面中去

    prevPage.setData(data, () => {
        console.log('赋值成功', data)
        wx.navigateBack({
            delta: 1
        })
    })
}

//订阅提醒
//

const addListener = function (who) {

       if(who=='user'){
        var tmplIds=['v_pkvU1y21HcA69K6Rsde4ivcsMExxptWHdcr2abADg', // 发货提醒
              'KEpGvkFWzV8bGV_cKLp9BUdEGVY6RwSijolExu5M5dY', // 留言通知
              'Wu_vie78kgoRr8y90IAsxmmQQvqy3l8f4NsYC_1xMqg'] //新品上架
       }else{

        var tmplIds= [
        'MlhFii7cRSnXZf-HFT20eccXD77MPByPLY6LQvUkidI',//新订单
        'LxxXR_fCI9WE8vxbvWvGLdlghHsJfxEcM_9QdofzfaI'] //经营报告

       }

       if(!wx.requestSubscribeMessage){
        return  wx.showToast({
                        title:'您的微信版本低，请升级微信',
                        icon:'none'
                      })
       }

       return function(){
            wx.requestSubscribeMessage({
              tmplIds:tmplIds ,
              success (res) {

                for (var key in res) {
                  if (key !='errMsg') {
                    if (res[key] =='reject') {
                      // wx.showModal({
                      //   title:'订阅消息',
                      //   content:'您已拒绝了订阅消息，将不会收到微信通知',
                      //   confirmText:'知道了',
                      //   //showCancel: false,
                      //   success: res => {
                         
                      //   }
                      // })
                      return
                    }else{
                      wx.showToast({
                        title:'已订阅',
                        icon:'none'
                      })
                    }
                  }
                }


               }
            })
       }



    }

//验证手机号函数

 const checkMobile = function(mobile){

     if(!mobile || !(/^1(3|4|5|6|7|8|9)\d{9}$/.test(mobile))){ 
             wx.showToast({
                        title: '手机号码有误',
                        icon: 'none'
                    });
            return false; 
        }

 }



const userListner = addListener('user')
const sellerListner = addListener('seller')

module.exports = {
    formatTime,
    fmtDate,
    inputDuplex,
    uploadPicture,
    distance,
    userListner,
    sellerListner,
    // getShareImg,
    formSubmitCollectFormId,
    getUserloaction,
    getQrcode,
    wx: WX,
    drawShareFriends,
    config,
    playSound,
    uploadFile,
    bezier,
    setParentData,
    throttle,
    url2json,
    checkMobile,
    isMoney
}