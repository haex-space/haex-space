import common from './de/common.json'
import index from './de/index.json'
import download from './de/download.json'
import privacy from './de/privacy.json'
import terms from './de/terms.json'
import marketplace from './de/marketplace/index.json'
import authRegister from './de/auth/register.json'
import authLogin from './de/auth/login.json'
import authConfirm from './de/auth/confirm.json'
import authCheckEmail from './de/auth/check-email.json'
import docsIndex from './de/docs/index.json'
import docsQuickstart from './de/docs/quickstart.json'
import docsExtensionsIndex from './de/docs/extensions/index.json'
import docsExtensionsManifest from './de/docs/extensions/manifest.json'
import docsExtensionsPermissions from './de/docs/extensions/permissions.json'
import docsExtensionsDatabase from './de/docs/extensions/database.json'
import docsExtensionsPublishing from './de/docs/extensions/publishing.json'
import docsSdkIndex from './de/docs/sdk/index.json'
import docsSdkDatabase from './de/docs/sdk/database.json'
import docsSdkStorage from './de/docs/sdk/storage.json'
import docsSdkFilesystem from './de/docs/sdk/filesystem.json'
import docsSdkWeb from './de/docs/sdk/web.json'
import developerIndex from './de/developer/index.json'
import developerSettings from './de/developer/settings.json'
import developerExtensions from './de/developer/extensions.json'
import dashboard from './de/dashboard.json'
import downloadPass from './de/downloadPass.json'

function deepMerge(...objects: Record<string, unknown>[]): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const obj of objects) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key]
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          result[key] = deepMerge(
            (result[key] as Record<string, unknown>) || {},
            value as Record<string, unknown>
          )
        } else {
          result[key] = value
        }
      }
    }
  }

  return result
}

export default defineI18nLocale(() => {
  return deepMerge(
    common,
    index,
    download,
    privacy,
    terms,
    marketplace,
    authRegister,
    authLogin,
    authConfirm,
    authCheckEmail,
    docsIndex,
    docsQuickstart,
    docsExtensionsIndex,
    docsExtensionsManifest,
    docsExtensionsPermissions,
    docsExtensionsDatabase,
    docsExtensionsPublishing,
    docsSdkIndex,
    docsSdkDatabase,
    docsSdkStorage,
    docsSdkFilesystem,
    docsSdkWeb,
    developerIndex,
    developerSettings,
    developerExtensions,
    dashboard,
    downloadPass
  )
})
