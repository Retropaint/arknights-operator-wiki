import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SkillLevelUnlockReqsTableComponent } from './skill-level-unlock-reqs-table.component';

describe('SkillLevelUnlockReqsTableComponent', () => {
  let component: SkillLevelUnlockReqsTableComponent;
  let fixture: ComponentFixture<SkillLevelUnlockReqsTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillLevelUnlockReqsTableComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SkillLevelUnlockReqsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
