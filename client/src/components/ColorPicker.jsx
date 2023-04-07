import React from 'react'
import { SketchPicker } from 'react-color'
import { useSnapshot } from 'valtio'

import state from '../store'


const ColorPicker = () => {
  const snap = useSnapshot(state)

  return (
    <div className='absolute left-full ml-3'>
      <SketchPicker 
        color={snap.color}
        disableAlpha
        // presetColors={[       //if we want to have our own preset colors
        //   '#ffffff',
        //   '#ccc',
        //   '#80C670',
        //   '#353934',
        //   '#FF96AD',
        //   '#512314',
        // ]}
        onChange={(color) => state.color = color.hex}
      />
    </div>
  )
}

export default ColorPicker