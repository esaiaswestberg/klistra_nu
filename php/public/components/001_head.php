<?php
session_start(); ?>
<?php function getRootUrl()
{
    $protocol =
        isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] === "on"
            ? "https"
            : "http";
    $host = $_SERVER["HTTP_HOST"];
    return $protocol . "://" . $host . "/";
} ?>

<div class="text-center mb-4" id="head_container_master">
<a href="/" class="inline-flex items-center justify-center gap-4 text-on-background hover:opacity-80 transition-opacity no-underline">
    <h1 class="text-3xl font-bold text-primary tracking-tighter m-0">Klistra.nu</h1>
</a>
</div>