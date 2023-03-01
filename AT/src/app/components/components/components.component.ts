import { Component, OnInit, ViewChild } from '@angular/core';
import { ComponentService } from '../../services/component.service';
import { DialogService } from '../../services/dialog.service';
import { EditComponentDialogComponent } from '../edit-component-dialog/edit-component-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { finalize, BehaviorSubject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ExportService } from '../../services/export.service';
import { NotifierService } from '../../services/notifier.service';
import { ComponentChangeModel, ComponentModel } from '../../models/component.model';
import { UserModel, UserRole } from '../../models/user.model';

import { DateAdapter } from '@angular/material/core';
import { FormGroup, FormControl, FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-components',
  templateUrl: './components.component.html',
  styleUrls: ['./components.component.css']
})
export class ComponentsComponent implements OnInit {
  user: BehaviorSubject<UserModel | null>;
  isAdmin = false;
  archivedData: ComponentChangeModel[] = [];
  data: ComponentModel[] = [];
  quickFilter: string = '';
  currentUser!: UserModel;
  maxNumberOfComponents:Number = 500;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  columnsToDisplay = [
    { field: 'no', header: '' },
    { field: 'id', header: '' },
    { field: 'name', header: '', width: '40%' },
    { field: 'specificBulkWeight', header: '' },
    { field: 'packingWeight', header: '' },
    { field: 'packingType', header: '' },    
    { field: 'lastUpdate', header: '' },
  ]
  allColumnsToDisplay = [...this.columnsToDisplay.map(c => c.field), 'actions'];
  dataSource: MatTableDataSource<ComponentModel> = new MatTableDataSource<ComponentModel>([]);
  isLoading: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private componentService: ComponentService,
    private dialogService: DialogService,
    private exportService: ExportService,
    private notifierService: NotifierService,
    private authService: AuthService,
    private translate: TranslateService,
    private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('en-GB');
    this.user = this.authService.user$;
    this.user.subscribe(user => {
      this.isAdmin = user?.role === UserRole.ADMIN;
    });

