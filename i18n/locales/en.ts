import common from './en/common.json'
import index from './en/index.json'
import download from './en/download.json'
import privacy from './en/privacy.json'
import terms from './en/terms.json'
import marketplace from './en/marketplace/index.json'
import authRegister from './en/auth/register.json'
import authLogin from './en/auth/login.json'
import authConfirm from './en/auth/confirm.json'
import authCheckEmail from './en/auth/check-email.json'
import docsIndex from './en/docs/index.json'
import docsQuickstart from './en/docs/quickstart.json'
import docsExtensionsIndex from './en/docs/extensions/index.json'
import docsExtensionsManifest from './en/docs/extensions/manifest.json'
import docsExtensionsPermissions from './en/docs/extensions/permissions.json'
import docsExtensionsDatabase from './en/docs/extensions/database.json'
import docsExtensionsPublishing from './en/docs/extensions/publishing.json'
import docsSdkIndex from './en/docs/sdk/index.json'
import docsSdkDatabase from './en/docs/sdk/database.json'
import docsSdkStorage from './en/docs/sdk/storage.json'
import docsSdkFilesystem from './en/docs/sdk/filesystem.json'
import docsSdkWeb from './en/docs/sdk/web.json'
import developerIndex from './en/developer/index.json'
import developerSettings from './en/developer/settings.json'
import developerExtensions from './en/developer/extensions.json'
import dashboard from './en/dashboard.json'
import downloadPass from './en/downloadPass.json'

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
