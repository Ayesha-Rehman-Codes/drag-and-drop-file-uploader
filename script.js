const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const errorMessage = document.getElementById('errorMessage');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const previewContainer = document.getElementById('previewContainer');
const imagePreview = document.getElementById('imagePreview');
const clearBtn = document.getElementById('clearBtn');

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

document.addEventListener('DOMContentLoaded', () => {
    const savedImage = localStorage.getItem('persistedImage');
    if (savedImage) {
        imagePreview.src = savedImage;
        previewContainer.classList.remove('hidden');
    }
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drop-zone--over');
});

['dragleave', 'dragend'].forEach(type => {
    dropZone.addEventListener(type, () => {
        dropZone.classList.remove('drop-zone--over');
    });
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drop-zone--over');

    if (e.dataTransfer.files.length) {
        handleFileValidation(e.dataTransfer.files[0]);
    }
});

const browseBtn = document.getElementById('browseBtn');
if (browseBtn) {
    browseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });
}

fileInput.addEventListener('change', () => {
    if (fileInput.files.length) {
        handleFileValidation(fileInput.files[0]);
    }
});

function handleFileValidation(file) {
    errorMessage.classList.add('hidden');
    previewContainer.classList.add('hidden');

    if (!ALLOWED_TYPES.includes(file.type)) {
        showError('Invalid file type! Please upload only JPG, PNG, or GIF images.');
        return;
    }

    simulateUpload(file);
}

// Simulate Upload Process using setTimeout()
function simulateUpload(file) {
    progressContainer.classList.remove('hidden');
    let progress = 0;
    progressFill.style.width = '0%';
    progressText.textContent = '0%';

    const interval = setInterval(() => {
        progress += 10;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                progressContainer.classList.add('hidden');
                processImagePreview(file);
            }, 300);
        }
    }, 150);
}

function processImagePreview(file) {
    const reader = new FileReader();
    
    reader.readAsDataURL(file); 
    
    reader.onloadend = () => {
        const base64Image = reader.result;
      
        imagePreview.src = base64Image;
        previewContainer.classList.remove('hidden');

        localStorage.setItem('persistedImage', base64Image);
    };
}

clearBtn.addEventListener('click', () => {
    localStorage.removeItem('persistedImage');
    imagePreview.src = '';
    previewContainer.classList.add('hidden');
    fileInput.value = '';
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}