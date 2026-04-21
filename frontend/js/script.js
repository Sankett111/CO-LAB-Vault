const dragDropArea = document.getElementById('drag-drop-area');
    const fileInput = document.getElementById('file-input');
    const resultDiv = document.getElementById('result');
    const customFilenameInput = document.getElementById('custom-filename');
    const dropFilesBtn = document.getElementById('drop-files-btn');
    const closeDragDropBtn = document.getElementById('close-drag-drop');
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');

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

    // Connect Drop Files button to show drag-drop area
    dropFilesBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dragDropArea.classList.add('show');
    });

    // Close drag-drop area when clicking outside
    document.addEventListener('click', (e) => {
      if (!dragDropArea.contains(e.target) && !dropFilesBtn.contains(e.target)) {
        dragDropArea.classList.remove('show');
      }
    });

    // Close drag-drop area after successful upload
    function closeDragDropArea() {
      dragDropArea.classList.remove('show');
    }

    // Close button functionality
    closeDragDropBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering the drag-drop area click
      closeDragDropArea();
    });

    // Hamburger menu functionality
    hamburgerMenu.addEventListener('click', () => {
      hamburgerMenu.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a nav link
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerMenu.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburgerMenu.contains(e.target) && !navMenu.contains(e.target)) {
        hamburgerMenu.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });

    function handleFiles(files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const formData = new FormData();
        formData.append('myfile', file);

        fetch('/api/files', {
          method: 'POST',
          body: formData
        })
          .then(response => {
            if (!response.ok) {
              return response.json().then(errorData => {
                throw new Error(errorData.error || `HTTP ${response.status}`);
              });
            }
            return response.json();
          })
          .then(data => {
            console.log('Upload success:', data);
            if (data.error) {
              resultDiv.innerHTML = `<p style="color:red;">Upload error: ${data.error}</p>`;
            } else {
              resultDiv.innerHTML = `
                <p style="color:green;">
                  File uploaded successfully:<br>
                  <a href="${data.file}" target="_blank">${data.file}</a>
                </p>
              `;
              closeDragDropArea(); // Close the drag-drop area after successful upload
            }
          })
          .catch(err => {
            console.error('Error uploading file:', err);
            resultDiv.innerHTML = `<p style="color:red;">Upload error: ${err.message}</p>`;
          });
      }
    }