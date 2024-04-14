const dragDropArea = document.getElementById('drag-drop-area');

dragDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragDropArea.classList.add('dragover');
});

dragDropArea.addEventListener('dragleave', () => {
    dragDropArea.classList.remove('dragover');
});

dragDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dragDropArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    
});


const dragDropTarget = document.getElementById('drag-drop-area');


['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dragDropTarget.addEventListener(eventName, preventDefaults, false);
});


['dragenter', 'dragover'].forEach(eventName => {
    dragDropTarget.addEventListener(eventName, highlight, false);
});


['dragleave', 'drop'].forEach(eventName => {
    dragDropTarget.addEventListener(eventName, unhighlight, false);
});


dragDropTarget.addEventListener('drop', handleDrop, false);

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight() {
    dragDropTarget.classList.add('highlight');
}

function unhighlight() {
    dragDropTarget.classList.remove('highlight');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = function(event) {
            const dataURL = event.target.result;
            const fileType = file.type;
            const fileName = file.name;

            
            const fileDisplay = document.createElement('p');
            fileDisplay.textContent = `File Name: ${fileName}, File Type: ${fileType}`;
            dragDropTarget.appendChild(fileDisplay);

            
        };

        reader.readAsDataURL(file);
    }

    
    preventDefaults(e);
}

const host='http://localhost:3000'
const uploadURL=`${host}api/files`;



const uploadFile = () => {
 const file= fileInput.files[0];
 const formData= new FormData();
 formData,append('myfile',file)

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange=() => {
     if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
         console.log(xhr.response);
     }

     xhr.open('POST', uploadURL);
     xhr.send(formData)
    };
}


