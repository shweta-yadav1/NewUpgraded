import { HttpClientModule } from '@angular/common/http';
// tslint:disable-next-line: import-spacing
import { Post } from './post.module';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root'})

export class PostService {
  private posts: Post[] = [];
  private postSubject = new Subject<Post[]>();

  constructor( private http: HttpClient,
               private router: Router) {

  }

  getPosts() {
    this.http.get<{message: string , posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        };

      });
    }))
    .subscribe(data => {
    this.posts = data;
    this.postSubject.next([...this.posts]);
    });
  }

  getUpdatedPost() {
    return this.postSubject.asObservable();
  }



  getPostId(id: string) {
    return this.http.get<{_id: string; title: string ; content: string }>('http://localhost:3000/api/posts/' + id);

  }

  addPost(title: string, content: string, id: null) {
  // const postData = new FormData();
  // postData.append('title', title);
  // postData.append('content', content);


  let post: Post = {
    id,
    title,
    content
  };

  this.http.post<{message: string , postId: string}>('http://localhost:3000/api/posts', post)
    .subscribe(data => {
       post = {
        id: data.postId,
        title,
        content
      };

    }, err => {

      console.log('errorr yaar', err);
    });
  this.posts.push(post);
  this.postSubject.next([...this.posts]);
  this.router.navigate(['/']);
  }


  deletePost(postId) {
    const aa = [];
    this.http.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {
      this.posts.forEach(data => {
        if (data.id !== postId) {

          aa.push(data);
        }

      });




      console.log(aa);
      this.posts = aa;
      this.postSubject.next([...this.posts]);
    });



  }


  updatePost(id: string, title: string, content: string ) {
    console.log('update service');
    const post: Post = { id , title, content};
    this.http.put('http://localhost:3000/api/posts/' + id, post).subscribe(
          response => {
            const updatedOne = [...this.posts];
            const oldPostIndex = updatedOne.findIndex( p => p.id === post.id);
            updatedOne[oldPostIndex] = post ;
            this.posts = updatedOne;
            this.postSubject.next([...this.posts]);
            this.router.navigate(['/']);

      }
    );
  }
}
