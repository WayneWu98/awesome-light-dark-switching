const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    // frame: false,
    titleBarStyle: 'hidden',
  })

  mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('ACTION:CAPTURE_PAGE', () => {
  return mainWindow.webContents.capturePage()
    .then(page => page.toDataURL())
})