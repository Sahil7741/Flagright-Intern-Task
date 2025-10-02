import React from 'react';

const ClientCard = ({client}) =>{
    return (
        <div className="bg-gray-950 hover:bg-gray-900 flex items-center justify-center w-full aspect-video">
            <img src={client.logo} alt={client.name}/>
        </div>
    )
}

export default ClientCard;