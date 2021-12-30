import { ControllerBase, Emit } from 'prism-web';
// 通讯录查看
export class AddressBookDetailController extends ControllerBase {
	private temp = {
		style: require('../../style/addressBook/addressBookDetail.less')
	};

	private formdata: Object = {
		data: {
			dutyName: '叶扬',
			dutySex: '女',
			dutyUnit: '市政府',
			dutyType: '调研员',
			dutyPhone: '82828282',
			dutyMail: '',
			dutyImg: '../../../../assets/image/person-icon.png',
			dutyMobile: '13500001111',
			dutyQQ: '',
			dutyFax: '',
			dutyRemarks: '12321312'
		},
		config: [
			{
				span: [12, 12],
				dataProp: [
					[
						{
							label: '姓名:',
							prop: 'dutyName',
							type: 'text'
						},
						{
							label: '性别:',
							prop: 'dutySex',
							type: 'text'
						},
						{
							label: '部门:',
							prop: 'dutyUnit',
							type: 'text'
						},
						{
							label: '职务:',
							prop: 'dutyType',
							type: 'text'
						},
						{
							label: '办公电话:',
							prop: 'dutyPhone',
							type: 'text'
						},
						{
							label: '邮箱:',
							prop: 'dutyMail',
							type: 'text'
						}
					],
					[
						{
							label: '照片:',
							prop: 'dutyImg',
							type: 'picture'
						},
						{
							label: '移动电话:',
							prop: 'dutyMobile',
							type: 'text'
						},
						{
							label: 'QQ号:',
							prop: 'dutyQQ',
							type: 'text'
						},
						{
							label: '传真号:',
							prop: 'dutyFax',
							type: 'text'
						}
					]
				]
			},
			{
				span: [24],
				dataProp: [
					[
						{
							label: '备注:',
							prop: 'dutyRemarks',
							type: 'textarea'
						}
					]
				]
			}
		]
	};

	constructor() {
		super();
	}

	created() {
		// this.initDialog();
	}

	// 初始化dialog中的值
	// initDialog() {
	// 	// console.log(this.checkObj(this.propdata));
	// 	// if(this.checkObj(this.propdata)){
	// 	// 	// this.$set()
	// 	// }
	// }

	// checkObj(obj) {
	// 	return Object.keys(obj).length === 0 ? false : true;
	// }
}
