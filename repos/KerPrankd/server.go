package main

import (
	"bytes"
	"embed"
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/faiface/beep/mp3"
	"github.com/faiface/beep/speaker"
	"github.com/itchyny/volume-go"
)

//go:embed song.mp3
var mp3Data []byte

//go:embed site/*
var content embed.FS

var stopVol bool

var functionMap = map[string]interface{}{
	"run":     play,
	"vol":     setVolume,
	"lockvol": lockVolume,
	"unvol":   unlockVolume,
}

func unlockVolume() {
	stopVol = true
}

func spamVolume() {
	for {
		switch {
		case stopVol:
			return
		default:
			volume.Unmute()
			volume.SetVolume(100)
			time.Sleep(100 * time.Millisecond)
		}
	}
}

func lockVolume() {
	stopVol = false
	go spamVolume()
}

func setVolume() {
	volume.Unmute()
	volume.SetVolume(100)
}

func play() {
	PlayMP3()
}

func main() {

	var port string

	if len(os.Args) > 1 {
		port = ":" + os.Args[1]
	} else {
		port = ":80"
	}

	http.HandleFunc("/", requestHandler)
	http.ListenAndServe(port, nil)
}

func requestHandler(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path[1:]

	if path == "" {
		path = "index.html"
	}

	request := r.URL.Path[1:]

	if fileExists(path) {
		fullpath := "site/" + path
		data, _ := content.ReadFile(fullpath)

		var contentType string
		switch {
		case strings.HasSuffix(fullpath, ".html"):
			contentType = "text/html"
		case strings.HasSuffix(fullpath, ".css"):
			contentType = "text/css"
		case strings.HasSuffix(fullpath, ".js"):
			contentType = "application/javascript"
		default:
			contentType = "application/octet-stream"
		}

		w.Header().Set("Content-Type", contentType)
		http.ServeContent(w, r, fullpath, time.Now(), strings.NewReader(string(data)))
	} else {
		if fn, ok := functionMap[request]; ok {
			f, ok := fn.(func())
			if !ok {
				http.Error(w, "Error: 404 Not found", http.StatusNotFound)
			}
			f()
			return
		}

		http.Error(w, "Error: 404 Not found", http.StatusNotFound)
	}
}

func fileExists(filename string) bool {
	entries, _ := content.ReadDir("site")
	for _, entry := range entries {
		if filename == entry.Name() {
			return true
		}
	}
	return false
}

// readerCloser wraps a bytes.Reader to add a Close method.
type readerCloser struct {
	*bytes.Reader
}

func (r *readerCloser) Close() error {
	// No resources to clean up, so just return nil
	return nil
}

// PlayMP3 plays the embedded MP3 file
func PlayMP3() error {
	// Use a bytes.Reader and wrap it with readerCloser to implement io.ReadCloser
	reader := &readerCloser{bytes.NewReader(mp3Data)}

	streamer, format, err := mp3.Decode(reader)
	if err != nil {
		return fmt.Errorf("failed to decode MP3: %v", err)
	}
	defer streamer.Close()

	// Initialize the speaker with the sample rate of the MP3 file
	err = speaker.Init(format.SampleRate, format.SampleRate.N(time.Second/10))
	if err != nil {
		return fmt.Errorf("failed to initialize speaker: %v", err)
	}

	// Play the MP3 file
	speaker.Play(streamer)

	// Wait until the playback is finished
	select {
	case <-time.After(format.SampleRate.D(streamer.Len())):
	}

	return nil
}
