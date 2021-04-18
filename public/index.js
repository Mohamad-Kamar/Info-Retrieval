async function searchAll() {
    let searchContent = document.getElementById("searchValue");
    console.log(searchContent.value);
    if (!searchContent.value) {
        alert("Please Enter a value in the search bar");
        return;
    }

    loadingString.innerText = "";
}
