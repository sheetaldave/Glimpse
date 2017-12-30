import { Component, OnInit } from '@angular/core';
import { SearchService } from '../search.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { GoogleAnalyticsService } from '../../google-analytics.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  query: string;
  searchHistory: {
    history: Array<{query: string}>;
    contacts: Array<{name: string, email: string}>;
    topics: Array<{name: string}>;
  }
  protected baseRoute: string = 'mail';
  private timer = null;
  public status: {isopen: boolean} = {isopen: false};
  searchActive: boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private searchService: SearchService,
              private ga: GoogleAnalyticsService) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        if(typeof params['query'] !== 'undefined') {
          this.query = params['query'];
          this.searchActive = true;
        } else {
          this.query = '';
          this.searchActive = false;
        }
      });
  }

  performSearch(type) {
    this.status.isopen = false;
    this.router.navigate(['/' + this.baseRoute + '/search/' + type + '/' + this.query])
  }

  showSuggestions(e) {
    this.status.isopen = true;

    if(this.query.length < 1) {
      this.query = '';
    };

    clearTimeout(this.timer);

    this.timer = setTimeout(()=> {
      this.searchService.showHistory(this.query)
        .then(res => {
          this.searchHistory = res;
          this.searchHistory.history = this.searchHistory.history.filter(keyword => keyword.query !== this.query);
        })
    }, 300);
  }

  hide(e) {
    setTimeout(() => {
      this.status.isopen = false;
    },200);
  }

  toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  change(value: boolean): void {
    this.status.isopen = value;
  }

  toggleSearch(active: boolean, el?) {
    this.searchActive = active;
    if (el) {
      el.focus();
    }
    if (!active) {
      this.router.navigate(['/']);
    }
  }

  chooseAndSearch(chosenQuery: string, type) {
    this.ga.trackEvent('search-email', 'search');
    this.status.isopen = false;
    this.query = chosenQuery;
    this.performSearch(type);
  }
}
