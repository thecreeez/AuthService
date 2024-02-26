export default {
  type: "get",
  rights: 0,
  ignoreDatabase: true,
  description: `Returns all endpoints`,
  func: async function ({ req, res, authService }) {
    let out = `<table border=1>
                <tr>
                    <th>Type</th>
                    <th>Id</th>
                    <th>URL</th>
                    <th>Description</th>
                    <th>Right level</th>
                </tr>`;

    authService.endpoints.forEach((endpoint, index) => {
      out += `
                    <tr>
                        <td>${endpoint.type}</td><td>${endpoint.id}</td><td>${endpoint.url}</td><td>${endpoint.description}</td><td>${endpoint.rights}</td>
                    </tr>
                `;
    })

    out += `</table><br>`

    out += `Rights levels:<br>`;
    out += `0) DEFAULT: Nothing need to use.<br>`;
    out += `1) USER: Need user auth (login and password)<br>`;
    out += `2) SERVICE: Need service token (token field)<br>`;
    out += `3) ADMIN: Need admin token (token field)<br>`;

    res.send(out);
  }
};