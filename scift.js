function previewImages(event) {
    const input = event.target;
    const files = input.files;
    const previewContainer = document.getElementById('preview-container');
    previewContainer.innerHTML = '';

    if (files.length > 0) {
        const isSingleFile = files.length === 1;
        previewContainer.className = isSingleFile ? 'preview-container' : 'preview-container grid';

        const fileArray = Array.from(files);

        fileArray.forEach((file, index) => {
            if (file.size >= 5 * 1024 * 1024) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'warning',
                    title: `Any file exceeding 5MB will be skipped.`,
                    showConfirmButton: false,
                    timer: 2000
                });
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';

                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = `Image ${index + 1}`;
                img.className = isSingleFile ? 'single' : 'multiple';

                const number = document.createElement('span');
                number.className = 'number';
                number.textContent = `${index + 1}`;

                previewItem.appendChild(img);
                previewItem.appendChild(number);
                previewContainer.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        });
    }
}

async function uploadImages(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const spinner = document.getElementById('spinner');
    const inputFile = document.getElementById('file-input');
    const submitBtn = document.getElementById('submit-btn');
    spinner.style.display = 'block'; // Tampilkan spinner
    inputFile.style.display = 'none'; // Sembunyikan input file
    submitBtn.style.display = 'none'; // Sembunyikan tombol upload

    try {
        const filteredFormData = new FormData();
for (const value of formData.values()) {
    if (value instanceof File && value.size >= 5 * 1024 * 1024) {
        continue; // Skip file yang lebih dari 5MB
    }
    filteredFormData.append("file", value); // Pastikan key adalah "file"
}
const response = await fetch('https://telegraph.zorner.men/upload', {
    method: 'POST',
    body: filteredFormData
});

        let result;
        try {
            result = await response.json();
            console.log(result);
        } catch (e) {
            console.log(e);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'error',
                title: e,
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        const outputContainer = document.getElementById('output-container');
        const outputList = document.getElementById('output-list');
        const outputTextarea = document.getElementById('output-textarea');
        const copyTextareaBtn = document.getElementById('copy-textarea-btn');
        outputList.innerHTML = '';
        outputTextarea.style.display = 'none'; // Sembunyikan textarea jika menampilkan list

        if (Array.isArray(result.links) && result.links.length > 0) {
            if (result.links.length === 1) {
                result.links.forEach((link, index) => {
                    const outputItem = document.createElement('div');
                    outputItem.className = 'output-item';

                    const outputInput = document.createElement('input');
                    outputInput.type = 'text';
                    outputInput.value = link;
                    outputInput.readOnly = true;

                    const copyBtn = document.createElement('button');
                    copyBtn.className = 'copy-btn';
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    copyBtn.style.marginTop = '0px';
                    copyBtn.onclick = function () {
                        copyToClipboard(outputInput);
                    };

                    outputItem.appendChild(document.createTextNode(`URL ${index + 1} :`));
                    outputItem.appendChild(outputInput);
                    outputItem.appendChild(copyBtn);
                    outputList.appendChild(outputItem);
                });
            } else {
                const urls = result.links.map(link => `"${link}"`).join(', ');
                outputTextarea.value = urls;
                outputTextarea.style.display = 'block'; // Tampilkan textarea
                outputTextarea.style.width = '88%';
                outputTextarea.style.height = '150px';
                outputList.style.display = 'none'; // Sembunyikan list
                copyTextareaBtn.style.display = 'block'; // Tampilkan tombol copy
                copyTextareaBtn.style.marginLeft = '7%';
            }

            outputContainer.style.display = 'block';
        }else{
            console.log(error);
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'warning',
                title: "Use another image",
                showConfirmButton: false,
                timer: 3000
            });
        }
    } catch (error) {
        console.log(error);
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'warning',
            title: "Error uploading images",
            showConfirmButton: false,
            timer: 3000
        });
    } finally {
        spinner.style.display = 'none'; // Sembunyikan spinner setelah proses selesai
        const refreshBtn = document.getElementById('refresh-btn');
        refreshBtn.style.display = 'block'; // Tampilkan tombol refresh
    }
}

function copyToClipboard(outputInput) {
    outputInput.select();
    outputInput.setSelectionRange(0, 99999); // Untuk perangkat mobile

    try {
        document.execCommand('copy');
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: "URL copied to clipboard",
            showConfirmButton: false,
            timer: 2000
        });
    } catch (err) {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'warning',
            title: "Please try manually",
            showConfirmButton: false,
            timer: 2000
        });
    }
}

function copyTextarea() {
    const textarea = document.getElementById('output-textarea');
    textarea.select();
    textarea.setSelectionRange(0, 99999); // Untuk perangkat mobile

    try {
        document.execCommand('copy');
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: "URL copied to clipboard",
            showConfirmButton: false,
            timer: 2000
        });
    } catch (err) {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'warning',
            title: "Please try manually",
            showConfirmButton: false,
            timer: 2000
        });
    }
}

function refreshPage() {
    window.location.reload();
}

document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('keydown', event => {
    if (event.key === 'F12' || (event.ctrlKey && (event.key === 'u' || event.key === 'U' || event.key === 's' || event.key === 'S'))) {
        event.preventDefault();
    }
});
