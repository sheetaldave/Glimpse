import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap';
import { NavBarComponent } from './nav-bar.component';
import { SearchModule } from '../search/search.module';
import { AvatarModule } from '../avatar.module';
import { SideMenuService } from './side-menu.service';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot([]),
    BsDropdownModule.forRoot(),
    SearchModule,
    AvatarModule
  ],
  declarations: [NavBarComponent],
  exports: [NavBarComponent],
  providers: [SideMenuService]
})
export class NavBarModule { }
