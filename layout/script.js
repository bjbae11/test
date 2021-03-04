/* design : https://www.uplabs.com/posts/messaging-app-2db4a257-7f1d-4d1c-970d-4cf6527247ff by Anastasia Marinicheva */

window.addEventListener('resize', function(){
    console.log("resize");
    if (window.getComputedStyle(document.querySelector(".discussions")).visibility === "hidden"){
        document.querySelector(".discussions").style.width = "0px";
    } else{        
        if(window.innerWidth >= 768){
            document.querySelector(".discussions").style.width = "412px";
        } else{
            document.querySelector(".discussions").style.width = "280px";
        }
    }   
});

const showDisc = document.querySelector(".show-disc-button");
const hideDisc = document.querySelector(".hide-disc-button");

showDisc.addEventListener("click", function () {
    if (window.getComputedStyle(document.querySelector(".discussions")).visibility === "hidden") {
        if(window.innerWidth >= 768){
            document.querySelector(".discussions").style.width = "412px";
        } else{
            document.querySelector(".discussions").style.width = "280px";
        }
        
        document.querySelector(".discussions").style.transition = "0.3s";
        document.querySelector(".discussions").style.visibility = "visible";
        document.querySelector(".hide-disc-button").style.visibility = "visible";
        document.querySelector(".searchbar").style.visibility = "visible";
    }
});

hideDisc.addEventListener("click", function () {
    if (window.getComputedStyle(document.querySelector(".discussions")).visibility === "visible") {
        document.querySelector(".searchbar").style.visibility = "hidden";
        document.querySelector(".discussions").style.transition = "0.3s";
        document.querySelector(".discussions").style.width = "0px";
        document.querySelector(".discussions").style.visibility = "hidden";
        document.querySelector(".hide-disc-button").style.visibility = "hidden";
    }
});