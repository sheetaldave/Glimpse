import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { TopicSearchComponent } from './topic-search/topic-search.component';
import { SearchService } from "./search.service";
import { BsDropdownModule } from 'ngx-bootstrap';
import { FormsModule } from "@angular/forms";
import { AvatarModule } from "../avatar.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    AvatarModule
  ],
  declarations: [SearchComponent, TopicSearchComponent],
  exports: [SearchComponent, TopicSearchComponent],
  providers: [
    SearchService
  ]
})
export class SearchModule { }
