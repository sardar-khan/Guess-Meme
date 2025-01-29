import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toggleAnimation } from '../features/animationSlice';

const AnimationToggle = () => {
    const dispatch = useDispatch();
    const isOn = useSelector((state) => state.animation.isOn);
    const handleToggle = () => {
        dispatch(toggleAnimation());
    };

    return (
        <div className='block'>
            <div className='Inter flex items-end gap-2'>
                <div className='flex'>Show animations:</div>
                <span
                    onClick={handleToggle}
                    style={{
                        cursor: 'pointer',
                        color: isOn ? 'green' : 'gray',
                        fontWeight: isOn ? 'bold' : 'normal'
                    }}
                >
                    On
                </span>
                <span
                    onClick={handleToggle}
                    style={{
                        cursor: 'pointer',
                        color: !isOn ? 'red' : 'gray',
                        fontWeight: !isOn ? 'bold' : 'normal'
                    }}
                >
                    Off
                </span>
            </div>
        </div>
    )
}

export default AnimationToggle