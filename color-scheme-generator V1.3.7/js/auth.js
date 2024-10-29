// 获取 Firebase Auth 实例和方法
const auth = window.firebaseAuth;
const GoogleAuthProvider = window.firebaseGoogleProvider;
const signInWithPopup = window.firebaseSignInWithPopup;
const signOut = window.firebaseSignOut;

// 获取 DOM 元素
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const userInfo = document.getElementById('userInfo');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');

// 处理登录
async function handleLogin() {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // 保存用户信息
        localStorage.setItem('user', JSON.stringify({
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
        }));
        
        updateUIAfterLogin(user);
    } catch (error) {
        console.error('登录错误:', error);
        alert('登录失败，请重试');
    }
}

// 处理登出
async function handleLogout() {
    try {
        await signOut(auth);
        localStorage.removeItem('user');
        updateUIAfterLogout();
    } catch (error) {
        console.error('登出错误:', error);
        alert('登出失败，请重试');
    }
}

// 更新登录后的 UI
function updateUIAfterLogin(user) {
    loginBtn.style.display = 'none';
    userInfo.style.display = 'flex';
    userAvatar.src = user.photoURL;
    userName.textContent = user.displayName;
}

// 更新登出后的 UI
function updateUIAfterLogout() {
    loginBtn.style.display = 'flex';
    userInfo.style.display = 'none';
    userAvatar.src = '';
    userName.textContent = '';
}

// 检查登录状态
function checkAuthState() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        updateUIAfterLogin(user);
    }
}

// 添加事件监听器
loginBtn.addEventListener('click', handleLogin);
logoutBtn.addEventListener('click', handleLogout);

// 页面加载时检查登录状态
document.addEventListener('DOMContentLoaded', checkAuthState);

// 监听 Firebase 认证状态变化
auth.onAuthStateChanged((user) => {
    if (user) {
        updateUIAfterLogin(user);
    } else {
        updateUIAfterLogout();
    }
}); 