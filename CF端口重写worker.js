addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
  })
  async function handleRequest(request) {
  const url = new URL(request.url)
  const newUrl = new URL('http://域名:端口')
  newUrl.pathname = url.pathname
  newUrl.search = url.search
  return fetch(newUrl, request)
}
