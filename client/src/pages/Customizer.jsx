import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'

import config from '../config/config'
import state from '../store'
import { download, logoShirt } from '../assets'
import { downloadCanvasToImage, reader } from '../config/helpers'
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants'
import { fadeAnimation, slideAnimation } from '../config/motion'
import { AIPicker, FilePicker, ColorPicker, Tab, CustomButton } from '../components/index' 

const Customizer = () => {
  const snap = useSnapshot(state)
  const [file, setFile] = useState('');
  const [prompt, setPrompt] = useState('')
  const [generateImg, setGenerateImg] = useState(false)
  const [activeEditorTab, setActiveEditorTab] = useState('')
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false
  })

  // show tab content depending on the active tab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker": 
        return <ColorPicker/>
      case "filepicker": 
        return <FilePicker 
                file={file}
                setFile = {setFile}
                readFile = {readFile}
                 />
      case "aipicker":
        return <AIPicker
          prompt={prompt}
          setPrompt={setPrompt}
          generateImg={generateImg}
          handleSubmit={handleSubmit}
        />
      default:
        return null;
    }
  }

  const handleSubmit = async(type) => {
    if(!prompt) return alert("Please enter a prompt")

    try {
      // call the backend to generate an ai img
      setGenerateImg(true);
      const response = await fetch('http://localhost:8080/api/v1/dalle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
        })
      })

      const data = await response.json()
      handleDecals(type, `data:image/png;b64,${data.photo}`)
    } catch (error) {
      alert(error)   
    } finally {
      setGenerateImg(false)
      setActiveEditorTab("")
    }
  }

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type]

    state[decalType.stateProperty] = result

    if(!activeFilterTab[decalType.filtertab]) {
      handleActiveFilterTab(decalType.filtertab)
    }
  }

  const handleActiveFilterTab = (tabName) => {
    switch(tabName){
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName]
        break;
      
      default:
        state.isLogoTexture = true
        state.isFullTexture = false
    }

    // after setting the state, set the active filter tab to update the ui
    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName]
      }
    })
  }

  const readFile = (type) => {
    reader(file)
      .then((result) => {
        handleDecals(type, result);
        setActiveEditorTab('')
      })
  }

  return (
    <AnimatePresence>
        {/* if not not homepage then show */}
      { !snap.intro && (         
          <>
            <motion.div key="custom"
                        className='absolute top-0 left-0 z-10'
                        {...slideAnimation('left')} >
              <div className='flex items-center min-h-screen'>
                <div className='editortabs-container tabs'>
                  {EditorTabs.map((tab) => (
                    <Tab key={tab.name}      //color tab
                          tab={tab}
                          handleClick={() => setActiveEditorTab(tab.name)}
                    />
                  ))}
                  {generateTabContent()}
                </div>
              </div>
            </motion.div>

            <motion.div className='absolute z-10 top-5 right-5' {...fadeAnimation} >
              <CustomButton type="filled"
                            title="Go Back" 
                            handleClick={() => state.intro = true}
                            customStyles="w-fit px-4 py-2.5 font-bold text-sm" />
            </motion.div>

            <motion.div className='filtertabs-container' {...slideAnimation('up')}>
              {FilterTabs.map((tab) => (
                  <Tab key={tab.name}
                        tab={tab}
                        isFiltertab
                        isActivetab={activeFilterTab[tab.name]}
                        handleClick={() => handleActiveFilterTab(tab.name)}
                    />
              ))}
            </motion.div>
          </>
      )}    
    </AnimatePresence>
  )
}

export default Customizer