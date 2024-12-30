document.addEventListener('DOMContentLoaded', function() {
    const fetchButton = document.getElementById('fetchBtn');
    fetchButton.addEventListener('click', function() {
        console.log('Button clicked!');
        chrome.runtime.sendMessage({ action: 'fetchData' }, function(response) {
            const responseDiv = document.getElementById('response');
            if (response.success) {
                // Create HTML content for logs
                const logsHtml = response.logs.map(log => `<p>${log}</p>`).join('');
                
                // Display the CGPA and logs in the popup
                responseDiv.innerHTML = `
                    <div class="result-container">
                        <p class="cgpa"><strong>Calculated CGPA: ${response.cgpa.toFixed(2)}</strong></p>
                        <div class="logs-container">
                            <h4>Logs:</h4>
                            <div class="logs-content">${logsHtml}</div>
                        </div>
                    </div>
                `;
            } else {
                responseDiv.innerHTML = `<p style="color: red;">Error: ${response.error}</p>`;
            }
        });
    });
});
