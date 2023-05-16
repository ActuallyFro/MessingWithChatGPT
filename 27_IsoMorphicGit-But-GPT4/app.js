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
  })();
});