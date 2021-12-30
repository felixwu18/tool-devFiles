import { ControllerBase, Emit, Inject, Prop, Watch } from 'prism-web';
//值班要情编辑
export class DutySituationEditController extends ControllerBase {
	private temp = {
		style: require('../../style/dutySituation/dutySituationAdd.less')
	};

	constructor() {
		super();
	}

	@Inject('http') http: any;

	@Emit('dialogcallback')
	closeDialogCall() {
		return;
	}

	@Watch('propdata')
	watchPropdata(val) {
		if (val) {
			this.initPage();
			// this.$parent.$parent['getListData']();
		}
	}

	private formdata = {
    width: "120px",
		data: {
			dutyPeopleName: '',
			startTime: '',
			endTiime: '',
			workItem: '',
			takeOverItem: ''
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

	created() {
		this.initPage();
	}

	/**
	 *
	 */
	@Prop() propdata;
	initPage() {
		//初始化dialog页面
		// console.log(this.propdata);
		let data = {
			dutyPeopleName: this.propdata.rowVal.dutyPeopleName,
      startTime: new Date(this.propdata.rowVal.startTime.replace(/\-/g, '/')),
      endTiime: new Date(this.propdata.rowVal.endTiime.replace(/\-/g, '/')),
			workItem: this.propdata.rowVal.workItem,
			takeOverItem: this.propdata.rowVal.takeOverItem
		};
		this.$set(this.formdata, 'data', data);
	}

	/* author by chengyun 保存
	 *  Modify by lichao
	 */
	saveFun(data) {
		let orgCode = this.$parent.$parent['searchData']['orgCode'];
		this.$refs.dutySituationEdit['$refs'].simpletableform.validate(valid => {
			if (valid) {
				let _data = {
					dutyLogId: this.propdata.rowVal.dutyLogId,
					dutyPeopleName: this.formdata.data.dutyPeopleName,
					startTime: new Date(this.formdata.data.startTime),
					endTiime: new Date(this.formdata.data.endTiime),
					workItem: this.formdata.data.workItem,
					takeOverItem: this.formdata.data.takeOverItem,
					orgCode
				};
				// console.log(_data);
				this.http.DutySituationRequest.dutySituationEdit(_data).then(res => {
					console.log(res);
					if (res.status == 200) {
						this.$message({ message: res.msg, type: 'success' });
						this.$parent.$parent['getListData']();
					}
				});
				this.closeDialogCall();
			} else {
				this.$message({ message: '校验未通过!', type: 'error' });
			}
		});
	}

	/* author by chengyun 取消保存
	 *  Modify by
	 */
	cancelOpen() {
		this.$message({ message: '取消保存', type: 'success' });
		this.closeDialogCall();
	}
}
