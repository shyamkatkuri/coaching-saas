import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TenantHome } from './tenant-home';

describe('TenantHome', () => {
  let component: TenantHome;
  let fixture: ComponentFixture<TenantHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantHome],
    }).compileComponents();

    fixture = TestBed.createComponent(TenantHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
