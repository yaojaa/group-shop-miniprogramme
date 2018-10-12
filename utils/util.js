const qiniuUploader = require("./qiniuUploader");


const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
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


module.exports = {
  formatTime,
  inputDuplex,
  uploadPicture,
  distance
}
