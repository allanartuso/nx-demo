import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { getI18nTestingModule } from '@demo/shared/util-i18n/test';
import { SidebarHeaderComponent } from './sidebar-header/sidebar-header.component';
import { SidebarMenuItemComponent } from './sidebar-menu-item/sidebar-menu-item.component';
import { SidebarComponent } from './sidebar.component';
import { MenuItem } from './sidebar.models';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  const testMenuItem: MenuItem = {
    name: 'testName'
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [getI18nTestingModule()],
        declarations: [SidebarComponent, SidebarHeaderComponent, SidebarMenuItemComponent],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('emit event when hovering on a menu item.', () => {
    spyOn(component.menuItemHoveredOn, 'emit');

    component.onMenuItemHoveredOn(testMenuItem);

    expect(component.menuItemHoveredOn.emit).toHaveBeenCalledWith(testMenuItem);
  });

  test('emit event when hovering off a menu item.', () => {
    spyOn(component.menuItemHoveredOff, 'emit');

    component.onMenuItemHoveredOff(testMenuItem);

    expect(component.menuItemHoveredOff.emit).toHaveBeenCalledWith(testMenuItem);
  });

  test('emit click event when clicking a menu item.', () => {
    spyOn(component.menuItemClicked, 'emit');

    component.onMenuItemClicked(testMenuItem);

    expect(component.menuItemClicked.emit).toHaveBeenCalledWith(testMenuItem);
  });

  test('emit toggle event when toggling a menu group.', () => {
    spyOn(component.menuItemToggled, 'emit');

    component.onMenuItemToggled(testMenuItem);

    expect(component.menuItemToggled.emit).toHaveBeenCalledWith(testMenuItem);
  });

  test('emit close event when closing the sidebar.', () => {
    spyOn(component.closingSidebar, 'emit');

    component.onClosing();

    expect(component.closingSidebar.emit).toHaveBeenCalled();
  });
});
