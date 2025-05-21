#!/bin/bash

# Скрипт для хуков сборки и деплоя Netlify

echo "Running pre-build checks..."

# Проверка структуры проекта
if [ ! -d "./client" ]; then
  echo "Error: client directory not found!"
  exit 1
fi

# Проверка конфигурационных файлов
if [ ! -f "./netlify.toml" ]; then
  echo "Error: netlify.toml not found!"
  exit 1
fi

echo "Pre-build checks passed!"

# Подготовка .env файла (если необходимо)
if [ -f ".env.example" ] && [ ! -f ".env" ]; then
  echo "Creating .env file from example..."
  cp .env.example .env
fi

echo "Build environment prepared successfully!"
