import { Component } from '@angular/core';
import { Post } from './posts/post.module';
import { findLast } from '@angular/compiler/src/directive_resolver';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'maxTut';
  posts: Post[] = [] ;

  onPostAdded(post) {

    this.posts.push(post);

  }
}
