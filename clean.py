import json

# Your exact, verified clean configuration
clean_data = {
  "name": "raghdemo-ledger",
  "version": "1.0.0",
  "private": True,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.15",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.6.3",
    "@types/react": "^18.3.5",
    "@types/node": "^22.7.4"
  }
}

# Completely overwrite package.json with clean UTF-8 data
with open('package.json', 'w', encoding='utf-8') as f:
    json.dump(clean_data, f, indent=2)

print("package.json has been completely overwritten and successfully fixed!")
