# CGPA Calculator Chrome Extension

This Chrome Extension calculates the CGPA of a student by fetching data from the ERP portal after logging in.

## Features
- Fetches level and course data from the ERP portal.
- Calculates SGPA for each term and CGPA across all terms.
- Displays the results in the popup UI.

## Prerequisites
- **Google Chrome**: Ensure you have the Chrome browser installed.
- **ERP Portal Credentials**: You need valid credentials to log in to the ERP portal.

## Installation Steps

### 1. Clone the Repository

```bash
# Clone the repository
$ git clone https://github.com/zakmii/cg_calc_chrome_extension

# Navigate to the cloned directory
$ cd cg_calc_chrome_extension
```

### 2. Load Extension in Developer Mode

1. Open Chrome and go to the Extensions page:
   - Enter `chrome://extensions/` in the address bar.

2. Enable **Developer Mode**:
   - Toggle the switch at the top-right corner.

3. Load the unpacked extension:
   - Click on **Load unpacked**.
   - Select the cloned repository folder where the `manifest.json` file is located.

### 3. Usage Instructions

1. **Login to the ERP Portal**:
   - Navigate to the ERP portal and log in with your credentials.
   - Navigate to My Course List.

2. **Use the Extension**:
   - Click on the extension icon in the toolbar.
   - Press the "Fetch Data" button to fetch and calculate CGPA.
   - View SGPA and CGPA results displayed in the extension popup.

## File Structure

```
.
├── manifest.json      # Chrome extension manifest file
├── background.js      # Background script handling data fetching
├── cgpa.js            # Script for CGPA calculation logic
├── popup.html         # Popup UI
├── popup.js           # Script for popup interaction
├── styles.css         # Styles for the popup UI
├── README.md          # Documentation
```

## License
This project is open-source and available under the [MIT License](LICENSE).

