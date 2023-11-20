document.addEventListener("DOMContentLoaded", function () {
    const menuLinks = document.querySelectorAll("#side-nav a");

    menuLinks.forEach((link, index) => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent the default behavior of anchor links
            const targetSlide = document.getElementById(`game-container${index + 1}`);

            if (targetSlide) {
                toggleNav(); // Close the menu
                // Use smooth scrolling to the target slide
                targetSlide.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

function toggleNav() {
    let sideNav = document.getElementById("side-nav");
    let overlay = document.querySelector(".overlay");

    if (sideNav.style.width === "250px") {
        sideNav.style.width = "0";
        overlay.style.display = "none";
    } else {
        sideNav.style.width = "250px";
        overlay.style.display = "block";
    }
}

// Function to scroll to a specific game slide
function scrollToGameSlide(slideNumber) {
    const targetSlide = document.getElementById(`game-container${slideNumber}`);

    if (targetSlide) {
        toggleNav(); 
        targetSlide.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
