# PWA Icons

Please copy the app icons to this folder with the following names and sizes:

| Filename | Size | Source (from Android) |
|----------|------|----------------------|
| icon-72x72.png | 72x72 | mipmap-hdpi/ic_launcher.png |
| icon-96x96.png | 96x96 | mipmap-xhdpi/ic_launcher.png |
| icon-128x128.png | 128x128 | Generated |
| icon-144x144.png | 144x144 | Generated |
| icon-152x152.png | 152x152 | Generated |
| icon-192x192.png | 192x192 | mipmap-xxxhdpi/ic_launcher.png |
| icon-384x384.png | 384x384 | Generated |
| icon-512x512.png | 512x512 | Generated |

## Quick Copy Commands (Windows)

Run these commands from the project root:

```cmd
copy android\app\src\main\res\mipmap-hdpi\ic_launcher.png pwa-app\public\icons\icon-72x72.png
copy android\app\src\main\res\mipmap-xhdpi\ic_launcher.png pwa-app\public\icons\icon-96x96.png
copy android\app\src\main\res\mipmap-xxhdpi\ic_launcher.png pwa-app\public\icons\icon-144x144.png
copy android\app\src\main\res\mipmap-xxxhdpi\ic_launcher.png pwa-app\public\icons\icon-192x192.png
```

For larger icons (128, 152, 384, 512), you can:
1. Use an online PWA icon generator
2. Resize the largest available icon using an image editor
3. Use the same icon for all sizes temporarily

## Alternative: Generate All Sizes

Use a tool like:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator
