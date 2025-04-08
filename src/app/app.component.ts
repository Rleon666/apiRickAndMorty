import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { Character } from './shared/interfaces/character.interface';
import { CharacterService } from './shared/services/character.service';
import { filter, take } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, ParamMap, Params, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

type RequestInfo = {
  next: string | null;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  characters: Character[] = [];
  info: RequestInfo = { next: null };
  showGoUpButton: boolean = false;
  private page: number = 1;
  private query: string = '';
  private hideScrollHeight = 200;
  private showScrollHeight = 500;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private characterService: CharacterService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getDataFromService();
    //this.getCharacterByQuery();
  }

  @HostListener ('window:scroll', [])
  onWindowScroll(): void {
    const yOffset = window.pageYOffset;
    if ((yOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop) > this.showScrollHeight) {  
      this.showGoUpButton = true;
    }else if(this.showGoUpButton && (yOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop) < this.showScrollHeight){
      this.showGoUpButton = false;
    }
  }

  onScrollDown(): void{
    if (this.info.next) {
        this.page++;
        this.getDataFromService();
    }
  }

  onScrollUp():void{
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
  }

  onUrlchanged(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.characters = [];
        this.page = 1;
        //this.getCharacterByQuery();
      });
  }
  // getCharacterByQuery(): void {
  //   this.route.queryParams.pipe(take(1)).subscribe((params: ParamMap) => {
  //     console.log('****params', params);
      
  //     this.query = params['query'] || '';
  //     this.getDataFromService();
  //   });
  // }

  getDataFromService(): void {
    this.characterService.searchCaracters(this.query, this.page)
      .pipe(take(1))
      .subscribe((res: any) => {
        if (res?.results?.length) {

          const { info, results } = res;
          this.characters = [...this.characters, ...results];
          console.log('****characters', this.characters);
          this.info = info;
        } else {
          this.characters = [];
        }
      });
  }

  onSearch(value: string) {
    console.log('****value', value);
    if (value && value.length > 3) {
      this.router.navigate(['/'],
        {
          queryParams: { query: value },
        });
    }
  }
}
