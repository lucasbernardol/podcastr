import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { usePlayer } from '../../contexts/PLayerContext';

import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './styles.module.scss';

export function Player() {
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    hasNext,
    hasPrevious,
    isLooping,
    isShuffling,
    toggleLoop,
    togglePlay,
    setIsPlayingState,
    playNext,
    playPrevious,
    toggleShuffle,
    clearPlayer,
  } = usePlayer();

  const episode = episodeList[currentEpisodeIndex];

  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const PLayerListener = () => {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  };

  const handleSeek = (duration: number) => {
    audioRef.current.currentTime = duration;
    setProgress(duration);
  };

  const handleEpisodeEnded = () => {
    if (hasNext) {
      playNext();
      return;
    }

    clearPlayer();
    setProgress(0);
  };

  return (
    <section className={styles.playerWrapper}>
      <header>
        <img src="/playing.svg" alt="Playing now" />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
            objectPosition="center"
          />

          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <p>Selecione um dos podcasts para ouvir.</p>
        </div>
      )}

      <footer className={!episode ? styles.empty : null}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>

          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9775ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>

          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay={true}
            loop={isLooping}
            onPlay={() => setIsPlayingState(true)}
            onPause={() => setIsPlayingState(false)}
            onLoadedMetadata={PLayerListener}
            onEnded={handleEpisodeEnded}
          />
        )}

        <div className={styles.controls}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embalharar" />
          </button>

          <button
            type="button"
            disabled={!episode || !hasPrevious}
            onClick={playPrevious}
          >
            <img src="/play-previous.svg" alt="Tocar podcast anterior" />
          </button>

          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src="/pause.svg" alt="Tocar" />
            ) : (
              <img src="/play.svg" alt="Pausar" />
            )}
          </button>

          <button
            type="button"
            disabled={!episode || !hasNext}
            onClick={playNext}
          >
            <img src="/play-next.svg" alt="Tocar próximo" />
          </button>

          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </section>
  );
}
