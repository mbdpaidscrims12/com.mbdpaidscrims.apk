const username = localStorage.getItem('fire_local');
if (!username) {
    alert('Please Login First!');
}

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwp94CbJQ25gQPLIX1MasY-eYgya2L-FYeLoHoVkm-eRC23Edr3bQD0ktrhiuZTXNjF/exec';

function showLoadingMessage(message) {
    const loadingDiv = document.createElement("div");
    loadingDiv.id = "loadingMessage";
    loadingDiv.style.position = "fixed";
    loadingDiv.style.top = "50%";
    loadingDiv.style.left = "50%";
    loadingDiv.style.transform = "translate(-50%, -50%)";
    loadingDiv.style.background = "#000";
    loadingDiv.style.color = "#fff";
    loadingDiv.style.padding = "10px 20px";
    loadingDiv.style.borderRadius = "10px";
    loadingDiv.style.fontSize = "18px";
    loadingDiv.innerText = message;
    document.body.appendChild(loadingDiv);
}

function hideLoadingMessage() {
    const loadingDiv = document.getElementById("loadingMessage");
    if (loadingDiv) {
        document.body.removeChild(loadingDiv);
    }
}

function showQR() {
    const amount = document.getElementById('amount').value.trim();
    
    if (!amount || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    if (!username) {
        alert('User not logged in!');
        return;
    }

    const upiId = '9122506874@omni';
    const upiLink = `upi://pay?pa=${upiId}&am=${amount}&cu=INR`;
    
    const qr = qrcode(0, 'M');
    qr.addData(upiLink);
    qr.make();
    document.getElementById('qrcode').innerHTML = qr.createImgTag(5);
    
    document.getElementById('amountPage').style.display = 'none';
    document.getElementById('qrPage').style.display = 'flex';

    sendTransactionEmail(amount);
}

async function sendTransactionEmail(amount) {
    try {
        const timestamp = new Date().toLocaleString();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('amount', amount);
        formData.append('timestamp', timestamp);
        formData.append('sheet', 'add_money');

        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData
        });

        const result = await response.text();

        if (!result.includes('success')) {
            throw new Error('Failed to send transaction email');
        }
    } catch (error) {
        console.error('Error sending transaction email:', error);
    }
}

function showUpload() {
    document.getElementById('qrPage').style.display = 'none';
    document.getElementById('uploadPage').style.display = 'flex';
}

function previewImage(event) {
    const preview = document.getElementById('preview');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function() {
        preview.src = reader.result;
        preview.style.display = 'none';
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}

async function uploadToImgur(file) {
    showLoadingMessage("Uploading image...");
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
            'Authorization': 'Client-ID ef7a1b1cd6ae260'
        },
        body: formData
    });

    hideLoadingMessage();
    const data = await response.json();
    return data.data.link;
}

async function submitForm() {
    const amount = document.getElementById('amount').value;
    const screenshot = document.getElementById('screenshot').files[0];

    if (!screenshot) {
        alert('Please upload a screenshot');
        return;
    }

    try {
        showLoadingMessage("Uploading image..."); // Keeps the "Uploading image..." loader
        const imgurLink = await uploadToImgur(screenshot);

        const formData = new FormData();
        formData.append('username', username);
        formData.append('amount', amount);
        formData.append('imageUrl', imgurLink);
        formData.append('sheet', 'add_money');

        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData
        });

        hideLoadingMessage();
        const result = await response.text();

        if (result.includes('success')) {
            alert('Payment details submitted successfully!');
            document.getElementById('amount').value = '';
            document.getElementById('screenshot').value = '';
            document.getElementById('preview').style.display = 'none';
            document.getElementById('uploadPage').style.display = 'none';
            document.getElementById('amountPage').style.display = 'block';
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        hideLoadingMessage();
        alert('Error submitting form: ' + error.message);
        console.error(error);
    }
}
