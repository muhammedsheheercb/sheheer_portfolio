import * as THREE from 'three/webgpu'
import { Game } from '../Game.js'
import { Inputs } from '../Inputs/Inputs.js'
import gsap from 'gsap'

// A temporary entrance set. No colliders or world assets are changed.
export class Intro
{
    constructor()
    {
        this.game = Game.getInstance()
        this.center = this.game.respawns.getDefault().position.clone().setY(0)
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        this.group = new THREE.Group()
        this.group.name = 'Orbit Gate entrance'
        this.group.position.copy(this.center)
        this.game.scene.add(this.group)
        this.geometries = new Set()
        this.materials = new Set()
        this.textures = new Set()
        this.floaters = []
        this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200)
        this.cameraBlend = 0
        this.active = true
        this.elapsed = 0
        this.ui = this.game.domElement.querySelector('.js-entrance')
        this.startButton = this.ui.querySelector('.js-entrance-start')
        this.progress = this.ui.querySelector('.js-entrance-progress')
        this.stopPointer = event =>
        {
            event.stopPropagation()
            if(event.type === 'touchstart' || event.pointerType === 'touch')
                this.game.inputs.updateMode(Inputs.MODE_TOUCH)
            else if(event.type === 'pointerdown' && event.pointerType === 'mouse')
                this.game.inputs.updateMode(Inputs.MODE_MOUSEKEYBOARD)
        }
        for(const button of this.ui.querySelectorAll('button'))
            for(const event of ['mousedown', 'touchstart', 'pointerdown'])
                button.addEventListener(event, this.stopPointer)
        this.ui.hidden = false
        this.circle = { hide: (callback) => callback?.() }
        this.setArchitecture()
        this.setAtmosphere()
        this.update = this.update.bind(this)
        this.game.ticker.events.on('tick', this.update, 9)
    }

    material(color, glowing = false)
    {
        const material = glowing
            ? new THREE.MeshBasicNodeMaterial({ color: new THREE.Color(color).multiplyScalar(2.2) })
            : new THREE.MeshStandardNodeMaterial({ color, roughness: 0.38, metalness: 0.65 })
        this.materials.add(material)
        return material
    }

    mesh(geometry, material, position = [0, 0, 0], parent = this.group)
    {
        this.geometries.add(geometry)
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.set(...position)
        mesh.castShadow = !material.transparent
        mesh.receiveShadow = true
        parent.add(mesh)
        return mesh
    }

    box(size, material, position, parent)
    {
        return this.mesh(new THREE.BoxGeometry(...size), material, position, parent)
    }

    setArchitecture()
    {
        const graphite = this.material('#172436')
        const stone = this.material('#334154')
        const black = this.material('#080f20')
        const cyan = this.material('#41e5f5', true)
        const violet = this.material('#8955ff', true)
        const warm = this.material('#ffaf61', true)
        this.glowMaterial = cyan

        // Broad chamfered dock: a layered architectural slab, not a circular island.
        const outline = new THREE.Shape()
        outline.moveTo(-8, -10)
        outline.lineTo(8, -10); outline.lineTo(10, -8)
        outline.lineTo(10, 7); outline.lineTo(7, 10)
        outline.lineTo(-7, 10); outline.lineTo(-10, 7)
        outline.lineTo(-10, -8); outline.closePath()
        const slab = this.mesh(new THREE.ExtrudeGeometry(outline, { depth: 0.8, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: 0.2, bevelThickness: 0.15 }), graphite, [0, -1.1, 0])
        slab.rotation.x = -Math.PI / 2
        this.box([17, 0.3, 16], black, [0, -1.35, 0])
        this.box([13, 0.05, 18], stone, [0, -0.08, 0])
        this.box([6.4, 0.045, 17.5], black, [0, -0.035, 0])
        for(const x of [-3.3, 3.3])
        {
            this.box([0.055, 0.025, 17], cyan, [x, 0.005, 0])
            for(let z = -8; z <= 8; z += 2)
                this.box([0.55, 0.025, 0.045], warm, [x + Math.sign(x) * 0.5, 0.008, z])
        }
        for(const x of [-9.3, 9.3])
        {
            this.box([0.08, 0.08, 13.5], violet, [x, -0.3, -0.4])
            for(let z = -6; z < 8; z += 3.2)
            {
                this.box([1.1, 0.55, 1.4], graphite, [x * 0.84, 0.2, z])
                this.box([0.7, 0.035, 0.9], cyan, [x * 0.84, 0.49, z])
            }
        }
        for(let i = 0; i < 3; i++)
            this.box([12 - i, 0.2, 1], graphite, [0, -0.35 - i * 0.25, 10.6 + i])

        // Six-sided portal with a heavy frame, luminous inset and suspended inner rings.
        this.portal = new THREE.Group()
        this.portal.position.set(0, 4.25, -6.5)
        this.group.add(this.portal)
        const frame = this.mesh(new THREE.TorusGeometry(4.25, 0.38, 4, 6), graphite, [0, 0, 0], this.portal)
        frame.rotation.z = Math.PI / 6
        const rim = this.mesh(new THREE.TorusGeometry(3.88, 0.055, 5, 6), cyan, [0, 0, 0.35], this.portal)
        rim.rotation.z = Math.PI / 6
        const outer = this.mesh(new THREE.TorusGeometry(4.7, 0.035, 4, 6), violet, [0, 0, -0.25], this.portal)
        outer.rotation.z = Math.PI / 6
        this.energyRing = this.mesh(new THREE.TorusGeometry(3.55, 0.018, 4, 64, Math.PI * 1.5), warm, [0, 0, 0.4], this.portal)
        for(const x of [-4.7, 4.7])
        {
            this.box([0.8, 6.5, 1], graphite, [x, 2.9, -6.5])
            this.box([0.08, 5.4, 0.08], warm, [x, 3, -5.95])
            this.box([1.7, 0.5, 2], stone, [x, 0.2, -6.5])
        }
        // Layered energy film with a view down an illuminated avenue.
        const veil = new THREE.MeshBasicNodeMaterial({ color: '#135a8a', transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false })
        this.materials.add(veil)
        this.mesh(new THREE.CircleGeometry(3.7, 6), veil, [0, 0, -0.15], this.portal).rotation.z = Math.PI / 6
        for(let i = 0; i < 4; i++)
        {
            const distant = this.mesh(new THREE.TorusGeometry(3.5 - i * 0.4, 0.018, 3, 6), i % 2 ? violet : cyan, [0, 0, -1.5 - i * 2], this.portal)
            distant.rotation.z = Math.PI / 6
        }
        // Integrated wayfinding sign, generated locally without image downloads.
        const sign = document.createElement('canvas'); sign.width = 1024; sign.height = 128
        const ctx = sign.getContext('2d')
        ctx.fillStyle = '#091525'; ctx.fillRect(0, 0, 1024, 128)
        ctx.fillStyle = '#98f1f5'; ctx.font = '500 42px sans-serif'; ctx.textAlign = 'center'
        ctx.fillText('SHEHEER  /  WORLD GATE 01', 512, 78)
        const signMap = new THREE.CanvasTexture(sign); signMap.colorSpace = THREE.SRGBColorSpace
        this.textures.add(signMap)
        const signMaterial = new THREE.MeshBasicNodeMaterial({ map: signMap }); this.materials.add(signMaterial)
        this.mesh(new THREE.PlaneGeometry(6.4, 0.8), signMaterial, [0, 8.85, -6.1])

        // Sculptural gardens and rock shelves along the dock.
        const leaf = this.material('#357f89')
        for(const side of [-1, 1])
        {
            this.box([2, 0.4, 6], graphite, [side * 6.5, 0.12, -1])
            for(let i = 0; i < 7; i++)
            {
                const x = side * (6 + (i % 2) * 0.7), z = -3.5 + i * 0.8
                const rock = this.mesh(new THREE.IcosahedronGeometry(0.5 + (i % 3) * 0.15, 0), stone, [x, 0.55, z])
                rock.scale.y = 0.6
                for(let j = 0; j < 3; j++)
                {
                    const plant = this.mesh(new THREE.ConeGeometry(0.12, 0.9 + j * 0.35, 4), leaf, [x + j * 0.2 - 0.2, 1 + j * 0.12, z])
                    plant.rotation.z = (j - 1) * 0.3 * side
                }
            }
        }
        // Side towers, suspended fragments, and distant monumental arches.
        for(let i = 0; i < 12; i++)
        {
            const side = i % 2 ? 1 : -1
            const chunk = new THREE.Group()
            chunk.position.set(side * (12 + (i % 3) * 4), 1 + (i % 4) * 2.8, -3 - Math.floor(i / 2) * 6)
            this.group.add(chunk)
            const rock = this.mesh(new THREE.IcosahedronGeometry(2.4 - (i % 3) * 0.4, 0), graphite, [0, -1.3, 0], chunk)
            rock.scale.set(1, 1.6, 0.85)
            this.box([3.3, 0.35, 3], stone, [0, 0.4, 0], chunk)
            this.box([0.045, 3 + i % 3, 0.045], i % 3 ? cyan : warm, [0, 2, 0], chunk)
            this.floaters.push({ object: chunk, y: chunk.position.y, phase: i * 1.7 })
        }
        const ambient = new THREE.HemisphereLight('#b5d9ff', '#15203b', 2.2)
        const key = new THREE.DirectionalLight('#acdbff', 3)
        key.position.set(6, 14, 10)
        // Reuse existing world shadowing on the vehicle; one small intro shadow map.
        key.castShadow = this.game.quality.level === 0
        key.shadow.mapSize.set(512, 512)
        key.shadow.camera.left = -12; key.shadow.camera.right = 12
        key.shadow.camera.top = 12; key.shadow.camera.bottom = -12
        key.shadow.bias = -0.003
        const fill = new THREE.PointLight('#8954ff', 100, 24, 2); fill.position.set(-6, 5, 0)
        const portalLight = new THREE.PointLight('#34eaff', 130, 20, 2); portalLight.position.set(0, 4, -5)
        this.group.add(ambient, key, key.target, fill, portalLight)
        this.keyLight = key
    }

    setAtmosphere()
    {
        // A painted sky on a low-poly dome gives depth without a full-screen effect.
        const canvas = document.createElement('canvas'); canvas.width = 32; canvas.height = 512
        const ctx = canvas.getContext('2d')
        const gradient = ctx.createLinearGradient(0, 0, 0, 512)
        gradient.addColorStop(0, '#020611'); gradient.addColorStop(0.45, '#11132f')
        gradient.addColorStop(0.62, '#263458'); gradient.addColorStop(0.78, '#101c32'); gradient.addColorStop(1, '#030817')
        ctx.fillStyle = gradient; ctx.fillRect(0, 0, 32, 512)
        const map = new THREE.CanvasTexture(canvas); map.colorSpace = THREE.SRGBColorSpace
        this.textures.add(map)
        const sky = new THREE.MeshBasicNodeMaterial({ map, side: THREE.BackSide, depthWrite: false })
        this.materials.add(sky)
        const dome = this.mesh(new THREE.SphereGeometry(85, 24, 16), sky)
        dome.castShadow = dome.receiveShadow = false
        dome.renderOrder = -10
        const starMaterial = this.material('#78b6d5', true)
        const geometry = new THREE.IcosahedronGeometry(0.018, 0); this.geometries.add(geometry)
        const count = this.game.quality.level === 0 ? 100 : 45
        this.particles = new THREE.InstancedMesh(geometry, starMaterial, count)
        this.particlePositions = []
        const dummy = new THREE.Object3D()
        for(let i = 0; i < count; i++)
        {
            // Deterministic placement keeps compositions consistent between devices.
            const x = Math.sin(i * 12.9898) * 26, y = 0.8 + (i * 0.618 % 1) * 18, z = -30 + (i * 0.413 % 1) * 40
            this.particlePositions.push({ x, y, z })
            dummy.position.set(x, y, z); dummy.updateMatrix()
            this.particles.setMatrixAt(i, dummy.matrix)
        }
        this.group.add(this.particles)
        this.particleDummy = dummy
    }

    setText()
    {
        this.active = true
        // Retain the actual vehicle and lights, hide the existing intro landscape.
        const vehicle = this.game.world.visualVehicle
        const keep = new Set([this.group, vehicle.parts.chassis, vehicle.antenna?.head])
        this.savedVisibility = new Map()
        for(const child of this.game.scene.children)
        {
            if(keep.has(child) || child.isCamera || child.isLight) continue
            this.savedVisibility.set(child, child.visible)
            child.visible = false
        }
        this.game.reveal.distance.value = 99999
        // Give the same vehicle physically lit intro materials, restored on entry.
        this.vehicleMaterials = new Map()
        for(const root of [vehicle.parts.chassis, vehicle.antenna?.head].filter(Boolean))
            root.traverse(child =>
            {
                if(!child.isMesh || Array.isArray(child.material)) return
                this.vehicleMaterials.set(child, child.material)
                const material = new THREE.MeshStandardNodeMaterial({ color: '#65d9de', metalness: 0.45, roughness: 0.3 })
                if(child.material._colorNode) material.colorNode = child.material._colorNode
                this.materials.add(material)
                child.material = material
            })
    }

    setSoundButton()
    {
        this.soundButton = this.ui.querySelector('.js-entrance-sound')
        this.onSound = () => this.game.audio.mute.toggle()
        this.onMute = () =>
        {
            this.soundButton.textContent = this.game.audio.mute.active ? 'Sound off' : 'Sound on'
            this.soundButton.setAttribute('aria-pressed', String(!this.game.audio.mute.active))
        }
        this.soundButton.addEventListener('click', this.onSound)
        this.game.audio.events.on('muteChange', this.onMute)
        this.onMute()
    }

    bindStart(callback)
    {
        this.onStart = callback
        this.startButton.addEventListener('click', this.onStart)
    }

    showLabel()
    {
        this.ui.classList.add('is-ready')
        this.startButton.disabled = false
        this.startButton.querySelector('span').textContent = 'Start Exploring'
        this.progress.textContent = 'Gateway ready'
    }

    restoreWorld()
    {
        for(const [child, visible] of this.savedVisibility ?? []) child.visible = visible
        this.savedVisibility?.clear()
        for(const [child, material] of this.vehicleMaterials ?? []) child.material = material
        this.vehicleMaterials?.clear()
    }

    hideLabel()
    {
        this.ui.classList.add('is-leaving')
        this.startButton.disabled = true
        this.startButton.removeEventListener('click', this.onStart)
        this.restoreWorld()
        gsap.to(this, { cameraBlend: 1, duration: this.reducedMotion ? 0.12 : 1.05, ease: 'power2.inOut' })
        // Retreat the set below the ground while the real world opens through it.
        gsap.to(this.group.position, { y: -18, duration: this.reducedMotion ? 0.12 : 1.05, ease: 'power3.in' })
    }

    updateProgress(progress)
    {
        this.progress.textContent = `Preparing your world · ${Math.round(progress * 100)}%`
    }

    update()
    {
        if(this.destroyed) return
        this.elapsed += this.game.ticker.delta
        const t = this.reducedMotion ? 0 : this.elapsed
        this.energyRing.rotation.z = t * 0.14
        this.glowMaterial.color.set('#41e5f5').multiplyScalar(2 + Math.sin(t * 1.2) * 0.25)
        for(const floater of this.floaters) floater.object.position.y = floater.y + Math.sin(t * 0.5 + floater.phase) * (this.reducedMotion ? 0 : 0.25)
        if(!this.reducedMotion)
        {
            for(let i = 0; i < this.particlePositions.length; i++)
            {
                const p = this.particlePositions[i]
                this.particleDummy.position.set(p.x, p.y + Math.sin(t * 0.3 + i) * 0.5, p.z)
                this.particleDummy.updateMatrix()
                this.particles.setMatrixAt(i, this.particleDummy.matrix)
            }
            this.particles.instanceMatrix.needsUpdate = true
        }
        if(!this.active) return
        const view = this.game.view.camera
        const mobile = this.game.viewport.ratio < 0.85
        this.camera.aspect = this.game.viewport.ratio
        this.camera.fov = mobile ? 54 : 42
        this.camera.position.copy(this.center).add(new THREE.Vector3(mobile ? 11 : 13, mobile ? 13 : 10, mobile ? 32 : 25))
        this.camera.position.x += Math.sin(t * 0.14) * 0.25
        this.camera.lookAt(this.center.clone().add(new THREE.Vector3(mobile ? 0 : -5.5, mobile ? 3 : 2.5, -2)))
        view.position.lerpVectors(this.camera.position, view.position.clone(), this.cameraBlend)
        view.quaternion.copy(this.camera.quaternion.clone().slerp(view.quaternion, this.cameraBlend))
        view.fov = THREE.MathUtils.lerp(this.camera.fov, 25, this.cameraBlend)
        view.updateProjectionMatrix()
        view.updateMatrixWorld()
    }

    destroy()
    {
        if(this.destroyed) return
        this.destroyed = true
        this.restoreWorld()
        gsap.killTweensOf(this); gsap.killTweensOf(this.group.position)
        this.game.view.camera.fov = 25
        this.game.view.camera.updateProjectionMatrix()
        this.ui.hidden = true
        for(const button of this.ui.querySelectorAll('button'))
            for(const event of ['mousedown', 'touchstart', 'pointerdown'])
                button.removeEventListener(event, this.stopPointer)
        this.soundButton?.removeEventListener('click', this.onSound)
        this.startButton.removeEventListener('click', this.onStart)
        if(this.onMute) this.game.audio.events.off('muteChange', this.onMute)
        this.game.ticker.events.off('tick', this.update)
        this.group.removeFromParent()
        this.keyLight.shadow.map?.dispose()
        for(const geometry of this.geometries) geometry.dispose()
        for(const material of this.materials) material.dispose()
        for(const texture of this.textures) texture.dispose()
        this.particles.dispose()
    }
}
