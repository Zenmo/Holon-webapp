const API_KEY = process.env.NEXT_PUBLIC_TINY_URL_API_KEY; 

export async function createTinyUrl(url: string) {   
    let body = {
        url: url, 
    }

    return await fetch('https://api.tinyurl.com/create', {
            method: 'POST', 
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${API_KEY}`, 
                "content-type": `application/json`,
        
            },
            body: JSON.stringify(body)
            })
            .then(response => {
                if (response.status != 200) {
                    throw `There was a problem with the fetch operation. Status Code: ${response.status}`;
                }
                return response.json()
              })
              .then(data => {
                return data.data.tiny_url; 
              })
              .catch(error => console.error(error));      
        }
   