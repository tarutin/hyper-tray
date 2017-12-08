const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const nativeImage = electron.nativeImage
const Tray = electron.Tray
const Menu = electron.Menu
const system = electron.systemPreferences
const AutoLaunch = require('auto-launch')
const globalShortcut = electron.globalShortcut

var launch, trayMenu

exports.onApp = (app) => {
    if(process.platform == 'darwin') {
        app.dock.hide()
        tray()
        launch()

        globalShortcut.register('CommandOrControl+H', () => {
            app.getWindows().forEach(_win => {
                _win.hide()
            })
        })
    }
}

exports.onWindow = (win) => {

}

function tray() {
    var image = nativeImage.createFromPath(__dirname + (system.isDarkMode() ? '/static/tray.png' : '/static/tray-black.png'))
    image.setTemplateImage(true)
    var tray = new Tray(image)


    trayMenu = Menu.buildFromTemplate([
        {label: 'Open at Login', type: 'checkbox', checked: (app.getLoginItemSettings().openAtLogin ? true : false), click: launchToggle},
        {type: "separator"},
        {label: 'Quit', role: "quit"}
    ])

    tray.on('click', () => {
        if(app.getWindows().size === 0) {
            app.createWindow()
        }
        else {
            app.getLastFocusedWindow().focus()
            app.getWindows().forEach(_win => {
                _win.show()
            })
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
        if(!enabled) launch.enable()
        else launch.disable()
    })
}
