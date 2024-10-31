function handleCredentialResponse(response) {
    // 解码 JWT token
    const responsePayload = decodeJwtResponse(response.credential);
    
    // 更新 UI
    document.querySelector('.g_id_signin').style.display = 'none';
    document.getElementById('userProfile').style.display = 'flex';
    document.getElementById('userAvatar').src = responsePayload.picture;
    
    // 保存用户信息到 localStorage
    localStorage.setItem('userEmail', responsePayload.email);
    localStorage.setItem('userName', responsePayload.name);
    localStorage.setItem('userPicture', responsePayload.picture);
    
    console.log('用户已登录:', responsePayload.name);
}

function handleSignOut() {
    google.accounts.id.disableAutoSelect();
    
    // 清除本地存储的用户信息
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPicture');
    
    // 更新 UI
    document.querySelector('.g_id_signin').style.display = 'block';
    document.getElementById('userProfile').style.display = 'none';
    
    console.log('用户已登出');
}

function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// 检查用户是否已登录
function checkLoginStatus() {
    const userEmail = localStorage.getItem('userEmail');
    const userPicture = localStorage.getItem('userPicture');
    
    if (userEmail && userPicture) {
        document.querySelector('.g_id_signin').style.display = 'none';
        document.getElementById('userProfile').style.display = 'flex';
        document.getElementById('userAvatar').src = userPicture;
    }
}

// 页面加载完成后检查登录状态
document.addEventListener('DOMContentLoaded', checkLoginStatus); 