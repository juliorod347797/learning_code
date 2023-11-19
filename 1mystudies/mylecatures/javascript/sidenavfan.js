// sidenavfan.js

function toggleNav() {
	var sidenav = document.querySelector(".sidenav");
	sidenav.style.width = sidenav.style.width === "250px" ? "" : "250px";

	if (sidenav.classList.length > 1) {
		sidenav.classList.remove("hide");
	} else {
		sidenav.classList.add("hide");
	}
	// console.log(sidenav.classList);
}
