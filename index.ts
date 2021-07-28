
export default class Path {
  static resolve(path: string) {
    const names = Path.getNames(path)
    if (Path.isAbsolutePath(path)) {
      return Path.joinAbsolutePath(...names)
    } else {
      return Path.joinRelativePath(...names)
    }
  }

  static getNames(path: string) {
    Path.validate(path)
    const isAbs = Path.isAbsolutePath(path)
    const _names = path.replace(/\/$/, '').split('/')
    const names: string[] = []
    for (const name of _names) {
      if (name == '..') {
        if (names.length == 0 || (names.length == 1 && isAbs)) {
          throw new Error('invalid path value')
        }
        names.pop()
      } else if (name != '.') {
        names.push(name)
      }
    }
    return names
  }

  static validate(path: string) {
    if (typeof path == 'string' && path.trim().length != path.length) {
      throw new Error('path must not contain leading and trailing spaces and/or tabs')
    }
    if (!path || typeof path != 'string' || !path.trim()) {
      throw new Error('path must not be empty')
    }
    if (/\/{2,}/.test(path) || path.split('/').some(name => /^\.{3,}$/.test(name)) || /^\/\.\./.test(path)) {
      throw new Error('invalid path value')
    }
  }

  static isAbsolutePath(path: string) {
    return path.indexOf('/') == 0
  }

  private static joinAbsolutePath(...names: string[]) {
    return names.length > 1 ? names.join('/') : '/'
  }

  private static joinRelativePath(...names: string[]) {
    const path = names.join('/')
    return `./${path}`
  }

  static join(...paths: string[]) {
    const hasSep = paths.some(p => p.includes('/'))
    let names: string[] = []
    if (hasSep) {
      paths.filter(path => path && path.includes('/')).forEach(Path.validate)
      const path = paths.join('/').replace(/\/{2,}/g, '/').replace(/(.+)\/$/, '$1')
      names = Path.getNames(path)
    } else {
      names = paths
    }
    const isRoot = names.length == 1 && names[0] === ''
    const isCurrent = names.length == 0
    const path = isRoot ? '/' : (isCurrent ? './' : names.join('/'))
    Path.validate(path)
    if (Path.isAbsolutePath(path)) {
      return Path.joinAbsolutePath(...names)
    }
    return Path.joinRelativePath(...names)
  }

  static isSubPath(path: string, basePath: string) {
    const resolved = {
      path: Path.resolve(path),
      basePath: Path.resolve(basePath),
    }
    return resolved.path.length > resolved.basePath.length
      && resolved.path.indexOf(resolved.basePath) === 0
  }

  static getRelativePath(path: string, basePath: string) {
    const resolvedPath = Path.resolve(path)
    const resolvedBasePath = Path.resolve(basePath)
    if (resolvedPath.indexOf(resolvedBasePath) !== 0) {
      throw new Error('path "' + path + '" must be subpath of "' + basePath + '"')
    }
    const relativePath = resolvedPath.replace(resolvedBasePath, '')
    return Path.resolve(`./${relativePath.replace(/^\//, '')}`)
  }

  static getExtension(filename: string) {
    Path.validateFileName(filename)
    const parts = filename.split('.')
    return parts.length > 1 ?  parts.pop() as string : ''
  }

  static validateFileName(filename: string) {
    if (/\/+/g.test(filename)) {
      throw new Error('invalid filename, ' + filename)
    }
  }

  static getFileName(path: string) {
    const names = Path.getNames(path)
    return names[names.length - 1] || ''
  }

  static getBaseName(filename: string) {
    Path.validateFileName(filename)
    const parts = filename.split('.')
    return parts.length <= 1 ? filename : parts.slice(0, -1).join('.')
  }

  static getSourceDirectory(path: string, filepath: string) {
    const pathNames = Path.getNames(path)
    const fileNames = Path.getNames(filepath)
    const reversedPathNames = pathNames.slice().reverse()
    const reversedFileNames = fileNames.slice().reverse()
    if (reversedFileNames.some((name, index) => name !== reversedPathNames[index])) {
      throw new Error('invalid path of file name, path = "' + path + '", filepath = "' + filepath + '"')
    }
    pathNames.length = pathNames.length - fileNames.length
    return Path.join(...pathNames)
  }
}
