warning: in the working copy of 'style.css', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/style.css b/style.css[m
[1mindex 75034dc..e94f31f 100644[m
[1m--- a/style.css[m
[1m+++ b/style.css[m
[36m@@ -226,11 +226,34 @@[m [mh1 {[m
     background-color: #e67e22;[m
 }[m
 [m
[32m+[m[32m.btn-danger {[m
[32m+[m[32m    background-color: var(--danger-color);[m
[32m+[m[32m    color: white;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.btn-danger:hover {[m
[32m+[m[32m    background-color: #c0392b;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.btn-logout {[m
[32m+[m[32m    background-color: var(--danger-color);[m
[32m+[m[32m    color: white;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.btn-logout:hover {[m
[32m+[m[32m    background-color: #c0392b;[m
[32m+[m[32m}[m
[32m+[m
 .btn-sm {[m
     padding: 5px 10px;[m
     font-size: 0.875rem;[m
 }[m
 [m
[32m+[m[32m.btn-block {[m
[32m+[m[32m    width: 100%;[m
[32m+[m[32m    padding: 12px;[m
[32m+[m[32m}[m
[32m+[m
 .modal {[m
     display: none;[m
     position: fixed;[m
[36m@@ -291,6 +314,116 @@[m [mh1 {[m
     margin-top: 20px;[m
 }[m
 [m
[32m+[m[32m.text-center {[m
[32m+[m[32m    text-align: center;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.message {[m
[32m+[m[32m    padding: 10px;[m
[32m+[m[32m    border-radius: 4px;[m
[32m+[m[32m    margin-top: 15px;[m
[32m+[m[32m    text-align: center;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.message.success {[m
[32m+[m[32m    background-color: #d4edda;[m
[32m+[m[32m    color: #155724;[m
[32m+[m[32m    border: 1px solid #c3e6cb;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.message.error {[m
[32m+[m[32m    background-color: #f8d7da;[m
[32m+[m[32m    color: #721c24;[m
[32m+[m[32m    border: 1px solid #f5c6cb;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.user-info {[m
[32m+[m[32m    display: flex;[m
[32m+[m[32m    align-items: center;[m
[32m+[m[32m    gap: 15px;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.user-welcome {[m
[32m+[m[32m    color: white;[m
[32m+[m[32m    font-weight: 500;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.action-buttons {[m
[32m+[m[32m    display: flex;[m
[32m+[m[32m    gap: 5px;[m
[32m+[m[32m    flex-wrap: wrap;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.confirmation-modal .modal-content {[m
[32m+[m[32m    max-width: 400px;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.confirmation-actions {[m
[32m+[m[32m    display: flex;[m
[32m+[m[32m    justify-content: center;[m
[32m+[m[32m    gap: 15px;[m
[32m+[m[32m    margin-top: 20px;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.login-container {[m
[32m+[m[32m    display: flex;[m
[32m+[m[32m    justify-content: center;[m
[32m+[m[32m    align-items: center;[m
[32m+[m[32m    min-height: 100vh;[m
[32m+[m[32m    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);[m
[32m+[m[32m    padding: 20px;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.login-form {[m
[32m+[m[32m    background: white;[m
[32m+[m[32m    padding: 40px;[m
[32m+[m[32m    border-radius: 10px;[m
[32m+[m[32m    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);[m
[32m+[m[32m    width: 100%;[m
[32m+[m[32m    max-width: 400px;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.login-form h1 {[m
[32m+[m[32m    text-align: center;[m
[32m+[m[32m    color: var(--secondary-color);[m
[32m+[m[32m    margin-bottom: 10px;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.login-form h2 {[m
[32m+[m[32m    text-align: center;[m
[32m+[m[32m    color: var(--primary-color);[m
[32m+[m[32m    margin-bottom: 30px;[m
[32m+[m[32m    font-size: 1.5rem;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.user-item {[m
[32m+[m[32m    transition: background-color 0.2s ease;[m
[32m+[m[32m    padding: 10px;[m
[32m+[m[32m    border: 1px solid #eee;[m
[32m+[m[32m    margin-bottom: 10px;[m
[32m+[m[32m    border-radius: 4px;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.user-item:hover {[m
[32m+[m[32m    background-color: #f8f9fa;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.users-list {[m
[32m+[m[32m    border: 1px solid #e9ecef;[m
[32m+[m[32m    border-radius: 4px;[m
[32m+[m[32m    max-height: 300px;[m
[32m+[m[32m    overflow-y: auto;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.btn:disabled {[m
[32m+[m[32m    opacity: 0.6;[m
[32m+[m[32m    cursor: not-allowed;[m
[32m+[m[32m}[m
[32m+[m
[32m+[m[32m.btn:disabled:hover {[m
[32m+[m[32m    transform: none;[m
[32m+[m[32m}[m
[32m+[m
 @media (max-width: 768px) {[m
     .main-content {[m
         grid-template-columns: 1fr;[m
[36m@@ -304,4 +437,34 @@[m [mh1 {[m
         display: block;[m
         overflow-x: auto;[m
     }[m
[32m+[m
[32m+[m[32m     .user-info {[m
[32m+[m[32m        flex-direction: column;[m
[32m+[m[32m        gap: 10px;[m
[32m+[m[32m        align-items: flex-start;[m
[32m+[m[32m    }[m
[32m+[m[41m    [m
[32m+[m[32m    .header-content {[m
[32m+[m[32m        flex-direction: column;[m
[32m+[m[32m        gap: 15px;[m
[32m+[m[32m        align-items: flex-start;[m
[32m+[m[32m    }[m
[32m+[m[41m    [m
[32m+[m[32m    .action-buttons {[m
[32m+[m[32m        flex-direction: column;[m
[32m+[m[32m    }[m
[32m+[m[41m    [m
[32m+[m[32m    .action-buttons .btn {[m
[32m+[m[32m        width: 100%;[m
[32m+[m[32m    }[m
[32m+[m[41m    [m
[32m+[m[32m    .user-item > div {[m
[32m+[m[32m        flex-direction: column;[m
[32m+[m[32m        align-items: flex-start;[m
[32m+[m[32m        gap: 10px;[m
[32m+[m[32m    }[m
[32m+[m[41m    [m
[32m+[m[32m    .user-item > div > div:last-child {[m
[32m+[m[32m        align-self: flex-end;[m
[32m+[m[32m    }[m
 }[m
\ No newline at end of file[m
