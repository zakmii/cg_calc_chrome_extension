document.addEventListener('DOMContentLoaded', function () {
    const fetchButton = document.getElementById('fetchBtn');
    const loadingDiv = document.getElementById('loading');
    const responseDiv = document.getElementById('response');
    const downloadButton = document.getElementById('downloadBtn');
    let savedLogs = [];

    function showLoading() {
        loadingDiv.style.display = 'flex';
        responseDiv.innerHTML = '';
    }

    function hideLoading() {
        loadingDiv.style.display = 'none';
    }

    function updateResponse(success, content) {
        savedLogs = success ? content.logs : [];
        responseDiv.innerHTML = success
            ? `
            <div class="result-container">
                <p class="cgpa"><strong>Calculated CGPA: ${content.cgpa.toFixed(2)}</strong></p>
                <div class="logs-container">
                    <h4>Logs:</h4>
                    <div class="logs-content">${content.logsHtml}</div>
                </div>
            </div>
            `
            : `<p style="color: red;">Error: ${content.error}</p>`;
    }

    function handleFetch() {
        showLoading();

        chrome.runtime.sendMessage({ action: 'fetchData' }, function (response) {
            hideLoading();

            if (response.success) {
                const logsHtml = response.logs.map(log => `<p>${log}</p>`).join('');
                const cgpa = response.cgpa;

                // Save data to Chrome storage
                chrome.storage.local.set({ cgpa, logs: response.logs }, () => {
                    console.log('Data saved to storage.');
                });

                updateResponse(true, { cgpa, logsHtml });
            } else {
                updateResponse(false, { error: response.error });
            }
        });
    }

    function loadStoredData() {
        chrome.storage.local.get(['cgpa', 'logs'], (data) => {
            if (data.cgpa && data.logs) {
                const logsHtml = data.logs.map(log => `<p>${log}</p>`).join('');
                updateResponse(true, { cgpa: data.cgpa, logsHtml });
            }
        });
    }

    loadStoredData();

    function downloadPDF() {
        if (!savedLogs) {
            alert('No logs available to download.');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text('CGPA Logs', 10, 10);

        doc.setFontSize(12);
        let y = 20;
        savedLogs.forEach(log => {
            doc.text(log, 10, y);
            y += 10;
        });

        doc.save('CGPA_Logs.pdf');
    }

    fetchButton.addEventListener('click', handleFetch);
    downloadButton.addEventListener('click', downloadPDF);
});
