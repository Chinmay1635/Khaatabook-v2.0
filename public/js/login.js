let closeBtn = document.getElementById("close");

closeBtn.addEventListener("click", ()=>{
    gsap.to("#invalid",{
        scale:0,
        duration:0.2,
    });
    gsap.to("#mask",{
        scale:0,
        duration:0.2,
    });

})