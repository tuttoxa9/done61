#!/bin/bash

# Убедимся, что есть необходимые утилиты
if ! command -v convert &> /dev/null; then
    echo "Требуется ImageMagick, устанавливаем..."
    apt-get update && apt-get install -y imagemagick
fi

# Конвертируем SVG в разные размеры PNG
convert -background none -size 16x16 logo.svg ../favicon-16x16.png
convert -background none -size 32x32 logo.svg ../favicon-32x32.png
convert -background none -size 180x180 logo.svg ../apple-touch-icon.png

# Создаем favicon.ico (комбинированный файл разных размеров)
convert -background none -size 16x16 logo.svg -size 32x32 logo.svg -size 48x48 logo.svg ../favicon.ico

echo "Все иконки созданы успешно!"
