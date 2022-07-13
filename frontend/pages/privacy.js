import React from 'react'; 

import ContentBlock from '../components/ContentBlock'; 
import PrivacyMarkdown from '../content/privacy_page.md'; 


export default function PrivacyStatement(){

    return (
        <div>
            <ContentBlock>
                <div className='mt-6 flex flex-col prose'>
                    <PrivacyMarkdown />
                </div>
            </ContentBlock>
        </div>
    )
}