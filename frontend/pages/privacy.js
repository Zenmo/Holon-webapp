import React, { useEffect } from 'react'; 
import ReactMarkdown from 'react-markdown';
import PrivacyMarkdown from '../content/privacy_page.md'; 

export default function PrivacyStatement(){

    const [text, setText] = useState({md: ""}); 

    useEffect( ()=>{
        fetch(PrivacyMarkdown)
        .then((res)=> res.text())
        .then((text) => {
            setText({text}); 
        })
    }, [])

    return (
        <div>
        <ReactMarkdown source={ pText }></ReactMarkdown>
        </div>

    )
}