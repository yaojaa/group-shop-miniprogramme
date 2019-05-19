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
    index: 1, // 动画下标
    animationDuration: 15, // 动画持续时间基数
    imgBoxSize: {}, // 容器实际尺寸
    img: {}, //页面当前图片
    bigImgsHidden: true, //查看大图
    minScaleVal: 50, //最小缩放值
    minXYVale: 100,//xy轴最小运动值
    checkImgDuration: 0, // 查看大图轮播持续时间
  },
  ready(){
    // this.init();
  },

  methods: {
    init() {

      if (this.isEmpty(this.properties.imgs.src)) {
        return;
      }

      this.data.animationDuration = this.properties.imgs.animationDuration || this.data.animationDuration;
      this.data.minScaleVal = this.properties.imgs.minScaleVal || this.data.minScaleVal;
      this.data.minXYVale = this.properties.imgs.minXYVale || this.data.minXYVale;

      this.properties.imgs.src.forEach(e => {
        e.src = e.img_url;
        e.img_url = e.img_url + '?imageMogr2/thumbnail/750x'+ this.properties.imgs.height +'/size-limit/60k!/imageslim'
      })

      // this.properties.imgs.src=[
      //   {img_url: "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1402689538,1138486299&fm=26&gp=0.jpg"},
      //   {img_url: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1349823395,1860218221&fm=26&gp=0.jpg"},
      //   {img_url: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3279718710,204380919&fm=26&gp=0.jpg"},
      //   {img_url: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3177052742,4178134656&fm=26&gp=0.jpg"},
      //   {img_url: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2769144416,3324413978&fm=26&gp=0.jpg"},
      //   {img_url: "https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=585768271,3076094714&fm=26&gp=0.jpg"},
      // ]

      this.data.imgsPath.push({ src: this.properties.imgs.src[0].img_url, type: 9, flag: false });
      this.setData({
        imgsPath: this.data.imgsPath,
        img: this.data.imgsPath[0]
      })


      if(this.properties.imgs.src.length == 1){
        return;
      }

      this.animationInit([this.properties.imgs.src.shift(),this.properties.imgs.src.shift()], true);
      
    },

    animationInit(IMG, first){
      let imageInfo = [];

      IMG.forEach(e => {
        imageInfo.push(this.getImageInfo(e.img_url)) 
      });

      if(first){
        Promise.all(imageInfo).then(arr => {
          this.createSelectorQuery().selectAll('.img-box').boundingClientRect().exec(rects => {

            this.data.imgBoxSize.w = rects[0][0].width;
            this.data.imgBoxSize.h = rects[0][0].height;
            this.data.imgsPath = [];

            arr.forEach((e, i) => {
              if(e.errMsg == "getImageInfo:ok"){
                this.data.imgsPath.push(this.getImgsOpt(this.data.imgBoxSize.w, this.data.imgBoxSize.h, e, IMG[i]));
              }
            })

            this.setData({
              imgsPath: this.data.imgsPath
            })

            this.animationFun(true);

            //二次加载图片
            this.animationInit(this.properties.imgs.src);
          })
        });
      }else{
        Promise.all(imageInfo).then(arr => {

            arr.forEach((e, i) => {
              if(e.errMsg == "getImageInfo:ok"){
                this.data.imgsPath.push(this.getImgsOpt(this.data.imgBoxSize.w, this.data.imgBoxSize.h, e, IMG[i]));
              }
            })

            this.setData({
              imgsPath: this.data.imgsPath
            })
        });
      }
      
      // Promise.all(imageInfo).then(arr => {
      //   this.createSelectorQuery().selectAll('.img-box').boundingClientRect().exec(rects => {

      //     this.data.imgBoxSize.w = rects[0][0].width;
      //     this.data.imgBoxSize.h = rects[0][0].height;
      //     this.data.imgsPath = [];

      //     arr.forEach((e, i) => {
      //       if(e.errMsg == "getImageInfo:ok"){
      //         this.data.imgsPath.push(this.getImgsOpt(this.data.imgBoxSize.w, this.data.imgBoxSize.h, e, IMG[i]));
      //       }
      //     })

      //     this.setData({
      //       imgsPath: this.data.imgsPath
      //     })

      //     this.animationFun(true);
      //   })
      // });

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
      let _img = i == 0 ? this.data.imgsPath[this.data.imgsPath.length-1] : this.data.imgsPath[i-1];
      //初始数据
      this.animationReset(random);

      img.transition = this.getAnimationParam(img.duration);

      img.flag = !_img.flag;

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

          }, img.duration*1000+500);
        });

      });

    },

    checkBigImg(){
      this.setData({
        index: this.data.index,
        bigImgsHidden: false
      },()=>{
        this.setData({
          checkImgDuration: 500
        })
      })
    },

    closeBigImg(){
      this.setData({
        checkImgDuration: 0,
        bigImgsHidden: true
      })
    },

    animationType(img, r){
      if(img.type == 0){
        img.scale = img.size.s;
      }else if(img.type == 1){
        img.x = r ? this.data.imgBoxSize.w - img.size.w : 0;
      }else{
        img.y = r ? this.data.imgBoxSize.h - img.size.h : 0;
      }
    },

    animationReset(r){
      this.data.imgsPath.forEach(e => {
        if(e.type == 0){
          e.scale = e.size._s;
        }else if(e.type == 1){
          e.x = r ? 0 : this.data.imgBoxSize.w - e.size.w;
        }else{
          e.y = r ? 0 : this.data.imgBoxSize.h - e.size.h;
        };
      })
    },

    getImgsOpt(w, h, e, imgs){
      let opt = null;
      let size = {};
      let b = e.width / e.height;
      let _b = w / h;

      if(b == 1){  //正方形
        size.w = Math.min(w, h);
        size.h = size.w;
        size.s = Math.max(w, h) / size.w; //缩放限值
        size._s = this.data.minScaleVal / size.w; //最小缩放
        opt = {
          src: e.path,
          size: size,
          type: '0', //0正方形  1横图  2竖图
          scale: size._s,
          duration: this.getDuration((Math.max(w, h) - this.data.minScaleVal)/2)
        };
      }else if(b > _b){ //横图
        size.h = h;
        size.w = e.width/e.height*h;

        if(size.w - w <= this.data.minXYVale){ //小于最小运动值  运动效果改缩放
          size.s = 1; //缩放限值
          size._s = this.data.minScaleVal / size.w;
          opt = {
            src: e.path,
            size: size,
            type: '0', //0正方形  1横图  2竖图
            scale: size._s,
            duration: this.getDuration((size.w - this.data.minScaleVal) / 2)
          };
        }else{
          opt = {
            src: e.path,
            size: size,
            type: '1', //0正方形  1横图  2竖图
            x: 0,
            duration: this.getDuration(Math.abs(size.w - w))
          };
        }

      }else{  //竖图
        size.w = w;
        size.h = e.height/e.width*w;

        if(size.h - h <= this.data.minXYVale){ //小于最小运动值  运动效果改缩放
          size.s = 1; //缩放限值
          size._s = this.data.minScaleVal / size.h;
          opt = {
            src: e.path,
            size: size,
            type: '0', //0正方形  1横图  2竖图
            scale: size._s,
            duration: this.getDuration((size.h - this.data.minScaleVal) / 2)
          };
        }else{
          opt = {
            src: e.path,
            size: size,
            type: '2', //0正方形  1横图  2竖图
            y: 0,
            duration: this.getDuration(Math.abs(size.h - h))
          };
        }
      };
      opt._src = imgs.src;
      return opt;
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
