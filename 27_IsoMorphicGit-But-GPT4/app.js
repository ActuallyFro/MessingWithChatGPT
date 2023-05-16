
document.addEventListener('DOMContentLoaded', (event) => {

// Configure BrowserFS and isomorphic-git
BrowserFS.configure({ fs: 'InMemory' }, function (err) {
  if (err) return console.log(err);

  const fs = BrowserFS.BFSRequire('fs');
  const dir = '/tutorial';
  
  (async function() {
    // Initialize git
    await git.init({ fs, dir });

    // Write a bash script
    fs.writeFileSync(`${dir}/hello.sh`, '#!/bin/bash\necho "Hello, world!"');

    // Add the file to git
    await git.add({ fs, dir, filepath: 'hello.sh' });

    // Commit the file
    await git.commit({
      fs,
      dir,
      author: { name: 'Your Name', email: 'you@example.com' },
      message: 'Initial commit: Add hello.sh'
    });

    // Update file select options
    async function updateFileSelect() {
      const files = await git.listFiles({ fs, dir });
      const fileSelect = document.getElementById('fileSelect');
      fileSelect.innerHTML = '';
  
      // Add an empty option
      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.textContent = '';
      fileSelect.appendChild(emptyOption);
  
      for (const file of files) {
        const option = document.createElement('option');
        option.value = file;
        option.textContent = file;
        fileSelect.appendChild(option);
      }
    }

    await updateFileSelect();

    // File select event listener
    document.getElementById('fileSelect').addEventListener('change', async function(e) {
      const selectedFile = e.target.value;
      if (selectedFile) {
        const content = fs.readFileSync(`${dir}/${selectedFile}`, 'utf8');
        document.getElementById('editor').textContent = content;
      } else {
        document.getElementById('editor').textContent = '';
      }
    });

    // Commit button event listener
    document.getElementById('commitBtn').addEventListener('click', async function() {
      const selectedFile = document.getElementById('fileSelect').value;
      const newFileName = document.getElementById('fileName').value;
      const content = document.getElementById('editor').textContent;
      const message = document.getElementById('commitComment').value;

      let filepath;
      if (selectedFile) {
        filepath = selectedFile;
      } else if (newFileName) {
        filepath = newFileName;
      } else {
        alert('Please select an existing file or enter a new file name.');
        return;
      }

      if (content && message) {
        fs.writeFileSync(`${dir}/${filepath}`, content);
        await git.add({ fs, dir, filepath });
        await git.commit({
          fs,
          dir,
          author: { name: 'Your Name', email: 'you@example.com' },
          message
        });

        // Clear the commit comment and new file name input
        document.getElementById('commitComment').value = '';
        document.getElementById('fileName').value = '';

        // Update the file select
        await updateFileSelect();
      }
    });       

    // Add event listener to the gitLogBtn
    document.getElementById('gitLogBtn').addEventListener('click', async function() {
      // Get the commit history
      const commits = await git.log({ fs, dir, depth: 5, ref: 'master' });
      
      // Get the log area
      const logArea = document.getElementById('logArea');

      // Clear the log area
      logArea.innerHTML = '';

      // Print the commit history
      for (const commit of commits) {
        const logItem = document.createElement('p');
        logItem.textContent = `${commit.oid.substring(0, 7)} ${commit.commit.message}`;
        logArea.appendChild(logItem);
      }
    });

    // Add event listener to the gitStatusBtn
    document.getElementById('gitStatusBtn').addEventListener('click', async function() {
      // Get the status
      const status = await git.statusMatrix({ fs, dir });
      
      // Get the status area
      const statusArea = document.getElementById('statusArea');

      // Clear the status area
      statusArea.innerHTML = '';

      // Print the status
      status.forEach(([filepath, , worktreeStatus]) => {
        const statusItem = document.createElement('p');
        statusItem.textContent = worktreeStatus > 0 ? `${filepath}: Modified` : `${filepath}: Unmodified`;
        statusArea.appendChild(statusItem);
      });
    });

    // Add event listener to the gitDiffBtn
    document.getElementById('gitDiffBtn').addEventListener('click', async function() {
      // Get the status
      const status = await git.statusMatrix({ fs, dir });

      // Get the diff area
      const diffArea = document.getElementById('diffArea');

      // Clear the diff area
      diffArea.innerHTML = '';

      // Print the diff
      status.forEach(([filepath, headStatus, worktreeStatus]) => {
        if (headStatus !== worktreeStatus) {
          const diffItem = document.createElement('p');
          diffItem.textContent = `${filepath}: Modified`;
          diffArea.appendChild(diffItem);
        }
      });
    });


  // Helper function to recursively read directory contents
  async function readDirRecursive(fs, path, zip, basePath) {
    const files = fs.readdirSync(path);
    for (const file of files) {
      const filePath = `${path}/${file}`;
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        const content = fs.readFileSync(filePath);
        zip.file(`${basePath}/${file}`, content);
      } else if (stats.isDirectory()) {
        const subFolder = zip.folder(`${basePath}/${file}`);
        await readDirRecursive(fs, filePath, subFolder, file);
      }
    }
  }

  // Export repository as zip
  document.getElementById('exportRepoBtn').addEventListener('click', async function() {
    const zip = new JSZip();

    await readDirRecursive(fs, dir, zip, '');

    zip.generateAsync({ type: 'blob' }).then(function(content) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'repository.zip';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });

  // Import repository from zip
  document.getElementById('importRepoBtn').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (file) {
      const zip = new JSZip();
      const content = await new Response(file).arrayBuffer();
      const loadedZip = await zip.loadAsync(content);

      BrowserFS.configure({ fs: 'InMemory' }, async function(err) {
        if (err) return console.log(err);

        await (async function() {
          // Extract files from the zip
          const extractFile = async function(zipObject, path) {
            const data = await zipObject.async('arraybuffer');
            fs.writeFileSync(path, new Buffer(data));
          };

          for (const relativePath in loadedZip.files) {
            const zipObject = loadedZip.files[relativePath];
            const fullPath = `${dir}/${relativePath}`;
            if (!zipObject.dir) {
              await extractFile(zipObject, fullPath);
            } else {
              fs.mkdirSync(fullPath);
            }
          }

          // Update the file select
          await updateFileSelect();
        })();
      });
    }
  });
  
  })(); //end async function
});




});