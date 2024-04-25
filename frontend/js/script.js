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
    handleDrop(files);
});

function handleDrop(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = (function(file) { 
            return function(event) {
                const dataURL = event.target.result;
                const fileType = file.type;
                const fileName = file.name;

                const formData = new FormData();
                formData.append('file', file);

                fetch('http://localhost:5000/api/files', 
                { 
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (response.ok) {
                        console.log('File uploaded successfully');
                    } else {
                        console.error('Failed to upload file');
                    }
                })
                .catch(error => {
                    console.error('Error uploading file:', error);
                });

                
        
            };
        })(file); 

        reader.readAsDataURL(file);
    }
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight() {
    dragDropArea.classList.add('highlight');
}

function unhighlight() {
    dragDropArea.classList.remove('highlight');
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dragDropArea.addEventListener(eventName, preventDefaults, false);
});

['dragenter', 'dragover'].forEach(eventName => {
    dragDropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dragDropArea.addEventListener(eventName, unhighlight, false);
});

