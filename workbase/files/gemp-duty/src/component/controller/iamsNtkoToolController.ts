/*
 * Author by chengyun 简报新增和编辑组件
 */

import { ControllerBase, Inject, Prop, Watch } from 'prism-web'
import { baseUrl, reportUrl } from '../../../service/config/base'

export class IamsNtkoToolController extends ControllerBase {
  constructor() {
    super()
  }

  @Inject('http') http: any
  @Prop() reporttype //简报类型
  @Prop() opendocbyurl //简报显示地址
  @Watch('opendocbyurl') //监听简报地址
  postword(val) {
    if (val) {
      this.showDocUrl = this.opendocbyurl
      this.TANGER_OCX_OpenDocByurl(val)
    } else {
      console.log('ntko未获取简报地址')
    }
  }
  @Watch('saveData')
  dataId(data) {
    if (!data) {
      return false
    }
    let val = JSON.parse(this.saveData).data
    if (val) {
      this.emit('reportAddmaterialId', val)
    }
  }
  private showDocUrl: string = '' //简报显示地址 showDocUrl
  private tempdocUrl: string = '' //简报模板显示地址
  private token = '' //token参数
  private saveDocUrl = '' //简报保存地址
  private saveData = null //保存成功的数据
  private TANGER_OCX_bDocOpen = false
  private TANGER_OCX_filename
  private TANGER_OCX_actionURL //For auto generate form fiields
  private TANGER_OCX_OBJ //The Control

  created() {
    this.token = JSON.parse(sessionStorage.getItem('token'))
    this.saveDocUrl = `${reportUrl}?type=${this.reporttype}&token=${this.token}`
    this.specialSaveToLocal()
    this.TANGER_OCX_Printview_Parent()
    this.initData()
  }

  initData() {
    this.showDocUrl = this.opendocbyurl
    if (this.$route.query.type) {
      //新增页面调用
      this.specialReportNtko()
    }
    if (this.$route.params.inparameter) {
      //文本跳转新增页面调用
      this.tempdocUrl = this.$route.params.inparameter
      this.TANGER_OCX_OpenDocByurl(this.$route.params.inparameter)
    } else {
      if(this.showDocUrl) {
        this.TANGER_OCX_OpenDocByurl(this.showDocUrl)
      }
    }
  }

  /*
   * Author by chenzheyu 预览功能通知机制
   * Modify by chengyun
   */

  TANGER_OCX_Printview_Parent() {
    this.on('printviewParent', (data) => {
      this.TANGER_OCX_Printview()
    })
  }

  /*
   * Author by chenzheyu 另存为功能通知机制
   * Modify by chengyun
   */

  specialSaveToLocal() {
    this.on('specialSaveToLocal', (data) => {
      this.SaveToLocal()
    })
  }

  /*
   * Author by chenzheyu 另存为功能
   * Modify by chengyun
   */
  SaveToLocal() {
    this.TANGER_OCX_OBJ. ShowDialog (3);
  }

  /*
   * Author by chengyun 保存按钮
   * Modify by chengyun
   */
  saveReportCom() {
    if (this.tempdocUrl) {
      let filename = this.tempdocUrl.substring(this.tempdocUrl.lastIndexOf('/') + 1, this.tempdocUrl.length)
      // return this.TANGER_OCX_SaveDoc(filename, this.reporttype)
      this.TANGER_OCX_SaveDoc(filename, this.reporttype)
    } else {
      let filename = this.showDocUrl.substring(this.showDocUrl.lastIndexOf('/') + 1, this.showDocUrl.length)
      // let a = this.TANGER_OCX_SaveDoc(filename, this.reporttype)
      // return this.TANGER_OCX_SaveDoc(filename, this.reporttype)
      this.TANGER_OCX_SaveDoc(filename, this.reporttype)
    }
  }

  /*
   * Author by chengyun 获取简报模板
   * Modify by chengyun
   */
  specialReportNtko() {
    let reportType = {reportType:this.reporttype}
    this.http.NotkTemplateTypeRequest.templateType(reportType).then((res) => {
      if (res.status == 200) {
        this.tempdocUrl = res.data
        this.TANGER_OCX_OpenDocByurl(res.data)
      }
    })
  }

