const express = require("express");
const formidable = require('formidable');
const fs = require("fs").promises
const fss = require("fs")

const app = express();
app.use(express.static('static'))
app.use(express.json());
const PORT = process.env.PORT || 8000;
const uploadDir = __dirname + "/static/upload"

app.get('/', () => {

})
app.post('/upload', (req, res, next) => {
  const form = formidable({ multiples: true, uploadDir, keepExtensions: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    res.send("ok");
    console.log({ fields, files });
  });
});
//    getPathFromName
const gpfn = name => uploadDir + "/" + name
app.post('/delete-files', async (req, res) => {
  for (const n of req.body.names) {
    await fs.unlink(gpfn(n))
  }
  res.send("ok")
})
app.post('/rename-file', async (req, res) => {
  let { nn, on } = req.body
  if (!nn.includes('.')) nn += '.' + on.split('.').pop()
  await fs.rename(gpfn(on), gpfn(nn))
  res.send("ok")
})
app.get('/files', async (_, res) => {
  res.json(await fs.readdir(__dirname + '/static/upload'))
});

if (!fss.existsSync(uploadDir)){
    fss.mkdirSync(uploadDir);
}
app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
})
