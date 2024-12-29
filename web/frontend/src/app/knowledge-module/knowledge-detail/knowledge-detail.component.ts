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
import { tap, catchError } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-knowledge-detail',
  templateUrl: './knowledge-detail.component.html',
  styleUrls: ['./knowledge-detail.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule, MatCardModule, FormsModule],
})
export class KnowledgeDetailComponent implements OnInit, OnDestroy {
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
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url.startsWith('/knowledge/detail')) {
          this.initializeComponent();
        }
      }
    });

    // Initial component setup
    this.initializeComponent();
  }

  ngOnDestroy() {
      // Unsubscribe to avoid memory leaks
      if (this.routerSubscription) {
        this.routerSubscription.unsubscribe();
      }
    }

  initializeComponent(){
    this.route.params.subscribe((params) => {
          this.id = params['id'];
          const idInt = parseInt(this.id, 10);
          this.cd.detectChanges();

          this.loadCategories();
          this.serviceKnowledge.getAllCategories(idInt).subscribe({
            next: (data) => {
              this.retrievedCategories = data;
            },
          });

          this.cd.detectChanges();

          const isEditRoute = this.router.url.includes('edit');
          if (isEditRoute) {
            console.log('Initializing Edit Mode');

            this.getCurrentUserId().subscribe({
              next: () => {
                console.log("User id: " + this.currentUserId);
                }
              })

            this.fetchKnowledgeDetails(idInt).subscribe({
              next: () => {

                if (this.knowledge) {
                  this.knowledgeForm = new FormGroup({
                    titleEdit: new FormControl(this.knowledge.title, [Validators.required]),
                    contentEdit: new FormControl(this.knowledge.content, [Validators.required]),
                    isPublicKnowledgeEdit: new FormControl(this.knowledge.isPublicKnowledge),
                  });

                  this.cd.detectChanges();
                }
              },
              error: (err) => console.error('Error fetching knowledge details:', err),
            });
          }

          this.cd.detectChanges();

          this.commentForm = new FormGroup({
            content: new FormControl('', Validators.required),
          });

          const previousUrl = this.navigationHistoryService.getPreviousUrl();

          if (previousUrl === '/knowledge') {
            this.getCurrentUserId().subscribe({
              next: () => {
                this.fetchKnowledgeDetails(idInt).subscribe({
                  next: () => {
                    this.cd.detectChanges();
                    this.initializeDetails();
                  },
                  error: (err) => console.error('Error fetching knowledge details:', err),
                })
              },
             error: (err) => console.error('Error fetching  idUser details:', err),
             });
          } else if (previousUrl === '/private-knowledge') {
            this.getCurrentUserId().subscribe({
              next: () => {
                this.cd.detectChanges();
                this.fetchKnowledgeDetailsPrivate(idInt, this.currentUserId).subscribe({
                  next: () => {
                    this.cd.detectChanges();
                    this.initializeDetails();
                  },
                  error: (err) => console.error('Error fetching private knowledge details:', err),
                });
              },
              error: (err) => console.error('Error fetching current user ID:', err),
            });
          }
        });
    }


  initializeDetails() {
    this.getCurrentAuthorId().subscribe({
      next: () => {
        this.updatePermissions();
        this.loadCategories();
        this.loadComments();
        this.cd.detectChanges();
      },
      error: (err) => console.error('Error fetching author ID:', err),
    });
  }

  get formattedCategories(): string {
    return this.retrievedCategories
      ? this.retrievedCategories.map((category) => category.categoryName).join(', ')
      : '';
  }

  updatePermissions() {
    console.log("this.currentAuthorId: " + this.currentAuthorId);
    console.log("this.currentUserId: " + this.currentUserId);
    if (
      this.serviceToken?.currentUser?.authorities?.includes('AUTHOR') &&
      this.currentAuthorId === this.currentUserId
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
        console.error('Error fetching user ID:', err);
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
      console.warn('Knowledge ID is undefined');
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
  this.router.navigate(['knowledge/detail/edit/', knowledge.idKnowledge]);
  this.cd.detectChanges();
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
                this.cd.detectChanges();
                this.router.navigate(['knowledge']);
              },
              error: (err) => console.error(err),
          });

      } else {
        console.log('Form is invalid or knowledge is not defined');
      }
    }


  deleteComment(groupId: number){
    console.log("Delete comment");
    }

  onSubmitComment(): void {
      if (this.commentForm.valid && this.knowledge) {

        const content = this.commentForm.get("content")?.value || '';

        if (!content.trim()) {
          console.error('Content is undefined or empty');
          return;
        } else {
          console.log("Content of the comment: " + content);
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
