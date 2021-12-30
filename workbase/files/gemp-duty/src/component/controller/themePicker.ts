import { ControllerBase, Watch } from 'prism-web'
const version = require('element-ui/package.json').version
const ORIGINAL_THEME = '#4A7DFF' // default color

export class ThemePicker extends ControllerBase {
    constructor(){
        super()
    }

    private chalk:string = '' //content of theme-chalk css
    private theme = ORIGINAL_THEME
    @Watch('theme') 
    async watchTheme(val,oldVal) {
        if(typeof val !== 'string') return
        const themeCluster = this.getThemeCluster(val.replace('#',''))
        const originalCluster = this.getThemeCluster(this.theme.replace('#',''))
        const getHandler =(variable, id) => {
            return ()  => {
                const originalCluster = this.getThemeCluster(ORIGINAL_THEME.replace('#',''))
                const newStyle = this.updateStyle(this[variable],originalCluster,themeCluster)
                let styleTag = document.getElementById(id)
                if(!styleTag) {
                    styleTag = document.createElement('style')
                    styleTag.setAttribute('id',id)
                    document.head.appendChild(styleTag)
                }
                styleTag.innerText = newStyle
            }
        }

        const chalkHandler = getHandler('chalk','chalk-style')
        if(!this.chalk) {
            const url = 'http://172.18.7.34:8099/upload/uploadFile/css/chalk.css'
            await this.getCSSString(url, chalkHandler, 'chalk')
        } else {
            chalkHandler()
        }

        const styles = [].slice.call(document.querySelectorAll('style')).filter(style => {
            const text = style.innerText
            return new RegExp(oldVal, 'i').test(text) && !/chalk Variables/.test(text)
        })
        styles.forEach( style => {
                const {innerText} = style
                if(typeof innerText !== 'string') return
                style.innerText = this.updateStyle(innerText, originalCluster, themeCluster)
        })
        this.$message({
            message:'换肤成功',
            type: 'success'
        })
    }


    updateStyle(style,oldCluster,newCluster) {
        let newStyle = style
        oldCluster.forEach((color, index) => {
            newStyle = newStyle.replace(new RegExp(color,'ig'), newCluster[index])
        })
        return newStyle
    }

    getCSSString(url,callback,variable) {
        const xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200) {
                this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/,'')
                callback()
            }
        }
        xhr.open("GET",url)
        xhr.send()
    }

    getThemeCluster(theme) {
        const tintColor = (color, tint) => {
            let red = parseInt(color.slice(0,2), 16)
            let green = parseInt(color.slice(2,4), 16)
            let blue = parseInt(color.slice(4,6), 16)

            if(tint == 0) {
                return [red, green,blue].join(',')
            } else {
                red += Math.round(tint * (255 - red))
                green += Math.round(tint * (255- green))
                blue += Math.round(tint * (255 - blue))

                let redTint = red.toString(16)
                let greenTint = green.toString(16)
                let blueTint = blue.toString(16)
                return `#${redTint}${greenTint}${blueTint}`
            }
        }

        const shadeColor = (color,shade) => {
            let red = parseInt(color.slice(0,2), 16)
            let green = parseInt(color.slice(2,4), 16)
            let blue = parseInt(color.slice(4,6), 16)

            red += Math.round((1 - shade) * red)
            green += Math.round((1 - shade) * green)
            blue += Math.round((1 - shade) * blue)

            let redTint = red.toString(16)
            let greenTint = green.toString(16)
            let blueTint = blue.toString(16)
            return `#${redTint}${greenTint}${blueTint}`
        }

        const clusters = [theme]
        for(let i =0;i<= 9;i++){
            clusters.push(tintColor(theme,Number(i / 10).toFixed(2)))
        }
        clusters.push(shadeColor(theme, 0.1))
        return clusters
    }
}