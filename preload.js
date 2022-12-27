const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('APP', {
  capturePage: () => ipcRenderer.invoke('ACTION:CAPTURE_PAGE')
})