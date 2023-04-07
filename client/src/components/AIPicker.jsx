import React from 'react'

import CustomButton from './CustomButton'

const AIPicker = ({ prompt, setPrompt, generateImg, handleSubmit }) => {
  return (
    <div className='aipicker-container'>
      <textarea
        placeholder='Ask AI...'
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className='aipicker-textarea'
      />
      <div className='flex flex-wrap gap-3'>
        {generateImg ? (
          <CustomButton
            type="outline"
            title="Ask AI"
            customStyles="text-xs"
          />
        ) : (
          <>
            <CustomButton
              type='outline'
              title='AI Logo'
              handleClick={() => handleSubmit('logo')}
            />
            <CustomButton
              type='filled'
              title='AI Full'
              handleClick={() => handleSubmit('full')}
            />
          </>
        ) }
      </div>
    </div>
  )
}

export default AIPicker