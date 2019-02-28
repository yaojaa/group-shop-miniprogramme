Component({
  properties: {
    imgs: {
      type: Object,
      value: {
        src:[
          "https://www.daohangwa.com/public/upload/local_cover/tmp_71a8a18f8d4e18b8cf892a4c3e28424cf3997fe5c76f3157.jpg",
          "https://www.daohangwa.com/public/upload/local_cover/wx6ac9955f87c289f0.o6zAJsx6hMSC0UBabsyLYJuKY6ew.7z0KiIbdNBif8c155dfc2e203591a2bc726215709f2e.jpg",
          "https://www.daohangwa.com/public/upload/local_cover/tmp_8789e959d03e6124356439808cc0354c81fd598848c33517.jpg",
          "https://www.daohangwa.com/public/upload/local_cover/tmp_cd85c827575f94b291aacf7552af15971fe3b1083d6d6374.jpg",
          "https://wx.qlogo.cn/mmopen/vi_32/QIbmMAaoLUEQg7pwSpjOEtMOPLxXxBsjQ4RNaIZQ7u7gngDjvU3RJC4ibez6ia2pX98dnnGserc9tqoniaicRg5aGA/132",
        ],
        height: 600
      },
      observer: function (newVal, oldVal) {
        this.init();
      },
    },
  },
  data: {
    imgsPath:[], // 图片信息集合
    index: 0, // 动画下标
    animationDuration: 10, // 动画持续时间基数
    imgBoxSize: {} // 容器实际尺寸
  },
  ready(){
    this.init();
  },

  methods: {
    isEmpty(object) {
      for (const i in object) {
        return false;
      }
      return true;
    },

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

          arr.forEach((e, i) => {
            let b = e.width/e.height;
            let size = this.widthHeight(this.data.imgBoxSize.w, this.data.imgBoxSize.h, e.width, e.height);

            if(e.errMsg == "getImageInfo:ok"){
              if(b == 1){  //正方形
                this.data.imgsPath.push({
                  src: e.path,
                  size: size,
                  type: '0', //0正方形  1横图  2竖图
                  hidden: i == this.data.index ? false : true,
                  scale: 1,
                  getAnimationParam: this.getAnimationParam(size.s/2)
                })
              }else if(b > 1){ //横图
                this.data.imgsPath.push({
                  src: e.path,
                  size: size,
                  type: '1', //0正方形  1横图  2竖图
                  hidden: i == this.data.index ? false : true,
                  scale: 1,
                  getAnimationParam: this.getAnimationParam(Math.abs(size.w - this.data.imgBoxSize.w)),
                })

              }else{  //竖图
                this.data.imgsPath.push({
                  src: e.path,
                  size: size,
                  type: '2', //0正方形  1横图  2竖图
                  hidden: i == this.data.index ? false : true,
                  scale: 1,
                  getAnimationParam: this.getAnimationParam(Math.abs(size.h - this.data.imgBoxSize.h)),
                })

              }
            }
          })

          this.animationFun();
        })
      });
      
    },

    getAnimationParam(size){
      return {
        duration: size*this.data.animationDuration,
        timingFunction: "linear"
      }
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

    animationFun(){
      let i = this.data.index % this.data.imgsPath.length;
      let img = this.data.imgsPath[i];

      this.data.imgsPath.forEach(e => {
        e.hidden = true;
        e.scale = 1;
      })

      if(img.type == 0){
        img.scale = 0;
      }

      img.hidden = false;
      
      this.setData({
        imgsPath: this.data.imgsPath
      },() => {
        this.animationType(img);

        this.setData({
          imgsPath: this.data.imgsPath
        }, () => {
          this.data.index ++ ;
          setTimeout(() => {
            this.animationFun();
          }, img.getAnimationParam.duration);
        });

      })

    },

    animationType(img){
      let animation = wx.createAnimation(img.getAnimationParam);
      if(img.type == 0){
        img.scale = 0;
        img.animationOuter = animation.scale(img.size.s/img.size.w, img.size.s/img.size.w).step().export();
      }else if(img.type == 1){
        img.animationImg = animation.translateX(-img.size.w + this.data.imgBoxSize.w).step().export();
      }else{
        img.animationImg = animation.translateY(-img.size.h + this.data.imgBoxSize.h).step().export();
      }
    }

  },
});
