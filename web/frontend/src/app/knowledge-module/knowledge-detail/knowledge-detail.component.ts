import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { KnowledgeService } from '../../services/knowledge.service';
import { CategoryService } from '../../services/category.service';
import { UserService } from '../../services/user.service';
import { CommentService } from '../../services/comment.service';
import { TokenService } from '../../token/token.service';

import { Knowledge } from '../../models/knowledge';
import { KnowledgeDto } from '../../models/knowledge-dto';
import { Comment } from '../../models/comment';
import { Category } from '../../models/category';

import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-knowledge-detail',
  templateUrl: './knowledge-detail.component.html',
  styleUrls: ['./knowledge-detail.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, MatCardModule, FormsModule],
})
export class KnowledgeDetailComponent implements OnInit {
  id: string;
  knowledge: Knowledge | undefined;
  knowledgeTemp: Knowledge | undefined;

  knowledgeForm: any;
  commentForm: any;

  retrievedCategories: Category[] = [];
  categories: Category[] = [];
  selectedCategories: string[] = [];

  comments: any[] = [];
  selectedCategoryIds: number[] = [];

  currentAuthorId: number = -1;
  currentUserId: number = -1;
  canEdit: boolean = false;
  canDelete: boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
    private serviceKnowledge: KnowledgeService,
    private serviceCategory: CategoryService,
    private serviceComments: CommentService,
    public serviceToken: TokenService,
    private serviceUser: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.id = '';
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      const idInt = parseInt(this.id, 10);
      this.cd.detectChanges();
      console.log('Knowledge Object:', JSON.stringify(this.knowledge, null, 2));


      this.commentForm = new FormGroup({
            content: new FormControl('', Validators.required),
          });

      this.serviceKnowledge.getAllCategories(idInt).subscribe({
        next: (data) => {
          this.retrievedCategories = data;
          }
        })

