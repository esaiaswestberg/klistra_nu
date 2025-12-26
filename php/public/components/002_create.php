<?php session_start(); ?>
<div class="bg-surface text-on-surface rounded-lg p-6 shadow-lg border border-border-color">
    <div class="flex justify-between items-center mb-4">
        <h4 class="text-primary text-xl font-bold m-0">Create New Klister</h4>
        <button id="theme-toggle" class="text-on-surface hover:text-primary transition-colors cursor-pointer p-2 rounded-full hover:bg-on-surface/10" onclick="toggleTheme()" aria-label="Toggle Theme" title="Toggle Light/Dark Mode">
            <i data-lucide="sun" id="icon-sun" width="24" height="24"></i>
            <i data-lucide="moon" id="icon-moon" width="24" height="24" style="display: none;"></i>
        </button>
    </div>
    <form class="flex flex-col gap-4" autocomplete="off" onsubmit="createKlister(); return false;">
        
        <textarea name="text" class="w-full bg-input-bg text-on-surface border border-border-color rounded-lg p-4 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-y min-h-[300px]" placeholder="Paste your code or text here..." spellcheck="false"></textarea>

        <div class="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div class="sm:w-[200px] shrink-0">
                <label for="expiry" class="block text-sm text-on-surface/80 mb-2 sm:mb-0">Expiration:</label>
            </div>
            <div class="grow">
                <select name="expiry" id="expiry" class="w-full bg-input-bg text-on-surface border border-border-color rounded-lg p-4 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer" style="background-image: url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23e0e0e0%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1.25rem;">
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
