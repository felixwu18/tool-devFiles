import { ControllerBase, Emit, Inject } from 'prism-web';
//值班要情新增
export class DutySituationAddController extends ControllerBase {
	private temp = {
		style: require('../../style/dutySituation/dutySituationAdd.less')
	};

	constructor() {
		super();
	}

	//触发父组件弹出框关闭方法
	@Emit('dialogcallback')
	closeDialogCall() {
		return;
	}

	@Inject('http') http: any;
  private messageDom:any
	private checkPage = '1';
	private formdata = {
    width:"120px",
		data: {
			reportTitle: '',
			starttime: '',
			endtime: '',
			work: '',
			handover: ''
		},
		config: [
			{
				span: [24],
				dataProp: [
					[
						{
							label: '值班人员:',
							prop: 'dutyPeopleName',
							type: 'text',
							requireType: ['required']
						},
						{
							label: '值班开始时间:',
							type: 'date',
							prop: 'startTime',
							requireType: ['required']
						},
						{
							label: '值班结束时间:',
							type: 'date',
							prop: 'endTiime',
							requireType: ['required']
						},
						{
							label: '工作事项:',
							type: 'textarea',
							prop: 'workItem',
							maxlength: 250,
							requireType: ['required']
						},
						{
							label: '交办事项:',
							type: 'textarea',
							prop: 'takeOverItem',
							maxlength: 250,
							requireType: ['required']
						}
					]
				]
			}
		]
	};

	created() {}

	/* author by chengyun 保存
	 *  Modify by
	 */
	saveFun(data) {
		// console.log(this.$parent.$parent['searchData']['orgCode']);
		let orgCode = this.$parent.$parent['searchData']['orgCode'];
		if (!orgCode) {
			this.$message({ message: '请选择机构', type: 'error' });
		} else {
			this.$refs.dutySituationAdd['$refs'].simpletableform.validate(valid => {
				if (valid) {
					let _data = {
						dutyPeopleName: this.formdata.data['dutyPeopleName'],
						endTiime: this.formdata.data['endTiime'],
						startTime: this.formdata.data['startTime'],
						takeOverItem: this.formdata.data['takeOverItem'],
						workItem: this.formdata.data['workItem'],
						orgCode
					};
					this.http.DutySituationRequest.dutySituationAdd(_data).then(res => {
						if (res.status == 200) {
							this.$message({ message: res.msg, type: 'success' });
							this.closeDialogCall();
							this.$parent.$parent['getListData']();
						}
					});
				} else {
          if (this.messageDom) { this.messageDom.close() }
					this.$message({ message: '请按提示正确填写信息!', type: 'warning' });
				}
			});
		}
	}

	/* author by chengyun 取消保存
	 *  Modify by
	 */
	cancelOpen() {
		this.$message({ message: '取消保存', type: 'success' });
		this.closeDialogCall();
	}
}
