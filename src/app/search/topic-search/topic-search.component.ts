import { Component, OnInit } from '@angular/core';
import { SearchComponent } from "../search/search.component";

@Component({
  selector: 'app-topic-search',
  templateUrl: './topic-search.component.html',
  styleUrls: ['./topic-search.component.css']
})
export class TopicSearchComponent extends SearchComponent implements OnInit{
  protected baseRoute: string = 'topics';
}
