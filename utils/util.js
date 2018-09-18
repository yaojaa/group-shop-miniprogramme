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
      console.log(e)
      let context = this
      let name = e.currentTarget.dataset.key;
      let nameMap = {}
      nameMap[name] = e.detail.value
      console.log('setData',nameMap)
      context.setData(nameMap)

}

module.exports = {
  formatTime: formatTime,
  inputDuplex:inputDuplex
}
