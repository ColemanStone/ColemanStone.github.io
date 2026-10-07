// Python consumes one queued action per frame; no synthetic mouse coordinates.
window.colorWarActions = [];
window.takeColorWarAction = () => window.colorWarActions.shift() || "";
window.updateColorWarControls = (paused, factions, message) => {
    document.querySelectorAll("[data-action]").forEach(button => { button.disabled = false; });
    const pause = document.getElementById("pause-control");
    pause.textContent = paused ? "Resume" : "Pause";
    pause.setAttribute("aria-pressed", String(paused));
    const status = `${factions} factions · ${paused ? "Paused" : "Running"}${message ? " · " + message : ""}`;
    const output = document.getElementById("game-status");
    if (output.textContent !== status) output.textContent = status;
};
document.querySelectorAll("[data-action]").forEach(button => {
    button.addEventListener("click", () => {
        const action = button.dataset.action;
        if (action === "new" && !window.confirm("Start a new world? Unsaved progress will be replaced.")) return;
        if (action === "load" && !window.confirm("Load your saved world? Unsaved progress will be replaced.")) return;
        window.colorWarActions.push(action);
    });
});
