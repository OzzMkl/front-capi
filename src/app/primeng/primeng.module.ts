import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { RippleModule} from 'primeng/ripple';
import { MenuModule } from 'primeng/menu';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [],
  exports:[
    DropdownModule,
    ButtonModule,
    RippleModule,
    MenuModule,
    MessageModule,
    MessagesModule,
    ToastModule,
    TableModule,
    ProgressSpinnerModule,
    DialogModule,
    PaginatorModule,
    InputTextModule,
    AvatarModule,
    AvatarGroupModule,
    TabViewModule,
    ConfirmDialogModule,
  ],
  imports: [
    CommonModule,
  ],
  providers: [MessageService],
})
export class PrimengModule { }
