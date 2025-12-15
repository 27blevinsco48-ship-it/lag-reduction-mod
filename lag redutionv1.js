// PvPBoost1122 - PvP-focused FPS optimization mod
// Eaglercraft 1.12.2 - EaglerForge
// Toggle with F7

let enabled = true;

function mc() {
    return ModAPI.minecraft();
}

function applyPvPOptimizations() {
    const m = mc();
    if (!m || !m.gameSettings) return;

    const gs = m.gameSettings;

    // ==== Core FPS Settings ====
    gs.fancyGraphics = false;
    gs.renderDistanceChunks = 3;
    gs.enableVsync = false;
    gs.clouds = 0;
    gs.particleSetting = 2; // Minimal
    gs.mipmapLevels = 0;
    gs.useVbo = false;
    gs.viewBobbing = false;
    gs.ambientOcclusion = 0;
    gs.entityShadows = false;

    // ==== Remove visual clutter ====
    gs.showDebugInfo = false;
    gs.heldItemTooltips = false;

    // ==== Sound reductions ====
    gs.soundLevels["ambient"] = 0;
    gs.soundLevels["weather"] = 0;
    gs.soundLevels["hostile"] = 0;

    // ==== PvP-specific tweaks ====
    gs.gammaSetting = 1.5; // Brighter without shaders
}

function disableMobAnimations() {
    const m = mc();
    if (!m || !m.world || !m.world.loadedEntityList) return;

    const entities = m.world.loadedEntityList;

    for (let i = 0; i < entities.length; i++) {
        const e = entities[i];
        if (!e) continue;

        // Skip players
        if (e.isPlayer && e.isPlayer()) continue;

        // Remove animation states
        e.hurtTime = 0;
        e.maxHurtTime = 0;
        e.limbSwing = 0;
        e.limbSwingAmount = 0;
        e.swingProgress = 0;
        e.prevSwingProgress = 0;
        e.rotationYawHead = e.rotationYaw;
        e.prevRotationYawHead = e.rotationYaw;
    }
}

function stripEnchantmentGlint() {
    const m = mc();
    if (!m || !m.gameSettings) return;

    // Disable fast-render glint where possible
    m.gameSettings.fancyGraphics = false;
}

function restoreDefaults() {
    const m = mc();
    if (!m || !m.gameSettings) return;

    const gs = m.gameSettings;
    gs.renderDistanceChunks = 8;
    gs.particleSetting = 1;
    gs.entityShadows = true;
}

// Toggle with F7
ModAPI.addEventListener("key", function(e) {
    if (e.key === "F7") {
        enabled = !enabled;
        if (enabled) {
            applyPvPOptimizations();
            console.log("[PvPBoost1122] ENABLED");
        } else {
            restoreDefaults();
            console.log("[PvPBoost1122] DISABLED");
        }
    }
});

// Run every tick to enforce + kill animations
ModAPI.addEventListener("tick", function() {
    if (!enabled) return;
    applyPvPOptimizations();
    disableMobAnimations();
    stripEnchantmentGlint();
});

// Apply immediately on load
ModAPI.addEventListener("load", function() {
    applyPvPOptimizations();
});
