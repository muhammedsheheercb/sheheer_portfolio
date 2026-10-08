import * as THREE from 'three/webgpu'

const text = `
███████╗██╗  ██╗███████╗██╗  ██╗███████╗███████╗██████╗ 
██╔════╝██║  ██║██╔════╝██║  ██║██╔════╝██╔════╝██╔══██╗
███████╗███████║█████╗  ███████║█████╗  █████╗  ██████╔╝
╚════██║██╔══██║██╔══╝  ██╔══██║██╔══╝  ██╔══╝  ██╔══██╗
███████║██║  ██║███████╗██║  ██║███████╗███████╗██║  ██║
╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝

╔═ Intro ═══════════════╗
║ Welcome to Sheheer's 3D Interactive Portfolio!
║ Frontend Engineer & Full Stack Architect based in Thrissur, Kerala, India.
║ Crafting visually stunning web applications with pixel-perfect design and solid engineering.
╚═══════════════════════╝

╔═ Contact & Socials ═══╗
║ Email          ⇒ muhammedsheheercb@gmail.com
║ Phone / WA     ⇒ +91 8086860867
║ Portfolio      ⇒ https://sheheer-portfolio.vercel.app/
║ GitHub         ⇒ https://github.com/muhammedsheheercb
║ LinkedIn       ⇒ http://linkedin.com/in/mohammed-sheheer-c-b-
╚═══════════════════════╝

╔═ Debug ═══════════════╗
║ You can access debug mode by adding #debug at the end of the URL and reloading.
║ Press [V] to toggle the free camera.
╚═══════════════════════╝

╔═ 3D Engine ═══════════╗
║ Three.js (release: ${THREE.REVISION}) WebGL/WebGPU with TSL.
║ Physics powered by Rapier 3D engine.
╚═══════════════════════╝
`
let finalText = ''
let finalStyles = []
const stylesSet = {
    letter: 'color: #00f0ff; font: 400 1em monospace;',
    pipe: 'color: #ffd166; font: 400 1em monospace;',
}
let currentStyle = null
for(let i = 0; i < text.length; i++)
{
    const char = text[i]

    const style = char.match(/[╔║═╗╚╝╔╝]/) ? 'pipe' : 'letter'
    if(style !== currentStyle)
    {
        currentStyle = style
        finalText += '%c'

        finalStyles.push(stylesSet[currentStyle])
    }
    finalText += char
}

export default [finalText, ...finalStyles]