document.addEventListener('DOMContentLoaded', function() {
    const fetchButton = document.getElementById('fetchBtn');
    const loadingDiv = document.getElementById('loading');
    const responseDiv = document.getElementById('response');

    fetchButton.addEventListener('click', function() {
        console.log('Button clicked!');
        
        loadingDiv.style.display = 'flex';
        responseDiv.innerHTML = '';

        chrome.runtime.sendMessage({ action: 'fetchData' }, function(response) {
            
            loadingDiv.style.display = 'none';

            if (response.success) {
                
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
