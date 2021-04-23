import {GetStaticProps} from 'next'
import { api } from '../services/api'
import {format, parseISO} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { convertDuration } from '../utils/convertDuration'
import styles from './home.module.scss'
import Image from 'next/image'

type Episode={
  id:string,
  title:string,
  thumbnail:string,
  description:string,
  duration:number,
  members:string,
  durationAsString:string,
  url:string,
  publishedAt: string
}
type HomeProps={
  latestEpisodes: Episode[],
  allEpisodes:Episode[],
}



export default function Home({latestEpisodes, allEpisodes}:HomeProps) {

  return (
    <div className={styles.homePage}>
      <section className={styles.latestEpisodes}>
        <h2>Ultimos lançamentos</h2>
        <ul>
          {latestEpisodes.map(episode=>{
            return (
                <li key={episode.id}>
                   <Image 
                    width={192} 
                    height={192} 
                    src={episode.thumbnail} 
                    alt={episode.title}
                    objectFit='cover'
                    />

                   <div className={styles.episodesDetails}>

                     <a href=''>{episode.title}</a>
                     <p>{episode.members}</p>
                     <span>{episode.publishedAt}</span>
                     <span>{episode.durationAsString}</span>

                   </div>

                   <button>
                     <img src='/play-green.svg' alt='play'/>
                   </button>

                </li>
            )
            
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>

      </section>
     
    </div>
  )
}


export const getStaticProps:GetStaticProps=async()=> {

  const {data}=await api.get('episodes', {
    params:{
      _limit:12,
      _sort:'published_at',
      _order: 'desc',  

    }
  })
  const episodes=data.map(episode =>{
    return {
      id:episode.id,
      title:episode.title,
      thumbnail: episode.thumbnail,
      members:episode.members,
      publishedAt:format(parseISO(episode.published_at),'d MMM yy',{locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString:convertDuration(Number(episode.file.duration)),
      description:episode.description,
      url:episode.file.url
    }
  })
  
  const latestEpisodes=episodes.slice(0,2)
  const allEpisodes=episodes.slice(2,episodes.length)
  return{
    props:{
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60*60*8,
  }
}