async function getDocs() {
    let theList = document.getElementById("libraries");
    const loadingString = document.getElementById("loadingString");
    let url = window.location.pathname;
    let libNameAndRest = url.substr(url.indexOf("/", 1) + 1, url.length);
    // console.log(libNameAndRest);
    let libName = libNameAndRest.substr(0, libNameAndRest.lastIndexOf("/"));
    // console.log(libName);
    let results = await (await fetch(`/api/libraries/${libName}`)).json();
    console.log(results);
    results.forEach((res) => {
        let listItem = document.createElement("li");
        listItem.innerText = res;

        addRenameButton(listItem);
        addDeleteButton(listItem);
        listItem.classList.add("libList");
        listItem.onclick = clickedOnLibrary(res);
        theList.append(listItem);
    });
    loadingString.innerText = "";
}

function addRenameButton(listItem) {
    let renameButton = document.createElement("button");
    renameButton.innerText = "Rename";
    renameButton.classList.add("libListBtn");
    listItem.appendChild(renameButton);
}

function addDeleteButton(listItem) {
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.classList.add("libListBtn");
    listItem.appendChild(deleteButton);
}

function clickedOnLibrary(libName) {
    return (e) => {
        window.location.href = `/libraries/${libName}/documents`;
    };
}
getDocs();
