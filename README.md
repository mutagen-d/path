# Path
[![Build Status](https://travis-ci.com/mutagen-d/path.svg?branch=master&status=passed)](https://travis-ci.com/github/mutagen-d/path)

Module for manipulating file and directory path

## Installation

```bash
npm i @mutagen-d/path
# or
yarn add @mutagen-d/path
```

## API

| Method                                        | Return type | Description                                  |
| --------------------------------------------- | ----------- | -------------------------------------------- |
| [`resolve()`](#resolve)                       | `string`    |                                              |
| [`getNames()`](#getnames)                     | `string[]`  | names of dirs and file                       |
| `validate()`                                  | `void`      | throws exception if not valid path value     |
| `isAbsolutePath()`                            | `boolean`   |                                              |
| [`join()`](#join)                             | `string`    | concatenate paths                            |
| `isSubPath()`                                 | `boolean`   |                                              |
| [`getRelativePath()`](#getrelativepath)       | `string`    |                                              |
| [`getFileName()`](#getfilename)               | `string`    | get filename from path                       |
| `validateFileName()`                          |             | throws exception if not valid filename       |
| `getExtension()`                              | `string`    | get extension from filename                  |
| `getBaseName()`                               | `string`    | get basename from filename                   |
| [`getSourceDirectory()`](#getsourcedirectory) | `string`    | returns source directory path for given path |

## Usage

### resolve

```javascript
// absolute paths
Path.resolve("/path/../to/some/directory/") === "/to/some/directory"
Path.resolve("/././path/to") === "/path/to"
Path.resolve("/././path/to/../") === "/path"
Path.resolve("/path/../") === "/"
Path.resolve("/path/..") === "/"
Path.resolve("/") === "/"

// relative paths
Path.resolve("path/../") === "./"
Path.resolve("path/..") === "./"
Path.resolve("./path/..") === "./"
Path.resolve("path") === "./path"
Path.resolve("././path/to/file/..") === "./path/to"
Path.resolve("./") === "./"
```

### getNames

```javascript
Path.getNames("/path/to/file") == ["", "path", "to", "file"]
Path.getNames("/path/to/dir/") == ["", "path", "to", "dir"]
Path.getNames("/path/to/../file/./") == ["", "path", "file"]
Path.getNames("./path/to/file") == ["path", "to", "file"]
Path.getNames("path/to/file") == ["path", "to", "file"]
Path.getNames("/") == [""]
Path.getNames("./") == []
```

### join

```javascript
Path.join([]) === "./"
Path.join([""]) ===  "/"
Path.join(["", "root", "main"]) === "/root/main"
Path.join(["root", "main"]) === "./root/main"
Path.join(Path.getNames("./root/folder/") === "./root/folder"
Path.join(Path.getNames("./")) === "./"
Path.join(Path.getNames("/")) === "/"

Path.join(["/root/dir"]) === "/root/dir"
Path.join(["./relative/path"]) === "./relative/path"
Path.join(["./relative/path", "/absolute/folder"]) === "./relative/path/absolute/folder"
Path.join(["./relative/path", "./relative/folder"]) === "./relative/path/relative/folder"
Path.join(["./relative/path/to/folder", "../../"]) === "./relative/path"
```

### getRelativePath

```javascript
Path.getRelative("./path/to/dir", "path/to") === "./dir"
Path.getRelative("/path/to/folder", "/path") === "./to/folder"
Path.getRelative("./path/to/folder/", "./path") === "./to/folder"
```

### getFileName

```javascript
Path.getFileName("./path/file.name.txt") === "file.name.txt"
Path.getFileName("./path/to/file.out/folder/../") === "file.out"
Path.getFileName("/") === ""
Path.getFileName("./") === ""
```

### getSourceDirectory

```javascript
Path.getSourceDirectory("/base/path/to/file.txt", "./to/file.txt") === "/base/path"
Path.getSourceDirectory("/base/path/to/file.txt", "to/file.txt") === "/base/path"
Path.getSourceDirectory("/base/path/to/file.txt", "file.txt") === "/base/path/to"
```
