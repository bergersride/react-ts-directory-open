'use strict'

class DirEntry
{
  constructor(name, handle, kind, subdir = null)
  {
    this.name = name;
    this.handle = handle;
    this.kind = kind;
    this.subdir = subdir;
  }
}

let currentDirHandle = null;

/**
 * Open a handle to an existing directory on the local file system.
 *
 * @return {!Promise<FileSystemDirectoryHandle>} Handle to the existing directory.
 */
function getDirectoryHandle() {

  // For Chrome 86 and later...
  if ('showDirectoryPicker' in window) {
    return window.showDirectoryPicker();
  }
  // For Chrome 85 and earlier...
    alert("no showDirectoryPicker");
  return window.chooseFileSystemEntries();
}


/**
 * Opens a Directory for reading.
 *
 * @param {FileSystemFileHandle} fileHandle File handle to read from.
 */
export async function openDirectory() {
  if (currentDirHandle)
  {
    alert("Current Directory: " + currentDirHandle.name);
    return;
  }

    try {
      var directoryHandle = await getDirectoryHandle();
    } catch (ex) {
      if (ex.name === 'AbortError') {
        return;
      }
      const msg = 'An error occured trying to open the directory: ' + ex.name;
      console.error(msg, ex);
      alert(msg);
  }

    if (!directoryHandle)
        return;
    
    alert("Directory Handle returned: " + directoryHandle.name);
   
    if (await verifyPermission(directoryHandle, true) === false) {
      alert("User did not grant permission");
      return;
    }

        const dirEntries = await listAllFilesAndDirs(directoryHandle);
        //console.log('files', files);
        //files.forEach(handle => console.log(handle.kind + " - " + handle.name));
      showDirEntries(dirEntries);

    currentDirHandle = directoryHandle;
    return;
};

function showDirEntries(dirEntries, indentStr = "")
{

  dirEntries.forEach(obj => { console.log(indentStr + obj.kind + " " + obj.name); if (obj.kind === 'directory') { showDirEntries(obj.subdir, indentStr + "   ") } });
}

/**
 * Verify the user has granted permission to read or write to the file, if
 * permission hasn't been granted, request permission.
 *
 * @param {FileSystemFileHandle} fileHandle File handle to check.
 * @param {boolean} withWrite True if write permission should be checked.
 * @return {boolean} True if the user has granted read/write permission.
 */
async function verifyPermission(fileHandle, withWrite) {
 
  // Check if we already have permission, if so, return true.
  if (await fileHandle.queryPermission({ mode: 'readwrite'}) === 'granted') {
    return true;
  }
  // Request permission to the file, if the user grants permission, return true.
  if (await fileHandle.requestPermission({ mode: 'readwrite'}) === 'granted') {
    return true;
  }
  // The user did nt grant permission, return false.
  return false;
};


  async function listAllFilesAndDirs(dirHandle) {
    const files = [];
    for await (let [name, handle] of dirHandle) {
        const {kind} = handle;
        if (handle.kind === 'directory') {
            const subdir = await listAllFilesAndDirs(handle);
            files.push(new DirEntry(name, handle, kind, subdir));
            //files.push(...await listAllFilesAndDirs(handle));
        } else {
            files.push(new DirEntry(name, handle, kind));
        }
    }
    
    //return files.sort();

    return files.sort(function(a, b): number { 
      if (a.kind === b.kind)
        {
        let aName = a.name.toUpperCase();
        let bName = b.name.toUpperCase();
        return a.name === bName ? 0 : +(aName > bName) || -1;
        }
      else
        return a.kind === b.kind ? 0 : +(a.kind > b.kind) || -1;
      });
}

