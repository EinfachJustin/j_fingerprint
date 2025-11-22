let isScanning = false;
let scanProgress = 0;
let scanInterval = null;

window.addEventListener('message', function(event) {
    const data = event.data;
    
    switch(data.action) {
        case 'show_scan_waiting':
            showScanView();
            break;
        case 'show_report':
            showReportView(data);
            break;
        case 'hide':
            hideScanner();
            break;
    }
});

function showScanView() {
    document.getElementById('scanner-container').style.display = 'block';
    document.getElementById('scanner-view').style.display = 'flex';
    document.getElementById('report-view').style.display = 'none';
    
    setupScanning();
}

function setupScanning() {
    const fingerprintZone = document.getElementById('fingerprint-zone');
    const scanText = document.getElementById('scan-text');
    const progressBar = document.getElementById('progress-bar');
    
    // Reset
    scanProgress = 0;
    progressBar.style.width = '0%';
    scanText.textContent = 'Finger auf Scanner legen';
    fingerprintZone.classList.remove('active');
    
    // Events
    fingerprintZone.addEventListener('mousedown', startScan);
    fingerprintZone.addEventListener('mouseup', stopScan);
    fingerprintZone.addEventListener('mouseleave', stopScan);
    
    // Touch events for mobile
    fingerprintZone.addEventListener('touchstart', startScan);
    fingerprintZone.addEventListener('touchend', stopScan);
    fingerprintZone.addEventListener('touchcancel', stopScan);
}

function startScan(e) {
    e.preventDefault();
    
    if (isScanning) return;
    
    isScanning = true;
    scanProgress = 0;
    
    const fingerprintZone = document.getElementById('fingerprint-zone');
    const scanText = document.getElementById('scan-text');
    const progressBar = document.getElementById('progress-bar');
    
    fingerprintZone.classList.add('active');
    scanText.textContent = 'Finger gedrückt halten...';
    
    scanInterval = setInterval(() => {
        scanProgress += 2;
        progressBar.style.width = scanProgress + '%';
        
        if (scanProgress >= 100) {
            completeScan();
        }
    }, 50); // 2.5 Seconds to scan
}

function stopScan(e) {
    e.preventDefault();
    
    if (!isScanning) return;
    
    isScanning = false;
    
    if (scanInterval) {
        clearInterval(scanInterval);
        scanInterval = null;
    }
    
    const fingerprintZone = document.getElementById('fingerprint-zone');
    const scanText = document.getElementById('scan-text');
    const progressBar = document.getElementById('progress-bar');
    
    fingerprintZone.classList.remove('active');
    scanText.textContent = 'Finger auf Scanner legen';
    
    const fadeInterval = setInterval(() => {
        scanProgress -= 5;
        if (scanProgress <= 0) {
            scanProgress = 0;
            clearInterval(fadeInterval);
        }
        progressBar.style.width = scanProgress + '%';
    }, 50);
}

function completeScan() {
    isScanning = false;
    
    if (scanInterval) {
        clearInterval(scanInterval);
        scanInterval = null;
    }
    
    const scanText = document.getElementById('scan-text');
    scanText.textContent = 'Scan abgeschlossen!';
    
    const fingerprintZone = document.getElementById('fingerprint-zone');
    fingerprintZone.removeEventListener('mousedown', startScan);
    fingerprintZone.removeEventListener('mouseup', stopScan);
    fingerprintZone.removeEventListener('mouseleave', stopScan);
    fingerprintZone.removeEventListener('touchstart', startScan);
    fingerprintZone.removeEventListener('touchend', stopScan);
    fingerprintZone.removeEventListener('touchcancel', stopScan);
    
    setTimeout(() => {
        sendToFiveM('scanComplete', {});
    }, 500);
}

function showReportView(data) {
    document.getElementById('scanner-container').style.display = 'block';
    document.getElementById('scanner-view').style.display = 'none';
    document.getElementById('report-view').style.display = 'flex';
    
    document.getElementById('data-id').textContent = truncateText(data.id || '-', 25);
    document.getElementById('data-firstname').textContent = data.firstname || '-';
    document.getElementById('data-lastname').textContent = data.lastname || '-';
    document.getElementById('data-dob').textContent = data.dob || '-';
    document.getElementById('data-gender').textContent = data.gender === 'm' ? 'Männlich' : 'Weiblich';
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

function hideScanner() {
    document.getElementById('scanner-container').style.display = 'none';
    
    // Cleanup
    if (scanInterval) {
        clearInterval(scanInterval);
        scanInterval = null;
    }
    
    isScanning = false;
    scanProgress = 0;
    
    const fingerprintZone = document.getElementById('fingerprint-zone');
    if (fingerprintZone) {
        fingerprintZone.classList.remove('active');
    }
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    
    try {
        document.execCommand('copy');
        
        const originalText = element.textContent;
        element.textContent = '✓ Kopiert!';
        element.style.color = '#00ff88';
        
        setTimeout(() => {
            element.textContent = originalText;
            element.style.color = '#fff';
        }, 1000);
        
    } catch (err) {
        console.error('Kopieren fehlgeschlagen:', err);
        
        const originalText = element.textContent;
        element.textContent = '✗ Fehler';
        element.style.color = '#ff4444';
        
        setTimeout(() => {
            element.textContent = originalText;
            element.style.color = '#fff';
        }, 1000);
    }
    
    document.body.removeChild(tempInput);
}

function closeScanner() {
    sendToFiveM('close', {});
    hideScanner();
}

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('selectstart', function(e) {
    e.preventDefault();
});

function sendToFiveM(action, data) {
    if (typeof GetParentResourceName === 'undefined') {
        console.log('Not in FiveM environment - action:', action);
        return;
    }
    
    try {
        const resourceName = GetParentResourceName();
        if (!resourceName) {
            console.log('No resource name available');
            return;
        }
        
        fetch(`https://${resourceName}/${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(error => {
        });
        
    } catch (error) {
    }
}
