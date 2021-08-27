import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarContainerComponent } from './sidebar-container.component';

describe('SidebarContainerComponent', () => {
  let component: SidebarContainerComponent;
  let fixture: ComponentFixture<SidebarContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SidebarContainerComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
