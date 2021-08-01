import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { logoutAction } from '@demo/acm/feature-authentication';
import { closeOrganizationSelectorAction, toggleOrganizationSelectorAction } from '@demo/acm/feature-sidebar';
import { getCurrentOrganizationResourceId } from '@demo/shared/acm/data-access/organizations';
import { logoDtoFixture } from '@demo/shared/acm/data-access/organizations/test';
import { ThemeService } from '@demo/shared/acm/feature-theme';
import { ClickActionType, MenuItem } from '@demo/shared/acm/ui/sidebar';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { initialSidebarState, SIDEBAR_FEATURE_KEY } from '../../+state/sidebar.reducer';
import { SidebarService } from '../../services/sidebar.service';
import { SidebarContainerComponent } from './sidebar-container.component';

describe('SidebarContainerComponent', () => {
  let component: SidebarContainerComponent;
  let fixture: ComponentFixture<SidebarContainerComponent>;
  let sidebarService: SidebarService;
  let themeService: ThemeService;
  let store: MockStore;

  const logo = logoDtoFixture.createLogoImage(logoDtoFixture.createPersistentLogo());
  const item: MenuItem = {
    name: 'testName'
  };

  beforeEach(
    waitForAsync(() => {
      const mockSidebarService: Partial<SidebarService> = {
        onMenuItemHoveredOn: jest.fn(),
        onMenuItemHoveredOff: jest.fn(),
        onMenuItemToggled: jest.fn(),
        onClosingSidebar: jest.fn(),
        onSidebarToggle: jest.fn(),
        updateMenuItem: jest.fn()
      };
      const mockThemeService: Partial<ThemeService> = {
        applicationLogo$: of(logo),
        applicationName$: of(''),
        applicationShortName$: of('')
      };

      TestBed.configureTestingModule({
        declarations: [SidebarContainerComponent],
        providers: [
          provideMockStore({ initialState: { [SIDEBAR_FEATURE_KEY]: initialSidebarState } }),
          {
            provide: SidebarService,
            useValue: mockSidebarService
          },
          {
            provide: ThemeService,
            useValue: mockThemeService
          }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarContainerComponent);
    component = fixture.componentInstance;
    sidebarService = TestBed.inject(SidebarService);
    themeService = TestBed.inject(ThemeService);
    store = TestBed.inject(MockStore);
    jest.spyOn(store, 'dispatch');
    store.overrideSelector(getCurrentOrganizationResourceId, '1/resource/2');
    fixture.detectChanges();
  });

  it('calls sidebar service on hovered on', () => {
    component.onMenuItemHoveredOn(item);
    expect(sidebarService.onMenuItemHoveredOn).toHaveBeenCalledWith(item);
  });

  it('calls sidebar service on hovered off', () => {
    component.onMenuItemHoveredOff(item);
    expect(sidebarService.onMenuItemHoveredOff).toHaveBeenCalledWith(item);
  });

  it('calls sidebar service on toggled', () => {
    component.onMenuItemToggled(item);
    expect(sidebarService.onMenuItemToggled).toHaveBeenCalledWith(item);
  });

  it('calls sidebar service on closing', () => {
    component.onClosingSidebar();
    expect(sidebarService.onClosingSidebar).toHaveBeenCalled();
  });

  it('emits an event when the click action is logout', () => {
    spyOn(store, 'dispatch');
    item.clickAction = ClickActionType.LOGOUT;
    component.onMenuItemClicked(item);
    expect(store.dispatch).toHaveBeenCalledWith(logoutAction());
  });

  it('calls sidebar service when the click action is side bar toggle', () => {
    item.clickAction = ClickActionType.SIDE_BAR_TOGGLE;
    component.onMenuItemClicked(item);
    expect(sidebarService.onSidebarToggle).toHaveBeenCalledWith(item);
  });

  it('dispatches toggleOrganizationSelectorAction when organization selector is clicked', () => {
    component.onOrganizationSelectorClicked();
    expect(store.dispatch).toHaveBeenCalledWith(toggleOrganizationSelectorAction());
  });

  it('dispatches closeOrganizationSelectorAction when organization selector is clicked', () => {
    component.onOrganizationSelectorClosed();
    expect(store.dispatch).toHaveBeenCalledWith(closeOrganizationSelectorAction());
  });
});
