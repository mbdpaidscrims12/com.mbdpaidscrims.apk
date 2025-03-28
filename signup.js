const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyr3LoIBlN7K5JljFSRkAKpV2uskQxRGt9pX8tM-_DGJkss_nqiGe_gUWqOUlgWg-SX/exec";

if (localStorage.getItem('fire_local')) {
    window.location.href = 'index.html';
}

function showLoadingMessage(message) {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loadingMessage';
    loadingDiv.style.position = 'fixed';
    loadingDiv.style.top = '50%';
    loadingDiv.style.left = '50%';
    loadingDiv.style.transform = 'translate(-50%, -50%)';
    loadingDiv.style.background = '#000';
    loadingDiv.style.color = '#fff';
    loadingDiv.style.padding = '10px 20px';
    loadingDiv.style.borderRadius = '10px';
    loadingDiv.style.fontSize = '18px';
    loadingDiv.innerText = message;
    document.body.appendChild(loadingDiv);
}

function hideLoadingMessage() {
    const loadingDiv = document.getElementById('loadingMessage');
    if (loadingDiv) {
        document.body.removeChild(loadingDiv);
    }
}

async function generateOtp() {
    const email = document.getElementById('email').value;

    if (!email) {
        alert('Please enter your email.');
        return;
    }

    showLoadingMessage('Sending OTP...');
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ action: "generateOtp", email }),
        });

        const result = await response.json();
        hideLoadingMessage();
        if (result.status === 'success') {
            alert('OTP sent to your email!');
            document.getElementById('otpSection').style.display = 'flex';
        } else {
            alert('Failed to send OTP. Try again.');
        }
    } catch (error) {
        hideLoadingMessage();
        console.error('Error:', error);
        alert('Failed to send OTP. Please try again later.');
    }
}

async function submitData() {
    const formData = {
        action: "verifyAndSubmit",
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        username: document.getElementById('username').value,
        mobileNumber: document.getElementById('mobileNumber').value,
        password: document.getElementById('password').value,
        gameId: document.getElementById('gameId').value,
        email: document.getElementById('email').value,
        otp: document.getElementById('otp').value,
        referCode: document.getElementById('referCode') ? document.getElementById('referCode').value : null,
    };

    if (!formData.firstName || !formData.lastName || !formData.username || !formData.mobileNumber ||
        !formData.password || !formData.gameId || !formData.email || !formData.otp) {
        alert('Please fill all required fields.');
        return;
    }

    showLoadingMessage('Signup...');
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        hideLoadingMessage();
        if (result.status === 'success') {
            alert('Signup successful!');
            localStorage.setItem('fire_local', formData.username);
            window.location.href = 'login.html';
        } else {
            alert(result.message);
        }
    } catch (error) {
        hideLoadingMessage();
        console.error('Error:', error);
        alert('Failed to submit data. Please try again later.');
    }
}