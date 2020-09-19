import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtAvatar, AtButton, AtImagePicker, AtInput, AtSteps, AtCard, AtFloatLayout, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'
import { add, minus, asyncAdd } from '../../actions/counter'

import './index.scss'


// @connect(({ counter }) => ({
//   counter
// }), (dispatch) => ({
//   add () {
//     dispatch(add())
//   },
//   dec () {
//     dispatch(minus())
//   },
//   asyncAdd () {
//     dispatch(asyncAdd())
//   }
// }))
class Index extends Component {
  state = {
    status: '',
    name: '',
    avatar: '',
    current: 0,
    want: '',
    price: '',
    wantPrice: '',
    deposit: '',
    cashin: '',
    investment: '',
    fixedasset: '',
    loanout: '',
    cashout: '',
    loanTotal: '',
    liabilityTotal: '',
    asset: 0,
    cashflow: 0,
    conclusion: '',
    isOpened: false,
    pic: '',
    items: [
      {
        title: '买它！',
        'icon': {
          value: 'heart',
          size: '14',
        }
      },
      {
        title: '康康存款？',
        status: ''
      },
      {
        title: '算算负债？',
        status: ''
      }
    ],
    files: []
  }

  config = {
    navigationBarTitleText: '买它! ... or not?'
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }
  componentWillMount () {
    Taro.cloud.callFunction({
      name: 'get',
      data:{
        mode: 'user_exist'
      }
    })
    .then(res=>{
      console.log(res)
      this.setState({
        status: res.result
      })
    })
    var that = this
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              console.log(res)
              that.setState({
                name: res.userInfo['nickName'],
                avatar: res.userInfo['avatarUrl'],
              })
            }
          })
        }
      }
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  getUserInfo(e) {
    console.log(e.detail.userInfo)
    this.setState({
      name: e.detail.userInfo['nickName'],
      avatar: e.detail.userInfo['avatarUrl'],
      status: 'ADD'
    })
    // Taro.cloud.callFunction({
    //   name: 'add',
    //   data:{
    //     mode: 'add_user'
    //   }
    // })
  }
  onStepChange (current) {
    if (this.state.current == 0){
      if (this.state.want == ''){
        Taro.showToast({
          title:'请输入名称',
          duration: 2000
        })
      }
      else if (this.state.price== ''){
        Taro.showToast({
          title:'请输入价格',
          duration: 2000
        })
      }
      else if (this.state.wantPrice== ''){
        Taro.showToast({
          title:'请输入心理价格',
          duration: 2000
        })
      }
      else{
        this.setState({
          current: current
        })
      }
    }
    else if (this.state.current == 1){
      if (this.state.deposit == '' || this.state.cashin == '' || this.state.investment == '' || this.state.fixedasset == ''){
        Taro.showToast({
          title:'请输入金额',
          duration: 2000
        })
      }
      else{
        this.setState({
          current: current
        })
      }
    }
    else if (this.state.current == 2){
      this.setState({
        current: current
      })
    }
  }
  onImageChange (files) {
    this.setState({
      files
    })
    console.log(this.state.files)
  }
  handleInputChange1 (value) {
    this.setState({
      want: value
    })
    return value
  }
  handleInputChange2 (value) {
    this.setState({
      price: value
    })
    return value
  }
  handleInputChange3 (value) {
    this.setState({
      wantPrice: value
    })
    return value
  }
  handleInputChange4 (value) {
    this.setState({
      deposit: value
    })
    return value
  }
  handleInputChange5 (value) {
    this.setState({
      cashin: value
    })
    return value
  }
  handleInputChange6 (value) {
    this.setState({
      investment: value
    })
    return value
  }
  handleInputChange7 (value) {
    this.setState({
      fixedasset: value
    })
    return value
  }
  handleInputChange8 (value) {
    this.setState({
      loanout: value
    })
    return value
  }
  handleInputChange9 (value) {
    this.setState({
      cashout: value
    })
    return value
  }
  handleInputChange10 (value) {
    this.setState({
      loanTotal: value
    })
    return value
  }
  handleInputChange11 (value) {
    this.setState({
      liabilityTotal: value
    })
    return value
  }
  handleSubmitFirst(value){
    if (this.state.loanout == '' || this.state.cashout == '' || this.state.loanTotal == '' || this.state.liabilityTotal == ''){
      Taro.showToast({
        title:'请输入金额',
        duration: 2000
      })
    }
    else{
      console.log(this.state.files[0]['url'],Math.floor(Math.random()*10000))
      let suffix = /\.[^\.]+$/.exec(this.state.files[0]['url'])[0]
      wx.cloud.uploadFile({
        cloudPath: (new Date().getTime()).toString()+(Math.floor(Math.random()*10000)).toString()+suffix,
        filePath: this.state.files[0]['url'], // 文件路径
      }).then(res => {
        // get resource ID
        console.log(res)
        // this.setData({
        //   fileIDs: this.data.fileIDs.concat(res.fileID)
        // })
        Taro.cloud.callFunction({
          name: 'add',
          data:{
            mode: 'add_want',
            want: this.state.want,
            price: this.state.price,
            wantPrice: this.state.wantPrice,
            image: res['fileID'],
            deposit: this.state.deposit,
            cashin: this.state.cashin,
            investment: this.state.investment,
            fixedasset: this.state.fixedasset,
            loanout: this.state.loanout,
            cashout: this.state.cashout,
            loanTotal: this.state.loanTotal,
            liabilityTotal: this.state.liabilityTotal
          }
        })
        .then(res=>{
          console.log(res)
          this.setState({
            asset: res.result[0],
            cashflow: res.result[1],
            conclusion: res.result[2],
            pic: res.result[3],
            isOpened: true
          })
        })
      })
      console.log(this.state.name, this.state.files, this.state.want)
    }
  }
  handleModalConfirm(value){
    this.setState({
      isOpened: false
    })
  }
  handleModalRedo(value){
    this.setState({
      isOpened: false
    })
    Taro.reLaunch({
      url: '/pages/index/index'
    })
  }


  render () {
    return (
      <View>
        { 
          (this.state.status == 'New'||this.state.status == 'Exist') && (
            <View className='index full'>
            <View style='height:30vh'></View>
            <View className='at-row'>
              <View className='at-col at-col-3'></View>
              <View className='at-col at-col-6 at-article__h2'>买它！</View>
              <View className='at-col at-col-3'></View>
            </View>
            <View className='at-row'>
              <View className='at-col at-col-6'></View>
              <View className='at-col at-col-3'>还是再算算??</View>
              <View className='at-col at-col-3'></View>
            </View>
            <View style='height:5vh'></View>
            <AtButton className='btn' openType="getUserInfo" onGetUserInfo={this.getUserInfo.bind(this)}>Come on!</AtButton>
          </View>
          )
        }
        { 
          this.state.status == 'ADD' && (
            <View className='index full'>
              <View style='height:10vh'></View>
              <View className='at-row at-row__align--center'>
                <View className='at-col at-col-3'></View>
                <View className='at-col at-col-3'>
                  <AtAvatar image={this.state.avatar}></AtAvatar>
                </View>
                <View className='at-col at-col-3 at-article-h2'>
                  {this.state.name}
                </View>
                <View className='at-col at-col-3'></View>
              </View>
              <View style='height:5vh'></View>
              <AtSteps
                items={this.state.items}
                current={this.state.current}
                onChange={this.onStepChange.bind(this)}
              />
              <View style='height:5vh'></View>
              {
                this.state.current == 0 && (
                  <View>
                    <View className='at-row'>
                      <View className='at-col at-col-2'></View>
                      <View className='at-col at-col-8'>
                        <AtInput
                          className='AtInput'
                          name='value'
                          title='想要这个:'
                          type='text'
                          placeholder='名字？'
                          value={this.state.want}
                          onChange={this.handleInputChange1.bind(this)}
                        />
                      </View>
                      <View className='at-col at-col-2'></View>
                    </View>
                    <View className='at-row'>
                      <View className='at-col at-col-2'></View>
                      <View className='at-col at-col-8'>
                        <AtInput
                          className='AtInput'
                          name='value'
                          title='价格:'
                          type='number'
                          placeholder='？'
                          value={this.state.price}
                          onChange={this.handleInputChange2.bind(this)}
                        />
                      </View>
                      <View className='at-col at-col-2'></View>
                    </View>
                    <View className='at-row'>
                      <View className='at-col at-col-2'></View>
                      <View className='at-col at-col-8'>
                        <AtInput
                          className='AtInput'
                          name='value'
                          title='心理价位:'
                          type='number'
                          placeholder='？'
                          value={this.state.wantPrice}
                          onChange={this.handleInputChange3.bind(this)}
                        />
                      </View>
                      <View className='at-col at-col-2'></View>
                    </View>
                    <View >
                      <View className='at-row at-row__align--center'>
                        <View className='at-col at-col-2'></View>
                        <View className='at-col at-col-2'>选择照片:</View>
                        <View className='at-col at-col-6'>
                          <AtImagePicker
                            length={2}
                            files={this.state.files}
                            onChange={this.onImageChange.bind(this)}
                          />
                        </View>
                        <View className='at-col at-col-2'></View>
                      </View>
                    </View>
                  </View>
                )
              }
              {
                this.state.current == 1 && (
                  <View>
                    <View className='at-row'>
                      <View className='at-col at-col-1'></View>
                      <View className='at-col at-col-10'>
                        <AtInput
                          className='AtInput'
                          name='value'
                          title='现有存款:'
                          type='number'
                          placeholder='？'
                          value={this.state.deposit}
                          onChange={this.handleInputChange4.bind(this)}
                        />
                      </View>
                      <View className='at-col at-col-1'></View>
                    </View>
                    <View className='at-row'>
                      <View className='at-col at-col-1'></View>
                      <View className='at-col at-col-10'>
                        <AtInput
                          className='AtInput'
                          name='value'
                          title='每月固定收入:'
                          type='number'
                          placeholder='？'
                          value={this.state.cashin}
                          onChange={this.handleInputChange5.bind(this)}
                        />
                      </View>
                      <View className='at-col at-col-1'></View>
                    </View>
                    <View className='at-row'>
                      <View className='at-col at-col-1'></View>
                      <View className='at-col at-col-10'>
                        <AtInput
                          className='AtInput'
                          name='value'
                          title='现有投资款:'
                          type='number'
                          placeholder='？'
                          value={this.state.investment}
                          onChange={this.handleInputChange6.bind(this)}
                        />
                      </View>
                      <View className='at-col at-col-1'></View>
                    </View>
                    <View className='at-row'>
                      <View className='at-col at-col-1'></View>
                      <View className='at-col at-col-10'>
                        <AtInput
                          className='AtInput'
                          name='value'
                          title='固定资产:'
                          type='number'
                          placeholder='？'
                          value={this.state.fixedasset}
                          onChange={this.handleInputChange7.bind(this)}
                        />
                      </View>
                      <View className='at-col at-col-1'></View>
                    </View>
                  </View>
                )
              }
              {
                this.state.current == 2 && (
                  <View>
                    <View className='at-row'>
                      <View className='at-col at-col-1'></View>
                      <View className='at-col at-col-10'>
                        <AtInput
                          className='AtInput'
                          name='value'
                          title='每月车贷房贷:'
                          type='number'
                          placeholder='？'
                          value={this.state.loanout}
                          onChange={this.handleInputChange8.bind(this)}
                        />
                      </View>
                      <View className='at-col at-col-1'></View>
                    </View>
                    <View className='at-row'>
                      <View className='at-col at-col-1'></View>
                      <View className='at-col at-col-10'>
                        <AtInput
                          className='AtInput'
                          name='value'
                          title='每月日常开支:'
                          type='number'
                          placeholder='？'
                          value={this.state.cashout}
                          onChange={this.handleInputChange9.bind(this)}
                        />
                      </View>
                      <View className='at-col at-col-1'></View>
                    </View>
                    <View className='at-row'>
                      <View className='at-col at-col-1'></View>
                      <View className='at-col at-col-10'>
                        <AtInput
                          className='AtInput'
                          name='value'
                          title='房贷/车贷总额:'
                          type='number'
                          placeholder='？'
                          value={this.state.loanTotal}
                          onChange={this.handleInputChange10.bind(this)}
                        />
                      </View>
                      <View className='at-col at-col-1'></View>
                    </View>
                    <View className='at-row'>
                      <View className='at-col at-col-1'></View>
                      <View className='at-col at-col-10'>
                        <AtInput
                          className='AtInput'
                          name='value'
                          title='其他欠款总额:'
                          type='number'
                          placeholder='？'
                          value={this.state.liabilityTotal}
                          onChange={this.handleInputChange11.bind(this)}
                        />
                      </View>
                      <View className='at-col at-col-1'></View>
                    </View>
                    <View style='height:5vh'></View>
                    <AtButton className='btn' onClick={this.handleSubmitFirst.bind(this)}>Next</AtButton>
                  </View>
                )
              }
              <AtModal isOpened={this.state.isOpened}>
                <AtModalHeader>Emmm...</AtModalHeader>
                <AtModalContent>
                  <image style="width: 200px; height: 200px; background-color: #eeeeee;" mode="aspectFit" src={this.state.pic}></image>
                  <View className='.at-article__h3'>{'净资产:'+this.state.asset}</View>
                  <View className='.at-article__h3'>{'每月流水:'+this.state.cashflow}</View>
                  <View className='.at-article__h3'>{this.state.conclusion}</View>
                </AtModalContent>
                <AtModalAction> <Button onClick={this.handleModalRedo.bind(this)}>重来</Button> <Button onClick={this.handleModalConfirm.bind(this)}>确定</Button> </AtModalAction>
              </AtModal>
            </View>
          )
        }
        { 
          this.state.status == 'Exist2' && (
            <View className='index full'>
              <View style='height:5vh'></View>
              <View className='at-row at-row__align--center'>
                <View className='at-col at-col-3'></View>
                <View className='at-col at-col-3'>
                  <AtAvatar image={this.state.avatar}></AtAvatar>
                </View>
                <View className='at-col at-col-3 at-article-h2'>
                  {this.state.name}
                </View>
                <View className='at-col at-col-3'></View>
              </View>
              <View className='at-row at-row__align--center'>
                <View className='at-col at-col-2'></View>
                <View className='at-col at-col-4'>
                  <AtButton>新增收入</AtButton>
                </View>
                <View className='at-col at-col-4'>
                  <AtButton>新增支出</AtButton>
                </View>
                <View className='at-col at-col-2'></View>
              </View>
              <View className='at-row at-row__align--center'>
                <View className='at-col at-col-3'></View>
                <View className='at-col at-col-6'>
                  <View className='.at-article__h3'>{'总资产:'}:</View>
                </View>
                <View className='at-col at-col-3'></View>
              </View>
              <View className='at-row at-row__align--center'>
                <View className='at-col at-col-3'></View>
                <View className='at-col at-col-6'>
                  <View className='.at-article__h3'>{'存款:'}:</View>
                </View>
                <View className='at-col at-col-3'></View>
              </View>
              <View className='at-row at-row__align--center'>
                <View className='at-col at-col-3'></View>
                <View className='at-col at-col-6'>
                  <View className='.at-article__h3'>{'固定资产:'}:</View>
                </View>
                <View className='at-col at-col-3'></View>
              </View>
              
              <View style='height:5vh'></View>
              <AtButton className='btn' openType="getUserInfo" onGetUserInfo={this.getUserInfo.bind(this)}>Come on!</AtButton>
            </View>
          )
        }
      </View>
    )
  }
}

export default Index
