import { ControllerBase, Prop } from 'prism-web';

export class AddressBookListController extends ControllerBase {
			private temp = {
				style: require('../../style/addressBook/addressBookList.less')
			};
			private dutyPhone = [{ val: '17777777777' }];
			private dutyFax = [{ val: 8888888 }];
			private newGroup: String = "";
			private addGroupVisiable: Boolean = false;
			private defaultchecked = '9e55c0339c4c46aba807f7094ac8ea67'; //机构树默认选中
			private showPageOne: boolean;
			private phonePanelVisible:boolean = false; // 拨号盘显隐控制
			private callnumber = "" // 传值号码
			private groupList:Array<any> = [ // 分组列表
				{label:"应急处置组",id:"0",showHandle:false},
				{label:"值班处置组",id:"1",showHandle:false},
				{label:"指挥组",id:"2",showHandle:false},
				{label:"联络组",id:"3",showHandle:false},
			]
			groupEdit(data){ 
				data.showInput=true
			}
			focus(){}
			private searchData: Object = {
				deleteFlag: null,
				startTime: '',
				endTime: '',
				keyWord: '',
				listOrder: {
					prop: '',
					sort: ''
				},
				nowPage: 1,
				pageSize: 10
			};
			private dutyDatas: Object = {
				nowPage: 1,
				pageSize: 12,
				pages: 158,
				total: 1259,
				unReadTotalCount: 0
			};

			private propData: Object = {
				isCheck: false,
				pageSize: 8,
				total: 1,
				config: [
					{
						type: 'string',
						label: '姓名',
						width: '/',
						prop: 'dutyName',
						emit: 'detailDialog'
					},
					{
						type: 'string',
						label: '职务',
						width: '/',
						prop: 'dutyType'
					},
					{
						type: 'string',
						label: '人员单位',
						width: '/',
						prop: 'dutyUnit'
					},
					{
						type: 'string',
						label: '办公电话',
						width: '/',
						prop: 'dutyPhone',
						emit: 'dutyPhoneCall'
					},
					{
						type: 'string',
						label: '手机',
						width: '/',
						prop: 'dutyMobile',
						emit: 'useMobile'
					},
					{
						type: 'string',
						label: '传真',
						width: '/',
						prop: 'dutyFax'
					},
					{
						type: 'string',
						label: '是否系统用户',
						width: '/',
						prop: 'isSys'
					},
					{
						type: 'string',
						label: '更新时间',
						width: '240',
						prop: 'updateTime'
					}
				],
				data: []
			};

			private fakeData: Array<Object> = [
				{
					dutyName: '叶扬1',
					dutyType: '主任',
					dutyUnit: '应急办',
					dutyPhone: '82866644',
					dutyMobile: '13800001111',
					dutyFax: '',
					isSys: '是',
					updateTime: '2019-08-30 11:30'
				},
				{
					dutyName: '叶扬2',
					dutyType: '主任',
					dutyUnit: '应急办',
					dutyPhone: '82866644',
					dutyMobile: '13800001111',
					dutyFax: '',
					isSys: '是',
					updateTime: '2019-08-30 11:30'
				},
				{
					dutyName: '叶扬3',
					dutyType: '主任',
					dutyUnit: '应急办',
					dutyPhone: '82866644',
					dutyMobile: '13800001111',
					dutyFax: '',
					isSys: '是',
					updateTime: '2019-08-30 11:30'
				},
				{
					dutyName: '叶扬4',
					dutyType: '主任',
					dutyUnit: '应急办',
					dutyPhone: '82866644',
					dutyMobile: '13800001111',
					dutyFax: '',
					isSys: '是',
					updateTime: '2019-08-30 11:30'
				},
				{
					dutyName: '叶扬5',
					dutyType: '主任',
					dutyUnit: '应急办',
					dutyPhone: '82866644',
					dutyMobile: '13800001111',
					dutyFax: '',
					isSys: '是',
					updateTime: '2019-08-30 11:30'
				},
				{
					dutyName: '叶扬6',
					dutyType: '主任',
					dutyUnit: '应急办',
					dutyPhone: '82866644',
					dutyMobile: '13800001111',
					dutyFax: '',
					isSys: '是',
					updateTime: '2019-08-30 11:30'
				},
				{
					dutyName: '叶扬7',
					dutyType: '主任',
					dutyUnit: '应急办',
					dutyPhone: '82866644',
					dutyMobile: '13800001111',
					dutyFax: '',
					isSys: '是',
					updateTime: '2019-08-30 11:30'
				},
				{
					dutyName: '叶扬',
					dutyType: '主任',
					dutyUnit: '应急办',
					dutyPhone: '82866644',
					dutyMobile: '13800001111',
					dutyFax: '',
					isSys: '是',
					updateTime: '2019-08-30 11:30'
				},
				{
					dutyName: '叶扬',
					dutyType: '主任',
					dutyUnit: '应急办',
					dutyPhone: '82866644',
					dutyMobile: '13800001111',
					dutyFax: '',
					isSys: '是',
					updateTime: '2019-08-30 11:30'
				}
			];

