import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Character } from '../interfaces/character.interface';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  constructor(
    private http: HttpClient, 
  ) { }

  searchCaracters(query = '', page = 1){
    return this.http.get<Character>(`${environment.apiUrlBase}/?name = ${query}&page=${page}`);
   }
getDetails(id: number){ 
  return this.http.get<Character>(`${environment.apiUrlBase}/${id}`);
}

}