      this.fetchKnowledgeDetails(idInt).subscribe({
        next: () => {
          this.cd.detectChanges();
          this.getCurrentAuthorId().subscribe({
            next: () => {
              this.cd.detectChanges();
              this.getCurrentUserId().subscribe({
                next: () => {
                    this.updatePermissions();
                    this.loadCategories();
                    this.loadComments();
                    this.cd.detectChanges();
                  }
                })
            },
            error: (err) => console.error('Error fetching author ID:', err),
          });
        },
        error: (err) => console.error('Error fetching knowledge details:', err),
      });
    });
  }

 get formattedCategories(): string {
    return this.retrievedCategories
      ? this.retrievedCategories.map(category => category.categoryName).join(', ')
      : '';
  }

  updatePermissions() {
    console.log('Comparing ...');
    console.log('Current user id: ' + this.currentUserId);
    console.log('Current author id: ' + this.currentAuthorId);
    if (
      this.serviceToken?.currentUser?.authorities?.includes('AUTHOR') &&
      this.currentAuthorId === this.currentUserId
    ) {
      this.canDelete = true;
    }
    this.canEdit = this.canDelete;
  }

  deleteComment(commentId: number) {
    console.log('Delete comment');
  }

  loadComments() {
    const id = this.knowledge?.idKnowledge;
    if (id !== undefined) {
      this.serviceKnowledge.getAllComments(id).subscribe({
        next: (data: any[]) => {
          this.comments = data;
          this.comments.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
        },
        error: (err) => console.error(err),
      });
    }
  }

  getCurrentUserId(): Observable<number> {
    const currentUserEmail = this.serviceToken?.currentUser?.email;
    if (!currentUserEmail) {
      console.warn('Current user email is undefined');
      return new Observable<number>((observer) => {
        observer.next(-1); // Default value if email is missing
        observer.complete();
      });
    }

    return this.serviceUser.getUserIdByEmail(currentUserEmail).pipe(
      tap((data: number) => {
        this.currentUserId = data; // Update `currentUserId`
        console.log('Current User ID:', this.currentUserId);
      }),
      catchError((err) => {
        console.error('Error fetching user ID:', err);
        return new Observable<number>((observer) => {
          observer.next(-1); // Default value on error
          observer.complete();
        });
      })
    );
  }

  getCurrentAuthorId(): Observable<number> {
    const knowledgeId = this.knowledge?.idKnowledge;
    if (knowledgeId === undefined) {
      console.warn('Knowledge ID is undefined');
      return new Observable<number>((observer) => {
        observer.next(-1);
        observer.complete();
      });
    }
    return this.serviceKnowledge.getAuthorId(knowledgeId).pipe(
      tap((data: number) => {
        this.currentAuthorId = data;
        console.log('Current Author ID:', this.currentAuthorId);
      }),
      catchError((err) => {
        console.error('Error fetching author ID:', err);
        return new Observable<number>((observer) => {
          observer.next(-1);
          observer.complete();
        });
      })
    );
  }

  loadCategories() {
    this.serviceCategory.getCategories().subscribe({
      next: (data: Category[]) => {
        this.categories = data;
        this.cd.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  fetchKnowledgeDetails(knowledgeId: number): Observable<void> {
    return new Observable((observer) => {
      this.serviceKnowledge.getKnowledgeById(knowledgeId).subscribe({
        next: (data: Knowledge) => {
          this.knowledge = data;
          console.log('Knowledge Details:', JSON.stringify(this.knowledge, null, 2));
          observer.next();
          observer.complete();
        },
        error: (err) => {
          console.error(err);
          observer.error(err);
        },
      });
    });
  }

  backToKnowledge() {
    this.router.navigate(['knowledge']);
  }

  backToDetail() {
    if (this.knowledge) {
      this.router.navigate(['knowledge/detail/', this.knowledge.idKnowledge]);
    }
  }

  deleteKnowledge(knowledge: Knowledge) {
    console.log('Delete by id: ' + knowledge.idKnowledge);
    this.serviceKnowledge.deleteKnowledge(knowledge.idKnowledge).subscribe();
    this.router.navigate(['knowledge']);
  }

  editKnowledge(knowledge: Knowledge) {
    this.knowledgeForm = new FormGroup({
      titleEdit: new FormControl(knowledge.title, [Validators.required]),
      contentEdit: new FormControl(knowledge.content, [Validators.required]),
      isPublicKnowledgeEdit: new FormControl(knowledge.isPublicKnowledge)
    });
  this.router.navigate(['knowledge/detail/edit/', knowledge.idKnowledge]);
  }




  onCategoryChange(event: any, category: Category) {
    const isChecked = event.target.checked;

    if (isChecked) {
      this.selectedCategoryIds.push(category.idCategory);
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter((id) => id !== category.idCategory);
    }

    console.log('Selected category IDs:', this.selectedCategoryIds);
  }

  isSelected(category: Category): boolean {
    return this.selectedCategoryIds.includes(category.idCategory);
  }

  onSubmit(): void {
    if (this.knowledgeForm.valid && this.knowledge) {

      const knowledge: KnowledgeDto = {
          title: this.knowledgeForm.get("titleEdit").value,
          content: this.knowledgeForm.get("contentEdit").value,
          userId: this.currentUserId,
          isPublicKnowledge: this.knowledgeForm.get("isPublicKnowledgeEdit").value
      };


      this.serviceKnowledge.updateKnowledge(knowledge,
        this.knowledge.idKnowledge,
        this.selectedCategories).subscribe({
            next: () => {
              this.router.navigate(['knowledge/detail', this.knowledge?.idKnowledge]);
            },
            error: (err) => console.error(err),
        });

    } else {
      console.log('Form is invalid or knowledge is not defined');
    }
  }

  onSubmitComment(): void {
    if (this.commentForm.valid && this.knowledge){

      const content = this.commentForm.get("content").value;

      if (!content) {
        console.error('Content is undefined or empty');
        return;
      } else {
        console.log("Content of the comment: " + content);
        }

       if (this.currentUserId !== -1){ // Logged in user
         this.serviceComments.createComment(
         this.currentUserId,
         this.knowledge.idKnowledge,
         content).subscribe({
         next: ()=>{
              this.loadComments();
              this.commentForm.reset()
              this.cd.detectChanges();
           },
          error: (err) => {
            console.error('Error submitting comment:', err);
          },
        })
      } else { // Anonymous
        this.serviceComments.createComment(
         3,
         this.knowledge.idKnowledge,
         content).subscribe({
         next: ()=>{
              this.loadComments();
              this.commentForm.reset()
              this.cd.detectChanges();
           },
          error: (err) => {
            console.error('Error submitting comment:', err);
          },
        })

        }

      } else {
        console.log("Not correct form comment");
        console.log('Form comment Status:', this.commentForm.status);
        console.log('Form comment Errors:', this.commentForm.errors);
        console.log('Form comment Values:', this.commentForm.value);
        }

    }
}
