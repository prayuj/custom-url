const submit_button = document.getElementById('submit-button')
getAllUrls()

document.getElementById('url-form').onsubmit = async function (event) {
    event.preventDefault();
    submit_button.disabled = true
    const url = event.target.url.value
    const title = event.target.title.value
    postData('/shorten-url', { url, title })
        .then(data => {
            if (data.url) {
                const resultUrlHTML = `
                    <input type="text" class="form-control" id="url-result" value="${window.location.origin + data.url}" readonly/>
                    <button class="btn btn-secondary" onclick="copyToClipboard(this)"><i class="far fa-copy"></i></button>`
                document.getElementById('result').innerHTML = resultUrlHTML
                getAllUrls()
            } else {
                document.getElementById('result').innerHTML = `<h2>An Error Occurred</h2>`
            }
            submit_button.disabled = false
        })
}

function getAllUrls() {
    fetch('/all-urls')
        .then(response => response.json())
        .then(data => showTable(data.urls))
}


async function copyToClipboard(button) {
    var copyText;
    if (button.id) {
        copyText = document.getElementById("url-result-" + button.id);
        copyText.select();
        copyText.setSelectionRange(0, 99999)
    } else {
        copyText = document.getElementById("url-result");
        copyText.select();
        copyText.setSelectionRange(0, 99999)
    }
    document.execCommand("copy");
    alert("Copied the text: " + copyText.value);

}

function showTable(urls) {
    let table = `
    <table class="table">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">From</th>
            <th scope="col">To</th>
            <th scope="col">Delete</th>
            </tr>
        </thead>
        <tbody>`

    for (let i = 0; i < urls.length; i++)
        table += `
        <tr>
            <td>${i + 1}</td>
            <td><input type="text" class="form-control"  id="url-result-${urls[i]._id}" value="${window.location.origin + "/t/" + urls[i].fromUrl}" readonly/></td>
            <td>${urls[i].toUrl}</td>
            <td>
            <button id = "${urls[i]._id}" class="btn btn-secondary" onclick="copyToClipboard(this)"><i class="far fa-copy"></i></button>
            <button class="btn btn-danger"><i class="far fa-trash-alt"></i></button>
            </td>
        </tr>
        `

    table += `
        </tbody>
        </table>
    `

    document.getElementById('table').innerHTML = table

}

// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}