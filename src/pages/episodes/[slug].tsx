import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

import { GetStaticProps, GetStaticPaths } from 'next';
import { usePlayer } from '../../contexts/PLayerContext';

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import { api } from '../../services/api';
import styles from '../../styles/episode.module.scss';

interface Episode {
  id: string;
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
  duration: number;
  durationString: string;
  url: string;
}

interface EpisodesProps {
  episode: Episode;
}

export default function Episode({ episode }: EpisodesProps) {
  const { play } = usePlayer();

  return (
    <div className={styles.episodeWrapper}>
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>

      <section className={styles.episodeContainer}>
        <div className={styles.thumbnailWrapper}>
          <Link href="/">
            <button type="button" title="Voltar">
              <img src="/arrow-left.svg" alt="Voltar" />
            </button>
          </Link>

          <Image
            width={720}
            height={180}
            objectFit="cover"
            src={episode.thumbnail}
            alt={episode.title}
          />

          <button
            type="button"
            title="Iniciar podcast"
            onClick={() => play(episode)}
          >
            <img src="/play.svg" alt="Tocar" />
          </button>
        </div>

        <header>
          <h2>{episode.title}</h2>
          <span>{episode.members}</span>
          <span>{episode.publishedAt}</span>
          <span>{episode.durationString}</span>
        </header>

        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: episode.description }}
        />
      </section>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc',
    },
  });

  const paths = data.map((episode) => {
    return {
      params: {
        slug: episode.id,
      },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { slug } = context.params;

  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    members: data.members,
    thumbnail: data.thumbnail,
    description: data.description,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
      locale: ptBR,
    }),
    duration: Number(data.file.duration),
    durationString: convertDurationToTimeString(Number(data.file.duration)),
    url: data.file.url,
  };

  return {
    props: {
      episode,
    },

    revalidate: 60 * 60 * 24,
  };
};
