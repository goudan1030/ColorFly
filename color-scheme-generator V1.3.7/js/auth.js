function handleCredentialResponse(response) {
    if (response.credential) {
        // 解码 JWT token
        const payload = decodeJwtResponse(response.credential);
        console.log("ID: " + payload.sub);
        console.log('Full Name: ' + payload.name);
        console.log('Email: ' + payload.email);
        console.log('Picture: ' + payload.picture);

        // 更新 UI
        document.querySelector('.g_id_signin').style.display = 'none';
        document.getElementById('userProfile').style.display = 'flex';
        document.getElementById('userAvatar').src = payload.picture;

        // 保存到 localStorage
        localStorage.setItem('userInfo', JSON.stringify({
            id: payload.sub,
            name: payload.name,
            email: payload.email,
            picture: payload.picture
        }));
    }
}

function handleSignOut() {
    google.accounts.id.disableAutoSelect();
    localStorage.removeItem('userInfo');
    
    // 更新 UI
    document.querySelector('.g_id_signin').style.display = 'block';
    document.getElementById('userProfile').style.display = 'none';
    location.reload(); // 刷新页面以重置状态
}

// JWT token 解码函数
function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// 检查登录状态
function checkLoginStatus() {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const user = JSON.parse(userInfo);
        document.querySelector('.g_id_signin').style.display = 'none';
        document.getElementById('userProfile').style.display = 'flex';
        document.getElementById('userAvatar').src = user.picture;
    }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeGoogleSignIn();
    checkLoginStatus();
});

// 错误处理
window.onerror = function(msg, url, line, col, error) {
    console.error('Error: ' + msg + '\nurl: ' + url + '\nline: ' + line);
    return false;
};

// 初始化 Google Sign-In
function initializeGoogleSignIn() {
    google.accounts.id.initialize({
        client_id: '157143550907-97rld0vu6tn7otrp54v5a6deoidkjn34.apps.googleusercontent.com',
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
    });
} 