import { ControllerBase, Prop, Emit, Inject, Watch } from 'prism-web'
import { formprop } from '../interfaces/formprop'
import { createDecipher } from 'crypto'

export class IamsFormController extends ControllerBase {
  constructor() {
    super();
  }

  private temp = {
    style: require('../style/iamsForm.less')
  };
  @Inject('http') http: any;
  @Prop() value
  @Watch('value', { deep: true })
  watchvalue(val) {
    if (val) {
      this.$emit('input', val)
    }
  }
  @Prop() gisshow: Boolean; //是否显示GIS
  @Prop() mapinfo; //地图参数
  @Prop() disabled: Boolean; //是否能编辑
  @Emit('changeGoods')
  getListCode(val) {
    this.value.data[val.prop] = val.value;

    if (this.value.data.hasOwnProperty('emresourceTypeId'))
      this.getstoragePointRequest(val.value);
  }

  get propRules() {
    let data = this.validatFunc(this.value.config);
    return data;
  }
  //是否能编辑参数
  private disabledEdit = null;
  //联动下拉框参数
  private disabledData = [];
  private recoredType = [
    {
      id: '0',
      label: '已办事项'
    },
    {
      id: '1',
      label: '待办事项'
    },
    {
      id: '2',
      label: '关注事项'
    }
  ];
  //设置文本域的高度
  private autoHeight = { minRows: 2, maxRows: 4 };
  //地图默认值
  private disableddefaultData = { id: '' };
  private flagid = '';
  private validatFunc(data) {
    data.forEach(item => {
      if (item.dataProp) {
        this.validatFunc(item.dataProp);
      } else if (item instanceof Array) {
        this.validatFunc(item);
      } else {
        this.$set(item, 'rules', []);
        if (item.requireType) {
          item.requireType.forEach(el => {
            // by 刘文磊 添加校验 正整数和 最多两位小数的整数 以及 长度校验规则
            if (el instanceof RegExp) {
              item.rules.push({
                validator: (rule, value, callback) => {
                  if (value) {
                    let data = el.test(value);
                    if (!data) {
                      return callback(
                        new Error(
                          item.message ? item.message : '请输入正确格式'
                        )
                      );
                    } else {
                      return callback();
                    }
                  } else {
                    return callback();
                  }
                },
                trigger: ['change', 'blur']
              });
            } else
              switch (el) {
                case 'required':
                  item.rules.push({
                    required: true,
                    message: '该字段不能为空',
                    trigger: ['blur', 'change']
                  });
                  break;
                case 'length':
                  item.rules.push({
                    max: item.maxlength,
                    message: `长度最大为${item.maxlength}`,
                    trigger: ['blur', 'change']
                  });
                  break;
              }
          });
        }
      }
    });
    return data;
  }

  created() {
    this.disabledEdit = this.disabled || false;
    // by 刘文磊 地图无数据爆红
    if (this.value['longitud'] && this.value['latitude'])
      //获取信息后，得到位置对应的经纬度,地图数据更新，给地图发送消息
      this.$set(this.mapinfo, 'data', [
        this.value['longitud'],
        this.value['latitude']
      ]);
    // 初始储存点的值
    this.flagid = this.value.data['placeId'];
  }

  //地图放大缩小回调的回调函数（给系统发送中心点位置的相关消息）
  mapCallback(msgObj) {
    //地图放大缩小后返回的地理信息展示到页面上
    this.$set(
      this.value.data,
      'address',
      msgObj.opts.formatted_address
    );
    this.$set(this.value.data, 'longitude', msgObj.opts.location.lon);
    this.$set(this.value.data, 'latitude', msgObj.opts.location.lat);
  }

  //事发地点搜索地址
  async searchAddress(val, cb) {
    let result = await this.$refs.detailMap[0]['searchAddrByKey'](val);
    cb(result);
  }

  //选中搜索到的地址
  selectAddress(item) {
    let latIn = item.name.split('-');
    this.$set(this.mapinfo, 'type', 'singleData');
    this.$set(this.mapinfo, 'data', [latIn[0], latIn[1]]);
    this.$refs.detailMap[0]['postMesgToMap'](this.mapinfo);
    this.$set(this.mapinfo, 'latitude', latIn[1]);
    this.$set(this.mapinfo, 'longitude', latIn[0]);
    this.$set(this.value.data, 'longitude', latIn[0]);
    this.$set(this.value.data, 'latitude', latIn[1]);
  }

  //选择机构数时触发数据变化
  // by 刘文磊 清除多余校验
  getTreeCode(val) {
    if (this.value.data['emresourceTypeId'] == '') {
      // console.log(val)
      // return this.$message('请选择物资类型')
    }
    this.value.data[val.prop] = val.value;
  }

  //二级联动选中值
  getstoragePointCode(val) {
    this.value.data['placeId'] = val;
  }

  //物资与装备模块的本表单二级联动
  // by  刘文磊 切换物资来源后 储存点清空  储存点没有下拉数据  值清空
  getstoragePointRequest(val) {
    this.http.SelectNode.storagePoint(val).then(res => {
      if (res.status != 200) {
        this.disabledData = [];
        this.value.data['placeId'] = '';
        return this.$message.error(res.msg);
      }

      // 存储点下拉框 author by 刘文磊
      this.disabledData = res.data;
      // 暂无数据的情况下 清空储存点的值
      if (res.data.length == 0) {
        this.value.data['placeId'] = '';
        return;
      }

      //展示初始化储存点的值  by 刘文磊
      if (this.flagid) {
        var flagplaceId = res.data.filter(item => {
          return item.id == this.flagid;
        });
      }

      if (flagplaceId && flagplaceId.length > 0) {
        // this.disableddefaultData.id = this.flagid
        this.value.data['placeId'] = this.flagid;
      } else {
        //by 刘文磊
        // 切换后存储点默认选择第一项
        // this.disableddefaultData.id = res.data[0].id
        this.value.data['placeId'] = res.data[0].id;
      }
    });
  }
  @Watch('value', { deep: true })
  getvalue(val) {
    this.flagid = this.value.data['placeId'];
  }

   /**
   * Author by chenzheyu  暴露表单验证的功能
   */
  validate() {
    return this.$refs['simpletableform']['validate']
  }
}
