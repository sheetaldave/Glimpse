import { Component, ViewEncapsulation, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { MailFolder } from '../mail-folder';
import { MailService } from '../mail.service';

@Component({
  selector: 'app-mail-folder-dropdown',
  templateUrl: './mail-folder-dropdown.component.html',
  styleUrls: ['./mail-folder-dropdown.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MailFolderDropdownComponent {

  @Input() folders: MailFolder[];
  @Input() showCreateFolderButton: boolean;
  @Output() onCreateFolder = new EventEmitter();
  @Output() onMoveFolder = new EventEmitter<any>();
  openFolder: MailFolder;
  @ViewChildren(MailFolderDropdownComponent) private mailFolderDropdowns: QueryList<MailFolderDropdownComponent>;

  constructor(private mailService: MailService) { }

  changeOpenFolder(folder: MailFolder) {
    if (folder && this.openFolder && (folder.id === this.openFolder.id)) {
      return;
    }
    this.mailFolderDropdowns.forEach(dropdown => {
      dropdown.openFolder = null;
    });
    this.openFolder = folder;
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

}
