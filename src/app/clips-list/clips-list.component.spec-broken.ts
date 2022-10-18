import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClipsListComponent } from './clips-list.component';

describe('ClipsListComponent', () => {
  let component: ClipsListComponent;
  let fixture: ComponentFixture<ClipsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClipsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClipsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
