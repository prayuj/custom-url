# custom-url
<p>I wanted to map some urls to my domain <a href='https://prayuj.tech'>prayuj.tech</a>, so I created this project.</p>
<p>Maps URLs to custom end point on the hosted server. If the custom end point is not provided, a deafult one is set if present in 'uniquenames' collection.</p>
<p>You can set 'uniquenames' names collections with a POST request to end point '/set-url-names'. 
An example of the request body is provided in <a href="https://github.com/prayuj/custom-url/blob/main/misc/short-url-names.json">./misc/short-url-names.json</a></p>

<p>The following endpoints have authentication middleware:</p>
<table>
  <thead>
    <th>Endpoint</th>
    <th>Method</th>
    <th>Authentication</th>
    <th>Request Body</th>
    <th>Response</th>
  </thead>
  <tbody>
    <tr>
      <td>/</td>
      <td>GET</td>
      <td>Yes</td>
      <td>None</td>
      <td>Main Dashboard</td>
    </tr>
    <tr>
      <td>/enter-key</td>
      <td>GET</td>
      <td>No</td>
      <td>None</td>
      <td>Login page to set key which then stores in cookies and redirects to Dashboard</td>
    </tr>
    <tr>
      <td>/404</td>
      <td>GET</td>
      <td>No</td>
      <td>None</td>
      <td>404 page for missing URL Target</td>
    </tr>
    <tr>
      <td>/t/{url}</td>
      <td>GET</td>
      <td>No</td>
      <td>None</td>
      <td>Maps 'url' to target url and redirects.</td>
    </tr>
    <tr>
      <td>/all-urls</td>
      <td>GET</td>
      <td>Yes</td>
      <td>None</td>
      <td>Returns list of short-urls along with their target</td>
    </tr>
    <tr>
      <td>/url</td>
      <td>DELETE</td>
      <td>Yes</td>
      <td>url to delete</td>
      <td>Deletes url</td>
    </tr>
    <tr>
      <td>/shorten-url</td>
      <td>POST</td>
      <td>Yes</td>
      <td>
        <ul>
          <li>url (required)</li>
          <li>title (optional)</li>
        </ul>
      </td>
      <td>Maps URL to title, if title is not provided, titlte is taken from 'uniquenames'</td>
    </tr>
    <tr>
      <td>/set-url-names</td>
      <td>POST</td>
      <td>Yes</td>
      <td>Refer <a href="https://github.com/prayuj/custom-url/blob/main/misc/short-url-names.json">here</a> for format of body</td>
      <td>Adds list of names to uniquenames collection</td>
    </tr>
  </tbody>
</table>

<p>To Authenticate you can do either of the following:</p>
 <ol>
  <li>Set 'key' in the Cookies of the Browser, for example {'key':YOUR_PRIVATE_KEY}, where YOUR_PRIVATE_KEY is the key that is set in your enviroment variables. This method is useful when accessing from the Browser</li>
  <li>Set 'key' in Headers of the request, for example {'key':YOUR_PRIVATE_KEY}, where YOUR_PRIVATE_KEY is the key that is set in your enviroment variables. This method is useful when hitting request from PostMan.</li>
 </ol>
