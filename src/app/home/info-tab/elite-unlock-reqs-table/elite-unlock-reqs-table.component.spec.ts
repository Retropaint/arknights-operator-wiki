import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EliteUnlockReqsTableComponent } from './elite-unlock-reqs-table.component';

describe('EliteUnlockReqsTableComponent', () => {
  let component: EliteUnlockReqsTableComponent;
  let fixture: ComponentFixture<EliteUnlockReqsTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EliteUnlockReqsTableComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EliteUnlockReqsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
