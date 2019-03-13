const { $Message } = require('../component/base/index');
const contactAndGet = function (res,callback) {

  console.log(res)
  var url = res.url
  var dataForm = res.dataForm

  var se = wx.getStorageSync('se')
  var session_id = wx.getStorageSync('id')
  if (se) {
    console.log(se)

    var header = {
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': 'PHPSESSID=' + session_id
    }

    wx.request({
      url: url,
      method: 'POST',
      header: header,
      data: dataForm,
      success: function (result) {
        console.log(result.data)
        callback(result)
      },
      fail: function () {
        console.log(3)
        
        $Message({
          content: '请确保网络状态良好',
          type: 'error',
          duration: 3
        });
      }
    })
    
  } else {
    // 登录
    wx.login({ //将userinfo放入globaldata中，还没放入data中
      success: res => {
        // 发送 res.code 到后台rang hou tai 换取 openId, sessionKey, unionId
        if (res.code) {
          var codd = res.code;
          wx.request({
            url: 'https://www.xzikeji.com/dikanong/index.php',
            data: {
              'code': codd
            },

            header: {
              'Content-Type': 'application/json'
            },
            success: function (res) {

              console.log(res.data)
              wx.setStorageSync('se', res.data.se)
              setTimeout(function () {

                wx.setStorageSync('se', 0)
              }, 330000)
              wx.setStorageSync('id', res.data.id)
              wx.setStorageSync('openid', res.data.openid)

              // 提交评论
              var session_id = wx.getStorageSync('id')
              var se = wx.getStorageSync('se')
              console.log(se)
              var header = {
                'content-type': 'application/x-www-form-urlencoded',
                'Cookie': 'PHPSESSID=' + session_id
              }
              wx.request({
                url: url,
                method: 'POST',
                header: header,
                data: dataForm,
                success: function (result) {
                  console.log(result.data)
                  callback(result)

                },
                fail: function () {
                  console.log(4)
                  $Message({
                    content: '请确保网络状态良好',
                    type: 'error',
                    duration: 3
                  });
                }
              })
            },
            fail: function () {
              console.log(5)
              $Message({
                content: '请确保网络状态良好',
                type: 'error',
                duration: 3
              });

            }
          })
        }
      },
      fail: function () {
        console.log(6)
        $Message({
          content: '请确保网络状态良好',
          type: 'error',
          duration: 3
        });

      }
    })
  }
  
}

module.exports = {
  contactAndGet: contactAndGet
} 