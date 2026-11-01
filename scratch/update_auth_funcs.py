import re

with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r'function\s+performRegister\s*\(\)\s*\{[\s\S]*?function\s+performLogout\s*\(\)\s*\{[\s\S]*?showSplash\(\);[\s\S]*?\}'

new_auth_code = """function performRegister() {
        const uInput = document.getElementById("modal-reg-username") || document.getElementById("reg-username");
        const eInput = document.getElementById("modal-reg-email") || document.getElementById("reg-email");
        const pInput = document.getElementById("modal-reg-password") || document.getElementById("reg-password");
        const errEl = document.getElementById("modal-error-msg");

        const uname = (uInput?.value || '').trim();
        const email = (eInput?.value || '').trim();
        const pwd = pInput?.value || '';

        if (errEl) { errEl.textContent = ''; errEl.classList.add("hidden"); }

        if (!uname || !pwd) {
            const msg = "Username and password are required";
            if (errEl) { errEl.textContent = msg; errEl.classList.remove("hidden"); }
            showToast(msg, "error");
            return;
        }

        setButtonLoading('modal-reg-btn', true);

        fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: uname, email: email, password: pwd })
        })
        .then(res => res.json())
        .then(data => {
            setButtonLoading('modal-reg-btn', false);
            if (data.status === 'success') {
                showToast(`User @${data.username} created successfully!`, 'success');
                if (uInput) uInput.value = '';
                if (eInput) eInput.value = '';
                if (pInput) pInput.value = '';
                closeUserModal();
                fetchUserInfo();
                if (typeof loadSystemUsersList === 'function') loadSystemUsersList();
                if (typeof renderAccountPage === 'function') renderAccountPage();
            } else {
                const msg = data.message || "Registration failed";
                if (errEl) { errEl.textContent = msg; errEl.classList.remove("hidden"); }
                showToast(msg, "error");
            }
        })
        .catch(() => {
            setButtonLoading('modal-reg-btn', false);
            const msg = "Connection error. Please try again.";
            if (errEl) { errEl.textContent = msg; errEl.classList.remove("hidden"); }
            showToast(msg, "error");
        });
    }
    window.performRegister = performRegister;

    function performLogin() {
        const uInput = document.getElementById("modal-input-username") || document.getElementById("login-username");
        const pInput = document.getElementById("modal-input-password") || document.getElementById("login-password");
        const errEl = document.getElementById("modal-error-msg");

        const uname = (uInput?.value || '').trim();
        const pwd = pInput?.value || '';

        if (errEl) { errEl.textContent = ''; errEl.classList.add("hidden"); }

        if (!uname || !pwd) {
            const msg = "Username and password are required";
            if (errEl) { errEl.textContent = msg; errEl.classList.remove("hidden"); }
            showToast(msg, "error");
            return;
        }

        setButtonLoading('modal-login-btn', true);

        fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: uname, password: pwd })
        })
        .then(res => res.json())
        .then(data => {
            setButtonLoading('modal-login-btn', false);
            if (data.status === 'success') {
                showToast(`Signed in as ${data.username}`, 'success');
                if (uInput) uInput.value = '';
                if (pInput) pInput.value = '';
                closeUserModal();
                fetchUserInfo();
                if (typeof loadSystemUsersList === 'function') loadSystemUsersList();
                if (typeof renderAccountPage === 'function') renderAccountPage();
                if (typeof loadDatabaseDevicesList === 'function') loadDatabaseDevicesList(true);
            } else {
                const msg = data.message || "Invalid username or password";
                if (errEl) { errEl.textContent = msg; errEl.classList.remove("hidden"); }
                showToast(msg, "error");
            }
        })
        .catch(() => {
            setButtonLoading('modal-login-btn', false);
            const msg = "Connection error. Please try again.";
            if (errEl) { errEl.textContent = msg; errEl.classList.remove("hidden"); }
            showToast(msg, "error");
        });
    }
    window.performLogin = performLogin;

    function performLogout() {
        fetch('/api/logout', { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                showToast("Signed out successfully", "info");
                const drop = document.getElementById("user-dropdown");
                if (drop) drop.classList.add("hidden");
                fetchUserInfo();
                if (typeof renderAccountPage === 'function') renderAccountPage();
                if (typeof loadSystemUsersList === 'function') loadSystemUsersList();
                if (typeof loadDatabaseDevicesList === 'function') loadDatabaseDevicesList(true);
            })
            .catch(() => showToast("Connection error", "error"));
    }
    window.performLogout = performLogout;"""

match = re.search(pattern, text)
if match:
    updated_text = text[:match.start()] + new_auth_code + text[match.end():]
    with open('logger/templates/logger/includes/scripts.html', 'w', encoding='utf-8') as f:
        f.write(updated_text)
    print("Updated performRegister, performLogin, and performLogout successfully!")
else:
    print("Could not match pattern!")

