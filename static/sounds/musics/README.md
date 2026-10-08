# Bowling playlist audio and artwork

The five tracks are configured in `sources/Game/bowlingSongs.js` in the requested order. All audio and artwork fields start as `null`: there are no substitutes, unverified recordings, remote hotlinks, or missing-file requests.

Add recordings you are authorized to host to this folder, then set each entry's `path`, for example `sounds/musics/mazha-thullikal.mp3`. These are relative public URLs, without `static/`. Use these filenames for clarity:

1. `mazha-thullikal.mp3` — Mazha Thullikal Pozhinjeedumi, M. G. Sreekumar, Vettam
2. `azhalinte-aazhangalil.mp3` — Nikhil Mathew, Ayalum Njanum Thammil
3. `khalbinnakame.mp3` — Mohammed Maqbool Mansoor, Abhilasham
4. `akaleyo-nee.mp3` — Vijay Yesudas, Grandmaster (the original, not the Kishan Sreebal cover)
5. `the-life-of-ram.mp3` — Pradeep Kumar, 96 (Tamil, not the Jaanu Telugu version)

Add authorized album images to `static/jukebox/`, then set `artwork`, for example `jukebox/vettam.jpg`. Without artwork the player displays only the song metadata; failed images are hidden. No generic cover is presented as an album cover.

Record the source and hosting permissions for each recording and image alongside the files. A retail download or streaming subscription alone does not document permission to redistribute the file. The old generic CC0 document did not establish rights to the commercial songs and has been removed with the old recordings.

After adding files, run `npm run build`. In the Bowling jukebox open Music player and verify play, pause/resume, volume, all five selections, previous/next wrapping, automatic advancement on completion, and mobile playback after a tap. Unavailable sources display a recoverable error instead of silently skipping to an unrelated song.

Metadata references:

- Vettam: https://open.spotify.com/track/1LIsg45215IB1qDD2TvhSp
- Ayalum Njanum Thammil: https://www.youtube.com/watch?v=Bw0WiuTHR38
- Abhilasham: https://music.apple.com/us/song/1805615632
- Grandmaster: https://www.malayalachalachithram.com/song.php?i=19042
- 96: https://music.amazon.com/tracks/B07GCNK3YG