  /**
   * 从URL增加图片到文档指定位置
   *
   * @param markname 书签的名称
   * @param url	要添加图片的地址(siteUrl+图片的路径)
   */
  AddPictureFromURL(markname, url) {
    //获得书签的位置
    var bookmark = this.TANGER_OCX_OBJ.ActiveDocument.BookMarks(markname)
    //在书签的位置添加图片
    this.TANGER_OCX_OBJ.ActiveDocument.InlineShapes.AddPicture(url, true, true, bookmark.range)
  }

  /**
   * 打印文档
   */
  TANGER_OCX_PrintDoc1() {
    try {
      this.TANGER_OCX_OBJ.printout(true)
    } catch (err) {
      //alert("请检查word是否可以打印!");
    } finally {
    }
  }

  // 打印预览
  TANGER_OCX_Printview() {
    try {
      this.TANGER_OCX_OBJ.ActiveDocument.PrintPreview()
    } catch (err) {
      return false
    } finally {
    }
  }

  /**
   * 打开文档Doc
   *
   * @param url为文档模板的路径
   */
  TANGER_OCX_OpenDocByurl(url) {
    this.TANGER_OCX_OBJ = document.getElementById('TANGER_OCX')
    if (url != null) {
      //根据文档路径开打文档
      //TANGER_OCX_OBJ.OpenFromURL(url);
      this.TANGER_OCX_OBJ.BeginOpenFromURL(url)
      this.TANGER_OCX_bDocOpen = true
    } else {
      //如果文档路径不为空则打开一个新的文档

      this.TANGER_OCX_OBJ.CreateNew('Word.Document')
    }
  }

  /**
   * 打开文档Excel
   *
   * @param url为文档模板的路径
   */
  TANGER_OCX_OpenExcelByurl(url) {
    this.TANGER_OCX_OBJ = document.getElementById('TANGER_OCX')

    if (url != null) {
      //根据文档路径开打文档
      //TANGER_OCX_OBJ.OpenFromURL(url);
      this.TANGER_OCX_bDocOpen = true
      this.TANGER_OCX_OBJ.OpenFromURL(url, false, 'Excel.Sheet')
    } else {
      //如果文档路径不为空则打开一个新的文档

      this.TANGER_OCX_OBJ.CreateNew('Excel.Sheet')
    }
  }

  /**
   * 保存到服务器
   *
   * @param filename为文档的名称
   * @param plantitle如果在保存中要传的参数
   */
  TANGER_OCX_SaveDoc = function(filename, plantitle) {
    var newwin, newdoc
    if (!this.TANGER_OCX_bDocOpen) {
      alert('没有打开的文档。')
      return
    }
    try {
      // this.TANGER_OCX_doFormOnSubmit()
      // if (!this.TANGER_OCX_doFormOnSubmit()) return //如果存在，则执行表单的onsubmit函数。
      //调用控件的SaveToURL函数
      this.saveData = this.TANGER_OCX_OBJ.SaveToURL(
        this.saveDocUrl, //此处为uploadedit.asp
        'file', //文件输入域名称,可任选,不与其他<input type=file name=..>的name部分重复即可
        '', //可选的其他自定义数据－值对，以&分隔。如：myname=tanger&hisname=tom,一般为空
        filename, //文件名,此处从表单输入获取，也可自定义
        'myForm' //控件的智能提交功能可以允许同时提交选定的表单的所有数据.此处可使用id或者序号
      ) //此函数会读取从服务器上返回的信息并保 存到返回值中。
      //打开一个新窗口显示返回数据
      // let val = JSON.parse(this.saveData).data
      // if (val) {
      //    this.emit('reportAddmaterialId', val)
      // }
      // return this.saveData
      if (this.saveData.length <= 350) {
        // newwin = window.open(siteUrl+"/jsp/iss/plan/planbrowse/Savesucceed.jsp?retHTML=true","_blank","left=200,top=200,width=400,height=300,status=0,toolbar=0,menubar=0,location=0,scrollbars=1,resizable=no",false);
      } else {
        alert('保存失败！')
        //			newwin = window.open(siteUrl+"/jsp/iss/plan/planbrowse/Saveunsucceed.jsp?retHTML=true","_blank","left=200,top=200,width=400,height=300,status=0,toolbar=0,menubar=0,location=0,scrollbars=1,resizable=no",false);
      }
    } catch (err) {
    } finally {
    }
  }

