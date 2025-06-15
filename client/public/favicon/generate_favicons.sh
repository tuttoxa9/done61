#!/bin/bash

# Убедитесь, что у вас установлен ImageMagick
# sudo apt-get install imagemagick

# Создаем временную директорию
mkdir -p temp

# Конвертируем SVG в PNG разных размеров
convert -background none -size 16x16 favicon.svg temp/favicon-16x16.png
convert -background none -size 32x32 favicon.svg temp/favicon-32x32.png
convert -background none -size 48x48 favicon.svg temp/favicon-48x48.png
convert -background none -size 128x128 favicon.svg temp/favicon-128x128.png
convert -background none -size 192x192 favicon.svg temp/favicon-192x192.png
convert -background none -size 512x512 favicon.svg temp/favicon-512x512.png

# Создаем apple-touch-icon
convert -background none -size 180x180 favicon.svg ../apple-touch-icon.png

# Создаем favicon.ico (включает размеры 16x16, 32x32, 48x48)
convert temp/favicon-16x16.png temp/favicon-32x32.png temp/favicon-48x48.png ../favicon.ico

# Копируем файлы в корневую директорию
cp temp/favicon-192x192.png ../android-chrome-192x192.png
cp temp/favicon-512x512.png ../android-chrome-512x512.png

# Очищаем временную директорию
rm -rf temp

echo "Favicons generated successfully!"
