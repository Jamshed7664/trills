import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject, observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import * as moment from "moment";
@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit, OnChanges {
  @Input() trackLists;
  @Input() playingIndex;
  files = [
    {
      title: 'Audio new ',
      playurl: 'https://aptechbangalore.com/trillbackend/public/uploads/music/11.mp3',
      artist: 'Audio tenth Artist1',
      duration:300,
      price: '',
      image: ''
    }
  ];

  public state: any = {
    playing: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: undefined,
    currentTime: undefined,
    volume: 0.5,
    canplay: false,
    error: false,
  };
  public stop$ = new Subject();
  public audioObj = new Audio();
  audioEvents = [
    "ended",
    "error",
    "play",
    "playing",
    "pause",
    "timeupdate",
    "canplay",
    "loadedmetadata",
    "loadstart"
  ];
  currentFile = {index:0};
  public stateChange: BehaviorSubject<any> = new BehaviorSubject(
    this.state
  );
  isShowPlayList = false;
  isRandomPlay = false;
  isRepeat = false;
  constructor() {
  }
  ngOnInit() {
    if(this.trackLists && this.trackLists.length>0) {
      this.files =  this.trackLists;
      console.log(this.files, this.playingIndex)
      this.openFile(this.playingIndex)
    }
    this.audioObj.onended = this.handleEnded.bind(this);
  }
  ngOnChanges() {
    setTimeout(() => {
      if(this.trackLists && this.trackLists.length>0) {
        this.files =  this.trackLists;
        console.log(this.files, this.playingIndex)
        this.openFile(this.playingIndex)
      }
    }, 300);
  }
  public updateStateEvents(event: Event): void {
    switch (event.type) {
      case "canplay":
        this.state.duration = this.audioObj.duration;
        this.state.readableDuration = this.formatTime(this.state.duration);
        this.state.canplay = true;
        break;
      case "playing":
        this.state.playing = true;
        break;
      case "pause":
        this.state.playing = false;
        break;
      case "timeupdate":
        this.state.currentTime = this.audioObj.currentTime;
        this.state.readableCurrentTime = this.formatTime(
          this.state.currentTime
        );
        break;
      case "error":
        this.resetState();
        this.state.error = true;
        break;
    }
    this.stateChange.next(this.state);
  }

  public resetState() {
    this.state = {
      playing: false,
      readableCurrentTime: '',
      readableDuration: '',
      duration: undefined,
      currentTime: undefined,
      volume: 0.5,
      canplay: false,
      error: false
    };
  }

  getState(): Observable<any> {
    return this.stateChange.asObservable();
  }
  
  public streamObservable(url) {
    return new Observable(observer => {
      // Play audio
      this.audioObj.src = url;
      this.audioObj.load();
      this.audioObj.play();

      const handler = (event: Event)=> {
        this.updateStateEvents(event);
        observer.next(event);
      };

      this.addEvents(this.audioObj, this.audioEvents, handler);
      return () => {
        // Stop Playing
        this.audioObj.pause();
        this.audioObj.currentTime = 0;
        // remove event listeners
        this.removeEvents(this.audioObj, this.audioEvents, handler);
        // reset state
        this.resetState();
      };
    });
  }

  public addEvents(obj, events, handler) {
    events.forEach(event => {
      obj.addEventListener(event, handler);
    });
  }

  public removeEvents(obj, events, handler) {
    events.forEach(event => {
      obj.removeEventListener(event, handler);
    });
  }
  previous() {
    if(this.currentFile.index==0) {
      this.currentFile.index = this.files.length-1;
    }else {
      this.currentFile.index = this.currentFile.index-1;
      
    }
    this.playStream(this.files[this.currentFile.index].playurl);
  }
  next() {
    if(this.currentFile.index==this.files.length-1) {
      this.currentFile.index = 0;
    }else {
      this.currentFile.index = this.currentFile.index+1;
    }
    this.playStream(this.files[this.currentFile.index].playurl);
  }
  isLastPlaying() {
    return false;
  }
  isFirstPlaying() {
    return true;
  }
  onSliderChangeEnd(event) {
    console.log("onSliderChangeEnd",event)
    this.audioObj.currentTime = event.value;
  }
  onVolumeChange(event) {
    console.log("onVolumeChange",event)
    this.audioObj.volume = event.value;
  }
  openFile(i){
    this.currentFile.index = i;
    this.playStream(this.files[i]?.playurl);
    // this.play()
  }
  playStream(url) {
    return this.streamObservable(url).pipe(takeUntil(this.stop$)).subscribe(data=>{
      // console.log(data);
    });
  }

  play() {
    this.audioObj.play();
  }

  pause() {
    this.audioObj.pause();
  }

  stop() {
    this.stop$.next();
  }

  seekTo(seconds) {
    this.audioObj.currentTime = seconds;
  }

  setVolume(volume) {
    this.audioObj.volume = volume;
  }
  shuffle() {
    this.isRandomPlay = !this.isRandomPlay;
    
    // this.title = randomTrack.title;
  }
  randomTrack(tracks) {
    const trackLength = tracks.length;
    // Pick a random number
    const randomNumber = Math.floor((Math.random() * trackLength));
    console.log("randomNumber=",randomNumber);
    this.currentFile.index = randomNumber;
    // Return a random track
    return tracks[randomNumber];
  }
  handleRandom() {
    // Pluck a song
    const randomTrack = this.randomTrack(this.files);
    console.log("randomTrack=",randomTrack)
    // Play the plucked song
    // this.play(randomTrack.url)
    this.playStream(randomTrack.playurl)
    // Set the title property
  }
  onRepeat() {
    this.isRepeat = !this.isRepeat
  }
  openPlayList() {
    this.isShowPlayList = !this.isShowPlayList
  }
  
  formatTime(time: number, format: string = "HH:mm:ss") {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }
  handleEnded(e) {
    if(this.isRepeat) {
      this.playStream(this.files[this.currentFile.index].playurl)
    } else {
      if(this.isRandomPlay) {
        this.handleRandom();
      } else {
        this.playSequence()
      }
    }
    
    
  }
  playSequence() {
    this.next()
  }
  onClosePlayer() {
    this.stop();
    this.files = [];
  }
}
