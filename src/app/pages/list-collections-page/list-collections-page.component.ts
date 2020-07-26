import { Component, OnInit, Input } from '@angular/core';
import { ApiServiceService } from 'app/services/api-service.service';
import { CollectionModel } from 'app/models/collection-model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-list-collections-page',
  templateUrl: './list-collections-page.component.html',
  styleUrls: ['./list-collections-page.component.scss']
})
export class ListCollectionsPageComponent implements OnInit {

  @Input() userId = -1;

  public inputFormCheck = new FormControl()

  currenToken = ''

  listCollections: CollectionModel[] = [];

  constructor(private api: ApiServiceService) {
   }

  ngOnInit() {
    const strData = localStorage.getItem('userData');
    if (strData != null) {
      const userData = JSON.parse(strData);
      this.currenToken =  userData.token;
    }
    this.loadListCollectionsByUser(this.userId);
  }

  public loadListCollectionsByUser(userId) {
    this.userId = userId;
    /*this.listCollections.push(new CollectionModel("windows"));
    this.listCollections.push(new CollectionModel("doors"));
    ;*/
    this.listCollections = []
    this.listCollections.push(new CollectionModel("Add", -1))
    this.getListCollections()
  }

  /** Collections */

  getListCollections() {
    this.api.getListCollectionsByUser(this.userId, this.currenToken).subscribe(res => {
        if (res != null) {
            if (res.success) {
                res.data.map(item => {
                  this.listCollections.push(item)
                })   
            }
        }
    });
}

}
