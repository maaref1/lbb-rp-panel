import {Component, ViewChild, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {UserModel} from 'app/models/user-model';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {SshModel} from 'app/models/ssh-model';
import {ApiServiceService} from 'app/services/api-service.service';
import {CollectionModel} from 'app/models/collection-model';
import {ActionModel} from 'app/models/action-model';
import {ListCollectionsPageComponent} from '../list-collections-page/list-collections-page.component';
import {ListWhitelistRespone} from "../../models/ListWhitelistRespone";

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

@Component({
  selector: 'table-cmp',
  moduleId: module.id,
  templateUrl: 'table.component.html'
})

export class TableComponent implements OnInit {
  //@ViewChild(ListCollectionsPageComponent, {static: true}) listCollectionComponent: ListCollectionsPageComponent;
  @ViewChild(ListCollectionsPageComponent, {static: false}) childCol: ListCollectionsPageComponent;

  public listActions: ActionModel[] = [];

  public listUser: UserModel[] = [];
  private listSSH: { [key: number]: SshModel } = [];
  public selectedUserSSH: SshModel;
  public selectedUser: UserModel;
  private currenToken = '';
  private userData: UserModel;
  public errorMsg = null

  private editableApi = false;
  private isNewUser = false;
  private isNewSsh = false;
  /** Modal Forms */
  grayedDismissView = false;
  showAddUserModal = false;
  showAddSshModal = false;
  addUserForm: FormGroup;
  addUserWhitelist: FormGroup;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private apiPi: ApiServiceService) {
  }

  ngOnInit() {
    let strData = localStorage.getItem('isConnectUser');
    if (strData !== 'True') {
      this.backToLogin();
    }
    strData = localStorage.getItem('userData');
    this.selectedUserSSH = null
    this.selectedUser = null;
    if (strData != null) {
      this.userData = JSON.parse(strData);
      this.currenToken = this.userData.token;
    }
    this.getListUsers();
    this.initForms();
  }

  initForms() {
    this.addUserForm = this.formBuilder.group({
      user: ['', Validators.required],
      pass: ['', [Validators.required, Validators.minLength(4)]]
    });

    this.addUserWhitelist = this.formBuilder.group({
      username: ['', Validators.required],
      isActive: ['', Validators.required],
    });
  }

  backToLogin() {
    localStorage.clear();
    localStorage.setItem('isConnectUser', "False");
    this.router.navigate(['/login']);

  }

  addSShDataToUser(editable = false, item: UserModel) {
    this.getSShDataForUser(item)
    this.editableApi = editable;
    this.isNewSsh = editable;
    this.showAddSshModal = true
    this.grayedDismissView = true
  }

  onAddUserSubmit() {
    const u: string = this.addUserForm.value.user;
    const p: string = this.addUserForm.value.pass;
    if (p.length == 0) {
      return;
    }
    if (this.isNewUser) {
      this.apiPi.addUserToWS(u, p, this.currenToken).subscribe(res => {
        if (res != null) {
          if (res.success) {
            this.dismisAllModals()
            const l: UserModel[] = res.data;
            if (l != null) {
              this.listUser = l;
            }
          } else {
            this.errorMsg = res.error
          }
        } else {
          this.errorMsg = "Error occured while trying to add new User."
        }
      })
    } else {
      this.apiPi.editUserToWS(u, p, this.currenToken).subscribe(res => {
        if (res != null) {
          if (res.success) {
            this.dismisAllModals()
            const l: UserModel[] = res.data;
            if (l != null) {
              this.listUser = l;
            }
          } else {
            this.errorMsg = res.error
          }
        } else {
          this.errorMsg = "Error occured while trying to add new User."
        }
      })
    }

  }

  getSShDataForUser(user) {
    const userId = user.userId;
    this.selectedUser = user
    if (this.listSSH[userId] != null) {
      this.selectedUserSSH = this.listSSH[userId];
      return;
    }
    this.apiPi.getSshForUsers(userId, this.currenToken).subscribe(res => {
      if (res != null) {
        if (res.success) {
          this.selectedUserSSH = res.data;
          this.listSSH[userId] = res.data;
          return;
        } else {
          if (res.error != null) {
            console.log("Failed to getSShDataForUser ,  error : " + res.error);
            this.backToLogin();
          } else {
            this.selectedUserSSH = null;
            console.log("No SSH Data for user " + userId);
          }
        }
      } else {
        console.log("getSShDataForUser(" + userId + "), res Null");
      }
      this.selectedUserSSH = null;
    })
  }

  showModalAddNewUserWhitelist() {
    // this.editableApi = editable;
    this.isNewSsh = true;
    this.showAddSshModal = true
    this.grayedDismissView = true
  }

  dismisAllModals() {
    console.log("Dismiis all Modals")
    this.showAddUserModal = false;
    this.grayedDismissView = false;
    this.showAddSshModal = false
    this.selectedUserSSH = null;
    this.selectedUser = null;
  }

  onClickUser(user) {
    this.selectedUser = user
    if (this.childCol != undefined && this.childCol != null) {
      this.childCol.loadListCollectionsByUser(this.selectedUser.userId);
    }
  }


  /** LBB Panel**/

  onAddSshSubmit() {
    const username = this.addUserWhitelist.value.username;
    const isActive = this.addUserWhitelist.value.isActive;

    console.log("[UserWhitelist] username: [" + username + "] , isActive: [" + isActive + "]");

    if (this.addUserWhitelist.invalid) {
      this.errorMsg = 'Please check your inputs'
      console.log('Invalid Inputs')
    } else {
      console.log('Will add new user')
      this.apiPi.addUserToWhitelist(username, isActive).subscribe(res => {
        if (res != null) {
          if (res.success) {
            this.getListUsers();
            this.dismisAllModals();
          } else {
            console.log('Failed to add user')
            this.errorMsg = res.error
          }
        }
      });
    }
  }

  getListUsers() {
    console.log("get list Users")
    this.apiPi.getListUsersInwhitelist().subscribe(res => {
      if (res != null) {
        if (res.success) {
          const l: ListWhitelistRespone = res.data;
          if (l != null) {
            this.listUser = l.list;
          }
        } else {
          console.log("Return to Login, cause : " + res.error);
          this.backToLogin();
        }
      } else {
        console.log("Return to Login, cause : res Null");
        this.backToLogin();
      }
    })
  }

  setWhitelistUser(username, stat = false) {
    if (stat) {
      console.log('Set user to whitelist');
    } else {
      console.log('Revoke user to whitelist');
    }

    this.apiPi.setUserWhitelistStat(username, stat).subscribe(res => {
      if (res != null) {
        if (res.success) {
          this.getListUsers();
        }
      } else {
        this.backToLogin();
      }
    });
  }

}
