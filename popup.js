chrome.tabs.query({active: true}, function(tabs) {
  const tab = tabs[0];
  chrome.tabs.executeScript(tab.id, {
    file: "./content-script.js",
  });
});
