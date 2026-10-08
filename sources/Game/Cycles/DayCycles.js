import * as THREE from 'three/webgpu'
import { Cycles } from './Cycles.js'

const presets = {
    day:   { revealColor: new THREE.Color('#00f0ff'), revealIntensity: 14, electricField: 0, temperature: 5, lightColor: new THREE.Color('#64dfdf'), lightIntensity: 1.3, shadowColor: new THREE.Color('#081026'), fogColorA: new THREE.Color('#07152b'), fogColorB: new THREE.Color('#00b4d8'), fogNearRatio: 0.315, fogFarRatio: 1.25 },
    dusk:  { revealColor: new THREE.Color('#ff00aa'), revealIntensity: 7.0, electricField: 0.25, temperature: 0, lightColor: new THREE.Color('#ffaa00'), lightIntensity: 1.4, shadowColor: new THREE.Color('#240046'), fogColorA: new THREE.Color('#3c096c'), fogColorB: new THREE.Color('#ff007f'), fogNearRatio: 0, fogFarRatio: 1.25 },
    night: { revealColor: new THREE.Color('#7209b7'), revealIntensity: 11, electricField: 1, temperature: -7.5, lightColor: new THREE.Color('#4cc9f0'), lightIntensity: 4.0, shadowColor: new THREE.Color('#03001e'), fogColorA: new THREE.Color('#03071e'), fogColorB: new THREE.Color('#3a0ca3'), fogNearRatio: -0.85, fogFarRatio: 1 },
    dawn:  { revealColor: new THREE.Color('#00f5d4'), revealIntensity: 6.0, electricField: 0.25, temperature: 0, lightColor: new THREE.Color('#c7f9cc'), lightIntensity: 1.3, shadowColor: new THREE.Color('#001d3d'), fogColorA: new THREE.Color('#00296b'), fogColorB: new THREE.Color('#00b4d8'), fogNearRatio: 0.3, fogFarRatio: 1.25 },
}

export class DayCycles extends Cycles
{
    constructor()
    {
        const forcedProgress = import.meta.env.VITE_DAY_CYCLE_PROGRESS ? parseFloat(import.meta.env.VITE_DAY_CYCLE_PROGRESS) : null
        super('🕜 Day Cycles', 4 * 60, forcedProgress, false)
    }

    get presets()
    {
        return presets
    }

    getKeyframesDescriptions()
    {
        // Debug
        if(this.game.debug.active)
        {
            this.debugPanel.addBinding(this, 'duration', { min: 1, max: 60 * 10, step: 1 })

            for(const presetKey in presets)
            {
                const preset = presets[presetKey]
                const presetsDebugPanel = this.debugPanel.addFolder({
                    title: presetKey,
                    expanded: true,
                })

                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.revealColor, 'revealColor')
                presetsDebugPanel.addBinding(preset, 'revealIntensity', { min: 0, max: 20, step: 0.001 })
                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.lightColor, 'lightColor')
                presetsDebugPanel.addBinding(preset, 'lightIntensity', { min: 0, max: 20 })
                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.shadowColor, 'shadowColor')
                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.fogColorA, 'fogColorA')
                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.fogColorB, 'fogColorB')
                presetsDebugPanel.addBinding(preset, 'fogNearRatio', { label: 'near', min: -2, max: 2, step: 0.001 })
                presetsDebugPanel.addBinding(preset, 'fogFarRatio', { label: 'far', min: -2, max: 2, step: 0.001 })
            }
        }

        return [
            [
                { properties: presets.day, stop: 0.0 }, // day
                { properties: presets.day, stop: 0.15 }, // day
                { properties: presets.dusk, stop: 0.25 }, // Dusk
                { properties: presets.night, stop: 0.35 }, // Night
                { properties: presets.night, stop: 0.6 }, // Night
                { properties: presets.dawn, stop: 0.8 }, // Dawn
                { properties: presets.day, stop: 0.9 }, // day
            ]
        ]
    }

    getIntervalDescriptions()
    {
        return [
            { name: 'night', start: 0.25, end: 0.7 },
            { name: 'deepNight', start: 0.35, end: 0.6 },
        ]
    }
}