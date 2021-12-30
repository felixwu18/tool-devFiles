import { Message } from 'element-ui'

(function(window){
    var TANGER_OCX_bDocOpen = false;
    var TANGER_OCX_filename;
    var TANGER_OCX_actionURL; //For auto generate form fiields
    var TANGER_OCX_OBJ; //The Control

    //以下为新增函数示例

    /**
     * 添加列表
     * 
     * @param bookname 书签的名称（列表要添加的位置）
     * @param title 数组（列表的标题）
     * @param tvalue 二维数组（列表的数据）
     * @param widths 列表列的宽度(数字类型的数组)
     */
    window.AddTableTitle = function(bookname,title,tvalue,widths,align){
    
        if(tvalue == null || tvalue.length < 0 || tvalue == ""){
            return ;
        }

        var bookmark = TANGER_OCX_OBJ.ActiveDocument.BookMarks(bookname);
        //初始化列表（bookmark.range为书签的位置，tvalue.length+1列表的行，title.length列表的列）
        var table = TANGER_OCX_OBJ.ActiveDocument.tables.add(bookmark.range,tvalue.length+1,title.length);
        //列表位置 1为居中 2为居右 3为居左
        table.Rows.Alignment = 1;

        for(var i=-1;i>=-6;i--)
        { 
            table.Borders(i).LineStyle=1;
        }

        //设置列表头的颜色和位置
        for(var i=0;i<table.Columns.Count;i++){
            //table.Rows(1).Cells(i+1).Shading.BackgroundPatternColorIndex = 16;
            //若align是空 默认居左
            if(align==null)
            {
            table.range.ParagraphFormat.Alignment=1;
            }
            
        }
            
        //设置列表的宽度 table.Rows.Count为列表的行数  table.Columns.Count为列表的列数
        for(var i=0;i<table.Rows.Count;i++){
            for(var j=0;j<table.Columns.Count;j++){
                table.Rows(i+1).Cells(j+1).width = widths[j];
            }
        }

        try
        {
            //添加标题
            for(var i=1;i<=title.length;i++){
                // with(table)
                // {
                    Cell(1,i).range.Text =  title[i-1];
                    //设置字体
                    // with(Cell(1,i).range.Font)
                    // {
                        Cell(1,i).range.Font.NameFarEast = "方正黑体_GBK";//字体名称
                        Cell(1,i).range.Font.Name = "方正黑体_GBK";//字体名称
                        Cell(1,i).range.Font.Bold = true;//是否粗体
                        Cell(1,i).range.Font.size=15;//字的大小（15相当于小三）
                    // }
                // }
            }
            //添加数据
            for(var i=0;i<table.Rows.Count;i++){
                for(var j=0;j<table.Columns.Count;j++){
                    // with(table)
                    // {
                        Cell(i+2,j+1).range.Text = tvalue[i][j];
                        //设置数据的字体
                        // with(Cell(i+2,j+1).range.Font)
                        // {
                            Cell(i+2,j+1).range.Font.NameFarEast = "方正仿宋_GBK";//字体名称
                            Cell(i+2,j+1).range.Font.Name = "方正仿宋_GBK";//字体名称
                            Cell(i+2,j+1).range.Font.Bold = false;//是否粗体
                            Cell(i+2,j+1).range.Font.size=15;//字的大小（15相当于小三）
                        // }
                    // }
                }
            }

        }
        catch(err){
            //alert("错误：" + err.number + ":" + err.description);
        }
        finally{
        }

    }
    window.AddTableTitle1 = function(bookname,title,tvalue,widths,align){
        if(tvalue == null || tvalue.length < 0 || tvalue == ""){
            return ;
        }
        
        var bookmark = TANGER_OCX_OBJ.ActiveDocument.BookMarks(bookname);
        //初始化列表（bookmark.range为书签的位置，tvalue.length+1列表的行，title.length列表的列）
        var table = TANGER_OCX_OBJ.ActiveDocument.tables.add(bookmark.range,tvalue.length+1,title.length);
        //列表位置 1为居中 2为居右 3为居左
        table.Rows.Alignment = 1;

        for(var i=-1;i>=-6;i--)
        { 
            table.Borders(i).LineStyle=1;
        }

        //设置列表头的颜色和位置
        for(var i=0;i<table.Columns.Count;i++){
            //table.Rows(1).Cells(i+1).Shading.BackgroundPatternColorIndex = 16;
            //若align是空 默认居左
            if(align==null)
            {
            table.range.ParagraphFormat.Alignment=1;
            }
            
        }
            
        //设置列表的宽度 table.Rows.Count为列表的行数  table.Columns.Count为列表的列数
        for(var i=0;i<table.Rows.Count;i++){
            for(var j=0;j<table.Columns.Count;j++){
                table.Rows(i+1).Cells(j+1).width = widths[j];
            }
        }

        try
        {
            //添加标题
            for(var i=1;i<=title.length;i++){
                var titlestr = title[i-1];
                // with(table)
                // {
                    Cell(1,i).range.Text =  titlestr;
                    //设置字体
                    // with(Cell(1,i).range.Font)
                    // {
                        /* 佛山现场代码 begin*/
                        Cell(1,i).range.Font.NameFarEast = "方正黑体_GBK";//字体名称
                        Cell(1,i).range.Font.Name = "方正黑体_GBK";//字体名称
                        Cell(1,i).range.Font.Bold = true;//是否粗体
                        Cell(1,i).range.Font.size=15;//字的大小（15相当于小三）
                        /* 佛山现场代码 end*/
                        
                        /* 基线版本代码 begin
                        
                        NameFarEast = "仿宋_GB2312";//字体名称
                        Name = "仿宋_GB2312";//字体名称
                        Bold = false;//是否粗体
                        size=16;//字的大小（15相当于小三）
                        
                        基线版本代码 end */
                    // }
                //}
            }
            //添加数据
            for(var i=0;i<table.Rows.Count;i++){
                for(var j=0;j<table.Columns.Count;j++){
                    // with(table)
                    // {
                        Cell(i+2,j+1).range.Text = tvalue[i][j];
                        //设置数据的字体
                        // with(Cell(i+2,j+1).range.Font)
                        // {
                            /* 佛山现场代码 begin*/
                            Cell(i+2,j+1).range.Font.NameFarEast = "方正仿宋_GBK";//字体名称
                            Cell(i+2,j+1).range.Font.Name = "方正仿宋_GBK";//字体名称
                            Cell(i+2,j+1).range.Font.Bold = false;//是否粗体
                            Cell(i+2,j+1).range.Font.size=15;//字的大小（15相当于小三）
                            /* 佛山现场代码 end*/
                            
                            /* 基线版本代码 begin
                        
                            NameFarEast = "仿宋_GB2312";//字体名称
                            Name = "仿宋_GB2312";//字体名称
                            Bold = false;//是否粗体
                            size=14;//字的大小（15相当于小三）
                        
                            基线版本代码 end */
                        // }
                    // }
                }
            }

        }
        catch(err){
            //alert("错误：" + err.number + ":" + err.description);
        }
        finally{
        }

    }

    /**
     * 如果列表存在 在列表最后添加一行
     * 
     * @param tableindex 那一个列表
     */
    window.AddRows = function(tableindex){
        //获取列表
        var control = TANGER_OCX_OBJ.ActiveDocument.Tables(tableindex);
        if(control){
            //添加table一行
            control.Rows.add();
        }else{
            alert("请先添加表格！");
        }
    }

    /**
     * 添加列表
     * 
     * @param bookname 书签的名称（列表要添加的位置）
     * @param title 数组（列表的标题）
     * @param tvalue 二维数组（列表的数据）
     * @param widths 列表列的宽度(数字类型的数组)
     * @param titleFont 标题字体
     * @param titleB  是否粗体
     * @param titlesize 标题字体大小
     * @param colsFont 第一列字体
     * @param colsB 第一列是否粗体
     * @param colssize 第一列字体大小
     * @param valueFont 数据字体
     * @param valuesize 数据字体大小
     * @param valueAlign 数据位置（1为居中 2为居右 3为居左）
     */
    window.AddTableTitle = function(bookname,title,tvalue,widths,titleFont,titleB,titlesize,colsFont,colsB,colssize,valueFont,valuesize,valueAlign){

        if(tvalue == null || tvalue.length < 0 || tvalue == ""){
            return ;
        }

        var bookmark = TANGER_OCX_OBJ.ActiveDocument.BookMarks(bookname);
        //初始化列表（bookmark.range为书签的位置，tvalue.length+1列表的行，title.length列表的列）
        var table = TANGER_OCX_OBJ.ActiveDocument.tables.add(bookmark.range,tvalue.length+1,title.length);
        //列表位置 1为居中 2为居右 3为居左
        table.Rows.Alignment = 1;

        for(var i=-1;i>=-6;i--)
        { 
            table.Borders(i).LineStyle=1;
        }

        //设置列表头的颜色和位置
        for(var i=0;i<table.Columns.Count;i++){
            //table.Rows(1).Cells(i+1).Shading.BackgroundPatternColorIndex = 16;
            table.range.ParagraphFormat.Alignment=1;
        }
            
        //设置列表的宽度 table.Rows.Count为列表的行数  table.Columns.Count为列表的列数
        for(var i=0;i<table.Rows.Count;i++){
            for(var j=0;j<table.Columns.Count;j++){
                table.Rows(i+1).Cells(j+1).width = widths[j];
            }
        }

        try
        {
            //添加标题
            for(var i=1;i<=title.length;i++){
                // with(table)
                // {
                    Cell(1,i).range.Text =  title[i-1];
                    //设置字体
                    // with(Cell(1,i).range.Font)
                    // {
                        Cell(1,i).range.FontNameFarEast = titleFont;//字体名称
                        Cell(1,i).range.FontName = titleFont;//字体名称
                        Cell(1,i).range.FontBold = titleB;//是否粗体
                        Cell(1,i).range.Fontsize=titlesize;//字的大小（15相当于小三）
                    //}
                //}
            }
            //添加数据
            for(var i=0;i<table.Rows.Count;i++){
                for(var j=0;j<table.Columns.Count;j++){
                    // with(table)
                    // {
                        if(j>0){
                            Cell(i+2,j+1).range.ParagraphFormat.Alignment=valueAlign;
                        }
                        Cell(i+2,j+1).range.Text = tvalue[i][j];
                        //设置数据的字体
                        // with(Cell(i+2,j+1).range.Font)
                        // {
                                if(j==0){
                                    Cell(i+2,j+1).range.Font.NameFarEast = colsFont;//字体名称
                                    Cell(i+2,j+1).range.Font.Name = colsFont;//字体名称
                                    Cell(i+2,j+1).range.Font.Bold = colsB;//是否粗体
                                    Cell(i+2,j+1).range.Font.size=colssize;//字的大小（15相当于小三）
                                }else{
                                    Cell(i+2,j+1).range.Font.NameFarEast = valueFont;//字体名称
                                    Cell(i+2,j+1).range.Font.Name = valueFont;//字体名称
                                    Cell(i+2,j+1).range.Font.Bold = false;//是否粗体
                                    Cell(i+2,j+1).range.Font.size=valuesize;//字的大小（15相当于小三）
                                }
                            
                        //}
                    //}
                }
            }

        }
        catch(err){
            //alert("错误：" + err.number + ":" + err.description);
        }
        finally{
        }

    }

    /**
     * 添加列表
     * 
     * @param tableindex 那一个列表
     * @param tvalue 二维数组（列表的数据）
     * @param colsFont 第一列字体
     * @param colsB 第一列是否粗体
     * @param colssize 第一列字体大小
     * @param valueFont 数据字体
     * @param valuesize 数据字体大小
     * @param valueAlign 数据位置（1为居中 2为居右 3为居左）
     */
    window.AddRowsforTable = function(tableindex,tvalue,colsFont,colsB,colssize,valueFont,valuesize,valueAlign){
        var table = TANGER_OCX_OBJ.ActiveDocument.Tables(tableindex);
        if(table){
            //添加table一行
            for(var i=0;i<tvalue.length;i++){
                table.Rows.add();
            }
        }else{
            alert("请先添加表格！");
        }
        try
        {
            for(var i=0;i<table.Rows.Count;i++){
                for(var j=0;j<table.Columns.Count;j++){
                    // with(table)
                    // {
                        if(j>0){
                            Cell(i+2,j+1).range.ParagraphFormat.Alignment=valueAlign;
                        }
                        Cell(i+2,j+1).range.Text = tvalue[i][j];
                        //设置数据的字体
                        // with(Cell(i+2,j+1).range.Font)
                        // {
                                if(j==0){
                                    Cell(i+2,j+1).range.Font.NameFarEast = colsFont;//字体名称
                                    Cell(i+2,j+1).range.Font.Name = colsFont;//字体名称
                                    Cell(i+2,j+1).range.Font.Bold = colsB;//是否粗体
                                    Cell(i+2,j+1).range.Font.size=colssize;//字的大小（15相当于小三）
                                }else{
                                    Cell(i+2,j+1).range.Font.NameFarEast = valueFont;//字体名称
                                    Cell(i+2,j+1).range.Font.Name = valueFont;//字体名称
                                    Cell(i+2,j+1).range.Font.Bold = false;//是否粗体
                                    Cell(i+2,j+1).range.Font.size=valuesize;//字的大小（15相当于小三）
                                }
                            
                        //}
                    //}
                }
            }
        }
        catch(err){
            //alert("错误：" + err.number + ":" + err.description);
        }
        finally{
        }
    }

    /*追加的方法*/
    window.AddRowsforTable1 = function(tableindex,tvalue,colsFont,colsB,colssize,valueFont,valuesize,valueAlign){
        var table = TANGER_OCX_OBJ.ActiveDocument.Tables(tableindex);
        var rownumber=table.Rows.Count;
        if(table){
            //添加table一行
            for(var i=0;i<tvalue.length;i++){
                table.Rows.add();
            }
        }else{
            alert("请先添加表格！");
        }
        try
        {
            
            for(var i=rownumber;i<table.Rows.Count;i++){
                for(var j=0;j<table.Columns.Count;j++){
                    // with(table)
                    // {
                        if(j>0){
                            Cell(i+2,j+1).range.ParagraphFormat.Alignment=valueAlign;
                        }
                        Cell(i+2,j+1).range.Text = tvalue[i-rownumber][j];
                        //设置数据的字体
                        // with(Cell(i+2,j+1).range.Font)
                        // {
                                if(j==0){
                                    Cell(i+2,j+1).range.Font.NameFarEast = colsFont;//字体名称
                                    Cell(i+2,j+1).range.Font.Name = colsFont;//字体名称
                                    Cell(i+2,j+1).range.Font.Bold = colsB;//是否粗体
                                    Cell(i+2,j+1).range.Font.size=colssize;//字的大小（15相当于小三）
                                }else{
                                    Cell(i+2,j+1).range.Font.NameFarEast = valueFont;//字体名称
                                    Cell(i+2,j+1).range.Font.Name = valueFont;//字体名称
                                    Cell(i+2,j+1).range.Font.Bold = false;//是否粗体
                                    Cell(i+2,j+1).range.Font.size=valuesize;//字的大小（15相当于小三）
                                }
                            
                        //}
                    //}
                }
            }
        }
        catch(err){
            //alert("错误：" + err.number + ":" + err.description);
        }
        finally{
        }
    }
    /**
     * 如果列表存在 在列表最后删除一行
     * 
     * @param tableindex 那一个列表
     */
    window.DeleteRows = function(tableindex){
        //获取列表
        var control = TANGER_OCX_OBJ.ActiveDocument.Tables(tableindex);
        if(control){
            //control.Rows.Count为列表的行数
            var i = control.Rows.Count;
            //删除最后一行
            control.Rows(i).Delete();
        }else{
            alert("请先添加表格！");
        }
    }

    /**
     * 添加书签和书签的内容
     * 
     * @param Bookmarkname 书签的名称
     * @param valuekey  要在书签位置添加的值
     */
    window.AddBookMarkC = function(Bookmarkname,valuekey){
        //获得原有书签的位置
        var v = TANGER_OCX_OBJ.GetBookmarkValue(Bookmarkname);
        //在书签的位置上添加值
        
        TANGER_OCX_OBJ.SetBookmarkValue(Bookmarkname,valuekey);
    }

    /**
     * 在模板原有书签的位置添加书签并在相应的位置添加书签的内容
     * 
     * @param bookname 新添加书签的名称
     * @param values  在新添加书签的位置加值
     * @param sbookname 原有的书签名称
     */
    window.AddBookMark = function(bookname,values,sbookname,vFont,vSize){
        //获得原有书签的位置
        var bookmark = TANGER_OCX_OBJ.ActiveDocument.BookMarks(sbookname);
        //在原有书签的位置添加一个段落
        var Parag = TANGER_OCX_OBJ.ActiveDocument.Paragraphs.add(bookmark.Range);
        //获取段落的开头的位置
        var pos = Parag.range.Start;
        //在段落的位置上开放一个范围
        var rangev = TANGER_OCX_OBJ.ActiveDocument.range(pos,pos);
        //在范围上添加书签
        TANGER_OCX_OBJ.ActiveDocument.BookMarks.add(bookname,rangev);
        //在书签上添加值
        TANGER_OCX_OBJ.SetBookmarkValue(bookname,values);

        //设置字体
        // with(TANGER_OCX_OBJ.ActiveDocument.BookMarks(bookname).Range.Font)
        // {
            if(vFont){
                TANGER_OCX_OBJ.ActiveDocument.BookMarks(bookname).Range.Font.NameFarEast = vFont;//字体名称
                TANGER_OCX_OBJ.ActiveDocument.BookMarks(bookname).Range.Font.Name = vFont;//字体名称
                TANGER_OCX_OBJ.ActiveDocument.BookMarks(bookname).Range.Font.Bold = false;//是否粗体
            }
            if(vSize){
                TANGER_OCX_OBJ.ActiveDocument.BookMarks(bookname).Range.Font.size=vSize;//字的大小（15相当于小三）
            }
        //}
    }

    /**
     * 在模板原有书签的位置添加书签（无值）
     * 
     * @param bookname 新添加书签的名称
     * @param sbookname 原有的书签名称
     */
    window.AddNullBookMark = function(bookname,sbookname){
        //获得原有书签的位置
        var bookmark = TANGER_OCX_OBJ.ActiveDocument.BookMarks(sbookname);
        //在原有书签的位置添加一个段落
        var Parag = TANGER_OCX_OBJ.ActiveDocument.Paragraphs.add(bookmark.Range);
        //获取段落的开头的位置
        var pos = Parag.range.Start;
        //在段落的位置上开放一个范围
        var rangev = TANGER_OCX_OBJ.ActiveDocument.range(pos,pos);
        //在范围上添加书签
        TANGER_OCX_OBJ.ActiveDocument.BookMarks.add(bookname,rangev);
    }

    /**
     * 从URL增加图片到文档指定位置
     * 
     * @param markname 书签的名称
     * @param url	要添加图片的地址(siteUrl+图片的路径)
     */
    window.AddPictureFromURL = function(markname,url){	
        //获得书签的位置
        var bookmark = TANGER_OCX_OBJ.ActiveDocument.BookMarks(markname);
        //在书签的位置添加图片
        TANGER_OCX_OBJ.ActiveDocument.InlineShapes.AddPicture(url, true, true, bookmark.range);

    }

    /**
     * form 表单提交
     * 
     */
    window.TANGER_OCX_doFormOnSubmit = function(){
        var form = document.forms[0];
        if (form.onsubmit)
        {
            var retVal = form.onsubmit();
            if (typeof retVal == "boolean" && retVal == false)
            return false;
        }
        return true;
    }

    /**
     * 打印文档
     */
    window.TANGER_OCX_PrintDoc1 = function(){
        try
        {
            TANGER_OCX_OBJ.printout(true);
        }
        catch(err){
            //alert("请检查word是否可以打印!");
        }
        finally{
        }
    }

    window.TANGER_OCX_PrintDoc = function(isBackground){
        var oldOption;
        try
        {
            var objOptions = TANGER_OCX_OBJ.ActiveDocument.Application.Options;
            oldOption = oldOption.PrintBackground;
            objOptions.PrintBackground = isBackground;
        }
        catch(err){};
        TANGER_OCX_OBJ.printout(false);
        try{
            var objOptions = TANGER_OCX_OBJ.ActiveDocument.Application.Options;
            objOptions.PrintBackground = oldOption;
        }catch(err){}
    }
    //打印预览
    window.TANGER_OCX_Printview = function(){
        if(!TANGER_OCX_bDocOpen) {
        alert("没有打开的文档。");
        return false;
        }
        try {   
            if(TANGER_OCX_OBJ.FilePrintPreview){
                TANGER_OCX_OBJ.ActiveDocument.PrintPreview();
                return true;
            } else {
                if(confirm("由于word的版本不是word2000或是word2003+sp版，不能打印预览！是否下载补丁")) {
                    window.open(siteUrl +"/jsp/cbms/document/files/update/Office2003SP2-KB887616-FullFile-CHS.exe");
                }
                return false;
            }
        } catch(err){
            //alert("错误：" + err.number + ":" + err.description);
            if(confirm("由于word的版本不是word2000或是word2003+sp版，不能打印预览！是否下载补丁")) {
                    window.open(siteUrl +"/jsp/cbms/document/files/update/Office2003SP2-KB887616-FullFile-CHS.exe");
                }
            return false;
        } finally{
        }
    }
    /**
     * 允许或禁止文件－>打印预览菜单
     */
    // window.TANGER_OCX_EnableFilePrintPreviewMenu = (boolvalue) => {
    //     try{
    //         if(TANGER_OCX_OBJ.EnableFileCommand(6)) {
    //             TANGER_OCX_OBJ.EnableFileCommand(6) = boolvalue;
    //         }
    //     } catch(error) {
    //         console.log(error);     
    //     }
    // }

    /**
     * 打开文档
     * 
     * @param url为文档模板的路径
     */
    window.TANGER_OCX_OpenDocByurl = function(url){	
        TANGER_OCX_OBJ = document.getElementById("TANGER_OCX");
    
        if(url != null)
        {	
        
            //根据文档路径开打文档
            //TANGER_OCX_OBJ.OpenFromURL(url);
        
            TANGER_OCX_OBJ.BeginOpenFromURL(url);
            
        }else{
            //如果文档路径不为空则打开一个新的文档
            
            TANGER_OCX_OBJ.CreateNew("Word.Document");
        }
        
    }
    window.TANGER_OCX_OpenExcelByurl = function(url){	
        TANGER_OCX_OBJ = document.getElementById("TANGER_OCX");
    
        if(url != null)
        {	
        
            //根据文档路径开打文档
            //TANGER_OCX_OBJ.OpenFromURL(url);
        
            TANGER_OCX_OBJ.OpenFromURL(url,false,"Excel.Sheet");
            
        }else{
            //如果文档路径不为空则打开一个新的文档
            
            TANGER_OCX_OBJ.CreateNew("Excel.Sheet");
        }
        
    }
    window.setSiteUrl = function(path){
        if(path != undefined && path != "") {
            siteUrl = path;
        }
    }
    window.TANGER_OCX_OpenDoc = function(documentId, file, first){
        TANGER_OCX_OBJ = document.getElementById("TANGER_OCX");
        if(documentId != "") {   
        
            //TANGER_OCX_OBJ.OpenFromURL("./readdoc.jsp?documentID=" + documentId);
            TANGER_OCX_OBJ.OpenFromURL(siteUrl + "/DownloadDoc?documentID=" + documentId);
            //TANGER_OCX_OBJ.BeginOpenFromURL("./files/01.doc");
        } else if(file != "") {
        
            TANGER_OCX_OBJ.OpenFromURL(siteUrl + "/DownloadDoc?file=" + file + "&first=" + "true");
        } else {
        
            TANGER_OCX_OBJ.CreateNew("Word.Document");
        }
    }
    window.TANGER_OCX_OnDocumentOpened = function(str, obj){
        TANGER_OCX_bDocOpen = true;		
    }

    window.TANGER_OCX_OnDocumentClosed = function(){
    TANGER_OCX_bDocOpen = false;
    }

    /**
     * 保存到服务器
     *
     * @param filename为文档的名称
     * @param plantitle如果在保存中要传的参数
     */
    window.TANGER_OCX_SaveDoc = function(filename,plantitle){
        var newwin,newdoc;

        if(!TANGER_OCX_bDocOpen)
        {
            alert("没有打开的文档。");
            return;
        }

        try
        {
            if(!TANGER_OCX_doFormOnSubmit())return; //如果存在，则执行表单的onsubmit函数。
            //调用控件的SaveToURL函数
            var retHTML = TANGER_OCX_OBJ.SaveToURL
            (
                document.forms[0].action,  //此处为uploadedit.asp
                "EDITFILE",	//文件输入域名称,可任选,不与其他<input type=file name=..>的name部分重复即可
                "plantitle="+plantitle, //可选的其他自定义数据－值对，以&分隔。如：myname=tanger&hisname=tom,一般为空
                filename, //文件名,此处从表单输入获取，也可自定义
                "myForm" //控件的智能提交功能可以允许同时提交选定的表单的所有数据.此处可使用id或者序号
            ); //此函数会读取从服务器上返回的信息并保存到返回值中。
            //打开一个新窗口显示返回数据

            if(retHTML.length<=350){
    //			newwin = window.open(siteUrl+"/jsp/iss/plan/planbrowse/Savesucceed.jsp?retHTML=true","_blank","left=200,top=200,width=400,height=300,status=0,toolbar=0,menubar=0,location=0,scrollbars=1,resizable=no",false);
            }else{
                alert("保存失败！");
    //			newwin = window.open(siteUrl+"/jsp/iss/plan/planbrowse/Saveunsucceed.jsp?retHTML=true","_blank","left=200,top=200,width=400,height=300,status=0,toolbar=0,menubar=0,location=0,scrollbars=1,resizable=no",false);
            }
        }
        catch(err){
        }
        finally{
        }
    }

    window.CopyValueToBookMark = function(inputValue,BookMarkName) {
        try {   
            //do copy
            //DEBUG
            //alert(inputname+"="+inputValue+" Bookmarkname="+BookMarkName);
            var bkmkObj = TANGER_OCX_OBJ.ActiveDocument.BookMarks(BookMarkName);    
            if(!bkmkObj)
            {
                //alert("Word 模板中不存在名称为：\""+BookMarkName+"\"的书签！");
            }
            var saverange = bkmkObj.Range;
            saverange.Text = inputValue;
            TANGER_OCX_OBJ.ActiveDocument.Bookmarks.Add(BookMarkName,saverange);
        } catch(err) {
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
    window.AddTableByDayPlan = function(bookname,title,mintitle,tvalue,widths,titleFont,titleB,titlesize,colsFont,colsB,colssize,valueFont,valuesize,valueAlign){

        if(tvalue == null || tvalue.length < 0 || tvalue == ""){
            return ;
        }

        var bookmark = TANGER_OCX_OBJ.ActiveDocument.BookMarks(bookname);
        //初始化列表（bookmark.range为书签的位置，tvalue.length+1列表的行，title.length列表的列）
        var table = TANGER_OCX_OBJ.ActiveDocument.tables.add(bookmark.range,tvalue.length+2,title.length+2);
        //列表位置 1为居中 2为居右 3为居左
        table.Rows.Alignment = 1;

        for(var i=-1;i>=-6;i--)
        { 
            table.Borders(i).LineStyle=1;
        }

        //设置列表头的颜色和位置
        for(var i=0;i<table.Columns.Count;i++){
            //table.Rows(1).Cells(i+1).Shading.BackgroundPatternColorIndex = 16;
            table.range.ParagraphFormat.Alignment=1;
        }
            
        //设置列表的宽度 table.Rows.Count为列表的行数  table.Columns.Count为列表的列数
        for(var i=0;i<table.Rows.Count;i++){
            for(var j=0;j<table.Columns.Count;j++){
                table.Rows(i+1).Cells(j+1).width = widths[j];
            }
        }

        try
        {
            //添加标题
            for(var i=1;i<=title.length;i++){
                // with(table)
                // {
                    Cell(1,i).range.Text =  title[i-1];
                    //设置字体
                    // with(Cell(1,i).range.Font)
                    // {
                        Cell(1,i).range.FontNameFarEast = titleFont;//字体名称
                        Cell(1,i).range.FontName = titleFont;//字体名称
                        Cell(1,i).range.FontBold = titleB;//是否粗体
                        Cell(1,i).range.Fontsize=titlesize;//字的大小（15相当于小三）
                    // }
               // }
            }
            //添加数据
            for(var i=0;i<table.Rows.Count;i++){
                for(var j=0;j<table.Columns.Count;j++){
                    // with(table)
                    // {
                        if(j>0){
                            Cell(i+2,j+1).range.ParagraphFormat.Alignment=valueAlign;
                        }
                        Cell(i+2,j+1).range.Text = tvalue[i][j]!=null?tvalue[i][j]:'';
                        //设置数据的字体
                        // with(Cell(i+2,j+1).range.Font)
                        // {							
                            Cell(i+2,j+1).range.FontNameFarEast = valueFont;//字体名称
                            Cell(i+2,j+1).range.FontName = valueFont;//字体名称
                            Cell(i+2,j+1).range.FontBold = false;//是否粗体
                            Cell(i+2,j+1).range.Fontsize=valuesize;//字的大小（15相当于小三）						
                        //}
                    //}
                }
            }

        }
        catch(err){
            console.log(err)
    //		alert("错误：" + err.number + ":" + err.description);
        }
        finally{
        }

    }
})(window)

