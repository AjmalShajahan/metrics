/**Mocked data */
export default async function({faker}, target, that, args) {
  //Arguments
  const [url] = args
  //Head request
  if (/^HEAD .$/.test(url)) {
    console.debug("metrics/compute/mocks > mocking rest api result > rest.request HEAD")
    return ({
      status: 200,
      url: "https://api.github.com/",
      headers: {
        server: "GitHub.com",
        status: "200 OK",
        "x-oauth-scopes": "repo",
      },
      data: undefined,
    })
  }
  //Commit content
  if (/^https:..api.github.com.repos.gh-metrics.metrics.commits.MOCKED_SHA/.test(url)) {
    console.debug(`metrics/compute/mocks > mocking rest api result > rest.request ${url}`)
    return ({
      status: 200,
      url: "https://api.github.com/repos/gh-metrics/metrics/commits/MOCKED_SHA",
      data: {
        sha: "MOCKED_SHA",
        commit: {
          author: {
            name: faker.internet.userName(),
            email: faker.internet.email(),
            date: `${faker.date.recent({days: 7})}`,
          },
          committer: {
            name: faker.internet.userName(),
            email: faker.internet.email(),
            date: `${faker.date.recent({days: 7})}`,
          },
          url: "https://api.github.com/repos/gh-metrics/metrics/commits/MOCKED_SHA",
        },
        author: {
          login: faker.internet.userName(),
          id: faker.number.int(100000000),
        },
        committer: {
          login: faker.internet.userName(),
          id: faker.number.int(100000000),
        },
        files: [
          {
            sha: "MOCKED_SHA",
            filename: faker.system.fileName(),
            patch: '@@ -0,0 +1,5 @@\n+//Imports\n+  import app from "./src/app.mjs"\n+\n+//Start app\n+  await app()\n\\ No newline at end of file',
          },
        ],
        parents: [],
      },
    })
  }

  //SSH signing keys
  if (/^GET \/users\/.*\/ssh_signing_keys/.test(url) || /https:\/\/api\.github\.com\/users\/.*\/ssh_signing_keys/.test(url)) {
    console.debug(`metrics/compute/mocks > mocking rest api result > rest.request ${url}`)
    return ({
      status: 200,
      url,
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

  return target(...args)
}
