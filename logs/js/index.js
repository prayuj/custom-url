getAllLogs()

function getAllLogs() {
    restClient('/all-logs?sortBy=createdAt:desc', null, 'GET')
        .then(response => showTable(response.logs))
}

function showTable(logs) {
    let table = `
    <table class="table">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">Line</th>
            <th scope="col">Created At</th>
            </tr>
        </thead>
        <tbody>`
    for (let i = 0; i < logs.length; i++)
        table += `
        <tr>
            <td>${i + 1}</td>
            <td>
                <p>${logs[i].line}</p>
            </td>
            <td>
                ${moment(logs[i].createdAt).fromNow()}
            </td>
        </tr>
        `

    table += `
        </tbody>
        </table>
    `

    document.getElementById('logs').innerHTML = table
}

async function restClient(url = '', data = {}, method = 'POST') {
    // Default options are marked with *
    const response = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: method === 'GET' ? null : JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}