			//向弹出框配置参数
			private dialogConfig: Object = {
				viewDialog: false, //弹框是否显示
				templateName: '', //弹框组件名
				tilteName: '' //标题头
			};

			// 短信发送弹出窗
			private sendMessageConfig: Object = {
				viewDialog: false,
				templateName: '',
				titleName: ''
			};

			//弹框传递的参数
			private propsData: Object = {};

			constructor() {
				super();
			}

			private checkPage: string = '1';
			created() {
				console.log(this.checkPage);
				if (this.$route.query.tab) {
					this.checkPage = this.$route.query.tab.toString();
					console.log(this.checkPage);
					console.log(this.$route.query.tab);
				}
				this.getListData('');
			}

			getListData(val) {
				let data;
				this.$set(this.propData, 'data', this.fakeData);
				this.propData['total'] = 13;
			}

			// 机构的回调
			getOrg(val) {
				this.$set(this.searchData, 'orgCode', val);
			}

			/**
			 * 列表行回调
			 */
			tableRowClassName() {}

			/**
			 * 点击姓名的dialog
			 */
			detailDialog(val) {
				this.dialogConfig['viewDialog'] = true;
				let data = {
					viewDialog: true,
					templateName: 'duty-addressbook-detail',
					tilteName: '查看人员'
				};
				this.$set(this, 'dialogConfig', data);
			}

			/**
			 * 列表所有按钮点击响应
			 * @param data
			 */
			tablecallback(data) {
				this[data.type](data);
			}

			/**
			 * 点击关闭弹窗
			 */
			closeDialogCall() {
				this.dialogConfig['viewDialog'] = false;
			}

			// 翻页
			handlePageChange(data) {
				if (data.rowVal === 2) {
					this.$set(this.propData, 'data', this.fakeData);
					this.propData['total'] = 13;
					this.getListData(2);
				}
			}

			// 导入
			dutyUpload() {
				this.$message('导入');
			}

			// 导出
			dutyDownload() {
				this.$message('导出');
			}

			// 统计表
			dutyShowTable() {
				this.$message('统计表');
			}

			// 拨打固定电话
			dutyPhoneCall(val) {
				this.phonePanelVisible = true
				this.callnumber = val.rowVal.dutyPhone;
				// TODO改变轮盘值
			}

			// 点击手机需要选择是拨打电话还是发送短信
			useMobile(val) {
				this.$confirm('选择发送短信还是拨打电话？', '提示', {
					distinguishCancelAndClose: true,
					confirmButtonText: '拨打电话',
					cancelButtonText: '发送短信'
				})
					.then(() => {
						this.phonePanelVisible = true
						this.callnumber = val.rowVal.dutyPhone;
					})
					.catch(action => {
						action === 'cancel' ? this.sendMessage() : null;
					});
			}

			// 发送短信
			sendMessage() {
				this.sendMessageConfig['viewDialog'] = true;
				let data = {
					viewDialog: true,
					templateName: 'duty-addressBook-send',
					tilteName: '发送短信'
				};
				this.$set(this, 'sendMessageConfig', data)
			}

			//
			closeSendDialog() {
				this.sendMessageConfig['viewDialog'] = false;
			}

			private sendMessageProp:Object = {
				
			}

			// 添加分组
			addGroup(){
				let data = {label:this.newGroup,id:(this.groupList[this.groupList.length-1]['id']) * 1 -1,showHandle:false};
				this.groupList.push(data);
				this.$message('添加分组');
				this.addGroupVisiable = false;
			}

			// 编辑分组
			editGroup(){
				this.$message('编辑分组');
			}

			// 删除分组
			delGroup(){
				this.$message('删除分组');
			}

			peopleAdd() {
				this.$message('新增人员');

			}
		}
