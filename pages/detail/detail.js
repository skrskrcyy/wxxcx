var app = getApp()
const {
  $Message
} = require('../../component/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    spinShow: true,
    kscreenH: 0,
    comment_current_openid: '',
    comment_current_id: '',
    horizontal: "horizontal-scroll",
    scroll_item: "",
    showCommentDialog: false, //点击评论按钮后渲染组件
    comment_content: "", //评论内容
    comment_content_reply: "",
    comment_count: '1', //评论个数
    comment_action: null, //点击评论删除还是回复
    agree_text: {
      text: "我已阅读并同意迪卡侬活动的",
      value: true
    },
    show_toptip: false,
    agree_to_about: true,
    top_class: true,
    love: false,
    showReply: false,
    showCommentDialog_reply: false,
    showDelete: false,
    join: false, //参加活动
    all_comment: [], //评论的各个内容名字
    all_comment_count: 0,
    detail: '',
    people: 0,
    num: 0,
    dead: false,
    src: '/static/images/1.jpeg',
    font_name: '活动详情',
    // 触摸开始时间
    touchStartTime: 0,
    // 触摸结束时间
    touchEndTime: 0,
    // 最后一次单击事件点击发生时间
    lastTapTime: 0,
    // 单击事件点击后要触发的函数
    lastTapTimeoutFunc: null,
    error_content: '',
    success_content: '',
    warning_content: '',
    lingyige: []
  },

  loadSpin(res) {
    this.setData({
      spinShow: false
    })
  },

  /// 按钮触摸开始触发的事件
  touchStart: function(e) {
    this.touchStartTime = e.timeStamp
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function(e) {
    this.touchEndTime = e.timeStamp
  },


  /// 单击、双击
  multipleTap: function(e) {
    var that = this
    // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
    if (that.touchEndTime - that.touchStartTime < 350) {
      // 当前点击的时间
      var currentTime = e.timeStamp
      var lastTapTime = that.lastTapTime
      // 更新最后一次点击时间
      that.lastTapTime = currentTime

      // 如果两次点击时间在300毫秒内，则认为是双击事件
      if (currentTime - lastTapTime < 300) {
        console.log("double tap")
        var ind = e.currentTarget.dataset.count
        // 成功触发双击事件时，取消单击事件的执行
        clearTimeout(that.lastTapTimeoutFunc);
        if (!that.data.lingyige[ind]) {
          console.log(e.currentTarget.dataset.count)

          var lingyige = that.data.lingyige
          lingyige[ind] = true
          that.setData({
            lingyige: lingyige
          })
        } else {

          var lingyige = that.data.lingyige
          lingyige[ind] = false
          that.setData({
            lingyige: lingyige
          })
        }
      } else {
        // 单击事件延时300毫秒执行，这和最初的浏览器的点击300ms延时有点像。
        that.lastTapTimeoutFunc = setTimeout(function() {
          console.log(e)
          var openid = e.currentTarget.dataset.openid
          var se = wx.getStorageSync('openid')

          console.log(openid)
          console.log(se)

          var id = e.currentTarget.dataset.id
          console.log(id)
          that.taptoreply(se, openid, id)
        }, 300);
      }
    }
  },



  handleSuccess() {
    var that = this
    $Message({
      content: that.data.success_content,
      type: 'success'
    });
  },
  handleWarning() {
    var that = this
    $Message({
      content: that.data.warning_content,
      type: 'warning',
      duration: 4
    });
  },
  handleError() {
    var that = this
    $Message({
      content: that.data.error_content,
      type: 'error',
      duration: 3
    });
  },





  // 删除自己的评论
  deleteComment: function(event) {
    var that = this
    var head = wx.getStorageSync('avatarUrl')
    var name = wx.getStorageSync('nickName')


    //判断是否登录
    if (!head || !name) {
      that.setData({
        warning_content: '删除评论失败，请在【我的信息】页面重新登录'
      })
      that.handleWarning()

      that.setData({
        showCommentDialog: false,
        showCommentDialog_reply: false,
        join: false,
        showReply: false,
        showDelete: false
      })

    } else {
      // 删除自己的评论过程
      var ID = that.data.comment_current_id
      console.log(ID)



      var session_id = wx.getStorageSync('id')
      var se = wx.getStorageSync('se')
      if (se) {
        console.log(se)
        var header = {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': 'PHPSESSID=' + session_id
        }
        wx.request({
          url: 'https://www.xzikeji.com/dikanong/deletecomment.php',
          method: 'POST',
          header: header,
          data: {
            'se': se,

            'ID': ID
          },
          success: function(res) {

            console.log(res.data)
            that.setData({
              showDelete: false
            })
            that.setData({
              success_content: '删除评论成功'
            })
            that.handleSuccess()

            that.getNewComment()

          },
          fail: function() {


            that.setData({
              error_content: '请确保网络状态良好',
            })
            that.handleError()
            that.setData({
              showCommentDialog: false,
              showCommentDialog_reply: false,
              join: false,
              showReply: false,
              showDelete: false
            })
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
                success: function(res) {
                  console.log(res.data)
                  // 将重新得到的信息放在缓存里
                  wx.setStorageSync('se', res.data.se)
                  setTimeout(function() {

                    wx.setStorageSync('se', 0)
                  }, 330000)
                  wx.setStorageSync('id', res.data.id)
                  wx.setStorageSync('openid', res.data.openid)
                  /************************** */
                  // 然后提交评论
                  var se = wx.getStorageSync('se')
                  var session_id = wx.getStorageSync('id')
                  console.log(se)
                  var header = {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Cookie': 'PHPSESSID=' + session_id
                  }
                  wx.request({
                    url: 'https://www.xzikeji.com/dikanong/deletecomment.php',
                    method: 'POST',
                    header: header,
                    data: {
                      'se': se,

                      'ID': ID
                    },
                    success: function(res) {
                      console.log(partyID)
                      console.log(res.data)
                      that.setData({
                        showDelete: false
                      })
                      that.setData({
                        success_content: '删除评论成功'
                      })
                      that.handleSuccess()
                      that.getNewComment()

                    }
                  })
                },
                fail: function() {
                  that.setData({
                    error_content: '请确保网络状态良好',
                  })
                  that.handleError()
                  that.setData({
                    showCommentDialog: false,
                    showCommentDialog_reply: false,
                    join: false,
                    showReply: false,
                    showDelete: false
                  })
                }
              })
            }
          },
          fail: function() {
            that.setData({
              error_content: '请确保网络状态良好',
            })
            that.handleError()
            that.setData({
              showCommentDialog: false,
              showCommentDialog_reply: false,
              join: false,
              showReply: false,
              showDelete: false
            })
          }
        })
      }
    }

  },

  // 获得活动的地点和自己的距离
  getloc: function(options) {
    var latitude = parseFloat(options.currentTarget.dataset.latitude)
    var longitude = parseFloat(options.currentTarget.dataset.longitude)
    console.log(latitude)
    console.log(longitude)
    wx.getSetting({
      success(res) {
        console.log('first')
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              console.log('second')
              wx.openLocation({
                latitude: latitude,
                longitude: longitude,
              })
            },
            fail() {
              wx.showModal({
                title: '用户未授权',
                content: '如需正常使用小程序地图定位功能，请点击【前往】选项前往授权',
                confirmText: '前往',
                success(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: "/pages/article/article",
                    })
                  }
                }
              })
            }
          })
        } else {
          wx.openLocation({
            latitude: latitude,
            longitude: longitude,
          })
        }
      }
    })


  },

  // 点击确定参加活动提交信息***********************************
  upSubmit(event) {
    console.log(event.detail.value.name)
    console.log(event.detail.value.card)

    var name = event.detail.value.name
    var card = event.detail.value.card
    var tel = event.detail.value.tel
    var session_id = wx.getStorageSync('id')
    var se = wx.getStorageSync('se')
    var that = this
    if (se && parseInt(name.length) != 0 && parseInt(tel.length) != 0) {
      if (parseInt(name.length) > 9) {
        that.setData({
          warning_content: '名字过长，请重新输入'
        })
        that.handleWarning()
        return
      }
      if (!(parseInt(card.length) == 13 || parseInt(card.length) == 0)) {
        console.log(card.length)
        console.log(parseInt(card.length))

        that.setData({
          warning_content: '卡号位数不对，卡号位数为13'
        })
        that.handleWarning()
        return
      }
      if (!(parseInt(tel.length) == 11 || parseInt(tel.length) == 0)) {


        that.setData({
          warning_content: '手机号码位数不对'
        })
        that.handleWarning()
        return
      }

      var header = {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + session_id
      }
      wx.request({
        url: 'https://www.xzikeji.com/dikanong/dkjion.php',
        method: 'POST',
        header: header,
        data: {
          'act_id': that.data.partyID,
          'se': se,
          'act_name': name,
          'act_card': card,
          'act_tel': tel
        },
        success: function(res) {
          that.setData({
            join: false
          })
          if (res.data.state == 'fail') {
            that.setData({
              warning_content: '您已经报名过此活动了，无法重复报名'
            })
            that.handleWarning()
            return
          } else {
            that.setData({
              success_content: '报名成功'
            })
            that.handleSuccess()
          }
          console.log(res.data)

          that.getAll() //重新渲染页面
        },
        fail: function(res) {
          that.setData({
            error_content: '请确保网络状态良好',
          })
          that.handleError()
          that.setData({
            showCommentDialog: false,
            showCommentDialog_reply: false,
            join: false,
            showReply: false,
            showDelete: false
          })
        }
      })
    } else if (!se) {
      //先重新申请code
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
              success: function(res) {

                console.log(res.data)
                wx.setStorageSync('se', res.data.se)
                setTimeout(function() {

                  wx.setStorageSync('se', 0)

                }, 330000)
                wx.setStorageSync('id', res.data.id)
                wx.setStorageSync('openid', res.data.openid)
              },
              fail: function() {
                that.setData({
                  error_content: '请确保网络状态良好',
                })
                that.handleError()
                that.setData({
                  showCommentDialog: false,
                  showCommentDialog_reply: false,
                  join: false,
                  showReply: false,
                  showDelete: false
                })
              }
            })
          }
        },
        fail: function() {
          that.setData({
            error_content: '请确保网络状态良好',
          })
          that.handleError()
          that.setData({
            showCommentDialog: false,
            showCommentDialog_reply: false,
            join: false,
            showReply: false,
            showDelete: false
          })
        }
      })
      //重新申请到code后，再重新发送用户信息，由于不是用户的错，所以这个重新发送是等同于上一个发送

      var session_id = wx.getStorageSync('id')
      var se = wx.getStorageSync('se')
      console.log(se)
      if (se && parseInt(name.length) != 0 && parseInt(tel.length) != 0) {
        if (parseInt(name.length) > 9) {
          that.setData({
            warning_content: '名字过长，请重新输入'
          })
          that.handleWarning()
          return
        }
        if (!(parseInt(card.length) == 13 || parseInt(card.length) == 0)) {
          console.log(card.length)
          console.log(parseInt(card.length))
          that.setData({
            warning_content: '卡号位数不对，卡号位数为13'
          })
          that.handleWarning()
          return
        }
        if (!(parseInt(tel.length) == 11 || parseInt(tel.length) == 0)) {


          that.setData({
            warning_content: '手机号码位数不对'
          })
          that.handleWarning()
          return
        }

        var header = {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': 'PHPSESSID=' + session_id
        }
        wx.request({
          url: 'https://www.xzikeji.com/dikanong/dkjion.php',
          method: 'POST',
          header: header,
          data: {
            'act_id': that.data.partyID,
            'se': se,
            'act_name': name,
            'act_card': card,
            'act_tel': tel
          },
          success: function(res) {
            console.log(res.data)
            that.setData({
              join: false
            })
            if (res.data.state == 'fail') {
              that.setData({
                warning_content: '您已经报名过此活动了，无法重复报名'
              })
              that.handleWarning()
              return
            } else {
              that.setData({
                success_content: '报名成功'
              })
              that.handleSuccess()
            }
            that.getAll()
          },
          fail: function(res) {
            that.setData({
              error_content: '请确保网络状态良好',
            })
            that.handleError()
            that.setData({
              showCommentDialog: false,
              showCommentDialog_reply: false,
              join: false,
              showReply: false,
              showDelete: false
            })
          }
        })
      }
    } else if (!name) {
      that.setData({
        warning_content: '请填写姓名'
      })
      that.handleWarning()
    } else if (!tel) {
      that.setData({
        warning_content: '请填写手机号码'
      })
      that.handleWarning()
    }

  },
  // 点击取消
  no(event) {
    this.setData({
      join: false
    })
  },

  // 用于上导航栏
  onPageScroll: function(e) {
    console.log(e)
    if (e.scrollTop < 240)
      this.setData({
        top_class: true
      })
    else {
      this.setData({
        top_class: false
      })
    }
  },
  //输入评论
  inputComment(events) {

    this.setData({
      comment_content: events.detail.value
    })

  },
  //3.输入回复
  inputCommentReply(event) {
    this.setData({
      comment_content_reply: event.detail.value
    })
  },


  // 1.点击用户的评论就会跳出回复或删除
  taptoreply(se, openid, id) {


    if (se != openid) {

      // 跳到回复按钮
      this.setData({
        showReply: true,
        comment_current_openid: openid,
        comment_current_id: id
      })
    }
    // 跳到删除按钮
    else {
      this.setData({
        showDelete: true,
        comment_current_openid: openid,
        comment_current_id: id
      })
    }
  },
  //2.点击弹出来的回复就会跳出输入框
  replyComment(event) {
    var that = this
    var head = wx.getStorageSync('avatarUrl')
    var name = wx.getStorageSync('nickName')


    //判断是否登录
    if (!head || !name) {
      that.setData({
        warning_content: '评论/回复失败，请在【我的信息】页面重新登录'
      })
      that.handleWarning()

      that.setData({
        showCommentDialog: false,
        showCommentDialog_reply: false,
        join: false,
        showReply: false
      })

    } else {
      this.setData({
        showCommentDialog_reply: true,
        showReply: false
      })
    }
  },
  //4.提交跟人的回复*******************************************
  publishCommentRelpy(events) {

    var that = this
    if (this.data.comment_content_reply.length <= 20) {
    var openid = this.data.comment_current_openid
    var commentid = this.data.comment_current_id
    console.log(openid)
    console.log(commentid)
    var that = this
    var session_id = wx.getStorageSync('id')
    var se = wx.getStorageSync('se')
    var name = wx.getStorageSync('nickName')
    var head = wx.getStorageSync('avatarUrl')
    if (se) {
      console.log(se)
      var header = {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + session_id
      }
      if (this.data.comment_content_reply != '') {
        var that = this
        console.log(this.data.comment_content_reply)
        var comment = this.data.comment_content_reply

        if (name && head) {
        wx.request({
          url: 'https://www.xzikeji.com/dikanong/backcomment.php',
          method: 'POST',
          header: header,
          data: {
            'content': comment,
            'se': se,
            'openid': openid,
            'commentid': commentid,
          },
          success: function(res) {
            console.log(res.data)
            that.setData({
              success_content: '回复成功'
            })
            that.handleSuccess()

            that.setData({
              showCommentDialog: false,
              showCommentDialog_reply: false,
              join: false,
              showReply: false,
              comment_content_reply: ''
            })
          },
          fail: function() {
            that.setData({
              error_content: '请确保网络状态良好',
            })
            that.handleError()
            that.setData({
              showCommentDialog: false,
              showCommentDialog_reply: false,
              join: false,
              showReply: false,
              showDelete: false
            })
          }
        })
        } else {
          that.setData({
            warning_content: '评论/回复失败，请在【我的信息】页面重新登录'
          })
          that.handleWarning()
          that.setData({
            showCommentDialog: false,
            showCommentDialog_reply: false,
            join: false,
            showReply: false,

          })
        }
        that.setData({
          showCommentDialog: false
        })




      }
       else {
        that.setData({
          warning_content: '请输入回复内容'
        })
        that.handleWarning()

      }
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
              success: function(res) {

                console.log(res.data)
                wx.setStorageSync('se', res.data.se)
                setTimeout(function() {

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
                if (this.data.comment_content != '') {
                  console.log(this.data.comment_content)
                  var comment = this.data.comment_content

                  if (name && head) {
                  wx.request({
                    url: 'https://www.xzikeji.com/dikanong/backcomment.php',
                    method: 'POST',
                    header: header,
                    data: {
                      'content': comment,
                      'se': se,
                      'openid': openid,
                      'commentid': commentid,
                    },
                    success: function(res) {
                      console.log(res.data)
                      that.setData({
                        success_content: '回复成功'
                      })
                      that.handleSuccess()
                    },
                    fail: function () {
                      that.setData({
                        error_content: '请确保网络状态良好',
                      })
                      that.handleError()
                      that.setData({
                        showCommentDialog: false,
                        showCommentDialog_reply: false,
                        join: false,
                        showReply: false,
                        showDelete: false
                      })
                    }
                  })
                  } else {
                    that.setData({
                      warning_content: '评论/回复失败，请在【我的信息】页面重新登录'
                    })
                    that.handleWarning()
                    that.setData({
                      showCommentDialog: false,
                      showCommentDialog_reply: false,
                      join: false,
                      showReply: false,

                    })
                  }


                  this.setData({
                    showCommentDialog: false
                  })
                }
                else {
                  that.setData({
                    warning_content: '请输入回复内容'
                  })
                  that.handleWarning()

                }


              },
              fail: function() {
                that.setData({
                  error_content: '请确保网络状态良好',
                })
                that.handleError()
                that.setData({
                  showCommentDialog: false,
                  showCommentDialog_reply: false,
                  join: false,
                  showReply: false,
                  showDelete: false
                })
              }
            })




          }
        },
        fail: function() {
          that.setData({
            error_content: '请确保网络状态良好',
          })
          that.handleError()
          that.setData({
            showCommentDialog: false,
            showCommentDialog_reply: false,
            join: false,
            showReply: false,
            showDelete: false
          })
        }
      })
    }
    }
    else{
      that.setData({
        warning_content: '评论/回复失败，内容字数不得超过二十字'
      })
      that.handleWarning()
    }


  },
  //点击评论就提交跟活动的评论**************************************
  publishComment(events) {
    var that = this
    if (this.data.comment_content.length<=20){
    var head = wx.getStorageSync('nickName')
    var name = wx.getStorageSync('avatarUrl')
    var se = wx.getStorageSync('se')
    var session_id = wx.getStorageSync('id')
    var that = this
    if (se)

    {
      console.log(se)
      var header = {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + session_id
      }
      if (that.data.comment_content != '') {
        console.log(that.data.comment_content)
        var comment = that.data.comment_content
        if (name && head) {
          wx.request({
            url: 'https://www.xzikeji.com/dikanong/comment.php',
            method: 'POST',
            header: header,
            data: {
              'comment': comment,
              'se': se,
              'act_id': that.data.partyID
            },
            success: function(res) {
              console.log(that.data.partyID)
              console.log(res.data)
              that.setData({
                success_content: '评论成功'
              })
              that.handleSuccess()
              that.getNewComment()
              that.setData({
                comment_content: ''
              })
            },
            fail: function() {
              that.setData({
                error_content: '请确保网络状态良好',
              })
              that.handleError()
              that.setData({
                showCommentDialog: false,
                showCommentDialog_reply: false,
                join: false,
                showReply: false,
                showDelete: false
              })
            }
          })
        } else {
          that.setData({
            warning_content: '评论/回复失败，请在【我的信息】页面重新登录'
          })
          that.handleWarning()
          that.setData({
            showCommentDialog: false,
            showCommentDialog_reply: false,
            join: false,
            showReply: false,

          })
        }
        that.setData({
          showCommentDialog: false
        })
      } else {
        that.setData({
          warning_content: '评论不能为空'
        })
        that.handleWarning()
      }
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
              success: function(res) {

                console.log(res.data)
                wx.setStorageSync('se', res.data.se)
                setTimeout(function() {

                  wx.setStorageSync('se', 0)

                }, 330000)
                wx.setStorageSync('id', res.data.id)
                wx.setStorageSync('openid', res.data.openid)

                // 提交评论
                ////********************************是否需要再从缓存中拿se

                var session_id = wx.getStorageSync('id')
                var se = wx.getStorageSync('se')
                console.log(se)
                var header = {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Cookie': 'PHPSESSID=' + session_id
                }
                if (that.data.comment_content != '') {
                  console.log(that.data.comment_content)
                  var comment = that.data.comment_content
                  if (name && head) {
                  wx.request({
                    url: 'https://www.xzikeji.com/dikanong/comment.php',
                    method: 'POST',
                    header: header,
                    data: {
                      'comment': comment,
                      'se': se,
                      'act_id': that.data.partyID
                    },
                    success: function(res) {
                      console.log(that.data.partyID)
                      console.log(res.data)
                      that.setData({
                        comment_content: ''
                      })
                      that.setData({
                        success_content: '评论成功'
                      })
                      that.handleSuccess()
                      that.getNewComment()
                    },
                    fail: function () {
                      that.setData({
                        error_content: '请确保网络状态良好',
                      })
                      that.handleError()
                      that.setData({
                        showCommentDialog: false,
                        showCommentDialog_reply: false,
                        join: false,
                        showReply: false,
                        showDelete: false
                      })
                    }
                  })
                  } else {
                    that.setData({
                      warning_content: '评论/回复失败，请在【我的信息】页面重新登录'
                    })
                    that.handleWarning()
                    that.setData({
                      showCommentDialog: false,
                      showCommentDialog_reply: false,
                      join: false,
                      showReply: false,

                    })
                  }
                  that.setData({
                    showCommentDialog: false
                  })
                }
                else {
                  that.setData({
                    warning_content: '评论不能为空'
                  })
                  that.handleWarning()
                }

              },
              fail: function() {
                that.setData({
                  error_content: '请确保网络状态良好',
                })
                that.handleError()
                that.setData({
                  showCommentDialog: false,
                  showCommentDialog_reply: false,
                  join: false,
                  showReply: false,
                  showDelete: false
                })
              }
            })




          }
        },
        fail: function() {
          that.setData({
            error_content: '请确保网络状态良好',
          })
          that.handleError()
          that.setData({
            showCommentDialog: false,
            showCommentDialog_reply: false,
            join: false,
            showReply: false,
            showDelete: false
          })
        }
      })
    }

  }
  else{
      that.setData({
        warning_content: '评论/回复失败，内容字数不得超过二十字'
      })
      that.handleWarning()
  }


  },
  // 点击icon跳转scroll页面
  tap_icon1: function(events) {
    this.setData({
      scroll_item: 'first'
    })
  },
  tap_icon2: function(events) {
    this.setData({
      scroll_item: 'second'
    })
  },
  tap_icon3: function(events) {
    this.setData({
      scroll_item: 'third'
    })
  },
  tap_icon4: function(events) {
    this.setData({
      scroll_item: 'forth'
    })
  },
  hideCommentDialog(events) {
    this.setData({
      showCommentDialog: false,
      join: false,
      showCommentDialog_reply: false,
      showReply: false,
      showDelete: false
    })
  },
  // 点击回复
  tap_to_reply(events) {

  },
  //点击我要评论按钮
  comment(events) {
    var that = this
    var head = wx.getStorageSync('avatarUrl')
    var name = wx.getStorageSync('nickName')


    //判断是否登录
    if (!head || !name) {
      that.setData({
        warning_content: '评论失败，请在【我的信息】页面登录'
      })
      that.handleWarning()
      that.setData({
        showCommentDialog: false,
        showCommentDialog_reply: false,
        join: false,
        showReply: false
      })

    } else {
      that.setData({
        showCommentDialog: true,
        showReply: false
      })
    }


  },
  //同意文档
  checkboxChange(events) {

    if (events.detail.value.length != 0) {
      this.setData({
        agree_to_about: true
      })
    } else {
      this.setData({
        agree_to_about: false
      })
    }
    console.log(this.data.agree_to_about)
  },
  hideAboutDialog() {
    this.setData({
      show_toptip: false
    })
  },
  tap_about() {
    this.setData({
      show_toptip: true
    })
  },
  tap_x() {
    this.setData({
      show_toptip: false
    })
  },
  // 点击我要参加
  sign_up() {
    var head = wx.getStorageSync('avatarUrl')
    var name = wx.getStorageSync('nickName')

    var that = this
    console.log(head)
    console.log(name)
    if (!that.data.agree_to_about) {

      that.setData({
        warning_content: '参加失败，请同意【相关条款和约定】文档'
      })
      that.handleWarning()
      that.setData({
        showCommentDialog: false,
        showCommentDialog_reply: false,
        join: false,
        showReply: false
      })
      return
    }
    if (!head || !name) {
      that.setData({
        warning_content: '参加失败，请在【我的信息】页面登录'
      })
      that.handleWarning()
      that.setData({
        showCommentDialog: false,
        showCommentDialog_reply: false,
        join: false,
        showReply: false
      })
      return
    }

    this.setData({
      join: true
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var kscreenH = app.globalData.kscreenH
    this.setData({
      kscreenH: kscreenH
    })


    console.log('用到了onload')




    this.setData({
      partyID: options.id,
      people: options.people
    })
    this.getAll()

    this.getNewComment()

    console.log(this.data.partyID)


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    setTimeout(function() {
      that.setData({
        spinShow: false
      })
    }, 4000)
  },
  timepan: function() {
    var that = this
    var dead = []


    //时间判断
    var t1 = new Date(that.data.detail.time - 0)
    var t2 = new Date()
    console.log(t1)

    //开始比较
    var year1 = t1.getFullYear()
    var month1 = t1.getMonth() + 1
    var date1 = t1.getDate()
    var hour1 = t1.getHours()
    var minute1 = t1.getMinutes()

    if (0 <= month1 && month1 <= 8) {
      var y = '0' + month1
    } else {
      var y = month1
    }
    if (1 <= date1 && date1 <= 9) {
      var d = '0' + date1
    } else {
      var d = date1
    }
    if (0 <= hour1 && hour1 <= 9) {
      var h = '0' + hour1
    } else {
      var h = hour1
    }
    if (0 <= minute1 && minute1 <= 9) {
      var m = '0' + minute1
    } else {
      var m = minute1
    }

    var ingtime = year1 + '-' + y + '-' + d + ' ' + h + ':' + m + ':00'
    that.setData({
      ingtime: ingtime
    })

    var year2 = t2.getFullYear()
    var month2 = t2.getMonth() + 1
    var date2 = t2.getDate()
    var hour2 = t2.getHours()
    var minute2 = t2.getMinutes()

    if (year1 - year2 > 0) {
      that.setData({
        dead: false
      })
      return
    } else if (year1 - year2 < 0) {
      that.setData({
        dead: true
      })
      return
    } else if (month1 - month2 > 0) {
      that.setData({
        dead: false
      })
      return
    } else if (month1 - month2 < 0) {
      that.setData({
        dead: true
      })
      return
    } else if (date1 - date2 > 0) {
      that.setData({
        dead: false
      })
      return
    } else if (date1 - date2 < 0) {
      that.setData({
        dead: true
      })
      return
    } else if (hour1 - hour2 > 0) {
      that.setData({
        dead: false
      })
      return
    } else if (hour1 - hour2 < 0) {
      that.setData({
        dead: true
      })
      return
    } else if (minute1 - minute2 > 0) {
      that.setData({
        dead: false
      })
      return
    } else if (minute1 - minute2 < 0) {
      that.setData({
        dead: true
      })
      return
    } else {
      that.setData({
        dead: false
      })
      return
    }
  },
  // 获得活动的所有detail
  getAll: function() {
    var that = this
    var se = wx.getStorageSync('se')
    var session_id = wx.getStorageSync('id')
    if (se) {
      console.log(se)
      var header = {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + session_id
      }



      wx.request({
        url: 'https://www.xzikeji.com/dikanong/alldetail.php',
        method: 'POST',
        header: header,
        data: {


          'partyID': that.data.partyID
        },
        success: function(res) {

          console.log(res.data)

          var ttype = wx.getStorageSync(res.data.dataInform[0].type)


          that.setData({
            detail: res.data.dataInform[0],
            num: res.data.num,
            blue: '/static/images/' + ttype + '.jpg'
          })
          that.timepan()
        },
        fail: function() {
          that.setData({
            error_content: '请确保网络状态良好',
          })
          that.handleError()
          that.setData({
            showCommentDialog: false,
            showCommentDialog_reply: false,
            join: false,
            showReply: false,
            showDelete: false
          })
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
              success: function(res) {

                console.log(res.data)
                wx.setStorageSync('se', res.data.se)
                setTimeout(function() {

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
                  url: 'https://www.xzikeji.com/dikanong/alldetail.php',
                  method: 'POST',
                  header: header,
                  data: {


                    'partyID': that.data.partyID
                  },
                  success: function(res) {
                    console.log(res.data)
                    console.log(res.data.dataInform)
                    var ttype = wx.getStorageSync(res.data.dataInform[0].type)

                    that.setData({
                      detail: res.data.dataInform[0],
                      num: res.data.num,
                      blue: '/static/images/' + ttype + '.jpg'
                    })
                    that.timepan()
                  },
                  fail: function() {
                    that.setData({
                      error_content: '请确保网络状态良好',
                    })
                    that.handleError()
                    that.setData({
                      showCommentDialog: false,
                      showCommentDialog_reply: false,
                      join: false,
                      showReply: false,
                      showDelete: false
                    })
                  }
                })



              },
              fail: function() {
                that.setData({
                  error_content: '请确保网络状态良好',
                })
                that.handleError()
                that.setData({
                  showCommentDialog: false,
                  showCommentDialog_reply: false,
                  join: false,
                  showReply: false,
                  showDelete: false
                })

              }
            })




          }
        },
        fail: function() {
          that.setData({
            error_content: '请确保网络状态良好',
          })
          that.handleError()
          that.setData({
            showCommentDialog: false,
            showCommentDialog_reply: false,
            join: false,
            showReply: false,
            showDelete: false
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  // 显示评论放出去
  getNewComment() {
    var that = this
    var se = wx.getStorageSync('se')
    var session_id = wx.getStorageSync('id')
    if (se) {
      console.log(se)
      var header = {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + session_id
      }



      wx.request({
        url: 'https://www.xzikeji.com/dikanong/showcomment.php',
        method: 'POST',
        header: header,
        data: {

          'se': se,
          'partyID': that.data.partyID
        },
        success: function(res) {
          console.log(res.data)
          that.setData({
            all_comment: res.data.dataInform, //评论的各个内容名字
            all_comment_count: res.data.num,
          })



        },
        fail: function() {
          that.setData({
            error_content: '请确保网络状态良好',
          })
          that.handleError()
          that.setData({
            showCommentDialog: false,
            showCommentDialog_reply: false,
            join: false,
            showReply: false,
            showDelete: false
          })
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
              success: function(res) {

                console.log(res.data)
                wx.setStorageSync('se', res.data.se)
                setTimeout(function() {

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
                  url: 'https://www.xzikeji.com/dikanong/showcomment.php',
                  method: 'POST',
                  header: header,
                  data: {

                    'se': se,
                    'partyID': that.data.partyID
                  },
                  success: function(res) {
                    console.log(res.data)
                    that.setData({
                      all_comment: res.data.dataInform,
                      all_comment_count: res.data.num
                    })

                  }
                })



              },
              fail: function() {
                that.setData({
                  error_content: '请确保网络状态良好',
                })
                that.handleError()
                that.setData({
                  showCommentDialog: false,
                  showCommentDialog_reply: false,
                  join: false,
                  showReply: false,
                  showDelete: false
                })
              }
            })




          }
        },
        fail: function() {
          that.setData({
            error_content: '请确保网络状态良好',
          })
          that.handleError()
          that.setData({
            showCommentDialog: false,
            showCommentDialog_reply: false,
            join: false,
            showReply: false,
            showDelete: false
          })
        }
      })
    }
  },

  // 显示内容，评论
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})