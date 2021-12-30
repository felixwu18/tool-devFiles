import { ControllerBase, Inject, Watch } from 'prism-web';
import searchSession from '../../../../assets/libs/searchData';
//值班要情列表
export class DutySituationController extends ControllerBase {
	private temp = {
		style: require('../../style/dutySituation/dutySituationList.less')
	};

	constructor() {
		super();
	}

	@Inject('http') http: any;

	//向弹出框配置参数
	private dialogConfig: Object = {
		viewDialog: false, //弹框是否显示
		templateName: '', //弹框组件名
		tilteName: '' //标题头
	};
	//向弹出框传递参数
	private propsData: Object = {};
	//时间搜索的返回值
	private search_time = [];

	//机构树的默认值
	private defaultchecked = '';

	private fakeData = [];
	//按钮控制
	private btnConfig = {
		time: false, //值班时间
		add: false,//新增
		search: false,//查询
	}
	private fakeData2 = [];
	//查看所有传参(传空) 查看未删传参(传0)
	private searchData: Object = {
		deleteFlag: null,
		startTime: '',
		// endTime: '',
		endTiime: '',
		keyWord: '',
		nowPage: 1,
		pageSize: 8,
		orgCode: JSON.parse(sessionStorage.getItem('role')).orgCode
	};
	//列表添加操作参数
	private btnGroup: object = {
		edit: { name: '编辑', type: 'warning', emit: 'editDialog', expression: true },
		delete: { name: '删除', type: 'danger', emit: 'deleteDialog', expression: true }
	};

	//列表参数
	private propData = {
		isCheck: false,
		pageSize: 8,
		total: 1,
		config: [
			// {
			// 	type: 'string',
			// 	width: '/',
			// 	prop: 'dutyLogId'
			// },
			{
				type: 'string',
				label: '人员名称',
				width: '/',
				// prop: 'reportTitle',
				prop: 'dutyPeopleName',
				emit: 'detailDialog'
			},
			{
				type: 'string',
				label: '值班时间起',
				width: '/',
				prop: 'startTime'
			},
			{
				type: 'string',
				label: '值班时间止',
				width: '/',
				prop: 'endTiime' //建表字段错误 非写错
			},
			{
				type: 'string',
				label: '工作事项',
				width: '/',
				prop: 'workItem'
			},
			{
				type: 'string',
				label: '交接事项',
				width: '/',
				prop: 'takeOverItem'
			},
			{
				type: 'button',
				label: '操作',
				width: '200',
				prop: 'operate'
			}
		],

		data: []
	};

	created() {
		this.getListData();
		this.btnManagement()
	}
	activated() {
	}
	/**
	*  author by xinglu 获取当前菜单的按钮权限
	*  @param{
	*    menuId: "",  //菜单id
	*    userId: "", //当前登录用户的id
	*  }
	*/
	btnManagement() {
		var userInfo = searchSession.getter({ name: 'role' })
		let params = {
			menuId: '2c9287db6e7e3851016e832888ce044c',
			userId: userInfo['userId']
		}
		this.http.PowerNodeRequest.btnPowerManagement(params).then((res) => {
			if (res.status == 200) {
				// console.log(res);
				res.data.forEach((data) => {
					switch (data.privName) {
						case '值班时间':
							this.btnConfig.time = true
							break
						case '新增':
							this.btnConfig.add = true
							break
						case '搜索':
							this.btnConfig.search = true
							break
					}
				})
			}
		})
	}
	/* author by chengyun 数据请求
	 *  Modify by
	 */
	getListData() {
		// console.log('this.searchData', this.searchData);
		this.http.DutySituationRequest.dutySituationQuery(this.searchData).then(res => {
			if (res.status == 200) {
				// console.log(res);
				res.data.list.map(item => (item['operate'] = this.btnGroup));
				this.$set(this.propData, 'data', res.data.list);
				this.propData.total = res.data.total;
				// console.log('this.propData', this.propData);
			}
		});
	}

	/* author by chengyun 机构的回调
	 *  Modify by
	 */
	getOrg(val) {
		let id = val.prop.id;
		this.$set(this.searchData, 'orgCode', id);
		this.getListData();
	}

	/* author by chengyun 列表所有按钮点击响应
	 *  Modify by
	 */
	tablecallback(data) {
		this[data.type](data);
	}

	/* author by chengyun 列表行的回调
	 *  Modify by
	 */
	tableRowClassName() { }

	/* author by chengyun 翻页功能
	 *  Modify by
	 */
	handlePageChange(data) {
		// console.log(data);

		this.searchData['nowPage'] = data.rowVal;
		this.getListData();
	}

	/* author by chengyun 查询按钮
	 *  Modify by lichao
	 */
	dutySearch() {
		if (this.search_time && this.search_time.length > 0) {
			this.searchData['startTime'] = this.search_time[0];
			this.searchData['endTiime'] = this.search_time[1];

		} else {
			this.searchData['startTime'] = ""
			this.searchData['endTiime'] = ""
		}
		this.getListData();

	}

	/* author by chengyun 关闭弹框
	 *  Modify by
	 */
	closeDialogCall() {
		//关闭弹框
		this.dialogConfig['viewDialog'] = false;
	}

	/* author by chengyun 新增弹框
	 *  Modify by
	 */
	situationAdd(val) {
		if (!this.searchData['orgCode']) {
			this.$message({ message: '请选择机构', type: 'error' });
		} else {
			this.dialogConfig['viewDialog'] = true;
			let data = {
				viewDialog: true,
				templateName: 'duty-situation-add',
				tilteName: '新增值班要情'
			};
			this.$set(this, 'dialogConfig', data);
		}
	}

	/* author by chengyun 查看弹框
	 *  Modify by
	 */
	detailDialog(val) {
		this.dialogConfig['viewDialog'] = true;
		let data = {
			viewDialog: true,
			templateName: 'duty-situation-detail',
			tilteName: '查看值班要情'
		};
		this.$set(this, 'dialogConfig', data);

		this.$set(this, 'propsData', val);
	}

	/* author by chengyun 编辑弹框
	 *  Modify by
	 */
	editDialog(val) {
		this.dialogConfig['viewDialog'] = true;
		let data = {
			viewDialog: true,
			templateName: 'duty-situation-edit',
			tilteName: '编辑值班要情'
		};
		this.$set(this, 'dialogConfig', data);
		this.$set(this, 'propsData', val);
	}

	/* author by chengyun 删除列表
	 *  Modify by
	 */
	deleteDialog(val) {
		let obj = { id: val.rowVal.dutyLogId };
		this.$confirm('请确认是否要删除此条信息!', '删除原因', {
			confirmButtonText: '确定',
			cancelButtonText: '取消'
		})
			.then(() => {
				this.http.DutySituationRequest.dutySituationDel(obj).then((res: { status: number }) => {
					if (res.status === 200) {
						this.getListData();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
					} else {
						this.$message({
							message: '删除失败',
							type: 'error'
						});
					}
				});
			})
			.catch(() => {
				this.$message({
					message: '已取消操作',
					type: 'success'
				});
			});
	}
}
