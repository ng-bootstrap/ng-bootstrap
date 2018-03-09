import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Component({selector: 'ngbd-carousel-basic', templateUrl: './carousel-basic.html'})
export class NgbdCarouselBasic implements OnInit {
  images: Array<string>;

  constructor(private _http: HttpClient) {}

  ngOnInit() {
    this._http.get('https://picsum.photos/list')
        .pipe(map((images: Array<{id: number}>) => this._randomImageUrls(images)))
        .subscribe(images => this.images = images);
  }

  private _randomImageUrls(images: Array<{id: number}>): Array<string> {
    return [1, 2, 3].map(() => {
      const randomId = images[Math.floor(Math.random() * images.length)].id;
      return `https://picsum.photos/900/500?image=${randomId}`;
    });
  }
}
