<?php
//PHP SESSION
session_start();
if (!isset($_SESSION["createdPaste"])) {
    $_SESSION["createdPaste"] = "";
}

//INCLUDES
include_once "./include/guid.php";

//HTML Main Page
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description"
        content="Klistra.nu is a secure and encrypted online platform that allows you to share password protected text with peace of mind. Keep your sensitive information safe and secure with Klistra.nu.">
    <meta name="keywords"
        content="Klistra.nu, secure, encrypted, online platform, share text pastes, passwords, automatic expiry, sensitive information, safe, secure">

    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Klistra.nu</title>
    <link rel="icon" type="image/x-icon" href="/static/favicon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@40,300,0,200" />
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
    <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <script src="static/script.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style type="text/tailwindcss">
        @theme {
            --color-background: #121212;
            --color-surface: #1e1e1e;
            --color-surface-variant: #2d2d2d;
            --color-primary: #f43f5e;
            --color-primary-variant: #be123c;
            --color-secondary: #03dac6;
            --color-secondary-variant: #018786;
            --color-error: #cf6679;
            --color-success: #4ade80;
            --color-warning: #fbbf24;
            --color-info: #60a5fa;
            --color-on-background: #e0e0e0;
            --color-on-surface: #e0e0e0;
            --color-on-primary: #000000;
            --color-input-bg: #2c2c2c;
            --color-border-color: #333333;
            --color-subtle-gray: #4a4a4a;
            --font-mono: "Roboto Mono", monospace;
        }

        body {
            background-color: var(--color-background);
            color: var(--color-on-background);
        }

        @layer utilities {
            .swal-modal {
                background-color: var(--color-surface) !important;
                border: 1px solid var(--color-border-color) !important;
            }
            .swal-title {
                color: var(--color-on-surface) !important;
            }
            .swal-text {
                color: var(--color-on-surface) !important;
            }
            .swal-button {
                background-color: var(--color-primary) !important;
                color: var(--color-on-primary) !important;
            }
        }
    </style>
    </script>
</head>

<body>
    <div class="relative flex flex-col items-center min-h-screen p-4 bg-gradient-to-br from-background via-[#1a1a1a] to-background font-mono text-on-background overflow-x-hidden">
        <!-- Background Glows -->
        <div class="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
            <div class="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]"></div>
            <div class="absolute top-[30%] -right-[10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px]"></div>
            <div class="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-primary-variant/20 rounded-full blur-[110px]"></div>
        </div>

        <div class="w-full max-w-[900px] mt-6 flex flex-col gap-6">
            <div id="001_head_container"></div>
            <?php if (isset($_GET["klister"])) {
            $_SESSION["createdPaste"] = $_GET["klister"]; ?>
            <div id="003_read_container"></div>
            <?php
        } elseif (isset($_GET["page"])) {
            //PAGES
            switch ($_GET["page"]) {
                case "privacy":
                    echo '<div id="005_privacy_container"></div>';
                    break;
            }
        } else {
             ?>
            <div id="002_create_container"></div>
            <?php
        } ?>
            <div id="004_footer_container"></div>
        </div>
    </div>
</body>


</html>