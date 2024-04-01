import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, tap, take, withLatestFrom, pluck } from 'rxjs';
import { Character, DataResponse, Episode } from '../interfaces/data.interface';
import { LocalStorageService } from './localStorage.service';


const QUERY = gql`
{
  episodes{
    results {
      name
      episode
    }
  }
  
  characters {
    results {
      id
      name
      status
      species
      gender
      image
    }
  }
}`;

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private episodesSubject = new BehaviorSubject<Episode[]>([]);
  episodes$ = this.episodesSubject.asObservable();
  
  private charactersSubject = new BehaviorSubject<Character[]>([]);
  characters$ = this.charactersSubject.asObservable();

  constructor(private apollo: Apollo, private localSotrageSvc: LocalStorageService) {
    this.getDataAPI();
  }

  getCharactersByPage(pageNum:number):void {
    const QUERY_BY_PAGE = gql`
    query GetCharacters($page: Int!) {
      characters(page: $page) {
        results {
          id
          name
          status
          species
          gender
          image
        }
      }
    }
  `;

      this.apollo.watchQuery<any>({
        query: QUERY_BY_PAGE,
        variables: { page: pageNum },
      }).valueChanges.pipe(
        take(1),
        pluck('data', 'characters'),
        withLatestFrom(this.characters$),
        tap(([apiResponse, characters]) => {
          console.log({apiResponse, characters});
          this.parseCharactersData([...characters, ...apiResponse.results])
        })
      ).subscribe();
  }

  private getDataAPI(): void{
    //
    this.apollo.watchQuery<DataResponse>({
      query: QUERY
    }).valueChanges.pipe(
      take(1),
      tap(({data}) => {
        const {characters, episodes} = data;
        // this.episodesSubject.next(episodes.results);
        this.charactersSubject.next(characters.results);

        this.parseCharactersData(characters.results);
      })
    ).subscribe();
  }

  private parseCharactersData(characters: Character[]): void{
    const currentFavs = this.localSotrageSvc.getFavoritesCharacters();
    const newData = characters.map(character => {
      const found = !!currentFavs.find((fav: Character) => fav.id === character.id);
      return { ...character, isFavorite: found};
    });
    this.charactersSubject.next(newData);

  }
}
