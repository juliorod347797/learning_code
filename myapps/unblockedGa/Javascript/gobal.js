
const Gamelist = [
    { gameName: "Home page", link: "../html/index.html" },
    { gameName: "slot Machine1 test", link: "../html/GatesterSlot.html" },
];

function addListItems() {
    let MyGameList = document.getElementById("MyGameList");
    for (let i = 0; i < Gamelist.length; i++) {
        let listItem = document.createElement("li");
        let link = document.createElement("a");

        
        link.href = Gamelist[i]["link"];

        
        link.textContent = Gamelist[i]["gameName"];

        
        link.style.textDecoration = "none"; 
        link.style.color = "#fafafa"; 
        link.style.fontFamily = "'Arial', sans-serif"; 

        
        link.addEventListener("mouseover", () => {
            link.style.textDecoration = "underline";
        });

        link.addEventListener("mouseout", () => {
            link.style.textDecoration = "none";
        });

        
        listItem.appendChild(link);

        
        MyGameList.appendChild(listItem);
    }
}

document.addEventListener("DOMContentLoaded", addListItems);

