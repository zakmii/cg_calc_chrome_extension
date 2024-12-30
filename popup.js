document.addEventListener('DOMContentLoaded', function () {
    const fetchButton = document.getElementById('fetchBtn');
    const loadingDiv = document.getElementById('loading');
    const responseDiv = document.getElementById('response');

    function showLoading() {
        loadingDiv.style.display = 'flex';
        responseDiv.innerHTML = '';
    }

    function hideLoading() {
        loadingDiv.style.display = 'none';
    }

    function updateResponse(success, content) {
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
        console.log('Button clicked!');
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

    fetchButton.addEventListener('click', handleFetch);
});
