const CITIES = ['意大利', '法国', '英国'];
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

function search(brandId, page, cb) {
  var url = 'https://v.lehe.com/weapp/goods/search_by_brand';
  var page = page || 1;
  wx.request({
    url: url,
    data: {
      brand_id: brandId,
      p: page,
      size: 20
    },
    header: {
      'content-type': 'application/json'
    },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    // header: {}, // 设置请求的 header
    success: function (res) {
      // success
      cb(res.data.data);
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  })
}

module.exports = {
  formatTime: formatTime,
  search: search
}
