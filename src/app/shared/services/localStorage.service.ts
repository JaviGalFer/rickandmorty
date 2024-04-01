import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Character } from "../interfaces/data.interface";
import { ToastrService } from "ngx-toastr";

const MY_FAVORITES = 'myFavorites';
@Injectable({
    providedIn: 'root'
})
export class LocalStorageService{
    private charactersFavSubject = new BehaviorSubject<Character[]>([])
    charactersFav$ = this.charactersFavSubject.asObservable();

    constructor(private toastrSvc:ToastrService){
        this.initialStorage();
    }

    addOrRemoveFavorite(character: Character):void{
        const { id } = character;
        const currentsFav = this.getFavoritesCharacters();
        const found = !!currentsFav.find( (fav: Character ) => fav.id === id);
        found ? this.removeFromFavorite(id, character) : this.addToFavorite(character);
    }

    private addToFavorite(character: Character): void{
        try{
            const currentsFav = this.getFavoritesCharacters();
            localStorage.setItem(MY_FAVORITES, JSON.stringify([...currentsFav, character]));
            this.charactersFavSubject.next([...currentsFav, character]);
            this.toastrSvc.success(`${character.name} added to favorite`, 'RickAndMortyAPP')
        }catch(e){
            console.log('Error saving favorites from localStorage', e);
            alert('Error');
            this.toastrSvc.error(`Error saving favorites from localStorage ${e}`, 'RickAndMortyAPP')
        }
    }

    private removeFromFavorite(id: number, character: Character): void{
        try{
            const currentsFav = this.getFavoritesCharacters();
            const characters = currentsFav.filter((item: any) => item.id !== id);
            localStorage.setItem(MY_FAVORITES, JSON.stringify([...characters]));
            this.charactersFavSubject.next([...characters]);
            this.toastrSvc.warning(`${character.name} removed from favorite`, 'RickAndMortyAPP')
        }catch(e){
            console.log('Error removing favorites from localStorage', e);
            this.toastrSvc.error(`Error removing favorites from localStorage ${e}`, 'RickAndMortyAPP')
            alert('Error');
        }
    }

    getFavoritesCharacters():any{
        try{
            const charactersFav = JSON.parse(localStorage.getItem(MY_FAVORITES)!);
            this.charactersFavSubject.next(charactersFav);
            return charactersFav;
        }catch (error){
            console.log('Error getting favorites from localStorage', error);
        }
    };

    clearStorage():void{
        try{
            localStorage.clear();
        }catch(e){
            console.log('Error cleaning localStorage', e);
        }
    }

    private initialStorage():void {
        const currents = JSON.parse(localStorage.getItem(MY_FAVORITES)!);
        if(!currents){
            localStorage.setItem(MY_FAVORITES, JSON.stringify([]));
        }
        this.getFavoritesCharacters();

    }
}