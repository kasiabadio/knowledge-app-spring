import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { KnowledgeService } from '../../services/knowledge.service';
import { TokenService } from '../../token/token.service';
import { UserService } from '../../services/user.service';

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
    currentUser: any;

    constructor(private serviceKnowledge: KnowledgeService,
      private fb: FormBuilder,
      private router: Router,
      private tokenService: TokenService,
      private userService: UserService) {
        this.validatorString = '^[a-zA-Z,.!?\\s-]+$';
    }

    ngOnInit(): void {
        this.knowledgeForm = this.fb.group({
        title: ['', [Validators.required, Validators.pattern(this.validatorString)]],
        content: ['', [Validators.required]],
        userId: [null, Validators.required]
        });

         this.currentUser = this.tokenService.currentUser;
           if (this.currentUser) {
               this.userService.getUserIdByEmail(this.currentUser.email).subscribe({
                 next: (id) => {
                   console.log("Fetched user, id:", id);
                   this.knowledgeForm.patchValue({ userId: id });
                   }
                 })
           } else {
              console.warn('No current user found.');
           }

      }

    onSubmit(): void {

      if (this.knowledgeForm.valid){
        console.log('Submitting Knowledge Form...');
        console.table(this.knowledgeForm.value);
          this.serviceKnowledge.createKnowledge(this.knowledgeForm.value).subscribe({
            next: ()=>{
              this.router.navigate(['knowledge']);
              },
            error: err=>console.log(err)
            });
        } else {
          console.log("Not correct form");
          console.log('Form Status:', this.knowledgeForm.status);
          console.log('Form Errors:', this.knowledgeForm.errors);
          console.log('Form Values:', this.knowledgeForm.value);
          }
      }

    numberValidator(control: any) {
        const value = control.value;
        if (value === null || value === undefined || isNaN(value)) {
          return { invalidNumber: true }; // Return an error if not a valid number
        }
        return null; // Valid
      }


    backToKnowledge(){
        this.router.navigate(['knowledge']);
    }

}
