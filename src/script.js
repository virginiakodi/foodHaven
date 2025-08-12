const buttonIcon = document.getElementById("button-icon");
const navBar = document.getElementById("navbar");
const asideIcon = document.getElementById("aside-icon");
const aside = document.querySelector(".aside");
const overlayCover = document.getElementById("overlayCover");

console.log(buttonIcon, navBar, asideIcon, aside, overlayCover);


///to open the aside menu
function openMenu(){
    aside.classList.add("active");
    overlayCover.classList.add("active");
}


//to close the aside menu
function closeMenu(){
    aside.classList.remove("active");
     overlayCover.classList.remove("active");
    
}


//event listeners
buttonIcon.addEventListener("click", openMenu);
asideIcon.addEventListener("click", closeMenu);
overlayCover.addEventListener("click" , closeMenu);

//close immediately on scroll
window.addEventListener("scroll", () => {
    if(aside.classList.contains("active")){
        closeMenu();
    }
});


// Optional: Close menu when clicking on nav links
const navLinks = document.querySelectorAll('.tags ul li a');
navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});



// buttonIcon.addEventListener("click", () => {
//   console.log("click");
//   aside.classList.toggle("active");
// });
// asideIcon.addEventListener("click", () => {
//   console.log("click");
//   aside.classList.toggle("active");
// });
