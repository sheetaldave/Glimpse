import { Component, OnInit } from '@angular/core';
import { Topic } from "../topic";
import { TopicsService } from "../topics.service";
import { SearchService } from "../../search/search.service";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { GoogleAnalyticsService } from '../../google-analytics.service';

@Component({
  selector: 'app-topics-map',
  templateUrl: './topics-map.component.html',
  styleUrls: ['./topics-map.component.css']
})
export class TopicsMapComponent implements OnInit {

  topics: Topic[];
  showSimilarTopic = false;
  similarTopics: Topic[];
  selectedTopic: Topic;
  selectedSimilarTopic: Topic;
  selectedFolder;
  currentTopic : Topic;
  query: string;
  folders:any[];
  filters = [
    { title: 'This Week', fromDate: new Date().setDate(new Date().getDate() - 7) },
    { title: 'This Month', fromDate: new Date().setMonth(new Date().getMonth() - 1) },
    { title: 'Three Months', fromDate: new Date().setMonth(new Date().getMonth() - 3) },
    { title: 'This Year', fromDate: new Date().setFullYear(new Date().getFullYear() - 1) }
  ];
  selectedFilter;
  constructor( private  topicsService: TopicsService,
               private searchService: SearchService,
               private route: ActivatedRoute,
               private ga: GoogleAnalyticsService,
               private router: Router) { }

  ngOnInit(): void {
    this.selectedFolder = 'inbox';
    this.selectedFilter = this.filters[0];
    this.subscribeToRouting();
  }

  getTopics(): void {
    this.topicsService.getTopics(this.selectedFilter.fromDate)
      .then(res => {
        this.topics = res.data;
      });
  }

  getSimilarTopics(): void {
    this.topicsService.getSimilarTopics(this.selectedTopic.name)
      .then(res => {
        this.similarTopics = res.data;
      })
  }

  selectTopic(topic: Topic): void {
    this.ga.trackEvent('topics-map', 'select-topic');
    this.showSimilarTopic = true;
    this.selectedTopic = topic;
    this.currentTopic = topic;
    this.getSimilarTopics();
    this.getTopicCounters();
  }

  selectSimilarTopic(topic: Topic): void {
    this.selectedSimilarTopic = topic;
    this.selectedTopic = topic;
  }

  selectFolder(folder: string): void {
    this.selectedFolder = folder;
  }

  getTopicCounters():void {
    this.folders = [];
    this.topicsService.getTopicCounters(this.selectedTopic.name)
      .then(res => {
        this.folders = res.data
      })
  }

  subscribeToRouting():void {
    this.route.params
      .subscribe((params: Params) => {
        if(params['folder'] === 'search') {
          this.route.queryParams.subscribe(queryParams => {
            this.query = queryParams['q'];
          })
        } else {
          this.query = '';
          this.getTopics();
        }
      });

    this.route.queryParams
      .subscribe(qParams => {
        if(typeof qParams['q'] !== 'undefined'){
          this.query = qParams['q'];
          this.search();
        }
      })
  }

  search(): void {
    this.searchService.searchTopics(this.query)
      .then(response => {
        this.ga.trackEvent('topics-map', 'search-topic');
        if(typeof response == 'undefined') {
          console.log('Can\'t search for ', response)
          console.log('Topic Search is currently under development, we\'re sorry')
        } else {
          this.topics = response;
        }
      })
  }

  showRelatedEmails(query: string): void {
    this.router.navigate(['/mail/search'],{ queryParams: { q: query} })
  }

  showRelatedAttachments(query: string): void {
    console.log('This feature is under development, will be available in new releases. Tried to look for attachments of:\n', query)
  }

  selectFilter(filter): void {
    this.selectedFilter = filter;
    this.getTopics();
  }
}
