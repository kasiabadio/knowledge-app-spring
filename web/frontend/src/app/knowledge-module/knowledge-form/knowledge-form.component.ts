import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { KnowledgeService } from '../../services/knowledge.service';

@Component({
  selector: 'app-knowledge-form',
  standalone: true,
  imports: [ NgIf, ReactiveFormsModule ],
  templateUrl: './knowledge-form.component.html',
  styleUrls: ['./knowledge-form.component.css'],
})
export class KnowledgeFormComponent implements OnInit {
    knowledgeForm: any;
    validatorString: string;

    constructor(private serviceKnowledge: KnowledgeService, private fb: FormBuilder, private router: Router) {
        this.validatorString = '^[a-zA-Z,.!?\\s-]+$';
    }

    ngOnInit(): void {
        this.knowledgeForm = this.fb.group({
          title: ['', [Validators.required, Validators.pattern(this.validatorString)]],
          content: ['', [Validators.required]],
          author: ['', [Validators.required, Validators.pattern(this.validatorString)]]
          });

      }

    onSubmit(): void {
      if (this.knowledgeForm.valid){
        console.log("Wartości w forms: ");
        console.table(this.knowledgeForm.value);
          this.serviceKnowledge.createKnowledge(this.knowledgeForm.value).subscribe({
            next: ()=>{
              this.router.navigate(['']);
              },
            error: err=>console.log(err)
            });
        } else {
          console.log("Not correct form");
          }
      }


    backToKnowledge(){
        this.router.navigate(['']);
    }

}
