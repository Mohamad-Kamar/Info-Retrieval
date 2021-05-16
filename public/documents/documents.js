let libName = getLibName();

async function getDocs() {
    let theList = document.getElementById("documents");
    const loadingString = document.getElementById("loadingString");
    document.getElementById("DocIn").innerText += " " + libName;
    let results = await (await fetch(`/api/libraries/${libName}`)).json();
    // console.log(results);
    results.forEach((res) => {
        addItemToList(res, theList);
    });
    loadingString.innerText = "";
}

function getLibName() {
    let url = window.location.pathname;
    let libNameAndRest = url.substr(url.indexOf("/", 1) + 1, url.length);
    return libNameAndRest.substr(0, libNameAndRest.lastIndexOf("/"));
}
function addItemToList(res, theList) {
    let listItem = document.createElement("li");
    listItem.innerText = res;

    addRenameButton(listItem);
    addDeleteButton(listItem);
    listItem.classList.add("libList");
    listItem.onclick = clickedOnLibrary(res);
    theList.append(listItem);
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

function clickedOnLibrary() {
    return (e) => {
        window.location.href = `/libraries/${libName}/documents`;
    };
}

async function addCreateBtnAction() {
    let cBtn = document.getElementById("createBtn");
    cBtn.onclick = async () => {
        const newDocName = prompt("Please enter the new document name: ");
        if (newDocName == null || newDocName == "") {
            alert("Document name cannot be empty");
        } else {
            await fetch(`/api/libraries/${libName}/document/`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    docName: newDocName
                })
            });
            location.reload();
        }
    };
}
getDocs();

addCreateBtnAction();
