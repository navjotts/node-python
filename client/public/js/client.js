const HOSTURL = 'http://localhost:3030';

function fireTest() {
    document.getElementById('test-button').innerHTML = 'Testing...';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `${HOSTURL}/test`, true);
    xhr.onerror = function() {alert (xhr.responseText);}
    xhr.onload = function(e) {
        if (this.readyState === 4) {
            var response = JSON.parse(e.target.responseText);
            document.getElementById('result-label').innerHTML = `${response['result']}`;
        }
        document.getElementById('test-button').innerHTML = 'Test Python';
    }
    xhr.send();
}
