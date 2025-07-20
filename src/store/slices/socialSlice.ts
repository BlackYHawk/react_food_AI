import {createSlice} from '@reduxjs/toolkit';

const socialSlice = createSlice({
  name: 'social',
  initialState: {
    id: '',
    followers: [],
    following: [],
    posts: [],
    collections: [],
  },
  reducers: {
    addFollower(state, action) {
      //state.followers.push(action.payload);
    },
    removeFollower(state, action) {
     // state.followers = state.followers.filter(follower => follower.id !== action.payload.id);
    },
    addFollowing(state, action) {
     // state.following.push(action.payload);
    },
    removeFollowing(state, action) {
    //  state.following = state.following.filter(following => following.id !== action.payload.id);
    },
    addPost(state, action) {
   //   state.posts.push(action.payload);
    },
    removePost(state, action) {
    //  state.posts = state.posts.filter(post => post.id !== action.payload.id);
    },
    addCollection(state, action) {
      //state.collections.push(action.payload);
    },
    removeCollection(state, action) {
      //state.collections = state.collections.filter(collection => collection.id !== action.payload.id);
    },
  },
});

export const { addFollowing, removeFollowing } = socialSlice.actions;
export default socialSlice.reducer;
