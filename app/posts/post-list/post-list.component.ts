import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post.module';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit , OnDestroy {

  @Input() newPost: Post[] = [];
  private postSub: Subscription;
  //isLoading = false;

  constructor(public postService: PostService) { }

  ngOnInit() {
    //this.isLoading = true;
    const aa = this.postService.getPosts();
    this.postSub = this.postService.getUpdatedPost().subscribe((posts: Post[]) => {
      //this.isLoading = false;
      this.newPost = posts;
    });
  }


  deleteP(id) {
    console.log(id);
    this.postService.deletePost(id);

  }

  onpage(event){
    console.log(event)
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();

  }

}
