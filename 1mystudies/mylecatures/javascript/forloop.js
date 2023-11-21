// Function to add <li> items to the existing <ul>
function addListItems() {
    let myList = document.getElementsById("myList");

    for (let i = 1; i <= 30; i++) {
        let listItem = document.createElement("li");
        listItem.textContent = `Item ${i}`;
        myList.appendChild(listItem);
    }
}

// Call the function to add <li> items when the page loads
document.addEventListener("DOMContentLoaded", addListItems);
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};