import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateKnowledgeListComponent } from './private-knowledge-list.component';

describe('PrivateKnowledgeListComponent', () => {
  let component: PrivateKnowledgeListComponent;
  let fixture: ComponentFixture<PrivateKnowledgeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivateKnowledgeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivateKnowledgeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
