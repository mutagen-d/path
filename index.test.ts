import Path from './index'

describe('Path', () => {
  test('resolve valid absolute path', () => {
    const resolve = (input: string, output: string) => {
      expect(Path.resolve(input)).toEqual(output)
    }
    resolve('/path/../to/some/directory/', '/to/some/directory')
    resolve('/././path/to', '/path/to')
    resolve('/././path/to/../', '/path')
    resolve('/path/../', '/')
    resolve('/path/..', '/')
    resolve('/', '/')
  })
  test('resolve valid relative path', () => {
    const resolve = (input: string, output: string) => {
      expect(Path.resolve(input)).toEqual(output)
    }
    resolve('path/../', './')
    resolve('path/..', './')
    resolve('./path/..', './')
    resolve('path', './path')
    resolve('././path/to/file/..', './path/to')
    resolve('./', './')
  })

  test('resolve invalid path', () => {
    const resolve = (input: string) => {
      try {
        Path.resolve(input)
      } catch (e) {
        expect(e instanceof Error).toBe(true)
      }
    }

    const paths = [
      'path/../../',
      '/path/.././../',
      'path/..././',
      '//path/to/file',
      './/path/to/file',
      ' /path/to/file ',
    ]
    expect.assertions(paths.length)
    for (const path of paths) {
      resolve(path)
    }
  })

  test('get names of path', () => {
    const getNames = (path: string, expectedNames: string[]) => {
      expect(Path.getNames(path)).toEqual(expectedNames)
    }

    getNames('/path/to/file', ['', 'path', 'to', 'file'])
    getNames('/path/to/dir/', ['', 'path', 'to', 'dir'])
    getNames('/path/to/../file/./', ['', 'path', 'file'])
    getNames('./path/to/file', ['path', 'to', 'file'])
    getNames('path/to/file', ['path', 'to', 'file'])
    getNames('/', [''])
    getNames('./', [])
  })
  test('join', () => {
    const join = (names: string[], expectedPath: string) => {
      expect(Path.join(...names)).toEqual(expectedPath)
    }

    join([''], '/')
    join(['', 'root', 'main'], '/root/main')
    join(['root', 'main'], './root/main')
    join(Path.getNames('./root/folder/'), './root/folder')
    join(Path.getNames('./'), './')
    join(Path.getNames('/'), '/')

    join([], './')
    join(['/root/dir'], '/root/dir')
    join(['./relative/path'], './relative/path')
    join(['./relative/path', '/absolute/folder'], './relative/path/absolute/folder')
    join(['./relative/path', './relative/folder'], './relative/path/relative/folder')
    join(['./relative/path/to/folder', '../../'], './relative/path')
  })
  test('get relative path - valid base path', () => {
    const getRelative = (path: string, basePath: string, expectedPath: string) => {
      expect(Path.getRelativePath(path, basePath)).toEqual(expectedPath)
    }

    getRelative('./path/to/dir', 'path/to', './dir')
    getRelative('/path/to/folder', '/path', './to/folder')
    getRelative('./path/to/folder/', './path', './to/folder')
  })
  test('get relative path - invalid base path', () => {
    const getRelative = (path: string, basePath: string) => {
      try {
        Path.getRelativePath(path, basePath)
      } catch (e) {
        expect(e instanceof Error).toBe(true)
      }
    }

    expect.assertions(2)
    getRelative('./path/to/file', '/path/to')
    getRelative('/path/to/folder/', './')
  })

  test('get extension', () => {
    const getExt = (path: string, expectedExt: string) => {
      expect(Path.getExtension(path)).toEqual(expectedExt)
    }

    getExt('file.ext', 'ext')
    getExt('file', '')
    getExt('image.1.png', 'png')
  })
  test('get filename', () => {
    const getFileName = (path: string, expectedFileName: string) => {
      expect(Path.getFileName(path)).toEqual(expectedFileName)
    }

    getFileName('./path/file.name.txt', 'file.name.txt')
    getFileName('./path/to/file.out/folder/../', 'file.out')
    getFileName('/', '')
    getFileName('./', '')
  })

  test('get basename', () => {
    const getBaseName = (filename: string, expectedBaseName: string) => {
      expect(Path.getBaseName(filename)).toEqual(expectedBaseName)
    }

    getBaseName('', '')
    getBaseName('file...png', 'file..')
    getBaseName('file', 'file')
  })

  test('get source directory', () => {
    const getSourceDirectory = (path: string, filepath: string, expectedSourceDirectory: string) => {
      expect(Path.getSourceDirectory(path, filepath)).toEqual(expectedSourceDirectory)
    }

    getSourceDirectory('/base/path/to/file.txt', './to/file.txt', '/base/path')
    getSourceDirectory('/base/path/to/file.txt', 'to/file.txt', '/base/path')
    getSourceDirectory('/base/path/to/file.txt', 'file.txt', '/base/path/to')
  })
  test('get source directory - error', () => {
    const getSourceDirectory = (path: string, filepath: string) => {
      try {
        Path.getSourceDirectory(path, filepath)
      } catch (e) {
        expect(e instanceof Error).toBe(true)
      }
    }

    expect.assertions(2)
    getSourceDirectory('/base/path/to/file.txt', '/to/file.txt')
    getSourceDirectory('./base/path/to/file.txt', '/to/file-123.txt')
  })
  test('is sub path', () => {
    const isSubPath = (path: string, basePath: string, expected: boolean) => {
      expect(Path.isSubPath(path, basePath)).toBe(expected)
    }

    isSubPath('/abc/path/to/file.txt', '/abc/path/', true)
    isSubPath('/abc/path/to/../file.txt', '/abc/path/', true)
    isSubPath('/abc/path/to/../file.txt', '/abc/path/to', false)
    isSubPath('abc/path/file.txt', './abc/path/to/..', true)
    isSubPath('/abc/path', '/abc/path', false)
  })
  test('validate file name', () => {
    const validate = (filename: string) => {
      try {
        const res = Path.validateFileName(filename)
      } catch (e) {
        expect(e.message.includes('invalid filename')).toBe(true)
      }
    }

    expect.assertions(2)
    validate('file.name.txt')
    validate('file')
    // invalid filenames:
    validate('/file.name.txt')
    validate('./file/name.txt')
  })
  test('validate path', () => {
    const validate = (path: string, errorMessage?: string) => {
      try {
        Path.validate(path)
      } catch (e) {
        expect(e.message.includes(errorMessage)).toBe(true)
      }
    }

    expect.assertions(5)

    validate('/path/to/file')
    validate('./path/to/file')
    validate('./path/../to/file')
    validate('../path/to/file')
    // invalid paths
    validate('//path/to/file', 'invalid path')
    validate('/root/.../path/to/file', 'invalid path')
    validate('/../root/path/to/file', 'invalid path')
    validate('', 'path must not be empty')
    validate(' /path/to/file ', 'path must not contain')
  })
})