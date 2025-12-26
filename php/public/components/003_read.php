<?php session_start(); ?>

<div class="bg-surface text-on-surface rounded-lg p-6 shadow-lg border border-border-color">

    <div class="flex justify-between items-center mb-4">
        <h4 id="countdown" class="m-0 text-primary text-xl font-bold">Expires in...</h4>
        <span class="material-symbols-outlined text-secondary" id="hiddenIcon" title="Encrypted & Password Protected">visibility_lock</span>
    </div>

    <form class="flex flex-col gap-4" autocomplete="off">
        
        <textarea name="text" id="klisterarea" readonly class="w-full bg-input-bg text-on-surface border border-border-color rounded-lg p-4 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-y min-h-[300px]" placeholder="Loading content..."></textarea>

        <div class="mt-4">
            <input type="button" value="Copy to Clipboard" onclick="copyToClipboard()" class="bg-primary text-on-primary border-none rounded-lg p-4 font-bold text-base cursor-pointer hover:brightness-110 active:scale-95 transition-transform w-full uppercase tracking-wider">
        </div>

    </form>

</div>