    this.translate
      .get('dialogService.delete')
      .subscribe((successMessage: string) => {



      });
  }

  ngOnInit(): void {

    this.loadComponents();

  }

  onDeleteClick(data: any) {
    this.authService.getCurrentUser().subscribe(dataUser => {
      this.currentUser = dataUser;
      if (this.currentUser !== null) {
        if (this.currentUser.role === 'ADMIN') {
          this.translate
            .get('dialogService')
            .subscribe((successMessage) => {
              this.dialogService.confirmDialog(successMessage.dialogDelete)
                .subscribe(result => {
                  if (result) {
                    console.log('delete clicked: ', data);
                    this.componentService.deleteComponent(data.no)
                      .subscribe(response => {
                        console.log('component deleted: ', response);
                        this.notifierService.showDefaultNotification(successMessage.notifierDeleted);
                        this.data = this.data.filter(u => u.no !== data.no);
                        this.dataSource.data = this.data;
                      })
                  }
                })
            });
        } else {
          this.authService.promptLogin('Login');
          return;
        }
      } else {
        this.authService.promptLogin('Login');
        return;
      }
    })
  }

  onEditClick(data: any) {
    this.authService.getCurrentUser().subscribe(dataUser => {
      this.currentUser = dataUser;
      if (this.currentUser !== null) {
        if (this.currentUser.role === 'ADMIN' || this.currentUser.role === 'TECHNOLOG') {
          this.dialogService.customDialog(EditComponentDialogComponent,
            { component: data, allComponents: this.data, editMode: 1 })
            .subscribe(result => {
              if (result) {
                this.translate
                  .get('dialogService')
                  .subscribe((successMessage) => {
                    this.dialogService.confirmDialog(successMessage.dialogUpdate)
                      .subscribe(resultS => {
                        if (resultS) {
                          console.log('edit clicked: ', data, result);
                          // this.componentService.updateComponent(data.no, result)
                          //   .subscribe(response => {
                          //     console.log('component updated: ', response);
                          //     this.notifierService.showDefaultNotification(successMessage.notifierUpdate);
                          //     this.data = this.data.map(c => c.no === data.no ? { ...c, ...result } : c);
                          //     this.dataSource.data = this.data;
                          //   })
                        }
                      })
                  });
              }
            })
        } else {
          this.authService.promptLogin('Login');
          return;
        }
      } else {
        this.authService.promptLogin('Login');
        return;
      }
    })
  }
  onEditClickPacking(data: any) {
    this.authService.getCurrentUser().subscribe(dataUser => {
      this.currentUser = dataUser;
      if (this.currentUser !== null) {
        if (this.currentUser.role === 'ADMIN' || this.currentUser.role === 'TECHNOLOG') {
          this.dialogService.customDialog(EditComponentDialogComponent,
            { component: data, allComponents: this.data, editMode: 2 })
            .subscribe(result => {
              if (result) {
                this.translate
                  .get('dialogService')
                  .subscribe((successMessage) => {
                    this.dialogService.confirmDialog(successMessage.dialogUpdate)
                      .subscribe(resultS => {
                        if (resultS) {
                          console.log('edit clicked: ', data, result);
                          this.componentService.updateComponentPacking(data.no, result)
                            .subscribe(response => {
                              console.log('component updated: ', response);
                              this.notifierService.showDefaultNotification(successMessage.notifierUpdate);
                              this.data = this.data.map(c => c.no === data.no ? { ...c, ...result } : c);
                              this.dataSource.data = this.data;
                            })
                        }
                      })
                  });
              }
            })
        } else {
          this.authService.promptLogin('Login');
          return;
        }
      } else {
        this.authService.promptLogin('Login');
        return;
      }
    })
  }

  createComponent() {
    this.authService.getCurrentUser().subscribe(data => {
      this.currentUser = data;
      if (this.currentUser !== null) {
        if (this.currentUser.role === 'ADMIN' || this.currentUser.role === 'TECHNOLOG') {
          this.translate.get('dialogService').subscribe((successMessage) => {
            console.log('this.data', this.data.length);
            if (this.data.length > this.maxNumberOfComponents) {
              this.notifierService.showNotification(
                successMessage.notifierErrorComponentDescription + this.maxNumberOfComponents+" !" ,
                successMessage.close,
                successMessage.error
              );
              return;
            }
          
          this.dialogService.customDialog(EditComponentDialogComponent,
            { component: null, allComponents: this.data, editMode: 0 })
            .subscribe(result => {
              if (result) {
                this.translate
                  .get('dialogService')
                  .subscribe((successMessage) => {
                    console.log('create clicked: ', result);
                    this.componentService.addComponent(result)
                      .subscribe(response => {
                        const component = { ...response, ...result };
                        console.log('component created: ', component);
                        this.notifierService.showDefaultNotification(successMessage.notifierCreated);
                        this.data.push(component);
                        this.dataSource.data = this.data;
                      })
                  });
              }
            })
          });

        } else {
          this.authService.promptLogin('Login');
          return;
        }
      } else {
        this.authService.promptLogin('Login');
        return;
      }
    })
  }

  changeFilter() {
    this.dataSource.filter = this.quickFilter.trim().toLowerCase();
  }
  changeDate() {
    this.loadComponents();
  }

  loadComponents() {
    console.log(this.translate.get('components'));

    this.isLoading = true;
    this.componentService.getAllComponents()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(data => {
        console.log('components loaded: ', data);
        this.data = data.active;

        if (this.range.value.start !== null && this.range.value.end !== null) {
          this.data = data.active.filter((item: ComponentModel) => {
            // console.log('new Date(item.datetime)',new Date(item.datetime));
            // console.log('range start', this.range.value.start);
            return new Date(item.lastUpdate) >= this.range.value.start &&
              new Date(item.lastUpdate) <= this.range.value.end;
          });
        } else if (this.range.value.start !== null) {
          this.data = data.active.filter((item: ComponentModel) => {
            return new Date(item.lastUpdate) >= this.range.value.start;
          });
        } else if (this.range.value.end !== null) {
          this.data = data.active.filter((item: ComponentModel) => {
            return new Date(item.lastUpdate) <= this.range.value.end;
          });
        }

        this.dataSource = new MatTableDataSource<ComponentModel>(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.archivedData = data.archived;
      })


  }

  exportCSV(visibleDataOnly: boolean) {
    const headerList = ['no', 'id', 'name', 'specificBulkWeight', 'lastUpdate'];
    if (visibleDataOnly) {
      // @ts-ignore
      this.exportService.downloadFile(this.dataSource._renderData.value, headerList, 'components');
    } else {
      this.exportService.downloadFile(this.data, headerList, 'components');
    }
  }


}
