import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormGroup, FormControl, FormArray, ReactiveFormsModule } from '@angular/forms';
import { KnowledgeService } from '../../services/knowledge.service';
import { CategoryService } from '../../services/category.service';
import { CategoryknowledgegroupService } from '../../services/categoryknowledgegroup.service';
import { Knowledge } from '../../models/knowledge';
import { CategoryKnowledgeGroup } from '../../models/categoryknowledgegroup';
import { Category } from '../../models/category';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-knowledge-detail',
  templateUrl: './knowledge-detail.component.html',
  styleUrls: ['./knowledge-detail.component.css'],
  standalone: true,
  imports: [ NgIf, NgFor, ReactiveFormsModule ],
})
export class KnowledgeDetailComponent implements OnInit {
    id: string;
    knowledge: Knowledge | undefined;
    knowledgeForm: any;
    categoryKnowledgeGroups: CategoryKnowledgeGroup[] = [];
    categories: Category[] = [];
    selectedCategoryIds: number[] = [];

    categoryKnowledgeGroupTemp!: CategoryKnowledgeGroup;
    categoryTemp!: Category;
    knowledgeTemp!: Knowledge;

    constructor(private cd: ChangeDetectorRef, private serviceKnowledge: KnowledgeService,  private serviceCategory: CategoryService, private serviceCKG: CategoryknowledgegroupService, private route: ActivatedRoute, private router: Router) {
        this.id = '';
      }

    ngOnInit(){
            this.route.params.subscribe(params => {
                this.id = params['id'];
                const idInt = parseInt(params['id'], 10);
                this.fetchKnowledgeDetails(idInt);
            });

            this.loadCategories();
          }

    loadCategories(){
          this.serviceCategory.getCategories().subscribe({
                next: (data: Category[]) => {
                  this.categories = data;
                  this.cd.detectChanges();
                  },
                error: err => console.log(err)
            })
     }

    fetchKnowledgeDetails(knowledgeId: number){
          this.serviceKnowledge.getKnowledgeById(knowledgeId).subscribe({
                next: (data: Knowledge) => {
                  this.knowledge = data;
                },
                error: err=>console.log(err)
              });
            }


    backToKnowledge(){
        this.router.navigate(['']);
    }

    backToDetail(){
      if (this.knowledge){
          this.router.navigate(['detail/', this.knowledge.idKnowledge]);
        }
    }

    deleteKnowledge(knowledge: Knowledge){
          console.log("Delete by id: " + knowledge.idKnowledge);
          this.serviceKnowledge.deleteKnowledge(knowledge.idKnowledge).subscribe();
          this.router.navigate(['']);
      }

    editKnowledge(knowledge: Knowledge){
            this.knowledgeForm = new FormGroup({
              idKnowledge: new FormControl(knowledge.idKnowledge),
              title: new FormControl(knowledge.title),
              content: new FormControl(knowledge.content),
              author: new FormControl(knowledge.author),
              knowledgeCategories: new FormArray([]),
          });

        this.router.navigate(['detail/edit/', knowledge.idKnowledge]);
      }

    onCategoryChange(event: any, category: Category) {
        const isChecked = event.target.checked;

        if (isChecked) {
            this.selectedCategoryIds.push(category.idCategory);
        } else {
            this.selectedCategoryIds = this.selectedCategoryIds.filter(id => id !== category.idCategory);
        }

        console.log("Selected category IDs:", this.selectedCategoryIds);
    }

    isSelected(category: Category): boolean {
        return this.selectedCategoryIds.includes(category.idCategory);
    }

    onSubmit(): void {
      if (this.knowledgeForm.valid && this.knowledge){
        console.log("Wartości w forms: ");
        console.table(this.knowledgeForm.value);
        this.knowledgeTemp = this.knowledgeForm.value;
        console.log("Knowledge temp");
        console.log(this.knowledgeTemp)

        for (var i = 0; i < this.selectedCategoryIds.length; i++){
          const selectedCategory = this.selectedCategoryIds[i];

            this.categoryKnowledgeGroupTemp = {
                groupId :  {
                  idCategory: selectedCategory,
                  idKnowledge: this.knowledgeTemp.idKnowledge
                },
                category: this.categories.find(c => c.idCategory === selectedCategory),
                knowledge: this.knowledgeTemp
              } as CategoryKnowledgeGroup;

            console.log("This categoryKnowledgeGroup temp:");
            console.log(this.categoryKnowledgeGroupTemp);

            this.serviceCKG.createCategoryKnowledgeGroup(this.categoryKnowledgeGroupTemp).subscribe({
              next: (createdCategoryKnowledgeGroup) => {
                console.log('Successfully created CategoryKnowledgeGroup:', createdCategoryKnowledgeGroup);
                this.knowledgeForm.knowledgeCategories.push(new FormControl(createdCategoryKnowledgeGroup));
              },
              error: (err) => {
                console.error('Error creating CategoryKnowledgeGroup:', err);
              }
            });
          }

          console.log("Form value after update:");
          console.log(this.knowledgeForm.value);


          this.serviceKnowledge.updateKnowledge(this.knowledgeForm.value).subscribe({
            next: ()=>{
                if (this.knowledge && this.knowledge.idKnowledge) {
                  this.router.navigate(['detail', this.knowledge.idKnowledge]);
                } else {
                  console.error('Knowledge object or its id is undefined');
                }
              },
            error: err=>console.log(err)
            });
        } else {
              console.log('Form is invalid or knowledge is not defined');
        }
    }

}
