import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MenuItem } from '../../models/sidebar.models';
import { SidebarHeaderComponent } from '../sidebar-header/sidebar-header.component';
import { SidebarMenuItemComponent } from '../sidebar-menu-item/sidebar-menu-item.component';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  const testMenuItem: MenuItem = {
    name: 'testName'
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SidebarComponent, SidebarHeaderComponent, SidebarMenuItemComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    component.header = {
      logo: '/assets/images/demo_logo.jpg',
      alt: 'Demo Logo',
      name: 'Demo Name',
      shortName: 'Demo'
    };
    fixture.detectChanges();
  });

  it('emit click event when clicking a menu item.', () => {
    jest.spyOn(component.menuItemClicked, 'emit');

    component.onMenuItemClicked(testMenuItem);

    expect(component.menuItemClicked.emit).toHaveBeenCalledWith(testMenuItem);
  });
});
