Component({
  properties: {
    imgs: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        this.init();
      },
    },
  },
  data: {
    imgsPath:[], // 图片信息集合
    index: 0, // 动画下标
    animationDuration: 10, // 动画持续时间基数
    imgBoxSize: {}, // 容器实际尺寸
    img: {}, //页面当前图片
    bigImgsHidden: true, //查看大图
  },
  ready(){
    // this.init();
  },

  methods: {
    init() {
      let imageInfo = [];

      if (this.isEmpty(this.properties.imgs)) {
        return;
      }

      this.properties.imgs.src.forEach(e => {
        imageInfo.push(this.getImageInfo(e))
      });
      
      Promise.all(imageInfo).then(arr => {
        this.createSelectorQuery().selectAll('.img-box').boundingClientRect().exec(rects => {

          this.data.imgBoxSize.w = rects[0][0].width;
          this.data.imgBoxSize.h = rects[0][0].height;
          this.data.imgsPath = [];

          arr.forEach((e, i) => {
            let b = e.width/e.height;
            let size = this.widthHeight(this.data.imgBoxSize.w, this.data.imgBoxSize.h, e.width, e.height);

            if(e.errMsg == "getImageInfo:ok"){
              if(b == 1){  //正方形
                this.data.imgsPath.push({
                  src: e.path,
                  size: size,
                  type: '0', //0正方形  1横图  2竖图
                  scale: 0,
                  duration: this.getDuration(size.s/2)
                })
              }else if(b > 1){ //横图
                this.data.imgsPath.push({
                  src: e.path,
                  size: size,
                  type: '1', //0正方形  1横图  2竖图
                  x: 0,
                  duration: this.getDuration(Math.abs(size.w - this.data.imgBoxSize.w))
                })

              }else{  //竖图
                this.data.imgsPath.push({
                  src: e.path,
                  size: size,
                  type: '2', //0正方形  1横图  2竖图
                  y: 0,
                  duration: this.getDuration(Math.abs(size.h - this.data.imgBoxSize.h))
                })
              }
            }
          })

          this.setData({
            imgsPath: this.data.imgsPath
          })

          this.animationFun(true);
        })
      });
      
    },

    getImageInfo(filePath) {
      return new Promise(resolve => {
        wx.getImageInfo({
          src: filePath,
          success: (info) => {
            resolve(info);
          },
          fail: (error) => {
            console.log('err',error)
          },
        });
      })

    },

    animationFun(random){
      let i = this.data.index;
      let img = this.data.imgsPath[i];
      console.log(random)
      //初始数据
      this.animationReset(random);

      if(img.type == 0){
        img.transition = this.getAnimationParam(img.duration);
      }else if(img.type == 1){
        img.transition = this.getAnimationParam(img.duration);
      }else{
        img.transition = this.getAnimationParam(img.duration);
      }

      img.index = i;

      // 初始渲染
      this.setData({
        img: img
      },() => {

        //添加动画效果值
        this.animationType(img, random);

        // 加载动画
        this.setData({
          img: img
        }, () => {
          setTimeout(() => {

            if(this.data.index == this.data.imgsPath.length - 1){
              this.data.index = 0;
            }else{
              this.data.index ++;
            }

            this.animationFun(this.getRandom());

          }, img.duration*1000);
        });

      });

    },

    checkBigImg(){
      this.setData({
        bigImgsHidden: false
      })
    },

    closeBigImg(){
      this.setData({
        bigImgsHidden: true
      })
    },

    animationType(img, r){
      if(img.type == 0){
        img.scale = img.size.s/img.size.w;
      }else if(img.type == 1){
        img.x = r ? this.data.imgBoxSize.w - img.size.w : 0;
      }else{
        img.y = r ? this.data.imgBoxSize.h - img.size.h : 0;
      }
    },

    animationReset(r){
      this.data.imgsPath.forEach(e => {
        if(e.type == 0){
          e.scale = 0;
        }else if(e.type == 1){
          e.x = r ? 0 : this.data.imgBoxSize.w - e.size.w;
        }else{
          e.y = r ? 0 : this.data.imgBoxSize.h - e.size.h;
        };
      })
    },

    widthHeight(w, h, _w, _h){
      let wh = w/h; //容器宽高
      let _wh = _w/_h; //原始图片宽高
      let size = {}; // 处理后图片尺寸

      if(_w == _h){
        size.w = Math.min(w, h);
        size.h = size.w;
        size.s = Math.max(w, h); //缩放限值
      }else if(wh > _wh){
        size.w = w;
        size.h = _h/_w*w;
      }else{
        size.h = h;
        size.w = _w/_h*h;
      }

      return size;
    },

    getDuration(size){
      return size*this.data.animationDuration/1000;
    },

    getAnimationParam(duration){
      return "transition: all "+ duration +"s";
    },

    getRandom(){
      return parseInt(Math.random()*9+1)%2 == 0;
    },

    isEmpty(object) {
      for (const i in object) {
        return false;
      }
      return true;
    },

  },
});
