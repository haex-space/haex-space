```bash
# 1. Build your extension
npm run build

# 2. Sign and package the build output. The CLI is shipped with the SDK.
npx haex sign dist -k haextension/private.key

# Produces:  my-extension-1.0.0.xt
# (.xt is the official packaged-extension extension)
```
