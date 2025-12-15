// PvPBoost1122 - PvP FPS Mod with HUD Indicator
// Eaglercraft 1.12.2 | EaglerForge
// F7 toggle | Bottom-left status number

let enabled = true;

function mc() {
    return ModAPI.minecraft();
}

// ================== OPTIMIZATIONS ==================

function applyPvPOptimizations() {
    const m = mc();
    if (!m || !m.gameSettings) return;

    const gs = m.gameSettings;

    gs.fancyGraphics = false;
    gs.renderDistanceChunks = 3;
    gs.enableVsync = false;
    gs.clouds = 0;
    gs.particleSetting = 2;
    gs.mipmapLevels = 0;
    gs.useVbo = false;
    gs.viewBobbing = false;
    gs.ambientOcclusion = 0;
    gs.entityShadows = false;

    gs.soundLevels["ambient"] = 0;
    gs.soundLevels["weather"] = 0;
    gs.soundLevels["hostile"] = 0;

    gs.gammaSetting = 1.5;
}

function disableMobAnimations() {
    const m = mc();
    if (!m || !m.world || !m.world.loadedEntityList) return;

    const list = m.world.loadedEntityList;

    for (let i = 0; i < list.length; i++) {
        const e = list[i];
        if (!e || (e.isPlayer && e.isPlayer())) continue;

        e.hurtTime = 0;
        e.maxHurtTime = 0;
        e.limbSwing = 0;
        e.limbSwingAmount = 0;
        e.swingProgress = 0;
        e.prevSwingProgress = 0;
    }
}

function restoreDefaults() {
    const m = mc();
    if (!m || !m.gameSettings) return;

    m.gameSettings.renderDistanceChunks = 8;
    m.gameSettings.particleSetting = 1;
    m.gameSettings.entityShadows = true;
}

// ================== HUD INDICATOR ==================

function drawStatusHUD() {
    const m = mc();
    if (!m || !m.fontRendererObj || !m.ingameGUI) return;

    const fr = m.fontRendererObj;
    const sr = m.ingameGUI.getScaledResolution();

    const text = enabled ? "1" : "0";
    const color = enabled ? 0xFFFFFF : 0x888888;

    // Bottom-left with tiny margin
    fr.drawStringWithShadow(
        text,
        2,
        sr.getScaledHeight() - 10,
        color
    );
}

// ================== EVENTS ==================

ModAPI.addEventListener("key", function(e) {
    if (e.key === "F7") {
        enabled = !enabled;
        if (enabled) applyPvPOptimizations();
        else restoreDefaults();
    }
});

ModAPI.addEventListener("render", function() {
    drawStatusHUD();
});

ModAPI.addEventListener("tick", function() {
    if (!enabled) return;
    applyPvPOptimizations();
    disableMobAnimations();
});

ModAPI.addEventListener("load", function() {
    applyPvPOptimizations();
});
