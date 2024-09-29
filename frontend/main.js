document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const fileInput = document.getElementById('audioFile');
    if (fileInput.files.length === 0) {
        alert('Please upload an audio file.');
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://127.0.0.1:8001/upload', {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        // Kontrolloni nëse përgjigjja është e suksesshme
        if (response.ok) {
            // Shkarkoni skedarin
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "decoded_audio.wav"; // Emri i skedarit të shkarkuar
            document.body.appendChild(a);
            a.click();
            a.remove();
            document.getElementById('statusMessage').textContent = 'Audio uploaded and decoded successfully!';
        } else {
            const result = await response.json();
            document.getElementById('statusMessage').textContent = 'Error: ' + result.error;
        }
    } catch (error) {
        document.getElementById('statusMessage').textContent = 'Error: ' + error.message;
    }
});