  CopyValueToBookMark(inputValue, BookMarkName) {
    try {
      //do copy
      //DEBUG
      //alert(inputname+"="+inputValue+" Bookmarkname="+BookMarkName);
      var bkmkObj = this.TANGER_OCX_OBJ.ActiveDocument.BookMarks(BookMarkName)
      if (!bkmkObj) {
        //alert("Word 模板中不存在名称为：\""+BookMarkName+"\"的书签！");
      }
      var saverange = bkmkObj.Range
      saverange.Text = inputValue
      this.TANGER_OCX_OBJ.ActiveDocument.Bookmarks.Add(BookMarkName, saverange)
    } catch (err) {
      //alert("Word 模板中不存在名称为：\""+BookMarkName+"\"的书签！");
    } finally {
    }
  }

  /**
   *
   * @param bookname
   * @param title
   * @param tvalue
   * @param widths
   * @param titleFont
   * @param titleB
   * @param titlesize
   * @param colsFont
   * @param colsB
   * @param colssize
   * @param valueFont
   * @param valuesize
   * @param valueAlign
   */
  AddTableByDayPlan(bookname, title, mintitle, tvalue, widths, titleFont, titleB, titlesize, colsFont, colsB, colssize, valueFont, valuesize, valueAlign) {
    if (tvalue == null || tvalue.length < 0 || tvalue == '') {
      return
    }

    var bookmark = this.TANGER_OCX_OBJ.ActiveDocument.BookMarks(bookname)
    //初始化列表（bookmark.range为书签的位置，tvalue.length+1列表的行，title.length列表的列）
    var table = this.TANGER_OCX_OBJ.ActiveDocument.tables.add(bookmark.range, tvalue.length + 2, title.length + 2)
    //列表位置 1为居中 2为居右 3为居左
    table.Rows.Alignment = 1

    for (var i = -1; i >= -6; i--) {
      table.Borders(i).LineStyle = 1
    }

    //设置列表头的颜色和位置
    for (var i = 0; i < table.Columns.Count; i++) {
      //table.Rows(1).Cells(i+1).Shading.BackgroundPatternColorIndex = 16;
      table.range.ParagraphFormat.Alignment = 1
    }

    //设置列表的宽度 table.Rows.Count为列表的行数  table.Columns.Count为列表的列数
    for (var i = 0; i < table.Rows.Count; i++) {
      for (var j = 0; j < table.Columns.Count; j++) {
        table.Rows(i + 1).Cells(j + 1).width = widths[j]
      }
    }

    try {
      //添加标题
      for (var i = 1; i <= title.length; i++) {
        // with(table)
        // {
        table.Cell(1, i).range.Text = title[i - 1]
        //设置字体
        // with(Cell(1,i).range.Font)
        // {
        table.Cell(1, i).range.FontNameFarEast = titleFont //字体名称
        table.Cell(1, i).range.FontName = titleFont //字体名称
        table.Cell(1, i).range.FontBold = titleB //是否粗体
        table.Cell(1, i).range.Fontsize = titlesize //字的大小（15相当于小三）
        // }
        // }
      }
      //添加数据
      for (var i = 0; i < table.Rows.Count; i++) {
        for (var j = 0; j < table.Columns.Count; j++) {
          // with(table)
          // {
          if (j > 0) {
            table.Cell(i + 2, j + 1).range.ParagraphFormat.Alignment = valueAlign
          }
          table.Cell(i + 2, j + 1).range.Text = tvalue[i][j] != null ? tvalue[i][j] : ''
          //设置数据的字体
          // with(Cell(i+2,j+1).range.Font)
          // {
          table.Cell(i + 2, j + 1).range.FontNameFarEast = valueFont //字体名称
          table.Cell(i + 2, j + 1).range.FontName = valueFont //字体名称
          table.Cell(i + 2, j + 1).range.FontBold = false //是否粗体
          table.Cell(i + 2, j + 1).range.Fontsize = valuesize //字的大小（15相当于小三）
          //}
          //}
        }
      }
    } catch (err) {
      console.log(err)
      //		alert("错误：" + err.number + ":" + err.description);
    } finally {
    }
  }
}
