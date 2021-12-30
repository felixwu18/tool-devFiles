// 注册全局指令
import Vue from 'vue'

Vue.directive('transferleft',{
    inserted:(el,binding,vnode) => {
        el.style.transition = 'all .5s'
        el.parentElement.style.whiteSpace = 'nowrap'
        el.nextElementSibling['style'].transition = 'all .5s'
        let slideFlag = binding.value
        if(slideFlag) {
            el.nextElementSibling['style'].transform = 'translateX(100%)'
            el.style.width = document.body.clientWidth + 'px'
        } else {
            el.nextElementSibling['style'].transform = 'translateX(0)'
            // el.style.width = '86rem';
            el.style.width = '67.5rem'
        }
    },
    update:(el,binding,vnode) => {
        let slideFlag = binding.value
        if(slideFlag) {
            el.nextElementSibling['style'].transform = 'translateX(100%)'
            el.style.width = document.body.clientWidth + 'px'
        } else {
            el.nextElementSibling['style'].transform = 'translateX(0)'
            // el.style.width = '86rem'
            el.style.width = '67.5rem'
        }
    }
}
)
Vue.directive('drag',{
  bind:(el,binding,vnode)=>{
    let op=el
    let scale=1
    el.style.cursor = "move"
    // 鼠标按下事件
    op.onmousedown=($e)=>{
      console.log("mousedown");
      $e.preventDefault();
      op.style.position = "absolute"
      let relativeX=$e.clientX-op.offsetLeft
      let relativeY=$e.clientY-op.offsetTop
      op.onmousemove=(e)=>{
            console.log("mousemove");
            e.preventDefault();
            // 图片的位置
            // 鼠标相对于图片的位置
            let opX = e.clientX - relativeX;
            let opY = e.clientY - relativeY;
            op.style.left = opX+'px';
            op.style.top=opY+'PX'
        };
        document.onmouseup = (e) => {
            op.onmousemove = null
            op.onmouseup = null
       }
    }
    let wheel=(event)=>{
      let delta=0;
      if(!event)event=window.event
      if(event.wheelDelta){
        delta=event.wheelDelta/120;
        if(window['opera']) delta=-delta;
      }else if(event.detail){
        delta=-event.detail/3
      }
      if(delta){
        if(delta>0){
          scale+= 0.1
        }else{
          if(scale > 0.3) {
            scale -= 0.1
          }
        }
        op.style.transform = "scale(" + scale + ")"
      }
    }
    if(window.addEventListener)
    window.addEventListener('DOMMouseScroll',wheel,false);
    window['onmousewheel']=document['onmousewheel']=wheel
  }
})

Vue.directive('transferleftnew',{
  inserted:(el,binding,vnode) => {
      el.style.transition = 'all .5s'
      el.parentElement.style.whiteSpace = 'nowrap'
      el.nextElementSibling['style'].transition = 'all .5s'
      let slideFlag = binding.value
      if(slideFlag) {
          el.nextElementSibling['style'].transform = 'translateX(100%)'
          el.style.width = document.body.clientWidth + 'px'
      } else {
          el.nextElementSibling['style'].transform = 'translateX(0)'
          // el.style.width = '86rem';
          el.style.width = '60rem'
      }
  },
  update:(el,binding,vnode) => {
      let slideFlag = binding.value
      if(slideFlag) {
          el.nextElementSibling['style'].transform = 'translateX(100%)'
          el.style.width = document.body.clientWidth + 'px'
      } else {
          el.nextElementSibling['style'].transform = 'translateX(0)'
          // el.style.width = '86rem'
          el.style.width = '60rem'
      }
  }
})