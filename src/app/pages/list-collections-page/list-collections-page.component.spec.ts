import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCollectionsPageComponent } from './list-collections-page.component';

describe('ListCollectionsPageComponent', () => {
  let component: ListCollectionsPageComponent;
  let fixture: ComponentFixture<ListCollectionsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListCollectionsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCollectionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
