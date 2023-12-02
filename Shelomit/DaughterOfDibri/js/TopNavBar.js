const navbar = document.getElementById("navbar");
const showNav = () => {
    handleScroll();
    navbar.classList.remove("hidden");
}

const hideNav = () => {
    if (window.scrollY <= 50){
        handleScroll();
    }
    else 
    navbar.classList.add("hidden");
} 

const handleScroll = () => {
    if (window.scrollY <= 50) {
        navbar.classList.remove("hidden");
    } 
    else {
        navbar.classList.add("hidden");
    }
};

// Event listener for the 'DOMContentLoaded' event
document.addEventListener("DOMContentLoaded", function() {
    // Initial call to handleScroll when the HTML first loads
    handleScroll();
});

// Event listener for the 'scroll' event
window.addEventListener("scroll", handleScroll);

