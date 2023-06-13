

export async function createTinyUrl(url: string) {
    return new Promise((resolve, reject) => {
        axios.get('/tiny-url', {
            params: {
                url: url,
            }
        }).then(response => {
            resolve(response.data.url)
        }).catch(error => {
            reject(error)
        })
    })
}