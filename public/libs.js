async function getLibs() {
    let theList = document.getElementById("libraries");
    const loadingString = document.getElementById("loadingString");

    let results = await (await fetch("/api/libraries")).json();
    results.forEach((res) => {
        let listItem = document.createElement("li");
        let currText = document.createTextNode(res);
        listItem.appendChild(currText);
        theList.appendChild(listItem);
    });
    loadingString.innerText = "";
}

getLibs();
