export class FetchInterceptor {
  private readonly requestInterceptors: Array<
    (url: string, init?: RequestInit) => Promise<[string, RequestInit?]>
  > = []

  private readonly responseInterceptors: Array<
    (response: Response) => Promise<Response>
  > = []

  public useRequestInterceptor(
    interceptor: (
      url: string,
      init?: RequestInit,
    ) => Promise<[string, RequestInit?]>,
  ) {
    this.requestInterceptors.push(interceptor)
  }

  public useResponseInterceptor(
    interceptor: (response: Response) => Promise<Response>,
  ) {
    this.responseInterceptors.push(interceptor)
  }

  public async interceptFetch(
    url: string,
    init?: RequestInit,
  ): Promise<Response> {
    let newUrl = url
    let newInit = init

    for (const interceptor of this.requestInterceptors) {
      const [newUrlReturned, newInitReturned] = await interceptor(
        newUrl,
        newInit,
      )
      newUrl = newUrlReturned
      newInit = newInitReturned ?? newInit
    }

    const response = await fetch(newUrl, newInit)

    let newResponse = response

    for (const interceptor of this.responseInterceptors) {
      newResponse = await interceptor(newResponse)
    }

    return newResponse
  }
}
