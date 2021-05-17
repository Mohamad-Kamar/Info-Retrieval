async function getLibs() {
    let theList = document.getElementById("libraries");
    const loadingString = document.getElementById("loadingString");

    let results = await (await fetch("/api/libraries")).json();
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

async function addCreateBtnAction() {
    let cBtn = document.getElementById("createBtn");
    cBtn.onclick = async () => {
        const newDocName = prompt("Please enter the new Library name: ");
        if (newDocName == null || newDocName == "") {
            alert("Document name cannot be empty");
        } else {
            await fetch(`/api/libraries/`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    name: newDocName
                })
            });
            location.reload();
        }
    };
}
getLibs();
addCreateBtnAction();
