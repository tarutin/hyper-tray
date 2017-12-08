const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const nativeImage = electron.nativeImage
const Tray = electron.Tray
const Menu = electron.Menu
const system = electron.systemPreferences
const AutoLaunch = require('auto-launch')

var launch, isLaunch, trayMenu

exports.onApp = (app) => {
    if(process.platform == 'darwin') {
        isLaunch = app.getLoginItemSettings().openAtLogin ? true : false
        app.dock.hide()
        tray()
        launch()
    }
}

function tray() {
    trayMenu = Menu.buildFromTemplate([
        {label: 'Open at Login', type: 'checkbox', checked: isLaunch, click: launchToggle},
        {type: "separator"},
        {label: 'Quit', role: "quit"}
    ])
    var image = nativeImage.createFromPath(__dirname + (system.isDarkMode() ? '/static/tray.png' : '/static/tray-black.png'))
    image.setTemplateImage(true)

    var tray = new Tray(image)

    tray.on('click', () => {
        if(app.getWindows().size === 0) {
            app.createWindow()
        }
        else {
            app.getLastFocusedWindow().focus()
        }
    })

    tray.on('right-click', () => {
        tray.popUpContextMenu(trayMenu)
    })

    tray.setToolTip('Hyper')
}

function launch() {
    let appPath = app.getPath('exe').replace(/\.app\/Content.*/, '.app')
    launch = new AutoLaunch({ name:'Hyper', path:appPath, isHidden:true })
}


function launchToggle() {
    launch.isEnabled().then(enabled => {
        if(!enabled) {
            launch.enable()
            trayMenu.items[0].checked = true
        }
        else {
            launch.disable()
            trayMenu.items[0].checked = false
        }
    })
}
