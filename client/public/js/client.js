const HOSTURL = 'http://localhost:3030'
const input = document.querySelector('#file-upload')

function onSelectFile() {
  const [file] = input.files
  predict(file)
}

function predict(img) {
  const body = new FormData()
  body.append('img', img)
  fetch(`${HOSTURL}/predict`, {
    method: 'POST',
    body
  })
    .then(async (response) => {
      try {
        const { predict } = await response.json();
        document.getElementById('result-label').innerHTML = predict
      } catch (e){
        alert(e.message)
      }
    })
    .catch(err => alert (err))
}

input.addEventListener('change', onSelectFile);
