import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SkillMasteryUnlockReqsTableComponent } from './skill-mastery-unlock-reqs-table.component';

describe('SkillMasteryUnlockReqsTableComponent', () => {
  let component: SkillMasteryUnlockReqsTableComponent;
  let fixture: ComponentFixture<SkillMasteryUnlockReqsTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillMasteryUnlockReqsTableComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SkillMasteryUnlockReqsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
