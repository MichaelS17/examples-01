import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';


@Injectable({providedIn: 'root'})
export class PostsService {
  updatedPosts: any;

  constructor(private http: HttpClient) {}
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
      this.http
        .get<{ message: string, posts: any }>(
        'http://localhost:3000/api/posts'
        )
        .pipe(map((postData) => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id
            };
          });
        }))
       .subscribe(transformedposts => {
         this.posts = transformedposts;
         this.postsUpdated.next([...this.posts]);
       });
    }
  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title, content };

    this.http
      .post<{ message: string }>('http://localhost:3000/api/posts', post)
      .subscribe((responseData: { message: any; }) => {
        console.log(responseData.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
  deletePost(postId: string ) {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe(() => {
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.updatedPosts.next([...this.posts]);
    });
  }
}
