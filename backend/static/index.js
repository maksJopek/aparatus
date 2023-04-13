const newDiv = `<!-- <div class="dImg"> -->
      <p>$name</p><br>
      <a href="upload/$name"><img src="upload/$name" alt="$name" width="120" height="120"/></a>
      <button type="button" onclick="deleteFiles(['$name'])">Delete</button>
      <button type="button" onclick="renameFile('$name')">Rename</button><br>
      <label>
        Select: 
        <input type="checkbox" name="$name" />
      </label>
    <!-- </div> -->`

function selectAll() {
  for (const c of document.querySelectorAll("input[type='checkbox']")) {
    c.checked = !c.checked
  }
}
async function deleteFiles(names) {
  if (!confirm("Are you sure about that file deleting thingy?")) return;
  await fetch("/delete-files", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ names }),
  })
  getFiles()
}
async function removeAllSel() {
  const names = []
  for (const c of [...document.querySelectorAll("input[type='checkbox']")].filter(i => i.checked)) {
    names.push(c.name)
  }
  deleteFiles(names)
}
async function renameFile(on) {
  const nn = prompt("What will be the new name of this beautiful picture?")
  if (!nn) return;
  await fetch("/rename-file", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nn, on }),
  })
  getFiles()
}
const cont = document.getElementById("container");
async function getFiles() {
  const files = await fetch("/files").then(res => res.json());
  for (const d of document.querySelectorAll(".dImg")) d.remove()
  for (const f of files) {
    const div = document.createElement("div")
    div.className = "dImg"
    div.innerHTML = newDiv.replaceAll("$name", f);
    cont.appendChild(div)
  }
}
getFiles()

