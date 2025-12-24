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

<div class="head_container_master" id="head_container_master">
<a href="/">
    <img src="/static/favicon.png" alt="Logo">
    <h1>Low-Stack Klistra</h1>
</a>
</div>