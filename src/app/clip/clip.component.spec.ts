import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClipComponent } from './clip.component';

describe('ClipComponent', () => {
  let component: ClipComponent;
  let fixture: ComponentFixture<ClipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
