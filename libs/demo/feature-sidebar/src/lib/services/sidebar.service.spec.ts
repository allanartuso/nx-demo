import { TestBed } from '@angular/core/testing';
import { MenuItem } from '@demo/shared/acm/ui/sidebar';
import { hot } from '@nrwl/angular/testing';
import { SidebarService } from './sidebar.service';

describe('SidebarService', () => {
  let sidebarService: SidebarService;
  let item: MenuItem;

  beforeEach(() => {
    TestBed.configureTestingModule({});

    sidebarService = TestBed.inject(SidebarService);

    item = {
      name: 'testName',
      displayChildren: false
    };
  });

  it('sets displayChildren to false when hovering on', () => {
    item.displayChildren = true;
    sidebarService.onMenuItemHoveredOn(item);
    expect(item.displayChildren).toBe(true);
  });

  it('sets displayChildren to true when hovering off', () => {
    sidebarService.onMenuItemHoveredOff(item);
    expect(item.displayChildren).toBe(false);
  });

  it('expands the sidebar and sets the menu item icon when toggling the sidebar', () => {
    sidebarService.onSidebarToggle(item);
    const expected = hot('e', { e: true });

    expect(sidebarService.expanded$).toBeObservable(expected);
    expect(item.icon).toBe('chevron-double-left');
  });

  it('collapses the sidebar and sets the menu item icon when toggling the sidebar', () => {
    sidebarService.onSidebarToggle(item);
    sidebarService.onSidebarToggle(item);
    const expected = hot('e', { e: false });

    expect(sidebarService.expanded$).toBeObservable(expected);
    expect(item.icon).toBe('chevron-double-right');
  });

  it('toggles menu item displayChildren when toggling the menu item', () => {
    sidebarService.onMenuItemToggled(item);
    expect(item.displayChildren).toBe(true);
  });

  it('sets all menu item to displayChildren when closing the sidebar', () => {
    sidebarService.bodyItems.forEach(bodyItem => {
      bodyItem.displayChildren = false;
    });

    sidebarService.footerItems.forEach(footerItem => {
      footerItem.displayChildren = false;
    });

    sidebarService.onClosingSidebar();
    for (const menuItem of [...sidebarService.footerItems, ...sidebarService.bodyItems]) {
      expect(menuItem.displayChildren).toBe(false);
    }
  });

  it('updates the menu item', () => {
    sidebarService.updateMenuItem('organizationProfile', { link: '/test' });
  });
});
