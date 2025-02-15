import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';


import { KnowledgeService } from '../../services/knowledge.service';
import { CategoryService } from '../../services/category.service';
import { UserService } from '../../services/user.service';
import { CommentService } from '../../services/comment.service';
import { TokenService } from '../../token/token.service';
import { NavigationHistoryService } from '../../services/navigation-history.service';

import { Knowledge } from '../../models/knowledge';
import { KnowledgeDto } from '../../models/knowledge-dto';
import { Comment } from '../../models/comment';
import { Category } from '../../models/category';

import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import { tap, catchError, combineLatestWith } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-knowledge-detail',
  templateUrl: './knowledge-detail.component.html',
  styleUrls: ['./knowledge-detail.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, MatCardModule, FormsModule],
})
export class KnowledgeDetailComponent implements OnInit {
  id: string = '';
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

  isEditMode: boolean = false;

  private routerSubscription: Subscription | undefined;

  constructor(
    private cd: ChangeDetectorRef,
    private serviceKnowledge: KnowledgeService,
    private serviceCategory: CategoryService,
    private serviceComments: CommentService,
    public navigationHistoryService: NavigationHistoryService,
    public serviceToken: TokenService,
    private serviceUser: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.initializeComponent();
  }

  initializeComponent(a?: boolean){

    this.route.params.subscribe((params) => {

      this.id = params['id'];
      const idInt = parseInt(this.id, 10);
      this.cd.detectChanges();

      // get all categories
      this.loadCategories();

      // get categories for knowledge
      this.serviceKnowledge.getAllCategories(idInt).subscribe({
        next: (data) => {
          this.retrievedCategories = data;
        },
      });

      this.cd.detectChanges();

      this.fetchKnowledgeDetails(idInt).subscribe({
        next: () => {
            this.cd.detectChanges();
            this.getCurrentUserId().pipe(combineLatestWith(this.getCurrentAuthorId())).subscribe({
              next: () => {
                this.initializeDetails();
                }
              })
        },
        error: (err) => console.error('Error fetching knowledge details:', err),
      });


      this.commentForm = new FormGroup({
        content: new FormControl('', Validators.required),
      });

    });
  }

  createKnowledgeForm(){
     if (this.knowledge && this.isEditMode) {
        this.knowledgeForm = new FormGroup({
          titleEdit: new FormControl(this.knowledge.title, [Validators.required]),
          contentEdit: new FormControl(this.knowledge.content, [Validators.required]),
          isPublicKnowledgeEdit: new FormControl(this.knowledge.isPublicKnowledge),
      });
    }
  }

  initializeDetails() {

      this.updatePermissions();
      this.loadComments();
      this.cd.detectChanges();
  }

  get formattedCategories(): string {
    return this.retrievedCategories
      ? this.retrievedCategories.map((category) => category.categoryName).join(', ')
      : '';
  }

  updatePermissions() {

    if (
      (this.serviceToken?.currentUser?.authorities?.includes('AUTHOR') &&
      this.currentAuthorId === this.currentUserId) ||
      this.serviceToken?.currentUser?.authorities?.includes('ADMIN')
    ) {
      this.canDelete = true;
    }
    this.canEdit = this.canDelete;
  }

  loadComments() {
    const id = this.knowledge?.idKnowledge;
    if (id !== undefined) {
      this.serviceKnowledge.getAllComments(id).subscribe({
        next: (data) => {
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
        observer.next(-1);
        observer.complete();
      });
    }

    return this.serviceUser.getUserIdByEmail(currentUserEmail).pipe(
      tap((data) => {
        this.currentUserId = data;
      }),
      catchError((err) => {
        return new Observable<number>((observer) => {
          observer.next(-1);
          observer.complete();
        });
      })
    );
  }

  getCurrentAuthorId(): Observable<number> {
    const knowledgeId = this.knowledge?.idKnowledge;
    if (knowledgeId === undefined) {
      return new Observable<number>((observer) => {
        observer.next(-1);
        observer.complete();
      });
    }
    return this.serviceKnowledge.getAuthorId(knowledgeId).pipe(
      tap((data) => {
        this.currentAuthorId = data;
      }),
      catchError((err) => {
        return new Observable<number>((observer) => {
          observer.next(-1);
          observer.complete();
        });
      })
    );
  }

  loadCategories() {
    this.serviceCategory.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.cd.detectChanges();
      },
      error: (err) => console.error(err),
    });
  }

  fetchKnowledgeDetails(knowledgeId: number): Observable<void> {
    return new Observable((observer) => {
      this.serviceKnowledge.getKnowledgeById(knowledgeId).subscribe({
        next: (data) => {
          this.knowledge = data;
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

  fetchKnowledgeDetailsPrivate(knowledgeId: number, userId: number): Observable<void> {
    return new Observable((observer) => {
      this.serviceKnowledge.getPrivateKnowledgeById(userId, knowledgeId).subscribe({
        next: (data) => {
          this.knowledge = data;
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
    const previousUrl = this.navigationHistoryService.getPreviousUrl();
    if (previousUrl) {
      this.router.navigateByUrl(previousUrl);
    } else {
      this.router.navigate(['knowledge']);
    }
  }

  backToDetail() {
    if (this.knowledge) {
      this.router.navigate(['knowledge/detail/', this.knowledge.idKnowledge]);
    }
  }

  deleteKnowledge(knowledge: Knowledge) {
    this.serviceKnowledge.deleteKnowledge(knowledge.idKnowledge).subscribe({
      next: () => {
        this.backToKnowledge();
      },
      error: (err) => console.error('Error deleting knowledge:', err),
    });
  }

  editKnowledge(knowledge: Knowledge) {
      this.isEditMode = true;
      this.createKnowledgeForm();
  }

  onCategoryChange(event: any, category: Category) {
    const isChecked = event.target.checked;

    if (isChecked) {
      this.selectedCategoryIds.push(category.idCategory);
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter((id) => id !== category.idCategory);
    }

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
                this.isEditMode = false;
                this.initializeComponent(true);
              },
              error: (err) => console.error(err),
          });

      } else {
        console.log('Form is invalid or knowledge is not defined');
      }
    }


  deleteComment(groupId: number, idUser: number){
    const idKnowledge = this.knowledge?.idKnowledge ?? 0;
    this.serviceComments.deleteComment(idUser, idKnowledge, groupId).subscribe({
      next: () => {
        this.loadComments();
        this.commentForm.reset();
        this.cd.detectChanges();
        }
      })
    }

  onSubmitComment(): void {
      if (this.commentForm.valid && this.knowledge) {

        const content = this.commentForm.get("content")?.value || '';

        if (!content.trim()) {
          console.error('Content is undefined or empty');
          return;
        }
        const userId = this.currentUserId !== -1 ? this.currentUserId : 3; // Use default ID for anonymous

        this.serviceComments.createComment(
          userId,
          this.knowledge.idKnowledge,
          content
        ).subscribe({
          next: () => {
            this.loadComments();
            this.commentForm.reset();
            this.cd.detectChanges();
          },
          error: (err) => {
            console.error('Error submitting comment:', err);
          },
        });

      } else {
        console.log("Not correct form comment");
        console.log('Form comment Status:', this.commentForm?.status);
        console.log('Form comment Errors:', this.commentForm?.errors);
        console.log('Form comment Values:', this.commentForm?.value);
      }
    }
}
