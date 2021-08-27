import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SidebarHeaderComponent } from './sidebar-header.component';

describe('SidebarHeaderComponent', () => {
  let component: SidebarHeaderComponent;
  let fixture: ComponentFixture<SidebarHeaderComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SidebarHeaderComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarHeaderComponent);
    component = fixture.componentInstance;
    component.header = {
      logo: '/assets/images/demo_logo.jpg',
      alt: 'Demo Logo',
      name: 'Demo Name',
      shortName: 'Demo'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
