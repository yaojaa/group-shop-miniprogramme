const d = new Date()
const years = []
const months = []
const days = []
const hours = [];
const minutes = [];

for (let i = 2019; i <= d.getFullYear() + 10; i++) {
  years.push(i.toString())
}

for (let i = 1; i <= 12; i++) {
  if (i < 10) i = "0" + i;
  months.push(i.toString())
}

for (let i = 0; i < 24; i++) {
 if (i < 10) i = "0" + i;
  hours.push(i.toString())
}

for (let i = 0; i < 60; i+=1) {
  if (i < 10) i = "0" + i;
  minutes.push(i.toString())
  i = parseInt(i)
}

Component({
  externalClasses: ['time-class', 'pick-class', 'indicator-class', "i-picker-title"],

  properties: {
    date: {   //格式 ＹＹ－ＭＭ－ＤＤ
      type: String,
      value: d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(),
      observer: function (newVal, oldVal) {
        this.valTime();
      }
    },
    time: {   //格式 HH：MM
      type: String,
      value: d.getHours() + ':' + d.getMinutes()
    },
    title: {   //格式 HH：MM
      type: String,
      value: '请选择日期'
    },
    label:{
      type: String,
      value: '请选择日期'
    }
  },

  data: {
    years: years,
    year: d.getFullYear(),
    months: months,
    month: d.getMonth() + 1,
    days: days,
    day: d.getDate(),
    hours: hours,
    hour: d.getHours(),
    minutes: minutes,
    minute: d.getMinutes(),
    value: {
      y: [0],
      m: [0],
      d: [0],
      h: [0],
      mm: [0],
    },
    hidden: true,
    bottom: "-300px"
  },

  ready() {
    this.valTime();
  },

  methods: {
    valTime() {
      let date = this.data.date.split("-");
      let time = this.data.time.split(":");

      let y = date[0];
      let m = date[1].toString().length < 2 ? "0" + date[1] : date[1];
      let d = date[2].toString().length < 2 ? "0" + date[2] : date[2];
      let h = time[0].toString().length < 2 ? "0" + time[0] : time[0];
      let mm = time[1].toString().length < 2 ? "0" + time[1] : time[1];

      this.getMonthDays(y, m);

      this.setData({
        value: {
      

          y: [this.data.years.indexOf(this.toFixedTwo(y))],
          m: [this.data.months.indexOf(this.toFixedTwo(m))],
          d: [this.data.days.indexOf(this.toFixedTwo(d))],
          h: [this.data.hours.indexOf(this.toFixedTwo(h))],
          mm: [this.data.minutes.indexOf(this.toFixedTwo(mm))]
        },
        year: y,
        month: m,
        day: d,
        hour: h,
        minute: mm
      });
    },
    bindChange (e) {
      const val = e.detail.value;

      switch (e.currentTarget.dataset.type) {
        case "year":
          this.data.year = this.data.years[val[0]]
          break;
        case "month":
          this.data.month = this.data.months[val[0]];
          this.getMonthDays(parseInt(this.data.year), parseInt(this.data.month))
          break;
        case "day":
          this.data.day = this.data.days[val[0]];
          break;
        case "hour":
          this.data.hour = this.data.hours[val[0]];
          break;
        case "minute":
          this.data.minute = this.data.minutes[val[0]];
          break;
        default:
          break;
      }
    },
    openPicker() {
      this.setData({
        hidden: false,
        bottom: 0,
      });
    },
    closePicker() {
      this.setData({
        hidden: true,
        bottom: "-300px"
      });
    },

    confirm(){
      console.log('确定')
      this.closePicker(); 
      this.setData({
        year: this.data.year,
        month: this.data.month,
        day: this.data.day,
        hour: this.data.hour,
        minute: this.data.minute
      })
      this.triggerEvent('datachange', [this.data.year, this.data.month, this.data.day, this.data.hour, this.data.minute])

      this.triggerEvent('change', [this.data.year, this.data.month, this.data.day, this.data.hour, this.data.minute])
    },

    getMonthDays(y, m) {
      let days = [];
      for (let i = 1; i <= new Date(y, m, 0).getDate(); i++) {
        if (i < 10) i = "0" + i;
        days.push(i.toString());
      }
      this.setData({
        days: days
      });
    },

    toFixedTwo(n){
      n = n.toString();
      if(n.length < 2){
        return '0' + n;
      }else{
        return n;
      }
    },


  }
});