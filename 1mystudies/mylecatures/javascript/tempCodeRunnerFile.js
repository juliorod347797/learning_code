function scrollToGameSlide(slideNumber) {
    console.log(`Scrolling to game container ${slideNumber}`);
    const targetSlide = document.getElementById(`game-container${slideNumber}`);
    console.log(targetSlide);

    if (targetSlide) {
        toggleNav(); // Close the menu
        targetSlide.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
