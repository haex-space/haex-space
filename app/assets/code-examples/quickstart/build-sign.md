```bash
# Build for production
npm run build

# Sign the extension
npx haex sign ./dist -k ./haextension/private.key

# This creates: my-extension-1.0.0.xt
```
