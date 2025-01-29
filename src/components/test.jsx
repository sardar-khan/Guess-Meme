import React, { useContext } from 'react'
import { PusherContext } from '../context/PusherContext';

const test = () => {
    const { data } = useContext(PusherContext);
    return (
        <div>
            <h1>Real-Time Updates</h1>
            <ul>
                {data.map((item, index) => (
                    <li key={index}>{JSON.stringify(item)}</li>
                ))}
            </ul>
        </div>
    )
}

export default test