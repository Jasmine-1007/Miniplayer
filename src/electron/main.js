import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === "development") {
    await win.loadURL("http://127.0.0.1:5173"); // Vite dev server
  } else {
    await win.loadFile(path.join(__dirname, "../index.html")); // built React app
  }
}

app.whenReady().then(createWindow);
