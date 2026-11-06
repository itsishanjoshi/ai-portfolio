/*
 * Runs in <head> before the first paint, so the page never flashes the wrong theme. Uses the visitor's
 * saved choice, otherwise their device setting, and keeps following the device until they choose.
 */
export const themeScript = `(function () {
  var root = document.documentElement;
  var saved = function () {
    try { return localStorage.getItem("theme"); } catch (e) { return null; }
  };
  var system = matchMedia("(prefers-color-scheme: dark)");
  var choice = saved();
  root.dataset.theme = choice === "light" || choice === "dark" ? choice : system.matches ? "dark" : "light";
  system.addEventListener("change", function (e) {
    if (!saved()) root.dataset.theme = e.matches ? "dark" : "light";
  });
})();`;
