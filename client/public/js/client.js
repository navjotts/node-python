var loc = window.location
const HOSTURL = `${loc.protocol}//${loc.hostname}:${loc.port}`
const input = document.querySelector('#file-upload')

function onFileSelect() {
  const [file] = input.files
  var reader = new FileReader()
  reader.onload = function (e) {
      document.getElementById('image-picked').src = e.target.result
      document.getElementById('image-picked').className = ''
  }
  reader.readAsDataURL(file)
  predict(file)
}

function convertToFormData(key, val) {
  const body = new FormData()
  body.append(key, val)
  return body
}

function predict(img) {
  document.getElementById('result-label').innerHTML = 'Loading...'
  fetch(`${HOSTURL}/predict`, {
    method: 'POST',
    body: convertToFormData('img', img)
  })
    .then(async (response) => {
      try {
        const { predict } = await response.json()
        document.getElementById('result-label').innerHTML = predict
      } catch (e){
        alert(e.message)
      }
    })
    .catch(err => alert (err))
}

input.addEventListener('change', onFileSelect);
