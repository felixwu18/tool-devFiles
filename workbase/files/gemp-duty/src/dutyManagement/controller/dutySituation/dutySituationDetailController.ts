import { ControllerBase, Emit, Prop, Watch } from 'prism-web';
//值班要情查看
export class DutySituationDetailController extends ControllerBase {
	private temp = {
		style: require('../../style/dutySituation/dutySituationAdd.less')
	};

	constructor() {
		super();
	}

	@Emit('dialogcallback')
	closeDialogCall() {
		return;
	}

	// 监听propdata 传入dialog的propdata变化 刷新dialog
	@Watch('propdata')
	watchPropdata(val) {
		if (val) {
			this.initPage();
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
							type: 'text'
						},
						{
							label: '值班开始时间:',
							type: 'date',
							prop: 'startTime'
						},
						{
							label: '值班结束时间:',
							type: 'date',
							prop: 'endTiime'
						},
						{
							label: '工作事项:',
							type: 'textarea',
							prop: 'workItem',
							maxlength: 250
						},
						{
							label: '交办事项:',
							type: 'textarea',
							prop: 'takeOverItem',
							maxlength: 250
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
	 * author lichao
	 */
	@Prop() propdata;
	initPage() {
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

	//生成简报后点击取消按钮
	cancelOpen() {
		this.closeDialogCall();
	}
}
