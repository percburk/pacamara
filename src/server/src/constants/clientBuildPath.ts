import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const clientPath = '../../../client/dist'

export const CLIENT_BUILD_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  clientPath
)
