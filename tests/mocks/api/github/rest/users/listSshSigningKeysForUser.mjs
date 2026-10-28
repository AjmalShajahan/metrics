/**Mocked data */
export default async function({faker}, target, that, [{username}]) {
  console.debug("metrics/compute/mocks > mocking rest api result > rest.users.listSshSigningKeysForUser")
  return ({
    status: 200,
    url: `https://api.github.com/users/${username}/ssh_signing_keys`,
    headers: {
      server: "GitHub.com",
      status: "200 OK",
      "x-oauth-scopes": "repo",
    },
    data: [
      {
        id: faker.number?.int?.(100000) ?? 1,
        key: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIG4rT3vTt99Ox5kNdCTuEbMc6kvpmEdNRCZIoMrtUCHr",
        title: "Mocked SSH Signing Key",
        created_at: `${faker.date.past({years: 1})}`,
      },
    ],
  })
}

