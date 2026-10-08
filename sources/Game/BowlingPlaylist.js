export class BowlingPlaylist
{
    constructor(Howl, songs, onChange = () => {}, onPlay = () => {})
    {
        this.songs = songs.map(song => ({ ...song, sound: null }))
        this.Howl = Howl
        this.onChange = onChange
        this.onPlay = onPlay
        this.index = 0
        this.volume = 0.2
        this.playing = false
        this.requested = false
        this.status = 'Audio not added'
    }

    get current() { return this.songs[this.index] }

    setVolume(volume)
    {
        if(!Number.isFinite(volume)) return
        this.volume = Math.max(0, Math.min(1, volume))
        for(const song of this.songs) song.sound?.volume(this.volume)
        this.onChange()
    }

    play()
    {
        const song = this.current
        if(!song.path)
        {
            this.status = 'Audio not added'
            this.onChange()
            return
        }
        if(this.requested || this.playing) return
        this.requested = true
        this.status = 'Loading…'
        if(!song.sound)
        {
            const fail = (message) =>
            {
                if(song !== this.current) return
                this.requested = this.playing = false
                this.status = message
                this.onChange()
            }
            song.sound = new this.Howl({
                src: [song.path], html5: true, preload: false, loop: false, volume: this.volume,
                onplay: () =>
                {
                    if(song !== this.current || !this.requested) { song.sound.pause(); return }
                    this.playing = true
                    this.status = 'Playing'
                    this.onChange()
                    this.onPlay()
                },
                onpause: () =>
                {
                    if(song !== this.current) return
                    this.playing = false
                    this.onChange()
                },
                onloaderror: () => fail('Audio unavailable. Add an authorized audio file.'),
                onplayerror: () => fail('Playback could not start. Tap Play to retry.'),
                onend: () => { if(song === this.current && this.requested) this.next() }
            })
        }
        // Howler queues play until loaded; keep it inside the user's click for mobile.
        if(song.sound.state() === 'unloaded') song.sound.load()
        song.sound.play()
        this.onChange()
    }

    pause()
    {
        this.requested = this.playing = false
        this.current.sound?.pause()
        this.status = this.current.path ? 'Paused' : 'Audio not added'
        this.onChange()
    }

    togglePlayPause() { this.requested ? this.pause() : this.play() }

    select(index)
    {
        if(!Number.isInteger(index) || index < 0 || index >= this.songs.length) return
        this.requested = this.playing = false
        this.current.sound?.stop()
        this.index = index
        this.status = this.current.path ? 'Ready' : 'Audio not added'
        this.onChange()
        this.play()
    }

    next() { this.select((this.index + 1) % this.songs.length) }
    previous() { this.select((this.index + this.songs.length - 1) % this.songs.length) }

    suspend()
    {
        this.resumeOnFocus = this.requested
        this.pause()
    }

    resume()
    {
        if(this.resumeOnFocus) this.play()
        this.resumeOnFocus = false
    }
}
