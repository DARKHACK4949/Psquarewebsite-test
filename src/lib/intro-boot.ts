/**
 * Inline, pre-paint: decide whether this visit plays the intro (once per
 * session; each regional edition keeps its own key).
 */
export const introBootScript = (key: string) =>
  `(function(){try{if(!sessionStorage.getItem(${JSON.stringify(key)}))document.documentElement.setAttribute("data-intro","run")}catch(e){}})();`;
