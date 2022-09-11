import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileInfoTextEntriesComponent } from './profile-info-text-entries.component';

describe('ProfileInfoTextEntriesComponent', () => {
  let component: ProfileInfoTextEntriesComponent;
  let fixture: ComponentFixture<ProfileInfoTextEntriesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileInfoTextEntriesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileInfoTextEntriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
