<?php session_start(); ?>
<div class="bg-surface text-on-surface rounded-lg p-6 shadow-lg border border-border-color">
    <h4 class="text-primary mb-4 mt-0 text-xl font-bold">Create New Klister</h4>
    <form class="flex flex-col gap-4" autocomplete="off" onsubmit="createKlister(); return false;">
        
        <textarea name="text" class="w-full bg-input-bg text-on-surface border border-border-color rounded-lg p-4 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-y min-h-[300px]" placeholder="Paste your code or text here..." spellcheck="false"></textarea>

        <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div class="sm:w-[200px] shrink-0">
                <label for="expiry" class="block text-sm text-on-surface/80 mb-2 sm:mb-0">Expiration:</label>
            </div>
            <div class="grow">
                <select name="expiry" id="expiry" class="w-full bg-input-bg text-on-surface border border-border-color rounded-lg p-4 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                    <option value="1800">30 Minutes</option>
                    <option value="3600">1 Hour</option>
                    <option value="21600">6 Hours</option>
                    <option value="43200">12 Hours</option>
                    <option value="86400">1 Day</option>
                    <option value="259200">3 Days</option>
                    <option value="604800">7 Days</option>
                </select>
            </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div class="sm:w-[200px] shrink-0">
                <label for="reqPass" class="block text-sm text-on-surface/80 mb-2 sm:mb-0">Password (Optional):</label>
            </div>
            <div class="grow">
                <input type="password" id="reqPass" name="reqPass" class="w-full bg-input-bg text-on-surface border border-border-color rounded-lg p-4 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" placeholder="Enter a password to encrypt">
            </div>
        </div>

        <div class="mt-4">
            <input type="submit" value="Create Secure Klister" class="bg-primary text-on-primary border-none rounded-lg p-4 font-bold text-base cursor-pointer hover:brightness-110 active:scale-95 transition-transform w-full uppercase tracking-wider">
        </div>
        
    </form>
</div>
