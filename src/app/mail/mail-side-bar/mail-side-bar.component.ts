import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { MailFolder } from '../mail-folder';
import { MailMessage } from '../mail-message';
import { MailService } from '../mail.service';
import { GoogleAnalyticsService } from '../../google-analytics.service';
import { SideMenuService } from '../../nav-bar/side-menu.service';
import { Subscription } from 'rxjs/Subscription';
import { ModalService } from '../modals/modal.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ContextMenuComponent } from 'ngx-contextmenu/lib/contextMenu.component';
import { MailFolderDropdownComponent } from '../mail-folder-dropdown/mail-folder-dropdown.component';

@Component({
  selector: 'app-mail-side-bar',
  templateUrl: './mail-side-bar.component.html',
  styleUrls: ['./mail-side-bar.component.css']
})

export class MailSideBarComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  folders: MailFolder[];
  defaultFolders: MailFolder[];
  userFolders: MailFolder[];
  selectedFolderId: string;
  selectedFolder: MailFolder;
  @Input() minimizedMailboxMenu;
  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
  @ViewChild(MailFolderDropdownComponent) private mailFolderDropdown: MailFolderDropdownComponent;
  minimizeMenu: boolean;
  folderSubscription: Subscription;
  routerSubscription: Subscription;
  sideMenuSubscription: Subscription;
  private defaultFolderIds: string[] = ['inbox', 'all', 'drafts', 'starred', 'important', 'sent', 'spam', 'trash', 'archive'];
  isOpenDropdownFolders: boolean = false;
  constructor(private mailService: MailService,
              private ga: GoogleAnalyticsService,
              private sideMenuService: SideMenuService,
              private modalService: ModalService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.routerSubscription = this.route.params.subscribe((params: Params) => {
      this.selectedFolderId = params['folder'];
      if ((this.selectedFolderId !== undefined) && (this.folders !== undefined)) {
        this.openFolderWithSubfolders(this.selectedFolderId);
        this.selectedFolder = this.findFolder(this.folders, this.selectedFolderId);
      }
    });
    this.sideMenuSubscription = this.sideMenuService.isMinimized.subscribe(data => {
      this.minimizeMenu = data;
    });
    this.getFolders();
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    this.sideMenuSubscription.unsubscribe();
    if (this.folderSubscription !== undefined) {
      this.folderSubscription.unsubscribe();
    }
  }

  private filterDefaultFolders(folders: MailFolder[]): MailFolder[] {
    return folders.filter(item => this.defaultFolderIds.some(id => item.id === id));
  }

  private filterUserFolders(folders: MailFolder[]): MailFolder[] {
    return folders.filter(item => !this.defaultFolderIds.some(id => item.id === id));
  }

  private findFolder(folders: MailFolder[], id: string): MailFolder | undefined {
    const recursiveFindFolder = ((folderList: MailFolder[]): MailFolder | undefined => {
      for (const folder of folderList) {
        if (folder.id === id) {
          return folder;
        }
        if (folder.hasOwnProperty('sub_folders') && folder.sub_folders.length > 0) {
          const result = recursiveFindFolder(folder.sub_folders);
          if (result !== undefined) {
            return result;
          }
        }
      }
    });
    return recursiveFindFolder(folders);
  }

  getFolders() {
    this.loading = true;
    this.folderSubscription = this.mailService.getFolders()
      .subscribe(folders => {
        this.loading = false;
        this.folders = folders;
        this.defaultFolders = this.filterDefaultFolders(this.folders);
        this.userFolders = this.filterUserFolders(this.folders);
        if (this.selectedFolderId) {
          this.openFolderWithSubfolders(this.selectedFolderId);
          this.selectedFolder = this.findFolder(this.folders, this.selectedFolderId);
        }
     });
   }

  composeNewMessage(e) {
    e.stopPropagation();
    this.ga.trackEvent('side-menu', 'compose-mail');
    this.modalService.compose();
  }

  createFolder(e) {
    if (e !== undefined) {
      e.stopPropagation();
      e.preventDefault();
    }

    this.ga.trackEvent('side-menu', 'create-folder');

    const folderName = prompt('Enter new folder name:');
    if (!folderName) {
      return;
    }

    this.mailService.createFolder(folderName);
  }

  openFolder(folder: MailFolder): void {
    if (folder.hasOwnProperty('sub_folders')) {
      if (folder.hasOwnProperty('open') === false) {
        folder['open'] = false;
        folder.icon = 'folder';
      }
      if (folder['open'] === false) {
        folder['open'] = true;
        folder.icon = 'folder-open';
      } else {
        folder['open'] = false;
        folder.icon = 'folder';
      }
    }
  }

  openFolderWithSubfolders(folderId: string) {
    if (this.userFolders === undefined) {
      return;
    }

    const recursiveFindFoldersTree = ((folders: MailFolder[]): MailFolder[] | undefined => {
      for (const folder of folders) {
        if (folder.id === folderId) {
          return [folder];
        }
        if (folder.hasOwnProperty('sub_folders') && folder.sub_folders.length > 0) {
          const foundFolders = recursiveFindFoldersTree(folder.sub_folders);
          if (foundFolders !== undefined) {
            foundFolders.push(folder);
            return foundFolders;
          }
        }
      }
    });
    const foundFolders = recursiveFindFoldersTree(this.userFolders);
    if (foundFolders !== undefined) {
      foundFolders.forEach(folder => {
        folder['open'] = true;
        folder.icon = 'folder-open';
      });
    }
  }

  renameFolder(folder: MailFolder): void {
    const folderName = prompt('Enter new folder name:');
    if (!folderName || folder.name === folderName) {
      return;
    }

    this.mailService.renameFolder(folder.folder_id, folderName);
  }

  deleteFolder(folder: MailFolder): void {
    this.mailService.deleteFolder(folder.folder_id);
  }

  allowDropFolder(folder: MailFolder): any {
    const notAllowFolders = ['drafts', 'starred', 'sent'];
    return ((dragData: any) => {
      if (notAllowFolders.indexOf(folder.id) !== -1) {
        return false;
      }
      return true;
    });
  }

  handleDrop(e, folderId: string) {
    this.isOpenDropdownFolders = false;
    this.moveMessages(e.dragData, folderId);
  }

  moveMessages(messages: MailMessage[], folderId: string) {
    switch (folderId) {
      case 'important':
        this.ga.trackEvent('side-menu', 'star');
        break;
      case 'spam':
        this.ga.trackEvent('side-menu', 'move-to-spam');
        break;
      case 'trash':
        this.ga.trackEvent('side-menu', 'delete');
        break;
      default:
        break;
    }
    this.mailService.moveMessages(messages, folderId)
      .then(() => {
        // TODO: notify user about success/failure
      });
  }

  changeDropdownFolders(isOpen: boolean): void {
    this.isOpenDropdownFolders = isOpen;
    if (this.isOpenDropdownFolders === false) {
      this.mailFolderDropdown.openFolder = null;
    }
  }

}
