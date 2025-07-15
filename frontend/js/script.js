const dragDropArea = document.getElementById('drag-drop-area');
    const fileInput = document.getElementById('file-input');
    const resultDiv = document.getElementById('result');
    const customFilenameInput = document.getElementById('custom-filename');

    dragDropArea.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', () => {
      handleFiles(fileInput.files);
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dragDropArea.addEventListener(eventName, e => {
        e.preventDefault();
        e.stopPropagation();
      }, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      dragDropArea.addEventListener(eventName, () => {
        dragDropArea.classList.add('highlight');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dragDropArea.addEventListener(eventName, () => {
        dragDropArea.classList.remove('highlight');
      }, false);
    });

    dragDropArea.addEventListener('drop', e => {
      const files = e.dataTransfer.files;
      handleFiles(files);
    });

    function handleFiles(files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const formData = new FormData();
        formData.append('myfile', file);

        fetch('http://localhost:5000/api/files', {
          method: 'POST',
          body: formData
        })
          .then(response => response.json())
          .then(data => {
            console.log('Upload success:', data);
            resultDiv.innerHTML = `
              <p style="color:green;">
                File uploaded successfully:<br>
                <a href="${data.file}" target="_blank">${data.file}</a>
              </p>
            `;
          })
          .catch(err => {
            console.error('Error uploading file:', err);
            resultDiv.innerHTML = `<p style="color:red;">Upload error: ${err.message}</p>`;
          });
      }
    }