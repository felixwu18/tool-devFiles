import { ControllerBase, Inject, Watch, Prop } from 'prism-web'

export class govermentDetailsController extends ControllerBase {
  private temp = {
  }

  constructor() {
    super()
  }

  @Prop() formdata
  private dutyselect=[{
    label:"白班带班领导",
    value:"0"
  },
    {
      label: "白班主班",
      value: "1"
    },
    {
      label: "白班副班",
      value: "2"
    },
    {
      label: "夜班带班领导",
      value: "3"
    },
    {
      label: "夜班主班",
      value: "4"
    },
    {
      label: "夜班副班",
      value: "5"
    }
 ]

  @Watch('formdata')
    getform(val){
    }
}