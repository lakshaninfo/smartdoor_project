with open('logger/templates/logger/includes/scripts.html', 'r', encoding='utf-8') as f:
    text = f.read()

old_block = """    function openUserModal(mode = 'login') {

        const modal = document.getElementById("user-auth-modal");

        const drop = document.getElementById("user-dropdown");

        if (drop) drop.classList.add("hidden");

        if (modal) modal.classList.remove("hidden");

        switchModalTab(mode);

    }

    function switchModalTab(mode) {

        const regTab = document.getElementById("tab-auth-register");

        const loginTab = document.getElementById("tab-auth-login");

        const btnReg = document.getElementById("btn-modal-tab-reg");

        const btnLogin = document.getElementById("btn-modal-tab-login");

        const titleEl = document.getElementById("modal-title-text");

        if (mode === 'register') {

            if (titleEl) titleEl.textContent = "New Account";

            if (regTab) regTab.classList.remove("hidden");

            if (loginTab) loginTab.classList.add("hidden");

            if (btnReg) btnReg.classList.add("active-modal-tab");

            if (btnLogin) btnLogin.classList.remove("active-modal-tab");

        } else {

            if (titleEl) titleEl.textContent = "Sign In";

            if (loginTab) loginTab.classList.remove("hidden");

            if (regTab) regTab.classList.add("hidden");

            if (btnLogin) btnLogin.classList.add("active-modal-tab");

            if (btnReg) btnReg.classList.remove("active-modal-tab");

        }

    }"""

new_block = """    function setUserModalMode(mode = 'login') {
        const tabLogin = document.getElementById("modal-tab-login") || document.getElementById("btn-modal-tab-login");
        const tabReg = document.getElementById("modal-tab-register") || document.getElementById("btn-modal-tab-reg");
        const formLogin = document.getElementById("modal-login-form") || document.getElementById("tab-auth-login");
        const formReg = document.getElementById("modal-register-form") || document.getElementById("tab-auth-register");
        const titleEl = document.getElementById("user-modal-title-text") || document.getElementById("modal-title-text");
        const errEl = document.getElementById("modal-error-msg");
        if (errEl) { errEl.textContent = ''; errEl.classList.add("hidden"); }

        if (mode === 'register') {
            if (titleEl) titleEl.textContent = "Create Account";
            if (tabLogin) tabLogin.classList.remove("active", "active-modal-tab");
            if (tabReg) tabReg.classList.add("active", "active-modal-tab");
            if (formLogin) formLogin.classList.add("hidden");
            if (formReg) formReg.classList.remove("hidden");
            const regUname = document.getElementById("modal-reg-username") || document.getElementById("reg-username");
            if (regUname) regUname.focus();
        } else {
            if (titleEl) titleEl.textContent = "Sign In";
            if (tabLogin) tabLogin.classList.add("active", "active-modal-tab");
            if (tabReg) tabReg.classList.remove("active", "active-modal-tab");
            if (formLogin) formLogin.classList.remove("hidden");
            if (formReg) formReg.classList.add("hidden");
            const loginUname = document.getElementById("modal-input-username") || document.getElementById("login-username");
            if (loginUname) loginUname.focus();
        }
        if (window.lucide && typeof lucide.createIcons === 'function') lucide.createIcons();
    }
    window.setUserModalMode = setUserModalMode;

    function switchModalTab(mode) {
        setUserModalMode(mode);
    }
    window.switchModalTab = switchModalTab;

    function openUserModal(mode = 'login') {
        const modal = document.getElementById("user-auth-modal");
        const drop = document.getElementById("user-dropdown");
        if (drop) drop.classList.add("hidden");
        if (modal) modal.classList.remove("hidden");
        setUserModalMode(mode);
    }
    window.openUserModal = openUserModal;"""

if old_block in text:
    text = text.replace(old_block, new_block, 1)
    with open('logger/templates/logger/includes/scripts.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Updated openUserModal and setUserModalMode successfully!")
else:
    print("Old block not found directly, trying normalized...")
    # Try normalized newlines
    text_norm = text.replace('\r\n', '\n')
    old_norm = old_block.replace('\r\n', '\n')
    if old_norm in text_norm:
        text_norm = text_norm.replace(old_norm, new_block.replace('\r\n', '\n'), 1)
        with open('logger/templates/logger/includes/scripts.html', 'w', encoding='utf-8') as f:
            f.write(text_norm)
        print("Updated via normalized newlines!")
    else:
        print("Could not match old_block")

