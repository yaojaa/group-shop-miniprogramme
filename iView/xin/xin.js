Component({
    externalClasses: ['xin-class'],

    properties: {
        size: {
            type: String,
            value: '40px'
        },
        cancelImg: {
            type: String,
            value: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTM2MTI5ODgwNTg2IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMxOTkiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNODg3LjI2MDcwOSAyMzIuODQ5MjMyYy05Ni45MzU3NS05Ni45MzY3NzMtMjU0LjExNjYwNS05Ni45MzY3NzMtMzUxLjAzNzAwNSAwbC0yNC43NTQ4IDI0Ljc2MTk2My0yNC43NjkxMjctMjQuNzYxOTYzYy05Ni45MzU3NS05Ni45MzY3NzMtMjU0LjEwMjI3OS05Ni45MzY3NzMtMzUxLjAyMjY3OSAwLTk2Ljk1MDA3NiA5Ni45MjY1NC05Ni45NTAwNzYgMjU0LjA4NDg4MiAwIDM1MS4wMjA2MzJsMjQuNzU1ODI0IDI0Ljc1NDggMzUxLjAzNTk4MiAyOTguODczOTcxIDM1MS4wMjE2NTUtMjk4Ljg3Mzk3MSAyNC43NzAxNS0yNC43NTU4MjRDOTg0LjE4MjEzMyA0ODYuOTM0MTE1IDk4NC4xODIxMzMgMzI5Ljc3NTc3MiA4ODcuMjYwNzA5IDIzMi44NDkyMzJMODg3LjI2MDcwOSAyMzIuODQ5MjMyeiIgcC1pZD0iMzIwMCIgZmlsbD0iI2ZmZmZmZiI+PC9wYXRoPjwvc3ZnPg==',
        },
        selectImg: {
            type: String,
            value: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTM2MTI5OTU1MTMyIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMzNTQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNjQiIGhlaWdodD0iNjQiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTg4Ny4yNjA3MDkgMjMyLjg0OTIzMmMtOTYuOTM1NzUtOTYuOTM2NzczLTI1NC4xMTY2MDUtOTYuOTM2NzczLTM1MS4wMzcwMDUgMGwtMjQuNzU0OCAyNC43NjE5NjMtMjQuNzY5MTI3LTI0Ljc2MTk2M2MtOTYuOTM1NzUtOTYuOTM2NzczLTI1NC4xMDIyNzktOTYuOTM2NzczLTM1MS4wMjI2NzkgMC05Ni45NTAwNzYgOTYuOTI2NTQtOTYuOTUwMDc2IDI1NC4wODQ4ODIgMCAzNTEuMDIwNjMybDI0Ljc1NTgyNCAyNC43NTQ4IDM1MS4wMzU5ODIgMjk4Ljg3Mzk3MSAzNTEuMDIxNjU1LTI5OC44NzM5NzEgMjQuNzcwMTUtMjQuNzU1ODI0Qzk4NC4xODIxMzMgNDg2LjkzNDExNSA5ODQuMTgyMTMzIDMyOS43NzU3NzIgODg3LjI2MDcwOSAyMzIuODQ5MjMyTDg4Ny4yNjA3MDkgMjMyLjg0OTIzMnoiIHAtaWQ9IjMzNTUiIGZpbGw9IiNmYzMxNWIiPjwvcGF0aD48L3N2Zz4='
        },
        url: {
          type: String,
          value: ''
        },
        urlType: {
          type: String,
          value: 'GET'
        },
        selected: {
          type: Number,
          value: 0
        },
        selecteVal: {
          type: Array,
          value:[0, 1]
        },
        id: {
          type: String,
          value: ""
        },
    },

    data: {
      xining:"",
      active:"",
    },

    ready() {
      console.log(this.data.selected)
      if(this.data.selected === this.data.selecteVal[1]){
        this.setData({
          active: "zan-active",
          xining: this.data.selectImg
        })
      }

    },

    methods: {
      dianzan(){

        if(this.data.active == 'zan-active'){
          this.setData({
            active: "zan-cancel",
            xining: this.data.cancelImg
          })
          this.triggerEvent('cancel'," myEventDetail, myEventOption")
        }else{
          this.setData({
            active: "zan-active",
            xining: this.data.selectImg
          })
          this.triggerEvent('select', "myEventDetail, myEventOptiondd")
        }
      }
    }
});
