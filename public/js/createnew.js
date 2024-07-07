let encrypt = document.getElementById("encrypt");
let password = document.getElementById("pass")

encrypt.addEventListener('click', function(){
    if(encrypt.checked){
        password.style.visibility="visible";
    }else{
        password.style.visibility="hidden";
    }
})

let share = document.getElementById("sharable");
let edit = document.getElementById("edit")

share.addEventListener('click', function(){
    if(share.checked){
        edit.style.visibility="visible";
    }else{
        edit.style.visibility="hidden";
    }
})
