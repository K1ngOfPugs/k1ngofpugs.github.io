// Function to create the file/folder structure recursively
function mainFileTree(node, parentElement) {

    for (let i = 0; i < node.length; i++) {
        const listItem = document.createElement('li');
        let ndata = node[i];

        if (ndata.type === 'folder') {
            const folderName = document.createElement('span');
            folderName.textContent = ndata.name;
            folderName.classList.add('folder-name');

            listItem.appendChild(folderName);
        
            const subList = document.createElement('ul');
            subList.classList.add('nested');
            ndata.children.forEach(child => {
                mainFileTree([child], subList); // Corrected to call mainFileTree instead of createFileTree
            });

            listItem.appendChild(subList);

            folderName.onclick = function() {
                subList.classList.toggle('active');
            }
        } else if (ndata.type === 'file') {
            const fileLink = document.createElement('a');
            fileLink.href = `repos/${ndata.name}`;
            fileLink.textContent = ndata.name;
            fileLink.download = ndata.name;

            listItem.appendChild(fileLink);
        } else {
            console.log("Invalid type: " + ndata.type);
        }

        parentElement.appendChild(listItem);
    }   
}

function createFileTree(node, parentElement) {
    listItem = document.createElement('li');

    if (node.type === 'folder') {
        listItem = document.createElement('li');
        const folderName = document.createElement('span');
        folderName.textContent = node.name;
        folderName.classList.add('folder-name');

        listItem.appendChild(folderName);
        
        const subList = document.createElement('ul');
        subList.classList.add('nested');
        node.children.forEach(child => {
            createFileTree(child, subList);
        });
            listItem.appendChild(subList);
            folderName.onclick = function() {
            subList.classList.toggle('active');
        }
    } else if (node.type === 'file') {
        listItem = document.createElement('li');
        console.log("File: " + node.name);
        const fileLink = document.createElement('a');
        fileLink.href = `repos/${node.name}`;
        fileLink.textContent = node.name;
        fileLink.download = node.name;
            listItem.appendChild(fileLink);
    } else {
        console.log("Invalid type: " + node.type);
    }

    parentElement.appendChild(listItem);
}

// Function to fetch and display the directory structure
function loadDirectoryStructure() {
    fetch('directory.json')
        .then(response => response.json())
        .then(data => {
            const fileList = document.getElementById('file-list');
            mainFileTree(data, fileList);
            console.log(data);
        })
        .catch(error => console.error('Error loading directory structure:', error));
}

// Call the function when the page loads
window.onload = loadDirectoryStructure;