// Function to create the file/folder structure recursively
function createFileTree(node, parentElement) {
    const listItem = document.createElement('li');
    
    if (node.type === 'folder') {
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
        };
    } else if (node.type === 'file') {
        const fileLink = document.createElement('a');
        fileLink.href = `repos/${node.name}`;
        fileLink.textContent = node.name;
        fileLink.download = node.name;

        listItem.appendChild(fileLink);
    }

    parentElement.appendChild(listItem);
}

// Function to fetch and display the directory structure
function loadDirectoryStructure() {
    fetch('directory.json')
        .then(response => response.json())
        .then(data => {
            const fileList = document.getElementById('file-list');
            createFileTree(data, fileList);
        })
        .catch(error => console.error('Error loading directory structure:', error));
}

// Call the function when the page loads
window.onload = loadDirectoryStructure;
