import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { KnowledgeService } from '../../services/knowledge.service';
import { CategoryService } from '../../services/category.service';
import { UserService } from '../../services/user.service';
import { Knowledge } from '../../models/knowledge';
import { Comment } from '../../models/comment';
import { Category } from '../../models/category';
import { TokenService } from '../../token/token.service';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-knowledge-detail',
  templateUrl: './knowledge-detail.component.html',
  styleUrls: ['./knowledge-detail.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, MatCardModule],
})
export class KnowledgeDetailComponent implements OnInit {
  id: string;
  knowledge: Knowledge | undefined;
  knowledgeTemp: Knowledge | undefined;
  knowledgeForm: any;
  categories: Category[] = [];
  selectedCategoryIds: number[] = [];
  comments: any[] = [];
  currentAuthorId: number = -1;
  currentUserId: number = -1;
  canEdit: boolean = false;
  canDelete: boolean = false;

  constructor(
    private cd: ChangeDetectorRef,
    private serviceKnowledge: KnowledgeService,
    private serviceCategory: CategoryService,
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
          console.log('Comments: ', JSON.stringify(data, null, 2));
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
      idKnowledge: new FormControl(knowledge.idKnowledge),
      title: new FormControl(knowledge.title),
      content: new FormControl(knowledge.content),
      user: new FormControl(knowledge.user),
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
      console.log('Form values: ');
      console.table(this.knowledgeForm.value);
      this.knowledgeTemp = this.knowledgeForm.value;
      console.log('Knowledge temp');
      console.log(this.knowledgeTemp);

      for (let i = 0; i < this.selectedCategoryIds.length; i++) {
        this.serviceKnowledge.updateKnowledge(this.knowledgeForm.value).subscribe({
          next: () => {
            if (this.knowledge && this.knowledge.idKnowledge) {
              this.router.navigate(['knowledge/detail', this.knowledge.idKnowledge]);
            } else {
              console.error('Knowledge object or its id is undefined');
            }
          },
          error: (err) => console.error(err),
        });
      }
    } else {
      console.log('Form is invalid or knowledge is not defined');
    }
  }
}
