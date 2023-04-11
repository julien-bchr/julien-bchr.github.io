function appear(id) {
    const rectangle = document.getElementById(id);
    if (rectangle.style.visibility == "hidden") { rectangle.style.visibility = "visible"; } else { rectangle.style.visibility = "hidden" }
}