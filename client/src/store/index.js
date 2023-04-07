import { proxy } from 'valtio'

const state = proxy({
    intro: true,  //meaning are we currently on homepage or not
    color: '#EFBD48',
    isLogoTexture: true,   //meaning are we currently displaying our logo on shirt or not
    isFullTexture: false,
    // initial logo before uploading any logo or texture
    logoDecal: './threejs.png',
    // initial full texture shirt before decal
    fullDecal: './threejs.png'
})

export default state