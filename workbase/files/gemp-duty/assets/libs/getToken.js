window.addEventListener("message",function(e){
    if(e.data.type == 'token') {
        localStorage.setItem('token',e.data.value)
    } else if(e.data.type == 'role') {
        localStorage.setItem('role',e.data.value)
    } else if(e.data.type == 'logout') {
        localStorage.removeItem('role')
    }
})