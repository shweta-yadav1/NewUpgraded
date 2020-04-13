import { PostService } from './../post.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Post } from '../post.module';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  post: Post;
  title = '';
  content = '';
  isLoading = false;
  postCreated = new EventEmitter<Post>();

  private mode = 'create';
  private postId: string;
  form: FormGroup;
  imagePreview: any;

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {

    this.form = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]})

    })

    console.log('post-create');
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        ////// this.isLoading = true;
        this.postService.getPostId(this.postId).subscribe(postData => {
          ////this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          });

        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });

    // if (this.mode === 'edit') {
    //   this.title = this.post.title;
    //   this.content = this.post.content;
    // }
  }

  onAddPost() {
    if (!this.form.valid) {
      return;
    }
    ////this.isLoading = true;
    if (this.mode === 'create') {
      console.log('fdfdfdf create');
      this.postService.addPost(this.form.value.title, this.form.value.content, null);
      ////this.isLoading = false;

    } else {
      console.log('update');
      this.postService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    }
    this.form.reset();
  }


  imageUploaded(event){
    console.log(event)
    const file = (event.target).files[0];
    const reader = new FileReader();
    console.log(reader)
    reader.onload = () => {
      this.imagePreview = reader.result;
      console.log(this.imagePreview)
    };
    reader.readAsDataURL(file);
  }

}
