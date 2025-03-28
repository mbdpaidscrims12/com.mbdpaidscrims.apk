const localUsername = localStorage.getItem('fire_local');

async function fetchUserData(username) {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxL1xWM5Mn7c1fj-Sm3jJMc-G3ck6pP3z6ZNvDQA60ALToWdOcG582tmAhzhK4ZeTzy/exec?username=' + username);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

async function initialize() {
    if (localUsername) {
        const userData = await fetchUserData(localUsername);
        if (userData && userData.match) {
            document.getElementById('counter').innerText = userData.password || '0';
            document.getElementById('userId').innerText = userData.id || '';
        } else {
            console.log('User not found or not authorized.');
        }
    } else {
        alert('No user data found in local storage.');
    }
}

function toggleDetails() {
    const detailsPage = document.getElementById('details-page');
    detailsPage.style.display = detailsPage.style.display === 'block' ? 'none' : 'block';
}

window.onload = initialize;

document.getElementById('counter').addEventListener('click', toggleDetails);