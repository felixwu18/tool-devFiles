import { ControllerBase, Emit } from 'prism-web';
// 短信发送
export class AddressBookSendMessage extends ControllerBase {
	// privete temp = {
	//   // style: require('')
	// }
	constructor() {
		super();
	}

	created() {}

	private formdata: Object = {
		data: {
			title: '',
			content: '',
			sendObj: ''
		},
		config: [
			{
				span: [24],
				label: '发送短信',
				dataProp: [
					[
						{
							label: '标题：',
							prop: 'title',
							type: 'text',
							requireType: ['required', 'length'],
							maxLength: 20
						},
						{
							label: '内容：',
							prop: 'content',
							type: 'text',
							requireType: ['required', 'length'],
							maxLength: 250
						},
						{
							label: '发送对象：',
							prop: 'sendObj',
							type: 'text',
							requireType: ['required']
						}
					]
				]
			}
		]
	};

	@Emit('dialogcallback')
	closeDialogCall() {
		return;
	}

	//点击取消按钮
	cancelOpen() {
    this.$message('取消发送')
		this.closeDialogCall()
  }
  
  // 发送短信
  sendMessage(){
    // TODO 获取内容 发送
    this.$message('发送短信')
    console.log(this.$refs.simpleTable['refs'])
    // 发送成功关闭dialog
    this.closeDialogCall()
  }
}
